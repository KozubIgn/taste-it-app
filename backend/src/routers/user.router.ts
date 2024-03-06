import { Router } from "express";
import { User, UserModel } from "../models/user.model";
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
const router = Router();

router.post('/signup', async (req, res) => {
    const email = req.body.email;
    const hashedPassword = await hash(req.body.password, 10);
    const user = await UserModel.findOne({ email });
    if (user) {
        res.status(401).send('user is already exist');
        return
    }
    const newUser: User = {
        id: '',
        email: email.toLowerCase(),
        password: hashedPassword,
        favourite_recipes: [],
        created_recipes: []
    };
    const dbUser = await UserModel.create(newUser);
    res.send(generateTokenReponse(dbUser))
});

const generateTokenReponse = (user: User) => {
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        process.env.JWT_SECRET!, {
        expiresIn: "30d"
    });

    return {
        id: user.id,
        email: user.email,
        token: token
    };
}

router.post('/login', async (req, res) => {
    const email = req.body.email;
    const user = await UserModel.findOne({ email });
    if (user && (await compare(req.body.password, user.password))) {
        res.send(generateTokenReponse(user));
    }
    else {
        res.status(404).send("username or password is invalid!");
    }
})

export default router;