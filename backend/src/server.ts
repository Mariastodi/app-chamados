//  --- DOCUMENTAÇÃO DO ARQUIVO PRINCIPAL ---
//  Responsabilidade - Inicializar, configurar e expor os serviços da API Rest para o ecossistema.
//  Funcionamento - Ativa o middleware CORS para permitir requisições cross-origin do Mobile, 
//  habilita a leitura de payloads em formato JSON, injeta a malha de rotas da aplicação, 
//  transforma a pasta de uploads em um diretório de arquivos estáticos públicos para exibição de fotos no app
//  e faz o servidor escutar na rede local utilizando o IP.

import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import routes from './routes'; 
import path from 'path';

const app = express();

app.use(cors()); 
app.use(express.json()); 
app.use(routes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

const PORT = process.env.PORT || 3000;
app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor rodando na porta 3000');
});
