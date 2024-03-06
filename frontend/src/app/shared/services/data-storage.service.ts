import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '../../recipies/interfaces/recipe.interface';
import {map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  
  constructor(
    private http: HttpClient,
  ) { }

  addNewRecipe(recipe: Recipe) {
    return this.http
      .post('https://taste-eat-app-default-rtdb.europe-west1.firebasedatabase.app/recipes.json', recipe )
      .subscribe(response => console.log(response))
  }

  fetchRecipes(): Observable<any> {
    return this.http
      .get<Recipe[]>('https://taste-eat-app-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
    ).pipe(map(res => {
      const data = res;
    return data;}
    ))
  }
}
