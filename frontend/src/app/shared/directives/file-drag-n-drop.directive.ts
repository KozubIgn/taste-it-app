import { EventEmitter, HostBinding, Output, HostListener, Directive } from '@angular/core';
import { UploadedFile } from '../interfaces/upload-file.interface';
enum DropColor {
  Default = '#FFFFFF',
  Over = '#DEE2E6',
}

@Directive({
  selector: '[appDragAndDropFile]',
})
export class DragAndDropFileDirective {
  @Output() public fileDropped: EventEmitter<UploadedFile[]> = new EventEmitter();
  @HostBinding('style.background') backgroundColor: string = DropColor.Default;

  @HostListener('dragover', ['$event']) public onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.backgroundColor = DropColor.Over;
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.backgroundColor = DropColor.Default;

  }

  @HostListener('drop', ['$event']) public onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.backgroundColor = DropColor.Default;

    const fileList: FileList | undefined = event.dataTransfer?.files;
    const files: UploadedFile[] = [];

    if (fileList !== undefined && fileList?.length >= 1) {
      Array.from(fileList).map((file: File) => {
        const url = window.URL.createObjectURL(file);
        files.push(
          {
            file: file,
            url: url
          });
      })
      this.fileDropped.emit(files);
    };
  }
}
