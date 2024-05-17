import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf } from '@angular/common';
import { ShoppingList } from '../interfaces/shopping-list.interface';
import { AbstractControl, FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { IconModule } from 'src/app/shared/modules/icon.module';
import { ShoppingListService } from '../services/shopping-list.service';

@Component({
    selector: 'edit-dialog',
    templateUrl: './edit-dialog.component.html',
    standalone: true,
    styles: [
        `input.ng-invalid.ng-touched,
        textarea.ng-invalid.ng-touched {
            border: 1px solid rgb(255, 55, 0);
        }`,
          `.row {
            margin: 5px 0;
        }`,
        `.error-message {
            font-size: small;
            color: rgb(255, 55, 0);
        }` 
],
    imports: [MatButtonModule, MatDialogModule, NgFor, NgIf, IconModule, FormsModule, ReactiveFormsModule]
})
export class EditDialogComponent implements OnInit {
    editMode = false;
    shoppingListForm!: FormGroup;
    shoppingListSubject$: Observable<ShoppingList | undefined> | undefined;
    shoppingList: ShoppingList | undefined;

    constructor(private router: Router,
        private ShoppingListService: ShoppingListService,
        public dialogRef: MatDialogRef<EditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,) { 
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '387px'
        
        this.dialogRef.updateSize(dialogConfig.width);
    }

    ngOnInit(): void {
        this.editMode = this.isEditRoute();
        this.initForm(this.data);
    }

    get controls() {
        return (<FormArray>this.shoppingListForm.get('ingredients')).controls;
    }

    isEditRoute(): boolean {
        return this.router.url.includes('edit');
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    private initForm(data?: any) {
        let name: string | undefined = '';
        let ingredients = new FormArray<FormGroup>([]);
        if ('node' in data) {
            const shoppingList = data.node;
            name = shoppingList.name;
            if (data.descendants && data.descendants.length > 0) {
                for (let ingredient of data.descendants) {
                    ingredients.push(
                        new FormGroup({
                            name: new FormControl(ingredient.name, Validators.required),
                            amount: new FormControl(ingredient.amount, [
                                Validators.required,
                                Validators.pattern(/^[1-9]+[0-9]*$/),
                            ])
                        })
                    )
                }
            }
        }
        this.shoppingListForm = new FormGroup({
            name: new FormControl(name, [Validators.required]),
            ingredients: ingredients,
        });
    }

    onAddIngredient() {
        (<FormArray>this.shoppingListForm.get('ingredients')).push(
            new FormGroup({
                name: new FormControl(null, Validators.required),
                amount: new FormControl(null, [
                    Validators.required,
                    Validators.pattern(/^[1-9]+[0-9]*$/),
                ]),
            })
        );
    }

    onDeleteIngredient(index: number) {
        (<FormArray>this.shoppingListForm.get('ingredients')).removeAt(index);
    }
    isInvalid(control: AbstractControl | null): boolean {
        return !!control && control.invalid && (control.touched || control.dirty);
    }
}