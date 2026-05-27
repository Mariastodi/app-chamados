// --- DOCUMENTAÇÃO DO CONTROLADOR --- 
//  Responsabilidade - Gerenciar o fluxo de requisições de autenticação e login no sistema.
//  Funcionamento - Recebe as credenciais enviadas pelo aplicativo Mobile, 
//  repassa esses dados para a camada de serviço validar a segurança de hash e, se estiver tudo correto, 
//  devolve para o celular o Token JWT dinâmico gerado para manter a sessão da usuária ativa.

import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService'; 

export default {
  async login(req: Request, res: Response) {
    const { email, password } = req.body; 

    try {
      const authService = new AuthService();
      
      const result = await authService.execute({ email, password });

      return res.json(result);
} catch (error: any) {
      console.log("Erro capturado no bloco catch do Login:", error);

      if (error.code === 'ECONNREFUSED' || error.message?.includes('connection')) {
        return res.status(503).json({ 
          error: "Serviço Indisponível",
          message: "O servidor de banco de dados está temporariamente offline. Por favor, tente novamente em alguns instantes." 
        });
      }

      return res.status(401).json({ 
        error: "Falha na autenticação",
        message: error.message || "E-mail ou senha incorretos." 
      });
    }
  }
};