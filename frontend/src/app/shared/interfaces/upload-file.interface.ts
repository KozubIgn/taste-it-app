export interface UploadedFile {
  file?: File;
  error?: UploadError;
  url: string;
}

export interface UploadError {
  name: string;
  errorMessage: string;
}
