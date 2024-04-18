import { Component, OnInit } from '@angular/core';
import { UploadedFile } from 'src/app/shared/interfaces/upload-file.interface';
import { AlertService } from 'src/app/shared/services/alert.service';
import { FileUploadService } from './service/file-upload.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-file-upload',
    templateUrl: 'file-upload.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: FileUploadComponent
        }
    ]
})
export class FileUploadComponent implements OnInit, ControlValueAccessor {
    uploadedFile?: UploadedFile;
    uploadedFiles: UploadedFile[] = [];
    files: File[] = [];
    imagePreviewUrls: string[] = [];
    hasErrorFiles: UploadedFile[] = [];
    fileUploadId: string = '';
    MAX_FILES_AMOUNT: number = 5;
    disabled: boolean = false;

    constructor(private fileUploadService: FileUploadService, private alertService: AlertService) { }

    ngOnInit(): void {
        this.fileUploadService.AddDefaultFile();
    }

    fileDropped(selectedFiles: File[]) {
        if (!selectedFiles) {
            return;
        }
        const totalFilesAmount: number = selectedFiles.length + this.files.length;
        if (totalFilesAmount > this.MAX_FILES_AMOUNT) {
            this.alertService.error(`to many files. Allowed amount files is ${this.MAX_FILES_AMOUNT}`);
            return;
        }
        selectedFiles.forEach((file: File) => this.files.push(file));
        this.fileUploadService.uploadedFilesSubject$.next(this.uploadedFiles);
    }

    removeFile(file: UploadedFile): void {
        this.uploadedFiles.splice(this.uploadedFiles.indexOf(file), 1);
        this.fileUploadService.uploadedFilesSubject$.next(this.uploadedFiles);
    }

    handleUploadFiles(event: any) {
        const files = event?.target?.files;
        this.fileUploadService.uploadFiles(files).subscribe((validatedFile: UploadedFile) => {
            this.uploadedFile = validatedFile;

            const { url } = validatedFile;
            if (validatedFile.url && validatedFile.file) {
                this.imagePreviewUrls.push(url);
                this.uploadedFiles.push(validatedFile);
                this.fileUploadService.uploadedFilesSubject$.next(this.uploadedFiles);
                this.onChange(this.uploadedFiles);
            } else {
                this.hasErrorFiles.push(validatedFile)
            };
        })
    }

    onChange = (value: UploadedFile[]) => [];
    onTouched = () => { };
    writeValue(obj: UploadedFile[]): void {
        this.uploadedFiles = obj
    }
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}