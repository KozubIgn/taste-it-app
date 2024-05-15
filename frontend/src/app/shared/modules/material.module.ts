import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    imports: [
        MatButtonModule,
        MatSlideToggleModule,
        MatChipsModule,
        MatDialogModule,
        MatCheckboxModule,
        MatTreeModule,
        MatIconModule,
    ],
    exports: [
        MatButtonModule,
        MatSlideToggleModule,
        MatChipsModule,
        MatDialogModule,
        MatCheckboxModule,
        MatTreeModule,
        MatIconModule,
    ]
})

export class MaterialModule { }
