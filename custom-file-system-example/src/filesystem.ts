import fs from 'fs/promises';
import path from 'path';
import mime from 'mime-types';
import { existsSync } from 'fs';

export interface FileMetadata {
  'mime-type': string;
  name: string;
  path: string;
  'last-modified': number;
  size: number;
  permissions: string;
  'public-url'?: string;
  thumbnail?: string | null;
  extra?: Record<string, any>;
}

export class FileSystemHandler {
  private rootDir: string;
  private publicUrlBase: string;

  constructor(rootDir: string, publicUrlBase: string) {
    this.rootDir = path.resolve(rootDir);
    this.publicUrlBase = publicUrlBase;
    
    // Ensure root dir exists
    if (!existsSync(this.rootDir)) {
      fs.mkdir(this.rootDir, { recursive: true }).catch(console.error);
    }
  }

  private getLocalPath(urlPath: string): string {
    // Remove leading slash and join with rootDir
    // Prevent directory traversal attacks
    const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
    return path.join(this.rootDir, safePath);
  }

  private getPublicUrl(urlPath: string): string {
    // Ensure urlPath starts with /
    const cleanPath = urlPath.startsWith('/') ? urlPath : `/${urlPath}`;
    return `${this.publicUrlBase}${cleanPath}`;
  }

  async getMetadata(urlPath: string): Promise<FileMetadata | null> {
    const localPath = this.getLocalPath(urlPath);
    if (!existsSync(localPath)) return null;

    const stats = await fs.stat(localPath);
    const name = path.basename(localPath);
    const isDirectory = stats.isDirectory();

    return {
      'mime-type': isDirectory ? 'application/directory' : (mime.lookup(name) || 'application/octet-stream'),
      name: name,
      path: urlPath.startsWith('/') ? urlPath : `/${urlPath}`,
      'last-modified': Math.round(stats.mtimeMs),
      size: stats.size,
      permissions: 'rw',
      'public-url': isDirectory ? undefined : this.getPublicUrl(urlPath),
      thumbnail: null, // Optional
      extra: isDirectory ? { 'can-move': true } : {} 
    };
  }

  async listDirectory(urlPath: string): Promise<FileMetadata[]> {
    const localPath = this.getLocalPath(urlPath);
    if (!existsSync(localPath)) throw new Error('Directory not found');

    const files = await fs.readdir(localPath);
    const metadataList: FileMetadata[] = [];

    for (const file of files) {
      const childPath = path.join(urlPath, file);
      const meta = await this.getMetadata(childPath);
      if (meta) metadataList.push(meta);
    }

    return metadataList;
  }

  async createDirectory(urlPath: string): Promise<FileMetadata> {
    const localPath = this.getLocalPath(urlPath);
    await fs.mkdir(localPath, { recursive: true });
    return (await this.getMetadata(urlPath))!;
  }

  async deleteResource(urlPath: string): Promise<void> {
    const localPath = this.getLocalPath(urlPath);
    await fs.rm(localPath, { recursive: true, force: true });
  }

  async saveFile(urlPath: string, sourceUrl: string, conflictStrategy: 'keep' | 'replace' | 'ask' = 'replace'): Promise<{ meta: FileMetadata, conflict?: boolean }> {
    let localPath = this.getLocalPath(urlPath);
    let finalUrlPath = urlPath;

    if (existsSync(localPath)) {
      if (conflictStrategy === 'ask') {
        return { meta: (await this.getMetadata(urlPath))!, conflict: true };
      }
      if (conflictStrategy === 'keep') {
        // Rename: file.png -> file_1.png
        const parsed = path.parse(urlPath);
        let counter = 1;
        while (existsSync(this.getLocalPath(path.join(parsed.dir, `${parsed.name}_${counter}${parsed.ext}`)))) {
          counter++;
        }
        finalUrlPath = path.join(parsed.dir, `${parsed.name}_${counter}${parsed.ext}`);
        localPath = this.getLocalPath(finalUrlPath);
      }
      // If replace, we just overwrite (default behavior of writeFile)
    }

    // Ensure parent directory exists
    await fs.mkdir(path.dirname(localPath), { recursive: true });

    // Download file
    const response = await fetch(sourceUrl);
    if (!response.ok) throw new Error(`Failed to download file from ${sourceUrl}`);
    
    const buffer = Buffer.from(await response.arrayBuffer());
    await fs.writeFile(localPath, buffer);

    return { meta: (await this.getMetadata(finalUrlPath))! };
  }

  async moveResource(oldUrlPath: string, newDir: string, conflictStrategy: string): Promise<{ meta: FileMetadata, conflict?: boolean }> {
    const oldLocalPath = this.getLocalPath(oldUrlPath);
    const fileName = path.basename(oldUrlPath);
    let newUrlPath = path.join(newDir, fileName);
    let newLocalPath = this.getLocalPath(newUrlPath);

    if (existsSync(newLocalPath)) {
      if (conflictStrategy === 'keep') {
        const parsed = path.parse(newUrlPath);
        let counter = 1;
        while (existsSync(this.getLocalPath(path.join(parsed.dir, `${parsed.name}_${counter}${parsed.ext}`)))) {
          counter++;
        }
        newUrlPath = path.join(parsed.dir, `${parsed.name}_${counter}${parsed.ext}`);
        newLocalPath = this.getLocalPath(newUrlPath);
      } else if (conflictStrategy === 'replace') {
         // overwrite
      } else {
         // Default to ask/error if not specified or empty
         return { meta: (await this.getMetadata(oldUrlPath))!, conflict: true };
      }
    }

    await fs.rename(oldLocalPath, newLocalPath);
    return { meta: (await this.getMetadata(newUrlPath))! };
  }
}

