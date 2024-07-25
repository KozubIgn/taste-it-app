import { EventEmitter, HostBinding, Output, HostListener, Directive } from '@angular/core';
import { FileUploadService } from 'src/app/components/file/file-upload/service/file-upload.service';

@Directive({
  selector: '[appDragAndDropFile]',
})
export class DragAndDropFileDirective {
  @Output()
  public fileDropped: EventEmitter<File[]> = new EventEmitter<File[]>();
  private isFileDropped: boolean = false;

  constructor(private fileuploadService: FileUploadService) {
  }

  @HostBinding('style.background')
  public bgColor: string | undefined;

  @HostListener('dragover', ['$event'])
  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
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
      this.fileuploadService.uploadFiles(droppedFiles);
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
