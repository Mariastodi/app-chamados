# Suporte App - Gestão de Chamados Técnicos

O **Suporte App** é uma solução mobile para a gestão de tickets de suporte, desenvolvida para facilitar a comunicação entre colaboradores e a equipa de TI/Infraestrutura. O sistema permite a abertura de chamados com evidências fotográficas, filtragem por departamento e acompanhamento em tempo real.

## Funcionalidades Principais

* **Autenticação Segura:** Sistema de login integrado com Context API.
* **Gestão de Chamados:** Listagem dinâmica de tickets consumindo API REST.
* **Filtros Inteligentes:** Organização por áreas - TI, Infraestrutura, RH, Sistemas.
* **Abertura de Tickets:** Formulário completo com upload/captura de fotos.
* **Interface Moderna:** Design focado em UX, com badges de status e feedback visual.

## Tecnologias Utilizadas

### Frontend

* **React Native / Expo**
* **TypeScript**
* **React Navigation** 
* **Axios** 
* **Expo Image Picker** 

### Backend 

* **Node.js / Express**
* **MySQL** 
* **Docker 

---

## Como Rodar o Projeto

### 1. Clonar o Repositório

```bash
git clone https://github.com/Mariastodi/app-chamados.git
cd app-chamados

```

### 2. Configurar e Rodar o Backend (Docker)

Certifica-te de que tens o Docker instalado e a correr.

```bash
cd backend
# Criar os containers e a base de dados
docker-compose up -d

# Instalar dependências e rodar a API
npm install
npm run dev

```

*A API estará disponível em `http://localhost:3333` ou no IP da tua máquina.*

### 3. Configurar e Rodar o Mobile

Em um novo terminal:

```bash
cd mobile
npm install

# Iniciar o Expo
npx expo start

```

* Dica: Usa o **Expo Go** no telemóvel para ler o QR Code ou prime `i` para simulador iOS / `a` para Android.

---

## Estrutura do Projeto

* `/backend`: API Node.js, configurações do Docker e scripts SQL.
* `/mobile/src/contexts`: Gestão de autenticação global.
* `/mobile/src/screens/Home`: Listagem e filtros de chamados.
* `/mobile/src/screens/CreateTicket`: Formulário de abertura com lógica de câmara.

---

## Notas de Versão

* **V1.0:** Lançamento inicial com Fluxo de Login, Home e Abertura de Chamados.

---

**Desenvolvido por Maria Beatriz**

