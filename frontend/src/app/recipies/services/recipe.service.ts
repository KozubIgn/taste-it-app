import { Injectable } from '@angular/core';
import { Recipe } from '../interfaces/recipe.interface';
import { Ingredient } from 'src/app/shared/interfaces/ingredient.interface';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RECIPES, RECIPE_ADD_NEW } from 'src/app/shared/constants/urls';
import { User } from 'src/app/auth/user.model';
import { AuthService } from '../../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  recipesChanged$ = new Subject<Recipe[]>;
  private recipeSubject$ = new BehaviorSubject<Recipe | undefined>(undefined);
  private recipesSubject$ = new BehaviorSubject<Recipe[]>([]);
  recipes$: Observable<Recipe[]> | undefined = this.recipesSubject$.asObservable();
  private recipes: Recipe[] = [];
  shoppingListService: any;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.getRecipes()?.subscribe((recipes: Recipe[]) => this.recipesSubject$.next(recipes));
  }

  getAllRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(RECIPES);
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged$.next(this.recipes.slice());
  }

  getRecipes(): Observable<Recipe[]> | undefined {
    return this.authService.getUser$().pipe(
      map((user: User | null) => {
        return user ? user.created_recipes : [];
      }
      )
    )
  }

  getRecipe(index: number | undefined) {
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
    const user = localStorage.getItem('user');
    const userObj: User = JSON.parse(user!);
    this.http.post<User>(RECIPE_ADD_NEW(userObj.id), recipe).pipe(
      map((user: User | null) => {
        if (user) {
          this.recipesSubject$.next(user.created_recipes);
        }
      })
    ).subscribe();
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

