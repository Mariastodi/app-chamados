// --- DOCUMENTAÇÃO DO SERVIÇO ---
// Responsabilidade - Processar a regra de negócio central para o cadastro de novos usuários no sistema.
// Funcionamento - Consulta o banco de dados MySQL para verificar a disponibilidade do e-mail informado,
// impedindo registros duplicados. Se o e-mail estiver livre, realiza a criptografia segura da senha 
// utilizando a biblioteca bcryptjs e persiste o novo perfil no banco.

import connection from '../database/connection';
import { hash } from 'bcryptjs'; 

interface IUserRequest {
  nome: string;
  email: string;
  senha: string;
}

export class CreateUserService {
  async execute({ nome, email, senha }: IUserRequest) {
    const [existingUser]: any = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      throw new Error('Este e-mail já está em uso.');
    }

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    
    const passwordHash = await hash(senha, saltRounds);

    const [result]: any = await connection.execute(
      'INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, passwordHash]
    );

    return { 
      id: result.insertId, 
      nome, 
      email 
    };
  };
}