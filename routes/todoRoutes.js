import express from "express";
import { addTodo, deleteTodo, editTodo, getTodoById, getTodos, toggleComplete } from "../controllers/todoController.js";
const router = express.Router();

router.get("/", getTodos);
router.get("/:id", getTodoById);
router.put("/:id", editTodo);
router.post("/", addTodo);
router.delete("/:id", deleteTodo);
router.patch("/:id/complete", toggleComplete);


export default router;