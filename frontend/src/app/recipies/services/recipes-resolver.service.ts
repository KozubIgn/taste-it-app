import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Recipe } from '../interfaces/recipe.interface';
import { Observable } from 'rxjs';
import { RecipeService } from './recipe.service';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor( private recipeService: RecipeService) { }

  resolve(): Recipe[] | Observable<any[]> | Promise<Recipe[]> {
    const recipes = this.recipeService.getAllRecipes();
    return recipes!;
  }
}
