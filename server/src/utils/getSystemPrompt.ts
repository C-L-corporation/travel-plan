/**
 * TODO(developer):
 *  1. Uncomment and replace these variables before running the sample.
 *  2. Set up ADC as described in https://cloud.google.com/docs/authentication/external/set-up-adc
 *  3. Make sure you have the necessary permission to list storage buckets "storage.buckets.list"
 *    (https://cloud.google.com/storage/docs/access-control/iam-permissions#bucket_permissions)
 */
import { Storage } from '@google-cloud/storage';
import fs from 'fs/promises';
import path from 'path';

type Options = {
  localSystemPrompt: boolean;
  projectId?: string;
  bucketName?: string;
  fileName?: string;
};
async function getSystemPrompt({
  localSystemPrompt,
  projectId,
  bucketName,
  fileName,
}: Options): Promise<string> {
  let content = '';
  try {
    if (localSystemPrompt) {
      content = await fs.readFile(
        path.join(__dirname, '../../system_prompt.txt'),
        'utf-8'
      );
      return content;
    }

    if (!projectId || !bucketName || !fileName) {
      throw new Error('Missing required arguments');
    }

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

export default getSystemPrompt;
