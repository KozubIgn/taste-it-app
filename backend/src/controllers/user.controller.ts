import { compare, hash } from "bcrypt";
import { UserModel, User } from '../models/user.model';
import * as jwt from 'jsonwebtoken';
import { RefreshToken, RefreshTokenModel } from '../models/refreshToken.model';
import { Types } from "mongoose";
import { Recipe } from "../models/recipe.model";

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
        created_recipes: []
    };
    await UserModel.create(newUser).then(async (user) => {
         await generateRefreshTokenModel(user).then(async (tokenModel) => {
           await setTokenCookie(res, tokenModel.token);
            res.status(200).send({
                user: getUserDetails(user),
                jwtToken: generateJwtTokenForUser(user.id),
                refreshToken: tokenModel.token
            })
        })
    })
}

export const login = async (req: any, res: any) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email }).populate<{ created_recipes: Recipe[] }>({ path: 'created_recipes', model: 'recipe' });
    if (user && (await compare(password, user.password))) {
        const jwtToken = generateJwtTokenForUser(user.id);
        const refreshTokenModel = await generateRefreshTokenModel(user);
        setTokenCookie(res, refreshTokenModel.token);
        res.status(200).send({
            user: getUserDetails(user),
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
        const user = await getUserFromRefreshToken(token);
        let newRefreshToken = generateTokenForRefreshToken(user.id as string);
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
        let newJwtTokenforUser = generateJwtTokenForUser(user.id as string);
        setTokenCookie(res, newRefreshToken);
        return res.send({
            user: { ...getUserDetails(user), token: newJwtTokenforUser },
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
            clearCookie(res);
            return res.status(200).send({ message: 'Token revoked successfully' });
        });
    } catch (error) {
        return res.status(500).send({ message: 'Cannot revoke!' });
    }
}

const generateRefreshTokenModel = async (user: User) => {
    const userId = user.id as Types.ObjectId;
    const userIdAsString = user.id as string;
    const refreshTokenModel: RefreshToken = {
        token: generateTokenForRefreshToken(userIdAsString),
        user: userId,
        expiryDate: new Date(Date.now() + Number(process.env["REFRESH_TOKEN_EXP_TIME_NUMBER"]))
    }
    return await RefreshTokenModel.create(refreshTokenModel);
}

const getUserFromRefreshToken = async (token: string) => {
    const user = await RefreshTokenModel.findOne({ token: token }).populate<{ user: User }>({
        path: 'user',
        populate: { path: 'created_recipes', model: 'recipe' }
    }).orFail();
    if (!user || user.isExpired) throw new Error('Invalid token');
    return user.user;
}

const setTokenCookie = (res: any, token: string) => {
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + Number(process.env["COOKIE_TIME"]))
    };
    res.cookie('refreshToken', token, cookieOptions);
}

const clearCookie = (res: any) => {
    res.clearCookie('refreshToken');
}

const generateTokenForRefreshToken = (id: string) => {
    return jwt.sign({ id: id }, process.env["JWT_REFRESH_TOKEN_SECRET"]!, { expiresIn: process.env["REFRESH_TOKEN_EXP_TIME"] });
}

const generateJwtTokenForUser = (userId: string) => {
    return jwt.sign({ id: userId }, process.env["JWT_SECRET"]!, { expiresIn: process.env["JWT_TOKEN_EXP_TIME"] });
}

const getUserDetails = (user: User) => {
    const { id, email, favourite_recipes, created_recipes, custom_objects, settings } = user;
    return { id, email, favourite_recipes, created_recipes, custom_objects, settings };
}
