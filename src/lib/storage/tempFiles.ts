import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

// Use os.tmpdir() for cross-platform (Windows/Linux/Vercel Serverless) compatibility
const TEMP_DIR = path.join(os.tmpdir(), 'leaselens_temp');

export async function ensureTempDirExists(): Promise<string> {
  try {
    await fs.mkdir(TEMP_DIR, { recursive: true });
  } catch (err) {
    console.error('Error creating temp directory:', err);
  }
  return TEMP_DIR;
}

export async function saveTempFile(buffer: Buffer, originalFileName: string): Promise<string> {
  try {
    await ensureTempDirExists();
    const fileExt = path.extname(originalFileName) || '.pdf';
    const sanitizedBase = path.basename(originalFileName, fileExt).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueId = crypto.randomBytes(6).toString('hex');
    const tempFileName = `${sanitizedBase}_${uniqueId}${fileExt}`;
    const tempFilePath = path.join(TEMP_DIR, tempFileName);

    await fs.writeFile(tempFilePath, buffer);
    return tempFilePath;
  } catch (err) {
    console.warn('[Temp File Storage] Could not write temp file to disk (serverless mode):', err);
    return ''; // Return empty string so in-memory buffer processing proceeds safely
  }
}

export async function deleteTempFile(filePath: string): Promise<void> {
  if (!filePath) return;
  try {
    await fs.unlink(filePath);
  } catch (err) {
    // Silently ignore if file is already deleted or not found
  }
}

