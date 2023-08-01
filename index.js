import express, { json } from "express";
import bodyParser from "body-parser";
import pkg from "pg";
const { Pool } = pkg;
const app = express();
const port = 3000;

// Configuração do banco de dados PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres",
  port: 5432, // Porta padrão do PostgreSQL
});

// Middleware para fazer o parse do corpo das requisições como JSON
app.use(json());

// Rota para criar um novo registro no banco de dados
app.post("/criar", async (req, res) => {
  const { nome, idade } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO pessoas (nome, idade) VALUES ($1, $2) RETURNING *",
      [nome, idade]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao inserir no banco de dados:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Rota para listar todos os registros no banco de dados
app.get("/listar", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pessoas");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erro ao listar do banco de dados:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
