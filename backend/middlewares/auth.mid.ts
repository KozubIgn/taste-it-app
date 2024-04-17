import { verify } from 'jsonwebtoken';
import { UserModel } from '../src/models/user.model';
import { RefreshTokenModel } from '../src/models/refreshToken.model';

export async function auth(req: any, res: any, next: any) {
    const token = req.headers.access_token as string;
    console.log('[auth middle - be] acces_token from header', token);
    if (!token) {
        res.send({ message: "[MIDDLEWARE] No token provided!" });  
    }
    try {
        const decodedUser = verify(token, process.env.JWT_SECRET!) as { id: string };
        const userId = decodedUser.id;
        console.log('decoded user: ', decodedUser);
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized user' });
        }

        const refreshToken = await RefreshTokenModel.find({ user: user.id });
        if (!refreshToken) {
            return res.status(401).json({ message: 'Unauthorized refreshToken' });
        }
        next();
    } catch {
        res.status(403).send({ message: "[middleware] verification filed - token Expired" });
    }
}
