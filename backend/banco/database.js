const mysql = require('mysql2');

// conexão com MariaDB
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // coloque sua senha se tiver
  database: 'PROJETO',
  port: 3306 // padrão MariaDB
});

// conectar
db.connect((err) => {
  if (err) {
    console.error('❌ Erro ao conectar no MariaDB:', err);
    return;
  }

  console.log('🔥 Conectado ao MariaDB (PROJETO)');
});

module.exports = db;