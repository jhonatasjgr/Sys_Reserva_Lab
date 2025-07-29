# Sistema de Reserva de Laboratórios e Salas 🏫

Um sistema completo de gestão e reserva de laboratórios e salas de aula desenvolvido para o Instituto Federal do Piauí (IFPI-Cacor), utilizando tecnologias modernas e padrões de projeto robustos para garantir escalabilidade, manutenibilidade e excelência na experiência do usuário.

## 📋 Visão Geral

O Sistema de Reserva de Laboratórios e Salas foi projetado para otimizar a gestão de recursos físicos educacionais, fornecendo uma plataforma intuitiva e segura para professores solicitarem reservas, administradores gerenciarem o sistema e vigilantes/secretárias aprovarem solicitações.

### 🎯 Objetivos

- **Digitalizar** o processo de reserva de salas e laboratórios
- **Eliminar conflitos** de agendamento através de validações automatizadas
- **Centralizar** o controle de recursos físicos da instituição
- **Fornecer relatórios** e históricos detalhados de utilização
- **Implementar** controle de acesso baseado em funções (RBAC)

## 🏗️ Arquitetura do Sistema

O projeto segue uma arquitetura **Full Stack** moderna com separação clara de responsabilidades:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│    FRONTEND     │◄──►│     BACKEND     │◄──►│   BANCO DADOS   │
│   Angular v20   │    │    NestJS       │    │     MySQL       │
│   TypeScript    │    │   TypeScript    │    │ Triggers/Procs  │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Tecnologias Utilizadas

### Frontend
- **Framework:** Angular v20
- **Linguagem:** TypeScript
- **Estilização:** SCSS
- **Autenticação:** JWT (JSON Web Tokens)
- **Alertas:** SweetAlert2
- **Reatividade:** RxJS
- **Decodificação JWT:** jwt-decode

### Backend
- **Framework:** NestJS
- **Linguagem:** TypeScript
- **Banco de Dados:** MySQL
- **ORM:** Prisma
- **Autenticação:** JWT com Passport.js
- **Criptografia:** bcrypt
- **Validação:** class-validator
- **Documentação:** Swagger/OpenAPI
- **Tarefas Agendadas:** @nestjs/schedule

### Banco de Dados
- **SGBD:** MySQL
- **Triggers:** Validação de conflitos e integridade
- **Stored Procedures:** Otimização de operações complexas
- **Migrações:** Controle de versão do schema

## 📁 Estrutura do Projeto

```
Sys_Reserva_Lab/
├── 📂 back-end/                 # API NestJS
│   ├── 📂 src/
│   │   ├── 📂 auth/            # Autenticação e autorização
│   │   ├── 📂 usuarios/        # Gestão de usuários
│   │   ├── 📂 salas/           # Gestão de salas
│   │   ├── 📂 reservas/        # Gestão de reservas
│   │   ├── 📂 prisma/          # Cliente Prisma ORM
│   │   └── 📂 [outros módulos]
│   ├── 📂 prisma/              # Schema e migrações
│   └── 📄 package.json
├── 📂 front-end/               # Aplicação Angular
│   ├── 📂 src/app/
│   │   ├── 📂 auth/            # Autenticação frontend
│   │   ├── 📂 paginas/         # Componentes de páginas
│   │   ├── 📂 services/        # Serviços para API
│   │   └── 📂 model_enum/      # Modelos e enums
│   └── 📄 package.json
├── 📂 trigger, functions/       # Scripts SQL
│   ├── 📄 sql_criacao_banco.sql
│   ├── 📄 trigger_create_conflito_data_reserva.sql
│   ├── 📄 trigger_create_usuario.sql
│   └── 📄 procedure_sala.sql
├── 📂 Apresentação/            # Documentação do projeto
└── 📄 README.md               # Este arquivo
```

## 👥 Perfis de Usuário e Funcionalidades

### 🔑 Administrador
- ✅ Gerenciar usuários (CRUD completo)
- ✅ Criar e gerenciar salas/laboratórios
- ✅ Visualizar e gerenciar todas as reservas
- ✅ Aprovar/cancelar reservas pendentes
- ✅ Gerar relatórios e históricos

### 👨‍🏫 Professor
- ✅ Solicitar reservas de salas/laboratórios
- ✅ Visualizar suas reservas ativas
- ✅ Consultar histórico de reservas pessoais
- ✅ Cancelar reservas próprias (quando permitido)
- ✅ Verificar disponibilidade de salas

### 👮 Vigilante/Secretária
- ✅ Aprovar/cancelar reservas pendentes do dia
- ✅ Visualizar reservas em andamento
- ✅ Marcar início/conclusão de reservas
- ✅ Consultar status das salas

## 🔧 Instalação e Configuração

### 📋 Pré-requisitos
- Node.js (versão LTS recomendada)
- MySQL Server
- Angular CLI (para frontend)
- Git

### 🗃️ 1. Configuração do Banco de Dados

```sql
-- 1. Criar banco de dados
CREATE DATABASE sistema_reserva_lab;

-- 2. Executar scripts na ordem:
-- Primeiro: sql_criacao_banco.sql
-- Segundo: procedure_sala.sql  
-- Terceiro: trigger_create_conflito_data_reserva.sql
-- Quarto: trigger_create_usuario.sql
```

### ⚙️ 2. Configuração do Backend

```bash
# Navegar para o diretório backend
cd back-end

# Instalar dependências
npm install

# Configurar variáveis de ambiente (.env)
DATABASE_URL="mysql://usuario:senha@localhost:3306/sistema_reserva_lab"
JWT_SECRET="sua_chave_secreta_muito_forte"

# Executar migrações Prisma
npx prisma migrate dev --name initial_migration

# Gerar cliente Prisma
npx prisma generate

# Iniciar servidor de desenvolvimento
npm run start:dev
```

### 🎨 3. Configuração do Frontend

```bash
# Navegar para o diretório frontend
cd front-end

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
ng serve

# Ou para abrir automaticamente no navegador
ng serve -o
```

### 🌐 4. Acessar a Aplicação

- **Frontend:** http://localhost:4200
- **API Backend:** http://localhost:3000
- **Documentação API (Swagger):** http://localhost:3000/api

## 🔐 Autenticação e Segurança

### JWT (JSON Web Tokens)
- **Autenticação stateless** entre frontend e backend
- **Tokens seguros** com payload contendo userId, tipo e username
- **Expiração automática** configurável
- **Middleware de autenticação** em todas as rotas protegidas

### Controle de Acesso (RBAC)
- **Guards personalizados** verificam permissões por rota
- **Roles específicos** para cada tipo de usuário
- **Menu dinâmico** baseado no perfil do usuário logado

### Validações de Segurança
- **Criptografia bcrypt** para senhas
- **Validação de DTOs** com class-validator
- **Triggers MySQL** para integridade de dados
- **CORS configurado** para requisições cross-origin

## 🎯 Padrões de Projeto Implementados

### Padrões Criacionais
- **Singleton:** Serviços Angular e NestJS
- **Factory:** Criação de DTOs e entidades

### Padrões Estruturais
- **Facade:** Serviços abstraindo complexidade
- **Adapter:** Integração entre camadas

### Padrões Comportamentais
- **Observer:** RxJS para programação reativa
- **Strategy:** Diferentes tipos de validação
- **Command:** Operações CRUD encapsuladas

## 📊 Funcionalidades Principais

### 🗓️ Gestão de Reservas
- **Criação inteligente** com verificação de conflitos
- **Aprovação workflow** para diferentes perfis
- **Status dinâmicos:** Pendente → Aprovada → Em Andamento → Concluída
- **Cancelamento controlado** com regras de negócio
- **Paginação otimizada** para grandes volumes de dados

### 🏢 Gestão de Salas
- **Cadastro completo** com tipos e capacidades
- **Verificação de disponibilidade** em tempo real
- **Associação com tipos** (Laboratório, Sala de Aula, Auditório)
- **Exclusão em cascata** respeitando integridade

### 👤 Gestão de Usuários
- **Cadastro seguro** com validação de email único
- **Ativação/desativação** de contas
- **Atribuição de papéis** dinâmica
- **Histórico de atividades** por usuário

## 🔮 Funcionalidades Futuras

### Em Desenvolvimento
- ✅ Reservas em atraso (implementado)
- ✅ Paginação do histórico (implementado)  
- ✅ Sweet Alert (implementado)

### Roadmap
- 📅 **Calendário visual** para reservas
- 🔍 **Filtros avançados** nas listagens
- 📊 **Ordenação de colunas** dinâmica
- 📈 **Dashboard com métricas** de utilização
- 📱 **Notificações em tempo real** via WebSocket
- 📄 **Relatórios PDF** detalhados
- 🔄 **Sincronização com sistemas** institucionais

## 🧪 Testes

### Backend
```bash
# Testes unitários
npm run test

# Testes de integração
npm run test:e2e

# Cobertura de código
npm run test:cov
```

### Frontend
```bash
# Testes unitários
ng test

# Testes E2E
ng e2e
```

## 📈 Performance e Otimização

### Backend
- **Conexão pooling** com Prisma
- **Queries otimizadas** com índices apropriados
- **Paginação server-side** para grandes datasets
- **Cache em memória** para dados frequentes

### Frontend
- **Lazy loading** de módulos
- **OnPush change detection** strategy
- **Trackby functions** em listas
- **Debounce** em buscas e filtros

## 🤝 Contribuição

### Padrões de Código
- **ESLint** configurado para TypeScript
- **Prettier** para formatação consistente
- **Convenções de nomenclatura** claras
- **Documentação inline** obrigatória

### Processo de Contribuição
1. **Fork** do repositório
2. **Branch feature** para nova funcionalidade
3. **Commits semânticos** seguindo padrão
4. **Pull Request** com descrição detalhada
5. **Code Review** obrigatório

## 📜 Licença

Este projeto está licenciado conforme as políticas do **Instituto Federal do Piauí (IFPI)** para projetos educacionais e institucionais.

## 📞 Suporte e Contato

Para dúvidas, sugestões ou reportar problemas:

- **Repositório:** [GitHub - Sys_Reserva_Lab](https://github.com/jhonatasjgr/Sys_Reserva_Lab)
- **Issues:** Use a aba Issues do GitHub para reportar bugs
- **Documentação:** Consulte os READMEs específicos de cada módulo

## 🎓 Créditos

Desenvolvido como projeto acadêmico no Instituto Federal do Piauí, Campus Corrente, aplicando conceitos avançados de:

- **Engenharia de Software**
- **Padrões de Projeto**
- **Arquitetura de Software**
- **Desenvolvimento Full Stack**
- **Banco de Dados**

---

<div align="center">

**Sistema de Reserva de Laboratórios e Salas** 🏫  
*Otimizando a gestão de recursos educacionais*

</div>
