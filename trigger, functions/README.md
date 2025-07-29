# Triggers e Procedures do Banco de Dados - Sistema de Reserva de Laboratórios e Salas

Este diretório reúne os scripts SQL essenciais que definem as regras de negócio, automações e a estrutura central do banco de dados para o **Sistema de Reserva de Laboratórios e Salas**.

## Visão Geral

O objetivo destes scripts é garantir a **integridade**, **consistência** e **automação** dos dados do sistema, contemplando:

- Criação da estrutura do banco de dados.
- Procedures para operações específicas.
- Triggers que reagem a eventos no banco, como inserções ou atualizações.

## Estrutura e Descrição dos Arquivos

A seguir, o detalhamento de cada arquivo e sua função no sistema:

---

### 1. `sql_criacao_banco.sql`

- **Propósito:** Script de fundação do banco de dados.
- **Conteúdo:** Comandos `CREATE TABLE` para criar as tabelas principais (`usuarios`, `salas`, `laboratorios`, `reservas`, etc.), definição de chaves primárias, estrangeiras e restrições de integridade.
- **Quando usar:** Deve ser o primeiro script executado ao configurar um novo ambiente para o sistema.

---

### 2. `trigger_create_conflito_data_reserva.sql`

- **Propósito:** Gatilho de regra de negócio crítica para evitar conflitos de agendamento.
- **Como funciona:** Acionado **antes** de inserir uma nova reserva (`BEFORE INSERT`), verifica se já existe reserva para a mesma sala/laboratório no mesmo dia e horário. Se houver conflito, impede a inserção e retorna um erro.
- **Benefício:** Garante que não haja reservas duplicadas ou sobrepostas.

---

### 3. `trigger_create_usuario.sql`

- **Propósito:** Trigger que automatiza ações no cadastro de novos usuários e garante unicidade do e-mail.
- **Descrição:** 
    - Antes de inserir um novo usuário, verifica se já existe um usuário cadastrado com o mesmo e-mail (`email unique`). 
    - Se já existir, impede a criação e retorna um erro:  
      `"E-mail já cadastrado. Por favor, use outro e-mail."`
    - Pode também ser usada para ações automáticas como criação de perfil inicial, definição de permissões, ou registrar datas de criação.
- **Benefício:** Centraliza e padroniza procedimentos ao cadastrar novos usuários, além de evitar duplicidade por e-mail.

---

### 4. `procedure_sala.sql`

- **Propósito:** Procedures relacionadas à entidade "Sala" ou "Laboratório".
- **Exemplos de uso:** 
  - Buscar salas disponíveis em determinado horário.
  - Atualização em cascata de dados associados à sala.
- **Benefício:** Encapsula lógicas complexas e frequentes, facilitando chamadas pela aplicação.

---

## Ordem Recomendada de Execução

Para configurar o banco de dados do zero, siga esta ordem:

1. **`sql_criacao_banco.sql`**  
   Criação da estrutura do banco de dados.

2. **`procedure_sala.sql`**  
   Disponibilização das stored procedures.

3. **`trigger_create_conflito_data_reserva.sql`**  
   Ativação da regra para evitar conflitos em reservas.

4. **`trigger_create_usuario.sql`**  
   Ativação das automações para cadastro de usuários.

---

## Observações

- Certifique-se de executar os scripts em um ambiente seguro e controlado, especialmente em produção.
- Recomenda-se a revisão e eventual customização dos scripts conforme as regras de negócio específicas da instituição.
- Sempre realize backups antes de alterações estruturais no banco de dados.

---

