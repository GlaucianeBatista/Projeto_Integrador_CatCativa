/**
 * CATBOOK - Módulo de Navegação
 * Gerenda navegação entre páginas e rotas
 */

// ========================================
// ROTAS DA APLICAÇÃO
// ========================================
const routes = {
    publicas: ['index.html', 'login.html', ''],
    privadas: ['explorar.html', 'perfil.html', 'leitura.html'],
    auth: ['login.html']
};

// ========================================
// NAVEGAÇÃO
// ========================================
const navigation = {
    // Página atual
    paginaAtual: window.location.pathname.split('/').pop() || 'index.html',
    
    // Inicializar
    init() {
        this.highlightNavAtiva();
        this.configurarMobileNav();
        this.verificarRotaProtegida();
    },
    
    // Destacar link ativo na navbar
    highlightNavAtiva() {
        const navLinks = document.querySelectorAll('.nav-links a');
        const paginaAtual = this.paginaAtual;
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            if (href === paginaAtual || 
                (paginaAtual === '' && href === 'index.html') ||
                (href === 'explorar.html' && paginaAtual === 'leitura.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    },
    
    // Configurar navegação mobile
    configurarMobileNav() {
        // Criar botão de menu mobile se não existir
        let mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (!mobileMenuBtn && window.innerWidth <= 768) {
            const navbar = document.querySelector('.navbar');
            
            mobileMenuBtn = document.createElement('button');
            mobileMenuBtn.className = 'mobile-menu-btn';
            mobileMenuBtn.innerHTML = '☰';
            mobileMenuBtn.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                background: var(--light-blue);
                border: none;
                border-radius: 10px;
                font-size: 20px;
                cursor: pointer;
            `;
            
            navbar.appendChild(mobileMenuBtn);
            
            mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
    },
    
    // Toggle menu mobile
    toggleMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        
        if (navLinks) {
            const isVisible = navLinks.style.display === 'flex';
            
            if (isVisible) {
                navLinks.style.display = '';
            } else {
                navLinks.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    position: absolute;
                    top: 70px;
                    left: 20px;
                    right: 20px;
                    background: white;
                    padding: 20px;
                    border-radius: 20px;
                    box-shadow: var(--shadow-hover);
                    z-index: 1000;
                `;
            }
        }
    },
    
    // Verificar se rota é protegida
    async verificarRotaProtegida() {
        const paginaAtual = this.paginaAtual;
        
        // Se está em página privada e não está autenticado
        if (routes.privadas.includes(paginaAtual)) {
            const autenticado = await auth.verificarAuth();
            
            if (!autenticado) {
                // Salvar página que tentou acessar
                sessionStorage.setItem('redirect_after_login', window.location.href);
                window.location.href = 'login.html';
            }
        }
        
        // Se está em página de auth e já está autenticado
        if (routes.auth.includes(paginaAtual) && auth.estaAutenticado) {
            const redirect = sessionStorage.getItem('redirect_after_login');
            sessionStorage.removeItem('redirect_after_login');
            window.location.href = redirect || 'explorar.html';
        }
    },
    
    // Navegar para página
    goTo(pagina, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${pagina}?${queryString}` : pagina;
        
        window.location.href = url;
    },
    
    // Voltar
    back() {
        window.history.back();
    },
    
    // Recarregar página
    reload() {
        window.location.reload();
    },
    
    // Obter parâmetros da URL
    getParams() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        
        for (const [key, value] of params) {
            result[key] = value;
        }
        
        return result;
    },
    
    // Atualizar URL sem recarregar
    updateUrl(params, title = '') {
        const queryString = new URLSearchParams(params).toString();
        const newUrl = queryString 
            ? `${window.location.pathname}?${queryString}`
            : window.location.pathname;
        
        window.history.pushState(params, title, newUrl);
    }
};

// ========================================
// BREADCRUMB
// ========================================
const breadcrumb = {
    // Itens do breadcrumb
    items: [],
    
    // Adicionar item
    add(label, url = null) {
        this.items.push({ label, url });
        this.render();
    },
    
    // Limpar
    clear() {
        this.items = [];
        this.render();
    },
    
    // Renderizar
    render() {
        const container = document.querySelector('.breadcrumb');
        if (!container) return;
        
        if (this.items.length === 0) {
            container.innerHTML = '';
            return;
        }
        
        const html = this.items.map((item, index) => {
            const isLast = index === this.items.length - 1;
            
            if (isLast || !item.url) {
                return `<span class="breadcrumb-item active">${item.label}</span>`;
            }
            
            return `<a href="${item.url}" class="breadcrumb-item">${item.label}</a>`;
        }).join('<span class="breadcrumb-separator">/</span>');
        
        container.innerHTML = html;
    }
};

// ========================================
// SCROLL SUAVE
// ========================================
const smoothScroll = {
    // Scroll para elemento
    to(elementId, offset = 80) {
        const element = document.getElementById(elementId);
        
        if (element) {
            const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
            
            window.scrollTo({
                top,
                behavior: 'smooth'
            });
        }
    },
    
    // Scroll para topo
    toTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    },
    
    // Scroll para bottom
    toBottom() {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }
};

// ========================================
// INICIALIZAÇÃO
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    navigation.init();
});

// Exportar
window.navigation = navigation;
window.breadcrumb = breadcrumb;
window.smoothScroll = smoothScroll;
