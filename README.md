# 🐱 Catbook

**Catbook** é uma plataforma de histórias criativa onde escritores e leitores se encontram para compartilhar narrativas incríveis. Inspirado no Spirit Fanfic e Wattpad, com uma experiência de leitura estilo Kindle.

## ✨ Funcionalidades

### Para Leitores
- 📖 **Feed de Histórias** - Explore histórias por categoria, popularidade ou recência
- 🔍 **Busca Avançada** - Encontre histórias por título, autor ou tags
- 📚 **Experiência de Leitura Kindle** - Fontes customizáveis, temas claro/escuro, tamanhos de texto
- 💬 **Comentários Estilo Wattpad** - Interaja com a comunidade enquanto lê
- 🎨 **Figurinhas** - Expresse suas reações com stickers divertidos

### Para Escritores
- ✍️ **Editor Intuitivo** - Ferramentas simples para escrever e publicar
- 📊 **Estatísticas** - Acompanhe visualizações, curtidas e comentários
- 🏷️ **Categorias e Tags** - Organize suas histórias para facilitar a descoberta
- 👥 **Perfil Personalizado** - Mostre seu trabalho e conquiste seguidores

## 🚀 Tecnologias

### Frontend
- HTML5 Semântico
- CSS3 com Variáveis e Flexbox/Grid
- JavaScript Vanilla (ES6+)
- Design Responsivo

### Backend
- Node.js
- Express.js
- JWT para Autenticação
- Banco de Dados em Memória (simulado)

## 📁 Estrutura do Projeto

```
catbook/
│
├── frontend/                    # Interface do usuário
│   ├── index.html               # Landing page
│   ├── login.html               # Login/Cadastro
│   ├── explorar.html            # Feed de histórias
│   ├── perfil.html              # Perfil do usuário
│   ├── leitura.html             # Página de leitura
│   │
│   ├── css/                     # Estilos
│   │   ├── style.css            # Estilos principais
│   │   ├── perfil.css           # Estilos do perfil
│   │   └── leitura.css          # Estilos de leitura
│   │
│   ├── js/                      # JavaScript
│   │   ├── app.js               # App principal e API
│   │   ├── auth.js              # Autenticação
│   │   ├── navigation.js        # Navegação
│   │   ├── index.js             # Landing page
│   │   ├── explorar.js          # Feed
│   │   ├── perfil.js            # Perfil
│   │   └── leitura.js           # Leitura
│   │
│   └── coisas/                  # Assets
│       └── images/
│           ├── logo.png
│           ├── logo-claro.png
│           └── logo-escuro.png
│
├── backend/                     # API e servidor
│   ├── servidor.js              # Servidor Express
│   ├── rotas/
│   │   ├── auth.js              # Autenticação
│   │   ├── historias.js         # Histórias
│   │   ├── usuarios.js          # Usuários
│   │   ├── comentarios.js       # Comentários
│   │   ├── categorias.js        # Categorias
│   │   └── figurinhas.js        # Figurinhas
│   │
│   └── banco/
│       └── conexao.js           # Banco de dados
│
├── package.json
├── .env
└── README.md
```

## 🛠️ Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/catbook.git
   cd catbook
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor**
   ```bash
   npm start
   # ou para desenvolvimento
   npm run dev
   ```

4. **Acesse a aplicação**
   ```
   http://localhost:3000
   ```

## 📝 Uso

### Conta de Teste
Para testar o sistema, use:
- **Email:** teste@catbook.com
- **Senha:** 123456

### API Endpoints

#### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/registro` - Registro
- `GET /api/auth/verificar` - Verificar token

#### Histórias
- `GET /api/historias` - Listar histórias
- `GET /api/historias/:id` - Obter história
- `POST /api/historias` - Criar história
- `PUT /api/historias/:id` - Atualizar história
- `DELETE /api/historias/:id` - Deletar história
- `POST /api/historias/:id/curtir` - Curtir história

#### Usuários
- `GET /api/usuarios/:id` - Obter perfil
- `PUT /api/usuarios/:id` - Atualizar perfil
- `GET /api/usuarios/:id/estatisticas` - Estatísticas

#### Comentários
- `GET /api/comentarios/historia/:id` - Listar comentários
- `POST /api/comentarios` - Criar comentário
- `POST /api/comentarios/:id/curtir` - Curtir comentário

## 🎨 Paleta de Cores

| Cor | Hex | Uso |
|-----|-----|-----|
| Azul Claro | `#B8C5F0` | Fundos, bordas |
| Cinza Branco | `#F5F5F5` | Fundo principal |
| Amarelo Limão | `#D4E157` | Destaques, badges |
| Azul Violeta | `#5C6BC0` | Primária, botões |
| Verde Claro | `#C5E1A5` | Sucesso, ícones |
| Azul Acinzentado | `#7986CB` | Secundária |
| Texto Escuro | `#2C3E50` | Texto principal |

## 🔮 Futuras Implementações

- [ ] Sistema de notificações
- [ ] Mensagens privadas entre usuários
- [ ] Upload de capas de histórias
- [ ] Sistema de biblioteca pessoal
- [ ] Modo offline/PWA
- [ ] App mobile (React Native)
- [ ] Integração com banco de dados real (MongoDB/PostgreSQL)
- [ ] Sistema de denúncias e moderação

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

Este projeto está licenciado sob a licença MIT.

---

<p align="center">
  💫 Feito com amor e ronronos 💫
</p>
