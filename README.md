# 🖥️ Task Manager Front end

Interface web para o Task Manager, desenvolvida com React e Vite. Consome a [Task Manager API](https://github.com/danieldonizeti/task_manger_API) e oferece uma experiência completa de gerenciamento de tarefas pessoais.

---

## 🚀 Tecnologias Utilizadas

- **React**
- **Vite**
- **Tailwind CSS**
- **Axios** (comunicação com a API)
- **React Router DOM** (navegação entre páginas)

---

## ✅ Funcionalidades

- 🔐 Login e registro de usuário
- 📋 Listagem de tarefas
- ➕ Criar, editar e deletar tarefas
- 🔍 Filtros por status e prioridade
- 🗂️ Organização por categorias
- 📅 Data de vencimento nas tarefas
- 📊 Dashboard com estatísticas das tarefas
- 👤 Perfil do usuário — visualização e edição de dados

---

## ⚙️ Como Rodar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- [Task Manager API](https://github.com/danieldonizeti/task_manger_API) pegue o link da API

### Passo a passo

1. Clone o repositório:
```bash
git clone https://github.com/danieldonizeti/task_manager_web.git
cd task_manager_web
```

2. Instale as dependências:
```bash
npm install
```

3. Crie o arquivo `.env` na raiz do projeto baseado no `.env.example`:
```env
VITE_API_URL=http://localhost:8000
```


4. Rode o projeto em modo desenvolvimento:
```bash
npm run dev
```

5. Acesse em: `http://localhost:5173`

---

## 📁 Estrutura do Projeto

```
task_manager_front/
├── public/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── pages/          # Páginas da aplicação
│   ├── context/        # Contextos globais (autenticação)
│   ├── routes/  
│   ├── App.jsx
│   └── main.jsx
├── .env.example
│── Dockerfile
│──index.html
├── nginx.conf
└── package.json
```

---

## 🔗 Repositório do Backend

Este projeto consome a API REST disponível em:
👉 [task_manger_API](https://github.com/danieldonizeti/task_manger_API)

---

## 🔭 Próximas Melhorias

- [ ] Melhorias de acessibilidade e responsividade
- [ ] Respostas mais coerentes no front exemplo(hoje se o usuario escolher uma data de vencimento no passado o front retorna falha ao criar tarefa)


---

## 👨‍💻 Autor

Feito por **Daniel Donizeti**  
[LinkedIn](https://linkedin.com/in/danieldonizeti) · [GitHub](https://github.com/danieldonizeti)