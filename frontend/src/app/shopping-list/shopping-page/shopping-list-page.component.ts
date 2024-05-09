import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ShoppingList } from '../interfaces/shopping-list.interface';

@Component({
  selector: 'app-shopping-list-page',
  templateUrl: './shopping-list-page.component.html',
  styleUrls: ['./shopping-list-page.component.scss']
})
export class ShoppingListPageComponent {
onSelectShoppingList(_t16: any) {
throw new Error('Method not implemented.');
}
shoppingLists$: Observable<ShoppingList[]> | undefined;
onNewShoppingList() {
throw new Error('Method not implemented.');
}

}
