declare namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      GOOGLE_CLIENT_ID?: string;
      GOOGLE_CLIENT_SECRET?: string;
    }
  }