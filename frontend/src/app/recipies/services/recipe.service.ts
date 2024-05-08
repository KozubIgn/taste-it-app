import { Injectable } from '@angular/core';
import { Recipe } from '../interfaces/recipe.interface';
import { Ingredient } from 'src/app/shared/interfaces/ingredient.interface';
import { BehaviorSubject, Observable, Subject, map, switchMap, take, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FAVOURITES, RECIPES, RECIPE_ADD_NEW, RECIPE_DELETE, RECIPE_UPDATE } from 'src/app/shared/constants/urls';
import { User } from 'src/app/auth/user.model';
import { AuthService } from '../../auth/auth.service';
import { ListType } from '../enums/list-type.enum';

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

  getRecipesForListType(listType: ListType | undefined): Observable<Recipe[]> | undefined {
    switch (listType) {
      case ListType.ALL:
        return this.getRecipes();
      case ListType.FAVOURITES:
        return this.getFavouritesRecipes();
    }
  }

  getFavouritesRecipes(): Observable<Recipe[]> | undefined {
    return this.recipes$?.pipe(
      map(recipes => recipes.filter(recipe => recipe.favourites))
    )
  }

  getRecipeById(id: string): Observable<Recipe | undefined> {
    return this.recipesSubject$.pipe(map(recipes => recipes.find(recipe => recipe.id === id)))
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

  updateRecipe(newRecipe: Recipe, recipeId: string) {
    const user = localStorage.getItem('user');
    const userObj: User = JSON.parse(user!);
 
    return this.http.put<Recipe>(RECIPE_UPDATE(userObj.id, recipeId), { newRecipe }).pipe(
      switchMap((response: any) => {
        const updatedRecipe = response.updatedRecipe;
        return this.recipesSubject$.pipe(
          take(1),
          map((recipes: Recipe[]) => {
            const updatedRecipes = recipes.map(recipe => {
              if (recipe.id === updatedRecipe.id) {
                return updatedRecipe;
              } else {
                return recipe;
              }
            });
            return updatedRecipes;
          }),
          tap(updatedRecipes => this.recipesSubject$.next(updatedRecipes))
        );
      })
    ).subscribe();
  }

  changeFavouriteStatus(id: string, isfavourite: boolean) {
    return this.http.patch<Recipe>(FAVOURITES(id), { favourite: isfavourite }).pipe(
      switchMap((response: any) => {
        return this.recipesSubject$.pipe(
          take(1),
          map((recipes: Recipe[]) => {
            const uploadedRecipes = recipes.map(recipe => {
              if (recipe.id === id) {
                recipe.favourites = response.favourites;
              } return recipe;
            });
            return uploadedRecipes;
          }),
          tap(uploadedRecipes => this.recipesSubject$.next(uploadedRecipes))
        );
      })
    ).subscribe();
  }

  deleteRecipe(id: string) {
    const user = localStorage.getItem('user');
    const userObj: User = JSON.parse(user!);
    this.http.delete(RECIPE_DELETE(userObj.id, id)).pipe(
      map((response: any) => {
        if (response.user) {
          this.recipesSubject$.next(response.user.created_recipes);
        }
      })
    ).subscribe();
  }
}

