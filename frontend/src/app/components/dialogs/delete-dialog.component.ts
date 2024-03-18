import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { Recipe } from "src/app/recipies/interfaces/recipe.interface";

@Component({
    selector: 'delete-dialog',
    template: `
        <mat-dialog-content>
        	<h3>Delete Recipe</h3>
        	<p>are you sure you want to delete the recipe?</p>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
        	<button mat-raised-button color="basic" mat-dialog-close>Cancel</button>
        	<button mat-raised-button color="primary" [mat-dialog-close]="data.id">Delete</button>
        </mat-dialog-actions>`,
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
})
export class DeleteDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Recipe) {}
 }