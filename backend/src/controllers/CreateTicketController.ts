// --- DOCUMENTAÇÃO DO CONTROLADOR ---
//  Responsabilidade - Gerenciar o fluxo de criação e persistência de novos chamados.
//  Funcionamento - Recebe os dados textuais do formulário. Como assunto, descrição, área e tipo,
//  verifica e processa a existência de arquivos de imagem anexados 
//  e executa a query SQL de inserção utilizando Prepared Statements no banco de dados MySQL.

import { Request, Response } from 'express';
import connection from '../database/connection';

export class CreateTicketController {
  async handle(req: Request, res: Response) {
    const { user_id, assunto, descricao, area_id, tipo_id } = req.body;

    const foto_url = req.file ? req.file.filename : null;

    try {
      await connection.execute(
        `INSERT INTO tickets (user_id, assunto, descricao, area_id, tipo_id, foto_url, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id || 1,         
          assunto || 'Sem título', 
          descricao || 'Sem descrição', 
          area_id || 1,         
          tipo_id || 1,         
          foto_url || null, 
          'Aguardando atendimento'
        ]
      );

      return res.status(201).json({ message: 'Chamado aberto com sucesso!' });

    } catch (error: any) {
      console.error("Erro real no MySQL:", error);
      return res.status(400).json({ 
        error: 'Erro ao salvar no banco.',
        details: error.message 
      });
    }
  }
}