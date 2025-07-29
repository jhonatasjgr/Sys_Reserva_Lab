# Sistema de Reserva de Laboratórios e Salas - Frontend

Este é o repositório do frontend do Sistema de Reserva de Laboratórios e Salas, desenvolvido com Angular v20. Ele fornece a interface do usuário para professores, vigilantes e administradores gerenciarem a reserva de espaços físicos.

---

## 1. Descrição do Projeto

O Sistema de Reserva de Laboratórios e Salas tem como objetivo otimizar a gestão e a reserva de recursos (laboratórios e salas de aula) no IFPI-Cacor. O frontend é a camada de apresentação que permite aos usuários interagir com o sistema de forma intuitiva, responsiva e segura.

---

## 2. Tecnologias Utilizadas

- **Frontend Framework:** Angular v20.
- **Linguagem:** TypeScript
- **Estilização:** SCSS
- **Gerenciamento de Pacotes:** npm
- **Autenticação:** JWT (JSON Web Tokens)
- **Alertas Visuais:** SweetAlert2 (substituindo alertas nativos)
- **Programação Reativa:** RxJS
- **Decodificação JWT:** jwt-decode

---

## 3. Funcionalidades Principais

- **Autenticação de Usuário:** Login e Registro de contas.
- **Gerenciamento de Usuários:** CRUD de usuários, com ativação/desativação de status(ADMIN).
- **Gerenciamento de Salas:** Criação de novas salas (Admin).
- **Gerenciamento de Reservas:**
  - **Criação de Reserva:** Formulário para solicitar novas reservas (Professor).
  - **Reservas Pendentes:** Visualização e aprovação/cancelamento de reservas pendentes do dia (ADMIN/VIGILANTE).
  - **Minhas Reservas Ativas:** Visualização de reservas ativas do usuário logado (pendentes, em andamento, aprovadas) com opção de cancelar ou concluir (PROFESSOR).
  - **Histórico de Reservas:** Visualização de reservas passadas (concluídas ou canceladas) para usuários logados (PROFESSORo.
  - **Gerenciar Todas as Reservas:** Visualização e gerenciamento de todas as reservas do sistema (ADMIN).
- **Navegação por Papel:** Menu lateral dinâmico que exibe links de acordo com o papel do usuário (Administrador, Professor, Vigilante/Secretaria).
- **Paginação:** Implementada em tabelas de listagem para melhor desempenho e usabilidade.
- **Alertas Visuais:** Notificações de sucesso, erro, aviso e informação utilizando SweetAlert2.

---

## 4. Instalação do Projeto

Siga os passos abaixo para configurar e rodar o frontend em sua máquina local.

### 4.1. Pré-requisitos

Certifique-se de ter o Node.js (versão LTS recomendada) e o Angular CLI instalados globalmente:

```bash
node -v  # Ex: v18.x.x ou v20.x.x
npm -v   # Ex: v9.x.x ou v10.x.x
ng v     # Ex: v17.x.x ou superior
```

Se não tiver o Angular CLI, instale-o:

```bash
npm install -g @angular/cli
```

### 4.2. Clonar o Repositório

```bash
git clone [URL_DESTE_PROJETO]
cd front-end
```

### 4.3. Instalar Dependências

Instale todas as dependências do projeto, incluindo SweetAlert2 e jwt-decode:

```bash
npm install
```

### 4.4. Configuração do Backend

Este frontend depende de um backend NestJS rodando. Certifique-se de que seu backend está configurado e acessível na URL `http://localhost:3000`.

Verifique a URL da API.

Certifique-se de que o CORS está habilitado no seu backend NestJS para permitir requisições de `http://localhost:4200`.

---

## 5. Rodando a Aplicação

Para iniciar o servidor de desenvolvimento do Angular:

```bash
ng serve -o
```

Isso compilará a aplicação e a abrirá no seu navegador padrão em `http://localhost:4200/`.

---

## 6. Estrutura do Projeto

A estrutura do projeto segue as convenções do Angular para aplicações standalone e modularidade:

```
src/
└── app/
    ├── auth/
    │   ├── cadastrar-usuario/
    │   ├── guard/
    │   ├── interceptors/
    │   ├── login/
    │   └── services/
    ├── model_enum/
    │   └── models.ts
    ├── paginas/
    │   ├── componentes/
    │   ├── criar-sala/
    │   ├── dashboard/
    │   ├── default-layout/
    │   ├── gerenciar-usuarios/
    │   ├── historico-reservas/
    │   ├── minhas-reservas-ativas/
    │   ├── minhas-reservas-historico/
    │   ├── reservar-sala/
    │   ├── reservas-em-andamento/
    │   └── reservas-pendentes/
    ├── services/
    │   ├── reserva-service.ts
    │   ├── sala-service.ts
    │   └── usuario.ts
```

---

## 7. Componentes e Serviços Chave

### 7.1. Autenticação e Autorização

**AuthService (`src/app/auth/services/auth.service.ts`):**
- Gerencia o login, logout e o token JWT no localStorage.
- Decodifica o token para obter userId, tipo (papel) e username.
- Disponibiliza o papel do usuário via `userRole$` (Observable).
- Utiliza SweetAlert2 para feedback de sucesso/erro no login/logout.

**AuthGuard (`src/app/core/guards/auth.guard.ts`):**
- `CanActivateFn` (função): Guard de rota que verifica se o usuário está logado (`authService.estaLogado()`).
- Redireciona para `/login` se não autenticado.

**RoleGuard (`src/app/core/guards/role.guard.ts`):**
- `CanActivateFn` (função): Guard de rota que verifica se o usuário logado possui um dos papéis necessários para acessar uma rota específica (`data: { roles: [...] }`).
- Redireciona para `/dashboard` ou exibe um alerta se não autorizado.

**AuthInterceptor (`src/app/core/interceptors/auth.interceptor.ts`):**
- `HttpInterceptorFn` (função): Interceptor HTTP que anexa o token JWT (Bearer Token) a todas as requisições enviadas ao backend.

### 7.2. Serviços de Entidades (Backend API)

**UserService (`src/app/services/user.service.ts`):**
- Consome a API `/usuarios` do backend para operações CRUD em usuários.
- Inclui handleError para tratamento de erros e tap para alertas de sucesso via SweetAlert2.

**ReservasService (`src/app/services/reserva-service.ts`):**
- Consome a API `/reservas` do backend para operações CRUD em reservas.
- Métodos para: `createReserva`, `getReservasPendentes` (paginado), `getReservasEmAndamento`, `getAll` (todas as reservas paginadas), `getHistoricoReservas` (paginado), `getMinhasReservas` (paginado), `getAvailability`, `update` (para status), `obterStatusReservaPorNome`.
- Inclui handleError e tap para SweetAlert2.

**SalaService (`src/app/services/sala-service.ts`):**
- Consome a API `/salas` do backend para operações CRUD em salas.
- Métodos para: `createSala`, `getSalas`, `getSalaById`, `updateSala`, `deleteSala`, `getTiposSala`.
- Inclui handleError e tap para SweetAlert2.

### 7.3. Componentes de UI e Lógica

**DefaultLayoutComponent (`src/app/default-layout/default-layout.component.ts`):**
- Componente de layout principal que contém o menu lateral (`app-menu`) e um `<router-outlet>` para exibir o conteúdo da rota atual.

**Menu (`src/app/components/menu.component.ts`):**
- Componente do menu lateral.
- Exibe links de navegação condicionalmente com base no papel do usuário (`tipoUsuario`).
- Possui funcionalidade de expandir/colapsar o menu.

**DashboardComponent (`src/app/dashboard/dashboard.component.ts`):**
- Tela inicial após o login.
- Redireciona o usuário para a tela apropriada com base em seu papel.

**Componentes de Tabela** (ex: GerenciarReservasComponent, MinhasReservasAtivasComponent, HistoricoReservasComponent, GerenciarTodasReservasComponent, MinhasReservasPassadasComponent):
- Carregam dados dos serviços.
- Exibem os dados em tabelas formatadas.
- Implementam controles de paginação.
- Utilizam SweetAlert2 para confirmações e feedback de ações.

---

## 8. Padrões de Projeto Aplicados

- **Singleton (Criacional):** Todos os serviços Angular e NestJS são Singletons por padrão.
- **Facade (Estrutural):** Serviços do frontend e backend abstraem complexidade de subsistemas.
- **Observer (Comportamental):** Amplamente utilizado com RxJS para reatividade.
- **Injeção de Dependência (DI):** Fundamental em Angular/NestJS, facilitando testabilidade.
- **Data Transfer Object (DTO):** Arquivos `.dto.ts` garantem tipagem forte e validação.
- **Validação em Camadas:** Validação em formulários, DTOs, e no banco de dados.
- **Cascade Delete:** Configurado em schema.prisma para integridade referencial.
- **Stored Procedures/Functions (MySQL):** Encapsulam lógica SQL e são chamadas via Prisma.

---

## 9. Tratamento de Erros e Alertas

- **SweetAlert2:** Exibe alertas visuais e modais de confirmação.
- **handleError em Serviços:** Centraliza tratamento de erros HTTP e exibe mensagens via SweetAlert2.
- **Validação em Camadas:**
  - **Frontend:** Validação de formulários.
  - **Backend:** Validação de DTOs e tratamento de exceções.
  - **Banco de Dados:** UNIQUE CONSTRAINT e triggers para garantir integridade.

---

## 10. Interação com o Banco de Dados (Perspectiva do Frontend)

O frontend interage com o banco de dados exclusivamente através da API RESTful do backend:

- **Criação:** Envia DTOs via POST.
- **Leitura:** GET para obter listas, com paginação e filtros.
- **Atualização:** PATCH com DTOs.
- **Exclusão:** DELETE para remover recursos.

---

## 11. Melhorias Futuras

- Filtragem e Busca Avançada nas tabelas de listagem.
- Notificações em Tempo Real via WebSockets (Socket.IO).
- Telas dedicadas para edição de usuários e salas.
- Relatórios de uso de salas.
- Testes unitários, integração e E2E.
- Otimização de Performance (backend e frontend).

---

## Licença

Este projeto pode ser licenciado conforme as políticas do Instituto Federal do Piauí-IFPI.
