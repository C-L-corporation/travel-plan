declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    FACEBOOK_APP_ID: string;
    FACEBOOK_APP_SECRET: string;
    PORT?: string; // port for production
    SESSION_SECRET: string;
    JWT_SECRET: string;
    MONGODB_URL: string;
    STORAGE_PATH: string;
    // development only
    CLIENT_PORT?: string;
    SERVER_PORT?: string;
  }
}
