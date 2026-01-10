import fs from 'fs/promises';
import path from 'path';
import { StorageAdapter } from './adapter';

export class FilesystemStorageAdapter implements StorageAdapter {
  private baseDir: string;

  constructor(baseDir?: string) {
    this.baseDir = baseDir ?? './uploads';
  }

  private getPath(key: string): string {
    return path.join(this.baseDir, key);
  }

  async save(file: Buffer, key: string): Promise<string> {
    await fs.mkdir(this.baseDir, { recursive: true });
    const filePath = this.getPath(key);
    await fs.writeFile(filePath, file);
    return key;
  }

  async get(key: string): Promise<Buffer> {
    const filePath = this.getPath(key);
    return fs.readFile(filePath);
  }

  async delete(key: string): Promise<void> {
    const filePath = this.getPath(key);
    await fs.unlink(filePath);
  }

  async exists(key: string): Promise<boolean> {
    const filePath = this.getPath(key);
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
