// --- DOCUMENTAÇÃO DA CONEXÃO ---
// Responsabilidade - Estabelecer e gerenciar o pool de conexões com o banco de dados MySQL.
// Funcionamento - Carrega as variáveis de ambiente utilizando para proteger credenciais sensíveis. 
// Cria uma estrutura de Pool que mantém conexões ativas simultâneas em cache, evitando o desgaste de abrir e fechar 
// uma nova conexão a cada requisição enviada pelo aplicativo Mobile.

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'root',
  database: process.env.DB_NAME || 'db_suporte',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default connection;