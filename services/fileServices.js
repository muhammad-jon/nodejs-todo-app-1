import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../data/todos.json");

export const readTodos = async () => {
  try {
    const data = await fs.promises.readFile(filePath, "utf-8");    
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

export const writeTodos = async (todos) => {
  try {
    await fs.promises.writeFile(filePath, JSON.stringify(todos, null, 2));
  } catch (error) {
    throw error;
  }
};
