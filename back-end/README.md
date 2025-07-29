# Sistema de Reserva de Laboratórios e Salas - Backend

Este é o repositório do backend do Sistema de Reserva de Laboratórios e Salas, desenvolvido com NestJS. Ele fornece a API RESTful para gerenciar usuários, salas e reservas, garantindo a lógica de negócio, autenticação, autorização e persistência de dados.

---

## 1. Descrição do Projeto

O Sistema de Reserva de Laboratórios e Salas tem como objetivo otimizar a gestão e a reserva de recursos (laboratórios e salas de aula) no IFPI-Cacor. O backend é a camada de lógica de negócio e API que serve como o cérebro do sistema, processando requisições do frontend e interagindo com o banco de dados.

---

## 2. Tecnologias Utilizadas

- **Framework Backend:** NestJS
- **Linguagem:** TypeScript
- **Banco de Dados:** MySQL
- **ORM:** Prisma
- **Autenticação:** JWT (JSON Web Tokens) com Passport.js
- **Criptografia de Senhas:** bcrypt
- **Validação de Dados:** class-validator
- **Tarefas Agendadas (Cron Jobs):** @nestjs/schedule
- **Variáveis de Ambiente:** @nestjs/config

---

## 3. Funcionalidades da API

A API expõe endpoints RESTful para as seguintes funcionalidades:

### Autenticação (`/auth`)
- Login de usuários.
- Geração e validação de tokens JWT.

### Gerenciamento de Usuários (`/usuarios`)
- Criação de usuários (com hashing de senha e atribuição de papel).
- Listagem de todos os usuários.
- Obtenção de detalhes de um usuário específico.
- Atualização de informações de usuário (incluindo status ativo/inativo e papel).
- Remoção de usuários.

### Gerenciamento de Salas (`/salas`)
- Criação de salas (com associação a tipos de sala).
- Listagem de todas as salas.
- Obtenção de detalhes de uma sala específica.
- Atualização de informações de sala.
- Remoção de salas (com exclusão em cascata de reservas associadas).

### Gerenciamento de Reservas (`/reservas`)
- Criação de reservas (com validação de conflito de horário via trigger MySQL).
- Listagem de reservas pendentes do dia (paginada).
- Listagem de reservas ativas (em andamento/aprovadas).
- Listagem de histórico de reservas (concluídas/canceladas, paginada).
- Listagem de todas as reservas do sistema (paginada).
- Obtenção de detalhes de uma reserva específica.
- Atualização de reservas (incluindo mudança de status: aprovar, cancelar, concluir).
- Remoção de reservas.
- Verificação de disponibilidade de salas.

### Tipos de Usuário (`/tipos-usuario`)
- Listagem de todos os tipos de usuário (Admin, Professor, Vigilante/Secretaria).

### Tipos de Sala (`/tipos-sala`)
- Listagem de todos os tipos de sala (Laboratório, Sala de Aula, Auditório, Mini Auditório).

### Status de Reserva (`/status-reservas`)
- Listagem de todos os status de reserva (Pendente, Em Andamento, Aprovada, Cancelada, Concluída, Em Atraso).

---

## 4. Arquitetura e Padrões de Projeto

O backend segue uma arquitetura em camadas e utiliza diversos padrões de design para garantir modularidade, manutenibilidade, testabilidade e escalabilidade.

- **Controladores (Controllers):** Camada de apresentação da API. Recebem requisições HTTP, validam DTOs e delegam a lógica de negócio para os serviços. Utilizam decoradores NestJS (`@Controller`, `@Get`, `@Post`, etc.) e Swagger (`@ApiTags`, `@ApiResponse`).
- **Serviços (Services):** Camada de lógica de negócio. Contêm as regras de negócio, interagem com o Prisma para persistência de dados e lançam exceções HTTP apropriadas. Implementam o padrão Facade para abstrair a complexidade do ORM e do banco de dados.
- **Módulos (Modules):** Organizam a aplicação em unidades coesas e desacopladas (ex: AuthModule, UsuariosModule, ReservasModule).
- **Prisma Service:** Atua como a camada de persistência e implementa o padrão Repository/Data Mapper, abstraindo as operações de banco de dados.
- **Guards:**
  - **JwtAuthGuard:** Protege as rotas exigindo autenticação via JWT.
  - **RolesGuard:** Implementa o controle de acesso baseado em função (RBAC), verificando se o usuário logado possui os papéis necessários para acessar um recurso.
- **Estratégias (Passport.js):**
  - **JwtStrategy:** Define como o token JWT é validado e como o payload do usuário é extraído e anexado à requisição.

### Padrões de Design Específicos

- **Singleton:** Todos os serviços são Singletons por padrão via Injeção de Dependência do NestJS.
- **Facade:** Serviços como ReservasService simplificam a interação com o banco de dados e outras lógicas complexas.
- **Data Transfer Object (DTO):** Utilizado extensivamente para tipagem e validação dos dados de entrada e saída.
- **Validação em Camadas:** Validação de DTOs (class-validator) e validações em nível de banco de dados (triggers, unique constraints).
- **Stored Procedures/Functions (MySQL):** Utilizadas em serviços como SalasService para encapsular a lógica de CRUD e otimizar operações diretamente no banco de dados.
- **Triggers MySQL:** Implementados para validações de integridade de dados no nível do banco (ex: conflito de horário em reservas, unicidade de e-mail).
- **Cascade Delete:** Configurado no `schema.prisma` para gerenciar a exclusão de dados relacionados (ex: reservas ao deletar uma sala).
- **Cron Jobs:** Utilizado para tarefas agendadas (ex: atualização de status de reservas em atraso) usando `@nestjs/schedule`.

---

## 5. Estrutura do Projeto

A estrutura do projeto segue as convenções do NestJS para modularidade:

```
.
├── dist/                # Arquivos compilados
├── generated/           # Código gerado pelo Prisma Client
├── node_modules/        # Dependências do Node.js
├── prisma/              # Arquivos de schema e migrações do Prisma
│   └── schema.prisma    # Definição do esquema do banco de dados
├── src/
│   ├── auth/            # Módulo de Autenticação (AuthService, AuthController, JwtStrategy, Guards)
│   ├── prisma/          # Módulo do Prisma (PrismaService)
│   ├── reservas/        # Módulo de Reservas (ReservasService, ReservasController, ReservasTasksService)
│   ├── salas/           # Módulo de Salas (SalasService, SalasController)
│   ├── status_reserva/  # Módulo para a tabela de Status de Reserva
│   ├── tipo_sala/       # Módulo para a tabela de Tipos de Sala
│   ├── tipo_usuario/    # Módulo para a tabela de Tipos de Usuário
│   ├── usuarios/        # Módulo de Usuários (UsuariosService, UsuariosController)
│   ├── app.controller.ts
│   ├── app.module.ts    # Módulo raiz da aplicação
│   ├── app.service.ts
│   └── main.ts          # Ponto de entrada da aplicação (configuração CORS, Pipes)
├── test/                # Testes e2e
├── .env                 # Variáveis de ambiente (ex: DATABASE_URL, JWT_SECRET)
└── package.json         # Configurações do projeto e dependências
```

---

## 6. Instalação do Projeto

Siga os passos abaixo para configurar e rodar o backend em sua máquina local.

### 6.1. Pré-requisitos

Certifique-se de ter o Node.js (versão LTS recomendada) e o npm instalados.

### 6.2. Clonar o Repositório

```bash
git clone [URL_DO__REPOSITORIO_BACKEND]
cd back-end
```

### 6.3. Instalar Dependências

```bash
npm install
```

### 6.4. Configuração do Banco de Dados

1. Crie um arquivo `.env` na raiz do projeto (back-end) com as variáveis de ambiente necessárias:

```
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
JWT_SECRET="SUA_CHAVE_SECRETA_MUITO_FORTE_E_LONGA"
```

Substitua `USER`, `PASSWORD`, `HOST`, `PORT`, `DATABASE_NAME` e `SUA_CHAVE_SECRETA_MUITO_FORTE_E_LONGA` pelos seus dados.

2. Execute as migrações do Prisma para criar as tabelas no seu banco de dados:

```bash
npx prisma migrate dev --name initial_migration
```

> Se houver problemas de Foreign Key ou Unique Constraint devido a dados existentes, pode ser necessário um `npx prisma migrate reset` (CUIDADO: APAGA TODOS OS DADOS).

3. Popule as tabelas de lookup (`tipos_usuario`, `tipos_sala`, `status_reserva`) com os dados iniciais:

Exemplo para status_reserva:

```sql
INSERT INTO status_reserva (id, nome_status) VALUES (1, 'PENDENTE');
INSERT INTO status_reserva (id, nome_status) VALUES (2, 'EM_ANDAMENTO');
INSERT INTO status_reserva (id, nome_status) VALUES (3, 'APROVADA');
INSERT INTO status_reserva (id, nome_status) VALUES (4, 'CANCELADA');
INSERT INTO status_reserva (id, nome_status) VALUES (5, 'CONCLUIDA');
INSERT INTO status_reserva (id, nome_status) VALUES (6, 'EM_ATRASO');
```

Faça o mesmo para `tipos_usuario` e `tipos_sala`.

4. Crie os Stored Procedures e Triggers MySQL conforme a documentação de implementação (ex: trigger de conflito de reserva, procedures de CRUD para salas).

---

## 7. Rodando a Aplicação

Para iniciar o servidor de desenvolvimento do NestJS:

```bash
npm run start:dev
```

Isso compilará a aplicação e a iniciará, geralmente na porta 3000.  
Você poderá acessar a documentação da API (Swagger UI) em [http://localhost:3000/api](http://localhost:3000/api).

---

## 8. Testes

- **Testes Unitários:**  
  ```bash
  npm run test
  ```
- **Testes E2E (End-to-End):**  
  ```bash
  npm run test:e2e
  ```
- **Cobertura de Testes:**  
  ```bash
  npm run test:cov
  ```

---

## Licença

Este projeto pode ser licenciado conforme as políticas do Instituto Federal do Piauí-IFPI.
