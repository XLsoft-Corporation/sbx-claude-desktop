const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const toTodo = (row) => ({ ...row, done: Boolean(row.done) });

app.get('/api/todos', (req, res) => {
  const rows = db.prepare('SELECT * FROM todos ORDER BY id DESC').all();
  res.json(rows.map(toTodo));
});

app.post('/api/todos', (req, res) => {
  const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
  if (!title) return res.status(400).json({ error: 'title is required' });
  const result = db.prepare('INSERT INTO todos (title) VALUES (?)').run(title);
  const row = db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(toTodo(row));
});

app.patch('/api/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ error: 'not found' });

  let title = row.title;
  let done = row.done;
  if (req.body.title !== undefined) {
    title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
    if (!title) return res.status(400).json({ error: 'title must not be empty' });
  }
  if (req.body.done !== undefined) done = req.body.done ? 1 : 0;

  db.prepare('UPDATE todos SET title = ?, done = ? WHERE id = ?').run(title, done, id);
  res.json(toTodo(db.prepare('SELECT * FROM todos WHERE id = ?').get(id)));
});

app.delete('/api/todos/:id', (req, res) => {
  const result = db.prepare('DELETE FROM todos WHERE id = ?').run(Number(req.params.id));
  if (result.changes === 0) return res.status(404).json({ error: 'not found' });
  res.status(204).end();
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`TODO app listening on http://localhost:${port}`));
