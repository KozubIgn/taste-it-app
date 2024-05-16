import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { ShoppingList } from "./interfaces/shopping-list.interface";
import { ShoppingListService } from "./services/shopping-list.service";
import { FlatTreeControl } from "@angular/cdk/tree";
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material/tree";
import { SelectionModel } from "@angular/cdk/collections";
import { MatDialog } from "@angular/material/dialog";
import { EditDialogComponent } from "./dialogs/edit-dialog.component";
import { Ingredient } from "../shared/interfaces/ingredient.interface";

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  amount: number | undefined;
}
@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  @Input() shoppingLists$: Observable<ShoppingList[]> | undefined;
  private shoppingListsChangeSub: Subscription | undefined;
  private _transformer = (node: ShoppingList | Ingredient, level: number): FlatNode => {
    if ('amount' in node) {
      return {
        expandable: false,
        name: node.name,
        level: level,
        amount: node.amount,
      };
    }
    return {
      expandable: !!node.ingredients && node.ingredients?.length > 0,
      name: node.name,
      amount: node.ingredients?.length,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.ingredients,
  );
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  checklistSelection = new SelectionModel(true);

  constructor(private shoppingListService: ShoppingListService, private dialog: MatDialog) { }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  ngOnInit() {
    this.shoppingListsChangeSub = this.shoppingLists$?.subscribe((lists: ShoppingList[]) => {
      this.dataSource.data = lists;
    })
  }

  descendantsAllSelected(node: any): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child => this.checklistSelection.isSelected(child));
  }

  descendantsPartiallySelected(node: any): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  todoItemSelectionToggle(node: any) {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }

  openEditModalDialog(node?: any) {
    if (!node) {
      const dialogRef = this.dialog.open(EditDialogComponent, {});
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.onEditShoppingList(result);
        }
      });
    } else {
      const descendants = this.treeControl.getDescendants(node);
      const dialogRef = this.dialog.open(EditDialogComponent, {
        data: {
          node: node,
          descendants: descendants
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const data = {
            value: { ...result.value },
            node: node,
          }
          this.onEditShoppingList(data);
        }
      });
    }
  }

  onEditShoppingList(result: any) {
    if (result.value) {
      this.shoppingListService.updateShoppingList(result);
    }
  }

  ngOnDestroy(): void {
    this.shoppingListsChangeSub?.unsubscribe();
  }
}
