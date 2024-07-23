import { User } from '../models/user.model';
import * as jwt from 'jsonwebtoken';
import { RefreshToken, RefreshTokenModel } from '../models/refreshToken.model';
import { Types } from "mongoose";

export const generateRefreshTokenModel = async (user: User) => {
    const userId = user.id as Types.ObjectId;
    const userIdAsString = user.id as string;
    const refreshTokenModel: RefreshToken = {
        token: generateTokenForRefreshToken(userIdAsString),
        user: userId,
        expiryDate: new Date(Date.now() + Number(process.env["REFRESH_TOKEN_EXP_TIME_NUMBER"]))
    }
    return await RefreshTokenModel.create(refreshTokenModel);
}

export const generateTokenForRefreshToken = (id: string) => {
    return jwt.sign({ id: id }, process.env["JWT_REFRESH_TOKEN_SECRET"]!, { expiresIn: process.env["REFRESH_TOKEN_EXP_TIME"] });
}

export const getUserFromRefreshToken = async (token: string) => {
    const user = await RefreshTokenModel.findOne({ token: token }).populate<{ user: User }>({
        path: 'user',
        populate: [{ path: 'created_recipes', model: 'recipe' },
        {
            path: 'shopping_lists', populate: {
                path: 'ingredients', model: 'ingredient'
            }
        }]
    }).orFail();
    if (!user || user.isExpired) throw new Error('Invalid token');
    return user.user;
}

export const setTokenCookie = (res: any, token: string) => {
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + Number(process.env["COOKIE_TIME"]))
    };
    res.cookie('refreshToken', token, cookieOptions);
}

export const clearCookie = (res: any) => {
    res.clearCookie('refreshToken');
}

export const generateJwtTokenForUser = (userId: string) => {
    return jwt.sign({ id: userId }, process.env["JWT_SECRET"]!, { expiresIn: process.env["JWT_TOKEN_EXP_TIME"] });
}


export const getUserDetails = (user: User) => {
    const { id, email, favourite_recipes, created_recipes, custom_objects, shopping_lists, settings } = user;
    return { id, email, favourite_recipes, created_recipes, custom_objects, shopping_lists, settings };
}

