/**
 * TODO(developer):
 *  1. Uncomment and replace these variables before running the sample.
 *  2. Set up ADC as described in https://cloud.google.com/docs/authentication/external/set-up-adc
 *  3. Make sure you have the necessary permission to list storage buckets "storage.buckets.list"
 *    (https://cloud.google.com/storage/docs/access-control/iam-permissions#bucket_permissions)
 */
import { Storage } from '@google-cloud/storage';
import path from 'path';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

const { NODE_ENV, STORAGE_PATH } =
  process.env;

export async function getSystemPrompt(): Promise<string> {
  let content = '';
  try {
    // if the storage path is not provided, read the system prompt from the local file
    if (NODE_ENV === 'development') {
      content = await fs.readFile(path.join(__dirname, '../../system_prompt.txt'), 'utf-8');
      return content;
    }

    if (!STORAGE_PATH) throw new Error('No google cloud storage path provided');

    const [projectId, bucketName, fileName] = (STORAGE_PATH ?? '').split('::');

    const storage = new Storage({ projectId });

    const stream = storage.bucket(bucketName).file(fileName).createReadStream();

    return new Promise((resolve, reject) => {
      stream
        .on('data', (data) => {
          content += data;
        })
        .on('error', (error) => {
          reject(error);
        })
        .on('end', () => {
          resolve(content);
        });
    });
  } catch (error) {
    throw new Error(error as string);
  }
}
