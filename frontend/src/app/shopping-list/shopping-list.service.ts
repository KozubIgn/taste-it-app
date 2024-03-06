import { Ingredient } from 'src/app/shared/interfaces/ingredient.interface';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  ingredients$ = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  private ingredients: Ingredient[] = [
    { name: 'Apple', amount: 5 },
    { name: 'Orange', amount: 2 },
  ];

  getIngredients() {
    return this.ingredients.slice();
  }
  getIngredient(index: number) {
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredients$.next(this.ingredients.slice());
  }
  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.ingredients$.next(this.ingredients.slice());
  }

  updateIngredient(index: number | undefined, newIngredient: Ingredient) {
    this.ingredients[index!] = newIngredient;
    this.ingredients$.next(this.ingredients.slice());
  }
  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredients$.next(this.ingredients.slice());
  }
}
