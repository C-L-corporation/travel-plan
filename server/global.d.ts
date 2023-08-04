declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    PORT?: string; // port for production
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    FACEBOOK_APP_ID: string;
    FACEBOOK_APP_SECRET: string;
    SESSION_SECRET: string;
    JWT_SECRET: string;
    STORAGE_PATH: string;
    GC_SECRET_PARENT: string;
    // development environment variables
    MONGODB_URL?: string;
    CHATGPT_API_KEY?: string;
    CLIENT_PORT?: string;
    SERVER_PORT?: string;
  }
}
