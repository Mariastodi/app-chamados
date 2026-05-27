// --- DOCUMENTAÇÃO DA CAMADA DE REDE ---
//  Responsabilidade - Instanciar, configurar e centralizar o cliente HTTP para comunicação com o Backend.
//  Funcionamento - Cria uma instância customizada da biblioteca axios definindo a URL base 
//  apontada para o IP da máquina na rede local e a porta do servidor Express. Também estabelece um tempo 
//  limite de espera de 5 segundos para requisições, evitando que o aplicativo trave ou 
//  consuma recursos em looping caso o servidor esteja inacessível.

import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://192.168.1.228:3000', 
  timeout: 5000,
});