// import { hash } from "bcrypt";
// import { UserModel, User } from "../models/user.model";
// import jwt from 'jsonwebtoken';

// export const signup = async (req: any, res: any) => {
//     const email = req.body.email;
//     const hashedPassword = await hash(req.body.password, 10);
//     const user = await UserModel.findOne({ email });
//     if (user) {
//         res.status(401).send('user is already exist');
//         return
//     }
//     const newUser: User = {
//         id: '',
//         email: email.toLowerCase(),
//         password: hashedPassword,
//         favourite_recipes: [],
//         created_recipes: []
//     };
//     const dbUser = await UserModel.create(newUser);
//     res.send(generateTokenReponse(dbUser))
// }
//     const generateRefreshToken = (user: User) => {
//         const refreshToken = jwt.sign(
//             { id: user.id, email: user.email }, process.env.JWT_REFRESH_TOKEN_SECRET!,
//             { expiresIn: "2m" }
//         );
//         return refreshToken;
//     }

//     const generateTokenReponse = (user: User) => {
//         const token = jwt.sign(
//             {
//                 id: user.id,
//                 email: user.email
//             },
//             process.env.JWT_SECRET!, {
//             expiresIn: "1m"
//         });

//         return {
//             id: user.id,
//             email: user.email,
//             token: token,
//             refreshToken: generateRefreshToken(user)
//         };
//     }
