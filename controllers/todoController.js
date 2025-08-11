import db from "../config/db.js";
import { validate as isUuid } from "uuid";

export const getTodos = async (req, res) => {
  try {
    const {completed, search, page=1, limit=10} = req.query;
    let query = "SELECT * FROM todos";
    let conditions =[];
    let values = [];

    //Filtering
    if(completed!==undefined){
      conditions.push(`completed=$${values.length+1}`);
      values.push(completed==='true');
    }
    if(search){
      conditions.push(`title ILIKE $${values.length+1} OR description ILIKE $${values.length+1}`);
      values.push(`%${search}%`);
    }
    if(conditions.length>0){
      query+=" WHERE " + conditions.join(" AND ");
    }

     // Total count olish
     const countQuery = `SELECT COUNT(*) FROM todos`;
     const totalCountResult = await db.query(countQuery, values);
     const totalCount = parseInt(totalCountResult.rows[0].count);

    //Pagination
    const offset = (parseInt(page)-1)*parseInt(limit);
    query+=` LIMIT $${values.length+1} OFFSET $${values.length+2}`;
    values.push(parseInt(limit), offset);

    const result = await db.query(query, values);

    res.json({
      data: {
        items: result.rows
      },
      meta: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.log(error);
  }
};

export const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isUuid(id)) {
      return res.status(400).json({ error: "Invalid UUID format" });
    }
    const result = await db.query("SELECT * FROM todos WHERE id=$1", [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Not found" });
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
  // const todos = await readTodos();
  // const todo = todos.find((t) => t.id == req.params.id);
  // if (!todo)
  //   res.status(404).json({
  //     message: "Todo not found",
  //   });
  // res.json(todo);
};

export const addTodo = async (req, res) => {
  // const todos = await readTodos();

  // const { title, completed } = req.body;

  try {
    const { title, completed, description } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const result = await db.query(
      "INSERT INTO todos (title, completed, description) VALUES ($1, $2, $3) RETURNING *",
      [title, completed || false, description || ""]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }

  // if (typeof title !== "string" || !title.trim()) {
  //   return res.status(400).json({
  //     error: "title string bo'sh bo'lmasligi kerak",
  //   });
  // }

  // const todo = {
  //   id: todos.length + 1,
  //   title,
  //   completed,
  // };
  // todos.push(todo);
  // await writeTodos(todos);
  // res.status(201).json(todo);
};

export const editTodo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isUuid(id)) {
      return res.status(400).json({ error: "Invalid UUID format" });
    }
    const { title, completed, description } = req.body;
    if (!title && completed === undefined) {
      return res.status(400).json({ error: "Nothing to update" });
    }
    const result = await db.query(
      `UPDATE todos SET title=COALESCE($1, title), completed=COALESCE($2, completed), description=COALESCE($3, description) WHERE id=$4 RETURNING *`,
      [title, completed, description, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Todo not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
  // const todos = await readTodos();

  // const { title, completed } = req.body;

  // if (typeof completed !== "boolean") {
  //   return res.status(400).json({
  //     error: "completed qiymati boolean bo'lishi keark",
  //   });
  // }

  // if (typeof title !== "string" || !title.trim()) {
  //   return res.status(400).json({
  //     error: "title string bo'sh bo'lmasligi kerak",
  //   });
  // }

  // const todo = todos.find((t) => t.id == req?.params?.id);
  // if (!todo) return res.status(404).json({ message: "Not found!" });
  // todo.title = req.body.title;
  // todo.completed = req.body.completed;
  // await writeTodos(todos);
  // res.json(todo);
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isUuid(id)) {
      return res.status(400).json({ error: "Invalid UUID format" });
    }

    const result = await db.query("DELETE FROM todos WHERE id=$1 RETURNING *", [
      id,
    ]);
    if (result.rows.length === 0) {
      res.status(404).json({
        error: "Not found",
      });
    }
    res.json({ message: "Deleted successfully", deleted: result.rows[0] });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
  // const { id } = req.params;

  // const todos = await readTodos();

  // const index = todos.findIndex((todo) => todo.id === Number(id));

  // if (index === -1) {
  //   return res.status(404).json({
  //     message: "Not found",
  //   });
  // }

  // todos.splice(index, 1);
  // await writeTodos(todos);
  // res.status(200).json({
  //   message: "Successfully deleted",
  // });
};

export const toggleComplete = async (req, res) => {

  try {
    const {id} = req.params;
    if (!isUuid(id)) {
      return res.status(400).json({ error: "Invalid UUID format" });
    }
    const result = await db.query("UPDATE todos SET completed = NOT completed WHERE id=$1 RETURNING *", [id])

    if(result.rows.length===0){
      res.status(404).json({error:"Not found"});
    }
    res.json(result.rows[0]);
    
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
  // const todos = await readTodos();

  // const { id } = req.params;

  // const todo = todos.find((t) => t.id == id);
  // if (!todo) return res.status(404).json({ message: "Not found!" });
  // todo.completed = !todo.completed;
  // await writeTodos(todos);

  // res.json({ message: "Todo completion status updated", todos });
};
