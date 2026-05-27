//  --- DOCUMENTAÇÃO DO CONTROLADOR ---
//  Responsabilidade - Gerenciar o fluxo de criação e registro de novos usuários no ecossistema do sistema.
//  Funcionamento - Intercepta a requisição HTTP contendo os dados cadastrais, 
//  executa uma validação preventiva de formato de e-mail utilizando Regex antes de atingir o banco de dados,
//  e repassa os dados sanitizados para a camada de serviço realizar a criptografia da senha e persistência no MySQL.


import { Request, Response } from 'express';
import { CreateUserService } from '../services/CreateUserService';

export default {
  async create(req: Request, res: Response) {
    const { nome, email, senha } = req.body;

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Formato de e-mail inválido!" });
    }

    try {
      const createUserService = new CreateUserService();
      const result = await createUserService.execute({ nome, email, senha });

      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
};