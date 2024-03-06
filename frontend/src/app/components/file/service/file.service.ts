// import { Injectable } from '@angular/core';
// import { saveAs } from 'file-saver';
// import { FileContentType } from 'src/app/enums/file-content-type.enum';
// import { Base64 } from 'src/app/shared/interfaces/base64.interface';
// import { AlertService } from 'src/app/shared/services/alert.service';


// @Injectable({
//     providedIn: 'root'
// })
// export class FileService {
//     constructor(private alertService: AlertService) {
//     }
//     handleFilesAddition(files: FileList, uploadAllowedContentTypes: FileContentType[], maxFilesAmount: number, allowMultipleFiles: boolean, maxFileMBSize: number): File[] | undefined {
//         if (files.length > 0) {
//             if (!allowMultipleFiles && files.length > 1) {
//                 this.alertService.error('Próbujesz dodać więcej niż jeden plik.');
//                 return;
//             }

//             if (files.length > 20) {
//                 this.alertService.error(`Próbujesz dodać więcej niż ${maxFilesAmount} plików.`);
//                 return;
//             }

//             return Array.from(files).filter((file: File) => {
//                 if (file.size > this.getMaxFileMBSizeAsKB(maxFileMBSize)) {
//                     this.alertService.error(`Plik ${file.name} jest większy niż dozwolone ${maxFileMBSize}MB.`);
//                     return;
//                 }

//                 if (!uploadAllowedContentTypes.includes(file.type as FileContentType)) {
//                     this.alertService.error(`Próbujesz wgrać niedozwolony format pliku.`);
//                     return;
//                 }
//                 return file;
//             });
//         }
//     }

//     private getMaxFileMBSizeAsKB(maxFileMBSize: number): number {
//         return maxFileMBSize * 1000000;
//     }
//     getUrlFromUploadedImage(files: File[]): Promise<string> {
//         return new Promise<string>((resolve, reject) => {
//             const reader: FileReader = new FileReader();

//             reader.readAsDataURL(files[0]);
//             reader.onload = () => {
//                 resolve(reader.result as string);
//             }
//         })
//     }

//     // downloadFile(base64: Base64): void {
//     //     const blobData = this.convertBase64ToBlobData(base64.base64, base64.contentType);
//     //     saveAs(blobData, base64.fileName);
//     // }


//     // convertFileToBase64(file: File): Promise<Base64> {
//     //     const reader = new FileReader();
//     //     return new Promise<Base64>((resolve, reject) => {
//     //         try {
//     //             reader.readAsDataURL(file);
//     //             return reader.onload = () => {
//     //                 const splitBase64Info: string[] = (reader.result as string).split(',');
//     //                 const base64: string = splitBase64Info[1];
//     //                 const contentType = splitBase64Info[0].split(';')[0] as FileContentType;
//     //                 resolve({
//     //                     fileName: File.name,
//     //                     base64,
//     //                     contentType
//     //                 });
//     //             };
//     //         } catch {
//     //             reject();
//     //         }
//     //     });
//     // }

//     // convertFilesToBase64List(files: File[]): Promise<Base64[]> {
//     //     const promises: Promise<Base64>[] = [];
//     //     files.forEach((file: File) => {
//     //         promises.push(
//     //             this.convertFileToBase64(file).then((base64: Base64) => {
//     //                 return base64;
//     //             })
//     //         );
//     //     });
//     //     return Promise.all(promises).then((promisesList: Base64[]) => {
//     //         return promisesList;
//     //     });
//     // }


//     // NO NEED
//     // private convertBase64ToBlobData(base64Data: string, contentType: string, sliceSize = 20): Blob {
//     //     const byteCharacters = atob(base64Data);
//     //     const byteArrays = [];

//     //     for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
//     //         const slice = byteCharacters.slice(offset, offset + sliceSize);

//     //         const byteNumbers = new Array(slice.length);
//     //         for (let i = 0; i < slice.length; i++) {
//     //             byteNumbers[i] = slice.charCodeAt(i);
//     //         }
//     //         const byteArray = new Uint8Array(byteNumbers);

//     //         byteArrays.push(byteArray);
//     //     }
//     //     return new Blob(byteArrays, { type: contentType });
//     // }

// }