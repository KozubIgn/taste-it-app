import { verify } from 'jsonwebtoken';

export const getUserId = async (req: any, res: any, next: any) => {
    const token = req.headers.access_token as string;
    if (!token) return res.status(403).send();
    try {
        const decodedUser = verify(token, process.env.JWT_SECRET!);
        req.userid = decodedUser;
    } catch (error) {
        res.status(403).send({ message: "[middleware] verification filed" });
    }
    return next();
}
