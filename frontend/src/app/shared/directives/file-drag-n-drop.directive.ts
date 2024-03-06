import { EventEmitter, HostBinding, Output, HostListener, Directive } from '@angular/core';
import { FileUploadService } from 'src/app/components/file/file-upload/service/file-upload.service';
import { FileUploadComponent } from '../../components/file/file-upload/file-upload.component';
import { UploadedFile } from '../interfaces/upload-file.interface';
import { Observable } from 'rxjs';
import { NgModel } from '@angular/forms';

// @Directive({
//   selector: '[FileDragDrop]',
// })
// export class FileDragNDropDrective {
//   @Output() private filesChangeEmiter: EventEmitter<File[]> =
//     new EventEmitter();

//   @HostBinding('style.background') private background = '#eee';
//   @HostBinding('style.border') private borderStyle = '2px dashed';
//   @HostBinding('style.border-color') private borderColor = '#696D7D';
//   @HostBinding('style.border-radius') private borderRadius = '5px';

//   constructor() {}

//   @HostListener('dragleave', ['$event']) public onDragLeave(event: any) {
//     event.preventDefault();
//     event.stopPropagation();
//     this.background = '#eee';
//     this.borderColor = '#696D7D';
//     this.borderStyle = '2px dashed';
//   }

//   @HostListener('drop', ['$event']) public onDrop(event: any) {
//     event.preventDefault();
//     event.stopPropagation();
//     this.background = '#eee';
//     this.borderColor = '#696D7D';
//     this.borderStyle = '2px dashed';
//     let files = event.dataTransfer.files;
//     let valid_files: Array<File> = files;
//     this.filesChangeEmiter.emit(valid_files);
//   }

// }

@Directive({
  selector: '[appDragAndDropFile]',
})
export class DragAndDropFileDirective {
  @Output()
  public fileDropped: EventEmitter<File[]> = new EventEmitter<File[]>();
  private isFileDropped: boolean = false;

  constructor(private fileuploadService: FileUploadService, private fileUploadComponent: FileUploadComponent) {
  }

  @HostBinding('style.background')
  public bgColor: string | undefined;

  // @HostBinding('class.dropzone.empty') get valid() {
  //   return this.control.valid; 
  // }
  // @HostBinding('class.dropzone') get invalid() {
  //   return this.control.invalid;
  // }

  @HostListener('dragover', ['$event'])
  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    // this.bgColor = '#D3D3D3';
    this.bgColor = 'green';

  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.isFileDropped) {
      this.bgColor = 'transparent';
    }
  }

  @HostListener('drop', ['$event'])
  public onDragDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();


    const droppedFiles: FileList | undefined = event?.dataTransfer?.files;
    if (droppedFiles?.length && droppedFiles != null) {
      // const allowedFiles: File[] | undefined = this.fileuploadService.handleFilesAddition(files);
      // const allowedFiles: Observable<UploadedFile> =
      this.fileuploadService.uploadFiles(droppedFiles);
      // this.fileDropped.emit(allowedFiles);
      return;
    }

    this.bgColor = 'transparent';
  }

  @HostListener('mouseover', ['$event'])
  public onMouseOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

  }

  @HostListener('mouseleave', ['$event'])
  public onMouseLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.isFileDropped) {
      this.bgColor = 'transparent';
    }
  }
}
