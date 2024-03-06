import { Injectable } from '@angular/core';
import { Recipe } from '../interfaces/recipe.interface';
import { Ingredient } from 'src/app/shared/interfaces/ingredient.interface';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RECIPES_ALL_URL, RECIPE_ADD_NEW } from 'src/app/shared/constants/urls';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  recipesChanged$ = new Subject<Recipe[]>;
  private recipeSubject$ = new BehaviorSubject<Recipe | undefined>(undefined);
  private recipes: Recipe[] = [];
  basePath: string = 'https://taste-eat-app-default-rtdb.europe-west1.firebasedatabase.app/';
  recipes$: Observable<Recipe[]> | undefined;
  shoppingListService: any;
  dataStorageService: any;

  constructor(private http: HttpClient) { }

  getAllRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(RECIPES_ALL_URL);
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged$.next(this.recipes.slice());
  }

  getRecipes(index: number | undefined) {
    return this.recipes[index!];
  }

  setRecipeSubject(recipe: Recipe): void {
    this.recipeSubject$.next(recipe);
  }

  getRecipeSubject(): Observable<Recipe | undefined> {
    return this.recipeSubject$;
  }

  addIngredientsToShoppingList(ingredients: Ingredient[] | undefined) {
    if (ingredients) {
      this.shoppingListService.addIngredients!(ingredients);
    }
  }

  addRecipe(recipe: Recipe) {
    const userId = localStorage.getItem('id');
    return this.http.post<Recipe>(RECIPE_ADD_NEW, recipe).subscribe((response) => {
    })
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged$.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged$.next(this.recipes.slice());
  }
}

