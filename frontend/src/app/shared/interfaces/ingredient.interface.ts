import { ShoppingList } from "src/app/shopping-list/interfaces/shopping-list.interface";

export interface Ingredient extends ShoppingList {
  amount: number;
}
