import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { Recipe, RecipeModel, ImageUrl } from '../models/recipe.model';
import { Tag, TagModel } from '../models/tag.model';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Ingredient } from '../models/ingredient.model';
import { auth } from '../../middlewares/auth.mid';
const router = Router();

router.get('/', asyncHandler(async (req, res) => {
    try {
        const recipes = await RecipeModel.find();
        res.send(recipes);
    } catch (error) {
        res.status(500).send('Internal Server error')
    }
}
));

router.get('/search/:searchTerm', asyncHandler(async (req, res) => {
    const searchRegex = new RegExp(req.params.searchTerm, 'i');
    const recipe = await RecipeModel.find({ name: { $regex: searchRegex } });
    res.send(recipe);
}
));

router.get('/:id', asyncHandler(async (req, res) => {
    try {
        const recipe = await RecipeModel.findById(req.params.id);
        res.send(recipe);
    } catch (error) {
        res.status(500).send(error);
    }
}
));

router.post('/new', auth, asyncHandler(async (req: any, res: any) => {
    const newRecipeData: Recipe = req.body;
    try {
        const user = jwt.verify(req.headers.access_token, process.env.JWT_SECRET!) as JwtPayload
        const ingredients: Ingredient[] = [];
        req.body.ingredients.map((ingredient: Ingredient) => {
            const ingredientToAdd = {
                name: ingredient.name,
                amount: ingredient.amount
            };
            ingredients.push(ingredientToAdd);
        });

        const imagesUrl: ImageUrl[] = [];
        req.body.imagePath.map((imagePathData: any) => {
            const image: ImageUrl = { url: imagePathData.url };
            imagesUrl.push(image);
        });

        const tags: Promise<Tag>[] = req.body.tags.map(async (tagData: any) => {
            const existingTag = await tagData.id ? tagExists(tagData.id) : false;
            if (existingTag) {
                return tagData
            } else {
                const newTag = new TagModel(tagData);
                await newTag.save();
                return newTag
            }
        });
        const savedTags = await Promise.all(tags);
        const newRecipe = new RecipeModel({
            ...newRecipeData,
            created_by: user.id,
            imagePath: imagesUrl,
            tags: savedTags,
            ingredients: ingredients
        });
        await newRecipe.save();
        res.status(200).send(newRecipe)
    } catch (error) {
        res.status(400).send(error)
    }
}
));

const tagExists = async (tagId: any): Promise<boolean> => {
    try {
        const existingTag = await TagModel.findById(tagId);
        return !!existingTag
    } catch (error) {
        console.error('Error checking tag existence:', error);
        return false;
    }
};

export default router;

