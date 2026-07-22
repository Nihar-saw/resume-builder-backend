export const env = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: process.env.MONGO_URI,

  JWT_SECRET: process.env.JWT_SECRET,

  JWT_EXPIRE: process.env.JWT_EXPIRE,

  REFRESH_EXPIRE: process.env.REFRESH_EXPIRE,

  CLIENT_URL: process.env.CLIENT_URL,

  OLLAMA_URL: process.env.OLLAMA_URL,

  OLLAMA_MODEL: process.env.OLLAMA_MODEL,
};