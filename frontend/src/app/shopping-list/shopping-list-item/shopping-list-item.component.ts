import { Component, Input } from '@angular/core';
import { EditDialogComponent } from '../dialogs/edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ShoppingList } from '../interfaces/shopping-list.interface';

@Component({
  selector: 'app-shopping-list-item',
  templateUrl: './shopping-list-item.component.html',
  styleUrls: ['./shopping-list-item.component.scss'],
})
export class ShoppingListItemComponent {
  @Input() shoppingList: ShoppingList | undefined

  constructor(private dialog: MatDialog) { }

  openEditModalDialog() {
    const dialogRef = this.dialog.open(EditDialogComponent, { data: this.shoppingList });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onEditShoppingList(result);
      }
    });
  }

  onEditShoppingList(result: any) {
    throw new Error('Method not implemented.');
  }

  allComplete: boolean = false;

  updateAllComplete() {
    this.allComplete = this.shoppingList?.ingredients != null && this.shoppingList.ingredients.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.shoppingList?.ingredients == null) {
      return false;
    }
    return this.shoppingList?.ingredients.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.shoppingList?.ingredients == null) {
      return;
    }
    this.shoppingList.ingredients.forEach(t => (t.completed = completed));
  }
}
