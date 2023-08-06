declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    FACEBOOK_APP_ID: string;
    FACEBOOK_APP_SECRET: string;
    SESSION_SECRET: string;
    JWT_SECRET: string;
    CHATGPT_API_KEY: string;
    MONGODB_URL: string;
    // production environment variables
    PORT?: string;
    STORAGE_PATH: string;
    // development environment variables
    CLIENT_PORT?: string;
    SERVER_PORT?: string;
  }
}
