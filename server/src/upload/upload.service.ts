import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  getFileUrl(filename: string): string {
    return `/uploads/${filename}`;
  }

  getFileUrls(filenames: string[]): string[] {
    return filenames.map((f) => this.getFileUrl(f));
  }
}
