import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
    imports: [
        MatButtonModule,
        MatSlideToggleModule,
        MatChipsModule
    ],
    exports: [
        MatButtonModule,
        MatSlideToggleModule,
        MatChipsModule
    ]
})

export class MaterialModule { }
