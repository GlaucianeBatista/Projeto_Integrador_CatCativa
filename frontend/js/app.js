/**
 * CATBOOK - Aplicação Principal
 * Gerencia funcionalidades globais do frontend
 */

// ========================================
// CONFIGURAÇÃO DA API
// ========================================
const API_BASE_URL = window.location.origin + '/api';

// ========================================
// UTILITÁRIOS
// ========================================
const utils = {
    // Formatar data
    formatarData(dataString) {
        const data = new Date(dataString);
        const agora = new Date();
        const diff = agora - data;
        
        const segundos = Math.floor(diff / 1000);
        const minutos = Math.floor(segundos / 60);
        const horas = Math.floor(minutos / 60);
        const dias = Math.floor(horas / 24);
        
        if (segundos < 60) return 'Agora mesmo';
        if (minutos < 60) return `${minutos}min atrás`;
        if (horas < 24) return `${horas}h atrás`;
        if (dias < 7) return `${dias}d atrás`;
        
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    },
    
    // Formatar número
    formatarNumero(numero) {
        if (numero >= 1000000) return (numero / 1000000).toFixed(1) + 'M';
        if (numero >= 1000) return (numero / 1000).toFixed(1) + 'K';
        return numero.toString();
    },
    
    // Truncar texto
    truncarTexto(texto, limite) {
        if (texto.length <= limite) return texto;
        return texto.substring(0, limite) + '...';
    },
    
    // Debounce
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Mostrar mensagem
    mostrarMensagem(mensagem, tipo = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${tipo}`;
        toast.innerHTML = `
            <span>${mensagem}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;
        
        // Estilos do toast
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${tipo === 'success' ? 'var(--success)' : 'var(--error)'};
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },
    
    // Verificar autenticação
    estaAutenticado() {
        return !!localStorage.getItem('catbook_token');
    },
    
    // Obter token
    getToken() {
        return localStorage.getItem('catbook_token');
    },
    
    // Obter usuário atual
    getUsuario() {
        const usuario = localStorage.getItem('catbook_usuario');
        return usuario ? JSON.parse(usuario) : null;
    },
    
    // Salvar usuário
    setUsuario(usuario) {
        localStorage.setItem('catbook_usuario', JSON.stringify(usuario));
    },
    
    // Logout
    logout() {
        localStorage.removeItem('catbook_token');
        localStorage.removeItem('catbook_usuario');
        window.location.href = '/login.html';
    }
};

// ========================================
// API CLIENT
// ========================================
const api = {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };
        
        // Adicionar token se existir
        const token = utils.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Erro na requisição');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    
    // Auth
    auth: {
        login(email, senha) {
            return api.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, senha })
            });
        },
        
        registro(nome, email, senha) {
            return api.request('/auth/registro', {
                method: 'POST',
                body: JSON.stringify({ nome, email, senha })
            });
        },
        
        verificar() {
            return api.request('/auth/verificar');
        }
    },
    
    // Histórias
    historias: {
        listar(params = {}) {
            const query = new URLSearchParams(params).toString();
            return api.request(`/historias?${query}`);
        },
        
        obter(id) {
            return api.request(`/historias/${id}`);
        },
        
        criar(dados) {
            return api.request('/historias', {
                method: 'POST',
                body: JSON.stringify(dados)
            });
        },
        
        curtir(id) {
            return api.request(`/historias/${id}/curtir`, {
                method: 'POST'
            });
        },
        
        doUsuario(userId) {
            return api.request(`/historias/usuario/${userId}`);
        }
    },
    
    // Usuários
    usuarios: {
        obter(id) {
            return api.request(`/usuarios/${id}`);
        },
        
        atualizar(id, dados) {
            return api.request(`/usuarios/${id}`, {
                method: 'PUT',
                body: JSON.stringify(dados)
            });
        },
        
        estatisticas(id) {
            return api.request(`/usuarios/${id}/estatisticas`);
        },
        
        seguir(id) {
            return api.request(`/usuarios/${id}/seguir`, {
                method: 'POST'
            });
        },
        
        listar(limite = 10) {
            return api.request(`/usuarios?limite=${limite}`);
        }
    },
    
    // Comentários
    comentarios: {
        listar(historiaId, params = {}) {
            const query = new URLSearchParams(params).toString();
            return api.request(`/comentarios/historia/${historiaId}?${query}`);
        },
        
        criar(dados) {
            return api.request('/comentarios', {
                method: 'POST',
                body: JSON.stringify(dados)
            });
        },
        
        curtir(id) {
            return api.request(`/comentarios/${id}/curtir`, {
                method: 'POST'
            });
        },
        
        responder(id, dados) {
            return api.request(`/comentarios/${id}/responder`, {
                method: 'POST',
                body: JSON.stringify(dados)
            });
        }
    },
    
    // Categorias
    categorias: {
        listar() {
            return api.request('/categorias');
        },
        
        obter(id) {
            return api.request(`/categorias/${id}`);
        },
        
        estatisticas() {
            return api.request('/categorias/estatisticas/geral');
        }
    },
    
    // Figurinhas
    figurinhas: {
        listar() {
            return api.request('/figurinhas');
        },
        
        minhas() {
            return api.request('/figurinhas/minhas');
        },
        
        desbloquear() {
            return api.request('/figurinhas/desbloquear', {
                method: 'POST'
            });
        }
    }
};

// ========================================
// COMPONENTES REUTILIZÁVEIS
// ========================================
const components = {
    // Card de história
    storyCard(historia) {
        return `
            <div class="story-card" onclick="window.location.href='leitura.html?id=${historia.id}'">
                <div class="story-cover">
                    <span class="story-cover-icon">📖</span>
                    <span class="story-status">${historia.status}</span>
                    <div class="story-rating">
                        ${this.estrelas(historia.classificacao)}
                    </div>
                </div>
                <div class="story-content">
                    <h3 class="story-title">${historia.titulo}</h3>
                    <div class="story-author">
                        <div class="author-avatar"></div>
                        <span class="author-name">@${historia.autorNome}</span>
                    </div>
                    <p class="story-excerpt">${historia.sinopse}</p>
                    <div class="story-meta">
                        <span class="meta-item">👁 ${utils.formatarNumero(historia.visualizacoes)}</span>
                        <span class="meta-item">❤️ ${utils.formatarNumero(historia.curtidas)}</span>
                        <span class="meta-item">💬 ${historia.comentarios}</span>
                    </div>
                    <div class="story-tags">
                        ${historia.tags.map(tag => `<span class="story-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    },
    
    // Estrelas de avaliação
    estrelas(nota) {
        const cheias = Math.floor(nota);
        const meia = nota % 1 >= 0.5;
        let html = '';
        
        for (let i = 0; i < cheias; i++) {
            html += '<span class="star">★</span>';
        }
        if (meia) {
            html += '<span class="star">⯪</span>';
        }
        for (let i = cheias + (meia ? 1 : 0); i < 5; i++) {
            html += '<span class="star" style="opacity: 0.3;">★</span>';
        }
        
        return html;
    },
    
    // Card de categoria
    categoryCard(categoria) {
        return `
            <div class="category-card" onclick="filtrarPorCategoria('${categoria.nome}')">
                <div class="category-icon">${categoria.icone}</div>
                <h3 class="category-name">${categoria.nome}</h3>
                <p class="category-count">${categoria.quantidade} história${categoria.quantidade !== 1 ? 's' : ''}</p>
            </div>
        `;
    },
    
    // Comentário
    commentItem(comentario) {
        return `
            <div class="comment-item">
                <div class="comment-avatar">${comentario.usuarioNome.charAt(0)}</div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-author">${comentario.usuarioNome}</span>
                        <span class="comment-time">${utils.formatarData(comentario.data)}</span>
                    </div>
                    ${comentario.figurinhas?.length ? `
                        <div class="comment-stickers">
                            ${comentario.figurinhas.map(f => `<span class="comment-sticker">${f}</span>`).join('')}
                        </div>
                    ` : ''}
                    <p class="comment-text">${comentario.conteudo}</p>
                    <div class="comment-actions">
                        <span class="comment-action" onclick="curtirComentario('${comentario.id}')">
                            ❤️ ${comentario.likes}
                        </span>
                        <span class="comment-action" onclick="responderComentario('${comentario.id}')">
                            💬 Responder
                        </span>
                    </div>
                </div>
            </div>
        `;
    }
};

// ========================================
// INICIALIZAÇÃO
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Atualizar navegação baseada na autenticação
    atualizarNavAutenticacao();
});

// Atualizar navegação
function atualizarNavAutenticacao() {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;
    
    const usuario = utils.getUsuario();
    
    if (usuario) {
        navActions.innerHTML = `
            <div class="nav-user" onclick="window.location.href='perfil.html'">
                <div class="nav-user-avatar">${usuario.nome.charAt(0)}</div>
                <span>${usuario.nome.split(' ')[0]}</span>
            </div>
            <button class="btn btn-secondary" onclick="utils.logout()">Sair</button>
        `;
    }
}

// ========================================
// FUNÇÕES GLOBAIS
// ========================================
window.filtrarPorCategoria = function(categoria) {
    window.location.href = `explorar.html?categoria=${encodeURIComponent(categoria)}`;
};

window.curtirComentario = async function(id) {
    try {
        await api.comentarios.curtir(id);
        utils.mostrarMensagem('Comentário curtido!');
    } catch (error) {
        utils.mostrarMensagem('Erro ao curtir comentário', 'error');
    }
};

window.responderComentario = function(id) {
    // Implementar resposta
    console.log('Responder comentário:', id);
};

// Exportar para uso global
window.utils = utils;
window.api = api;
window.components = components;
