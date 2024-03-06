import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Recipe } from '../interfaces/recipe.interface';
import { Observable } from 'rxjs';
import { DataStorageService } from '../../shared/services/data-storage.service';
import { RecipeService } from './recipe.service';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private dataStorageService: DataStorageService,
    private recipeService: RecipeService
  ) { }


  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Recipe[] | Observable<any[]> | Promise<Recipe[]> {
    const recipes = this.recipeService.getAllRecipes();

    // if (recipes.length === 0) {
    //   return this.dataStorageService.fetchRecipes();
    // }
    return recipes!;
  }
}
