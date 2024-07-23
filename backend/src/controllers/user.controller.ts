import { compare, hash } from "bcrypt";
import { UserModel, User } from '../models/user.model';
import { RefreshTokenModel } from '../models/refreshToken.model';
import { Recipe } from "../models/recipe.model";
import { ShoppingList } from "../models/shopping-list.model";
import * as authHelpers from '../helpers/auth.helpers';

export const signup = async (req: any, res: any) => {
    const email = req.body.email;
    const hashedPassword = await hash(req.body.password, 10);
    const user = await UserModel.findOne({ email });
    if (user) {
        res.status(401).send('user is already exist');
    }
    const newUser: User = {
        id: '',
        email: email.toLowerCase(),
        password: hashedPassword,
        favourite_recipes: [],
        created_recipes: [],
        shopping_lists: [],
    };
    await UserModel.create(newUser).then(async (user) => {
        await authHelpers.generateRefreshTokenModel(user).then(async (tokenModel) => {
            await authHelpers.setTokenCookie(res, tokenModel.token);
            res.status(200).send({
                user: authHelpers.getUserDetails(user),
                jwtToken: authHelpers.generateJwtTokenForUser(user.id),
                refreshToken: tokenModel.token
            })
        })
    })
}

export const login = async (req: any, res: any) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email })
        .populate<{ created_recipes: Recipe[] }>({ path: 'created_recipes', model: 'recipe' })
        .populate<{ shopping_lists: ShoppingList[] }>({
            path: 'shopping_lists',
            populate: { path: 'ingredients', model: 'ingredient' }
        })
    if (user && (await compare(password, user.password))) {
        const jwtToken = authHelpers.generateJwtTokenForUser(user.id);
        const refreshTokenModel = await authHelpers.generateRefreshTokenModel(user);
        authHelpers.setTokenCookie(res, refreshTokenModel.token);
        res.status(200).send({
            user: authHelpers.getUserDetails(user),
            jwtToken: jwtToken,
            refreshToken: refreshTokenModel.token,
        });
    } else {
        res.status(404).send("Username or password is invalid!");
    }
}

export const refreshToken = async (req: any, res: any) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(403).send({ message: " No token provided!" });
    }
    try {
        const user = await authHelpers.getUserFromRefreshToken(token);
        let newRefreshToken = authHelpers.generateTokenForRefreshToken(user.id as string);
        const refreshToken = JSON.parse(atob(newRefreshToken.split('.')[1]));
        const expirationDate = refreshToken.exp * 1000;
        try {
            await RefreshTokenModel.findOneAndUpdate(
                { token },
                { $set: { token: newRefreshToken, expiryDate: new Date(expirationDate) } },
                { new: true },
            );
        } catch (updateError) {
            console.error('Error updating refreshToken:', updateError);
            return res.status(500).send({ message: updateError });
        };
        let newJwtTokenforUser = authHelpers.generateJwtTokenForUser(user.id as string);
        authHelpers.setTokenCookie(res, newRefreshToken);
        return res.send({
            user: { ...authHelpers.getUserDetails(user), token: newJwtTokenforUser },
            jwtToken: newJwtTokenforUser,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        return res.status(500).send({ error });
    }
}

export const revokeToken = async (req: any, res: any) => {
    const token = req.body.token || req.cookies.refreshToken;
    if (!token) { return res.status(400).json({ message: 'Token is required.' }); }
    try {
        await RefreshTokenModel.findOneAndDelete({ token }).then(() => {
            authHelpers.clearCookie(res);
            return res.status(200).send({ message: 'Token revoked successfully' });
        });
    } catch (error) {
        return res.status(500).send({ message: 'Cannot revoke!' });
    }
}
