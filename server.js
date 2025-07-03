// Servidor que vai gerenciar os usuários no banco de dados SQLite

import express from 'express'
import Database from 'better-sqlite3'
import cors from 'cors'

const app = express()
const port = 3000

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

// Criando o banco de dados
const db = new Database('db.sqlite')

// Middlewares
app.use(express.json())
app.use(cors())


app.route('/api/users')
  .get((req, res) => {
    try {
      const users = db.prepare('SELECT * FROM users').all() // Pega tudo da tabela users
      res.json(users)
    } catch (error) {
      res.status(500).json({ error: 'Error at getting users.' })
    }
  })
  
  .post((req, res) => {
    const { nome, avatar, bio } = req.body // Pega os dados do usuário do corpo da requisição
    if (!nome || !avatar || !bio) {
      return res.status(400).json({ error: 'Name, avatar, and bio are required' })
    }

    try {
      const stmt = db.prepare('INSERT INTO users (nome, avatar, bio) VALUES (?, ?, ?)') // Prepara a query para inserir um novo usuário
      const info = stmt.run(nome, avatar, bio)
      res.status(201).json({ id: info.lastInsertRowid, nome, avatar, bio }) // Retorna o usuário criado com o ID
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT') { // Verifica se o erro é de constraint, ou seja, o usuário já existe
        return res.status(400).json({ error: 'User already exists' })
      }

      return res.status(500).json({ error: 'Error at creating user.' })
    }
  }
)

app.get('/api/users/:id_user', ((req, res) => {
  const { id_user } = req.params
  try {
    // Prepara a query para buscar um usuário pelo ID
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?')
    const user = stmt.get(id_user)
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (error) {
    return res.status(500).json({ error: 'Error at getting user.' })
  }
}))