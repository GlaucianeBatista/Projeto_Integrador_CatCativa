# 🐱 Catbook - Instruções Rápidas

## 🚀 Como Iniciar

### 1. Iniciar o Servidor

```bash
npm start
```

O servidor vai rodar em: `http://localhost:3000`

### 2. Acessar as Páginas

- **Landing Page:** http://localhost:3000
- **Login:** http://localhost:3000/login.html
- **Explorar:** http://localhost:3000/explorar.html
- **Perfil:** http://localhost:3000/perfil.html
- **Leitura:** http://localhost:3000/leitura.html?id=1

## 📋 Funcionalidades Implementadas

### ✅ Páginas
- [x] **Landing Page** - Apresentação da comunidade com estatísticas
- [x] **Login/Cadastro** - Autenticação com animações
- [x] **Explorar** - Feed de histórias com filtros
- [x] **Perfil** - Estilo Spirit Fanfic com tabs
- [x] **Leitura** - Estilo Kindle + comentários Wattpad

### ✅ Backend API
- [x] Autenticação (JWT)
- [x] CRUD de Histórias
- [x] CRUD de Comentários
- [x] Perfil de Usuários
- [x] Categorias
- [x] Sistema de Figurinhas

### ✅ Recursos
- [x] Design Responsivo
- [x] Animações suaves
- [x] Tema claro/escuro na leitura
- [x] Fontes customizáveis
- [x] Comentários com figurinhas
- [x] Progresso de leitura

## 🎨 Personalização

### Adicionar Figurinhas

Para adicionar suas próprias figurinhas, edite o arquivo:
```
/backend/banco/conexao.js
```

Na seção `figurinhas`, adicione novos itens:
```javascript
{ id: '13', codigo: 'sua_figurinha', nome: 'Nome', icone: '🔥', categoria: 'especial' }
```

### Adicionar Histórias

Edite o arquivo `/backend/banco/conexao.js` na seção `historias`.

### Adicionar Categorias

Edite o arquivo `/backend/banco/conexao.js` na seção `categorias`.

## 🔧 Configurações

### Variáveis de Ambiente (.env)

```
PORT=3000
JWT_SECRET=catbook_super_secret_key_2026
NODE_ENV=development
```

## 📱 Responsividade

O Catbook é totalmente responsivo e funciona em:
- 💻 Desktop
- 📱 Mobile
- 📲 Tablet

## 🐛 Conta de Teste

Use estas credenciais para testar:
- **Email:** teste@catbook.com
- **Senha:** 123456

## 📝 Próximos Passos

Para colocar em produção:

1. **Substituir banco de dados** por MongoDB ou PostgreSQL
2. **Configurar variáveis de ambiente** para produção
3. **Adicionar HTTPS** com certificado SSL
4. **Configurar upload de imagens** (AWS S3, Cloudinary)
5. **Implementar cache** (Redis)

---

💫 **Divirta-se com o Catbook!** 💫
