import { FileContentType } from "src/app/enums/file-content-type.enum";


export interface Base64 {
    fileName: string;
    contentType: FileContentType;
    base64: string;
}