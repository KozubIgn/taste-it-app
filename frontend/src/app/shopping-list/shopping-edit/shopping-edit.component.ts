import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Ingredient } from '../../shared/interfaces/ingredient.interface';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @Output() ingredientAdded = new EventEmitter<Ingredient>();
  @ViewChild('form', { static: false }) shoppingListForm!: NgForm;
  private ItemToEdit$: Subscription | undefined;
  editedItemIndex: number | undefined;
  editMode: boolean = false;
  editedItem: Ingredient | undefined;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.ItemToEdit$ = this.shoppingListService.startedEditing.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editedItem = this.shoppingListService.getIngredient(index);
        this.shoppingListForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        });
      }
    );
  }

  onAddItem(form: NgForm) {
    const newIngredient: Ingredient = {
      name: form.value.name,
      amount: form.value.amount,
    };
    if (this.editMode) {
      this.shoppingListService.updateIngredient(
        this.editedItemIndex,
        newIngredient
      );
    } else {
      this.shoppingListService.addIngredient(newIngredient);
    }
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.shoppingListForm.reset();
    this.editMode = false;
  }
  onDelete() {
    this.shoppingListService.deleteIngredient(this.editedItemIndex!);
    this.onClear();
  }

  ngOnDestroy(): void {
    this.ItemToEdit$?.unsubscribe();
  }
}
