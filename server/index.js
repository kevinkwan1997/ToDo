const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

//middleware
app.use(cors());
app.use(express.json());

//Routes 

    //create

    app.post("/todos", async(req, res) => {
        try{

            const { description } = req.body;
            const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *",
             [description]
             );
            res.json(newTodo.rows);

        } catch (e) {
            console.error(e.message);
        }
    })

    //get all

    app.get("/todos", async(req, res) => {
        try {
            const allTodos = await pool.query("SELECT * FROM todo");
            res.json(allTodos.rows);
        } catch (e) {
            console.error(e.message);
        }
    }); 

    //get one
    app.get("/todos/:id", async(req, res) => {
        try {
            const {id} = req.params;
            const todo = await pool.query('SELECT * FROM todo WHERE todo_id = $1', [id])

            res.json(todo.rows);
        } catch(e) {
            console.error(e.message);
        }
    })
    //update

    app.put("/todos/:id", async(req, res) => {
        try {   
            const {id} = req.params;
            const {description} = req.body;
            const updateTodo = await pool.query('UPDATE todo SET description = $1 WHERE todo_id = $2', [description, id]);

            res.json('To do was updated!');
        } catch(e) {
            console.error(e.message);
        }
    })

    //delete

    app.delete("/todos/:id", async(req, res) => {
        try {
            const {id} = req.params;
            const deleteTodo = pool.query('DELETE FROM todo WHERE todo_id = $1', [id]);

            res.json('Todo was deleted');
        } catch(e) {
            console.error(e.message);
        }
    })

app.listen(5000, () => {
    console.log('Server has started on port 5000');
})