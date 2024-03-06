import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import recipeRouter from './routers/recipe.router';
import userRouter from './routers/user.router';
import tagRouter from './routers/tag.router';
import { dbConnect } from './config/database.config';
import bodyParser from 'body-parser';

const PORT = process.env.PORT;
const app = express();
dbConnect();
app.use(bodyParser.json({ limit: '5mb' }));
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ['http://localhost:4200']
}));

app.listen(PORT, () => {
    console.log(`Success! Website run on http://localhost:${PORT}`);
});

app.use('/api/recipes', recipeRouter);
app.use('/api/user', userRouter);
app.use('/api/tags', tagRouter);