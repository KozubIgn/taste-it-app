import { verify } from 'jsonwebtoken';

export const middlewares = {
    verifyToken: async (req: any, res: any, next: any) => {
        const token = req.headers.access_token as string;
        if (!token) return res.status(403).send();
        try {
            const decodedUser = verify(token, process.env.JWT_SECRET!);
            req.user = decodedUser;
        } catch (error) {
            res.status(403).send("middleware verification filed");
        }
        return next();

    },
    getUserId: async (req: any, res: any, next: any) => {
        const token = req.headers.access_token as string;
        if (!token) return res.status(403).send();
        try {
            const decodedUser = verify(token, process.env.JWT_SECRET!);
            req.userid = decodedUser;
        } catch (error) {
            res.status(403).send("middleware verification filed");
        }
        return next();
    }
}
