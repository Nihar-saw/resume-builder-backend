import axios from "axios";
import { env } from "./env.js";

const ollama = axios.create({
  baseURL: env.OLLAMA_URL,
  timeout: 120000,
});

export default ollama;