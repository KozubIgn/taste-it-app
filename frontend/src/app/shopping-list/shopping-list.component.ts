import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { BehaviorSubject, Subject, Subscription, debounceTime } from "rxjs";
import { ShoppingList } from "./interfaces/shopping-list.interface";
import { ShoppingListService } from "./services/shopping-list.service";
import { FlatTreeControl } from "@angular/cdk/tree";
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material/tree";
import { SelectionModel } from "@angular/cdk/collections";
import { MatDialog } from "@angular/material/dialog";
import { EditDialogComponent } from "./dialogs/edit-dialog.component";
import { Ingredient } from "../shared/interfaces/ingredient.interface";
import { DeleteDialogComponent } from "./dialogs/delete-dialog.component";

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  amount: number | undefined;
  children?: any[];
  id?: string | undefined;
  checked?: boolean | undefined;
  indeterminate?: boolean;
}

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
})

export class ShoppingListComponent implements OnInit, OnDestroy {
  private flatNodeTransformer = (node: ShoppingList | Ingredient, level: number): FlatNode => {
    return {
      expandable: !!node.ingredients && node.ingredients.length > 0,
      name: node.name,
      level: level,
      amount: (node as ShoppingList).ingredients ? (node as ShoppingList).ingredients?.length : (node as Ingredient).amount,
      id: node.id,
      checked: node.checked,
      indeterminate: false,
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this.flatNodeTransformer,
    node => node.level,
    node => node.expandable,
    node => (node as ShoppingList).ingredients,
  );

  hasChild = (_: number, node: FlatNode) => node.expandable;

  @Input() shoppingLists$: BehaviorSubject<ShoppingList[]> | undefined;
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  checklistSelection = new SelectionModel<FlatNode>(true);
  private shoppingListsSub$: Subscription | undefined;
  private dataToSendSub$ = new Subject<FlatNode[]>();
  private selectedNodes: FlatNode[] = [];
  private expandedNodeIds = new Set<string>();
  DELAY_TIME = 2000;

  constructor(private shoppingListService: ShoppingListService, private dialog: MatDialog) { }

  ngOnInit() {
    this.shoppingListsSub$ = this.shoppingLists$?.subscribe((lists: any[]) => {
      this.initializeTree(lists);
    });

    this.dataToSendSub$.pipe(
      debounceTime(this.DELAY_TIME)).subscribe((selectedNodes: FlatNode[]) => {
        if (selectedNodes.length > 0) {
          this.shoppingListService.updateCompletedStatus(selectedNodes);
          this.selectedNodes = [];
        }
      });
  };

  initializeTree(data: any): void {
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.dataSource.data = data;
    this.treeControl.dataNodes.forEach((node: any) => {
      this.initialNode(node);
      if (this.expandedNodeIds.has(node.id)) {
        this.treeControl.expand(node);
      }
    });
  }

  initialNode(node: FlatNode) {
    node.checked ? this.checklistSelection.select(node) : this.checklistSelection.deselect(node);
  }

  selectionToggle(node: any) {
    this.checklistSelection.toggle(node);
    node.checked = this.checklistSelection.isSelected(node);
    this.updateParentSelectionState(node);
    this.updateChildrenSelectionState(node);
    const nodeData = this.getNodeDataToSend(node);
    this.selectedNodes.push(nodeData);
    this.dataToSendSub$.next(this.selectedNodes);
  }

  handleExpandedNode(event: FlatNode) {
    this.treeControl.isExpanded(event) ?
      this.addNodeToSet(event) :
      this.removeNodeFromSet(event);
  }

  addNodeToSet(node: FlatNode) {
    this.expandedNodeIds.add(node.id!);
  }

  removeNodeFromSet(node: FlatNode) {
    this.expandedNodeIds.delete(node.id!);
  }

  private getNodeDataToSend(node: FlatNode) {
    const parent = this.getParentNode(node);
    const baseNode = parent ? parent : node;
    const children = this.treeControl.getDescendants(baseNode);
    return {
      ...baseNode,
      ingredients: children.map(childNode => ({
        ...childNode,
        checked: this.checklistSelection.isSelected(childNode),
        indeterminate: childNode.indeterminate,
      }))
    };
  }

  updateChildrenSelectionState(node: FlatNode) {
    const children = this.treeControl.getDescendants(node);
    if (children.length > 0) {
      children.map(child => {
        this.checklistSelection.isSelected(node) ? this.checklistSelection.select(child) : this.checklistSelection.deselect(child);
      })
    }
  }

  updateParentSelectionState(node: FlatNode) {
    let parent: FlatNode | null = this.getParentNode(node);
    while (parent) {
      const children = this.treeControl.getDescendants(parent);
      const allSelected = children.every(child => this.checklistSelection.isSelected(child));
      const someSelected = children.some(child => this.checklistSelection.isSelected(child));

      if (allSelected) {
        this.checklistSelection.select(parent);
        parent.indeterminate = false;
      } else if (someSelected) {
        this.checklistSelection.deselect(parent);
        parent.indeterminate = true;
      } else {
        this.checklistSelection.deselect(parent);
        parent.indeterminate = false;
      }
      parent.checked = allSelected;
      parent.indeterminate = !allSelected && someSelected;
      parent = this.getParentNode(parent);
    }
  }

  isIndeterminate(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child)) && !descendants.every(child => this.checklistSelection.isSelected(child));
    return result;
  }

  getParentNode(node: FlatNode): FlatNode | null {
    const currentLevel = node.level;
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (currentNode && currentNode.level < currentLevel) {
        return currentNode;
      }
    }
    return null;
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

  openDeleteModalDialog(node: any) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, { data: node });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onDeleteShoppingList(result);
      }
    });
  }

  onDeleteShoppingList(id: string) {
    this.shoppingListService.deleteRecipe(id);
  }

  onEditShoppingList(result: any) {
    if (result.value) {
      this.shoppingListService.updateShoppingList(result);
    }
  }

  ngOnDestroy(): void {
    this.shoppingListsSub$?.unsubscribe();
  }
}
