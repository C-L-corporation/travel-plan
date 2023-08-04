import dotenv from 'dotenv';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

dotenv.config();

const { GC_SECRET_PARENT } = process.env;

const client = new SecretManagerServiceClient();

export const accessGCSecret = async (name: string): Promise<string> => {
  try {
    const [accessResponse] = await client.accessSecretVersion({
      name: `${GC_SECRET_PARENT}/${name}/versions/latest`,
    });

    const payload = accessResponse.payload?.data?.toString();

    if (!payload) {
      throw new Error(`No secret ${name} found`);
    }
    return payload;
  } catch (error) {
    throw new Error(error as string);
  }
};
