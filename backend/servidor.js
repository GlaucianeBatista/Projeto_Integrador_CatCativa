// 1️⃣ IMPORTAÇÕES
const express = require('express');
const db = require('./banco/database');
const cors = require('cors');
const path = require('path');

// 2️⃣ CRIA O APP
const app = express();

app.use(cors());
app.use(express.json());

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar no MySQL:', err);
    return;
  }
  console.log('Conectado ao banco PROJETO!');
});


// 4️⃣ DEPOIS VÊM AS ROTAS
app.get('/', (req, res) => {
  res.send('Servidor rodando!');
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Rotas da API
app.use('/api/auth', require('./rotas/auth'));
app.use('/api/historias', require('./rotas/historias'));
app.use('/api/usuarios', require('./rotas/usuarios'));
app.use('/api/comentarios', require('./rotas/comentarios'));
app.use('/api/categorias', require('./rotas/categorias'));
app.use('/api/figurinhas', require('./rotas/figurinhas'));

// Rota raiz - redirecionar para index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Rotas para páginas HTML específicas
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.get('/explorar', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/explorar.html'));
});

app.get('/perfil', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/perfil.html'));
});

app.get('/leitura', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/leitura.html'));
});

// Tratamento de erros 404
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Rota não encontrada' 
    });
});

// Tratamento de erros gerais
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Erro interno do servidor' 
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🐱 Catbook rodando na porta ${PORT}`);
    console.log(`📚 Acesse: http://localhost:${PORT}`);
});
