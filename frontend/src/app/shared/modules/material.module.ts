import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
    imports: [
        MatButtonModule,
        MatSlideToggleModule,
        MatChipsModule,
        MatDialogModule,
        MatCheckboxModule
    ],
    exports: [
        MatButtonModule,
        MatSlideToggleModule,
        MatChipsModule,
        MatDialogModule,
        MatCheckboxModule
    ]
})

export class MaterialModule { }
