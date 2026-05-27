//  --- DOCUMENTAÇÃO DA CONFIGURAÇÃO ---
//  Responsabilidade - Definir a infraestrutura e a lógica de armazenamento para os uploads de mídia do sistema.
//  Funcionamento - Configura o destino físico no servidor local onde os anexos binários enviados pelo aplicativo Mobile serão salvos 
//  e implementa uma camada de segurança que gera nomes criptográficos exclusivos para cada arquivo, 
//  prevenindo qualquer sobreposição ou conflito de dados no diretório de uploads.

import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

export default {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'),

    filename: (request, file, callback) => {
     const fileHash = crypto.randomBytes(10).toString('hex');
     
     const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};