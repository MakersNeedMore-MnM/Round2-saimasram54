import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const TEMP_DIR = path.join(process.cwd(), 'storage', 'temp');

export async function ensureTempDirExists(): Promise<string> {
  try {
    await fs.mkdir(TEMP_DIR, { recursive: true });
  } catch (err) {
    console.error('Error creating temp directory:', err);
  }
  return TEMP_DIR;
}

export async function saveTempFile(buffer: Buffer, originalFileName: string): Promise<string> {
  await ensureTempDirExists();
  const fileExt = path.extname(originalFileName) || '.pdf';
  const sanitizedBase = path.basename(originalFileName, fileExt).replace(/[^a-zA-Z0-9_-]/g, '_');
  const uniqueId = crypto.randomBytes(6).toString('hex');
  const tempFileName = `${sanitizedBase}_${uniqueId}${fileExt}`;
  const tempFilePath = path.join(TEMP_DIR, tempFileName);

  await fs.writeFile(tempFilePath, buffer);
  return tempFilePath;
}

export async function deleteTempFile(filePath: string): Promise<void> {
  if (!filePath) return;
  try {
    await fs.unlink(filePath);
  } catch (err) {
    // Silently ignore if file is already deleted
  }
}
