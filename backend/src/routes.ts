//  --- DOCUMENTAÇÃO DO ARQUIVO ---
//  Responsabilidade - Mapear e gerenciar todos os endpoints HTTP disponíveis na API.
//  Funcionamento - Centraliza as requisições vindas do aplicativo Mobile, distribuindo-as para seus respectivos 
//  controladores ou executando queries diretas de leitura no MySQL. Também atua injetando o middleware Multer 
//  especificamente nas rotas que exigem o upload e processamento de arquivos binários.

import { Router } from 'express';
import multer from 'multer';
import uploadConfig from './config/upload';
import connection from './database/connection'; 

import UserController from './controllers/UserController';
import AuthController from './controllers/AuthController';
import { CreateTicketController } from './controllers/CreateTicketController';

const routes = Router();
const upload = multer(uploadConfig);
const createTicketController = new CreateTicketController();


routes.post('/users', UserController.create);

routes.post('/sessions', AuthController.login);

routes.get('/areas', async (req, res) => {
  const [rows] = await connection.execute('SELECT * FROM areas');
  return res.json(rows);
});

routes.get('/tipos', async (req, res) => {
  const [rows] = await connection.execute('SELECT * FROM tipos');
  return res.json(rows);
});


routes.get('/tickets', async (req, res) => {
  try {
    const [rows] = await connection.execute(`
      SELECT 
        t.id, 
        t.assunto as title, 
        t.descricao as description, 
        t.status, 
        t.created_at,
        t.foto_url,
        a.nome as area,
        tp.nome as tipo
      FROM tickets t
      LEFT JOIN areas a ON a.id = t.area_id
      LEFT JOIN tipos tp ON tp.id = t.tipo_id
      ORDER BY t.created_at DESC
    `);
    return res.json(rows);
  } catch (error) {
    console.error("Erro ao listar tickets:", error);
    return res.status(500).json({ error: "Erro interno ao buscar chamados" });
  }
});

routes.get('/tickets/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await connection.execute(`
      SELECT 
        t.*, 
        t.assunto as title, 
        t.descricao as description,
        a.nome as area_nome, 
        tp.nome as tipo_nome
      FROM tickets t
      LEFT JOIN areas a ON a.id = t.area_id
      LEFT JOIN tipos tp ON tp.id = t.tipo_id
      WHERE t.id = ?
    `, [id]);

    const ticket = (rows as any[])[0];

    if (!ticket) {
      return res.status(404).json({ error: "Chamado não encontrado" });
    }

    return res.json(ticket);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar detalhes" });
  }
});

routes.post('/tickets', upload.single('image'), createTicketController.handle);

export default routes;
