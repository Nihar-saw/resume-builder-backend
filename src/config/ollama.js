import axios from "axios";
import { env } from "./env.js";

const ollama = axios.create({
  baseURL: env.OLLAMA_URL || "http://localhost:11434",
  timeout: 300000,
});

export default ollama;