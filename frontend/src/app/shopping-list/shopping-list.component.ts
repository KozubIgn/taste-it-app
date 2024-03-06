import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ingredient } from '../shared/interfaces/ingredient.interface';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[] = [];
  private ingredientChangeSub: Subscription | undefined;
  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.ingredients = this.shoppingListService.getIngredients();
    this.ingredientChangeSub =
      this.shoppingListService.ingredients$.subscribe(
        (ingredients: Ingredient[]) => {
          this.ingredients = ingredients;
        }
      );
  }

  onEditItem(index: number) {
    this.shoppingListService.startedEditing.next(index);
  }

  ngOnDestroy(): void {
    this.ingredientChangeSub?.unsubscribe();
  }
}
