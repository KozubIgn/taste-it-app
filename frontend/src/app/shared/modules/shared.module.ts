import { NgModule } from '@angular/core';
import { FileUploadComponent } from 'src/app/components/file/file-upload/file-upload.component';
import { DragAndDropFileDirective } from '../directives/file-drag-n-drop.directive';
import { IconModule } from './icon.module';
import { MaterialModule } from './material.module';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../components/loading-spinner.component';
import { DropdownDirective } from '../directives/dropdown.directive';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        DragAndDropFileDirective,
        FileUploadComponent,
        LoadingSpinnerComponent,
        DropdownDirective, 
    ],
    imports: [
        IconModule,
        MaterialModule,
        CommonModule,
        FormsModule
    ],
    exports: [
        DragAndDropFileDirective,
        LoadingSpinnerComponent,
        FileUploadComponent,
        DropdownDirective,
        IconModule,
        MaterialModule,
        CommonModule,
        FormsModule
    ]
})
export class SharedModule{ }
