import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { ShoppingList } from '../interfaces/shopping-list.interface';

@Component({
    selector: 'edit-dialog',
    template: `
        <h2 mat-dialog-title> Edit Shopping List</h2>
        <mat-dialog-content>
        {{data.name}}
        </mat-dialog-content>
        <mat-dialog-actions align="end">
        	<button mat-button (click)="onCancel()">Cancel</button>
        	<button mat-button [mat-dialog-close]="true" cdkFocusInitial>Update</button>
        </mat-dialog-actions>`,
    standalone: true,
    imports: [MatButtonModule, MatDialogModule],
})
export class EditDialogComponent {
    constructor(public dialogRef: MatDialogRef<EditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ShoppingList
    ) { }

    onCancel(): void {
        this.dialogRef.close();
    }
}