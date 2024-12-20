import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ShoppingList } from '../interfaces/shopping-list.interface';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from '../dialogs/edit-dialog.component';
import { FormGroup } from '@angular/forms';
import { ShoppingListService } from '../services/shopping-list.service';

@Component({
  selector: 'app-shopping-list-page',
  templateUrl: './shopping-list-page.component.html',
  styleUrls: ['./shopping-list-page.component.scss']
})
export class ShoppingListPageComponent implements OnInit {
  shoppingLists$: BehaviorSubject<ShoppingList[]> | undefined;
  constructor(private shoppingListService: ShoppingListService, private dialog: MatDialog) { }

  ngOnInit() {
    this.shoppingLists$ = this.shoppingListService.getShoppingListsSubject();
  }

  onSelectShoppingList(_t16: any) {
    throw new Error('Method not implemented.');
  }

  onNewShoppingList() {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data:
        { title: 'Add new shopping list' }
    });
    dialogRef.afterClosed().subscribe(form => {
      if (form) {
        this.onAddNewShoppingList(form);
      }
    });
  }

  onAddNewShoppingList(shoppingListForm: FormGroup) {
    const newShoppingList: ShoppingList = {
      name: shoppingListForm.get('name')?.value,
      ingredients: shoppingListForm.get('ingredients')?.value,
      checked: false,
      level: 0,
      expandable: shoppingListForm.get('ingredients') ? true : false,
    };
    this.shoppingListService.addNewShoppingList(newShoppingList);
    //handle response
  }
}
