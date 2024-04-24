import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    imports: [
        MatButtonModule,
        MatSlideToggleModule,
        MatChipsModule,
        MatDialogModule
    ],
    exports: [
        MatButtonModule,
        MatSlideToggleModule,
        MatChipsModule,
        MatDialogModule
    ]
})

export class MaterialModule { }
