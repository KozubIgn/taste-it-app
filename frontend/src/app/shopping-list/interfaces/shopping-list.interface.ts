import { ThemePalette } from "@angular/material/core";
import { Ingredient } from "src/app/shared/interfaces/ingredient.interface";

export interface ShoppingList{
    id?: string;
    name: string,
    ingredients?: Ingredient[]
    completed?: boolean,
    color?: ThemePalette
}