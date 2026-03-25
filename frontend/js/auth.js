/**
 * CATBOOK - Módulo de Autenticação
 * Gerencia login, registro e sessão do usuário
 */

// ========================================
// ESTADO DA AUTENTICAÇÃO
// ========================================
const authState = {
    usuario: null,
    token: null,
    carregando: false
};

// ========================================
// FUNÇÕES DE AUTENTICAÇÃO
// ========================================
const auth = {
    // Inicializar
    init() {
        // Verificar se há sessão salva
        const token = localStorage.getItem('catbook_token');
        const usuario = localStorage.getItem('catbook_usuario');
        
        if (token && usuario) {
            authState.token = token;
            authState.usuario = JSON.parse(usuario);
            this.atualizarUI();
        }
        
        // Configurar listeners de formulários
        this.configurarFormularios();
    },
    
    // Configurar formulários
    configurarFormularios() {
        // Formulário de Login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // Formulário de Registro
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleRegistro(e));
        }
    },
    
    // Handler de Login
    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const btn = e.target.querySelector('.btn-primary');
        const messageEl = document.getElementById('login-message');
        
        // Validação
        if (!this.validarEmail(email)) {
            this.mostrarErro(messageEl, 'Por favor, insira um e-mail válido.');
            return;
        }
        
        if (password.length < 6) {
            this.mostrarErro(messageEl, 'A senha deve ter pelo menos 6 caracteres.');
            return;
        }
        
        // Loading
        this.setLoading(btn, true);
        
        try {
            const response = await api.auth.login(email, password);
            
            if (response.success) {
                this.salvarSessao(response.data.token, response.data.usuario);
                this.mostrarSucesso(messageEl, 'Login realizado com sucesso! Redirecionando...');
                
                setTimeout(() => {
                    window.location.href = 'explorar.html';
                }, 1500);
            }
        } catch (error) {
            this.mostrarErro(messageEl, error.message || 'Erro ao fazer login. Tente novamente.');
        } finally {
            this.setLoading(btn, false);
        }
    },
    
    // Handler de Registro
    async handleRegistro(e) {
        e.preventDefault();
        
        const nome = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirm = document.getElementById('signup-confirm').value;
        const btn = e.target.querySelector('.btn-primary');
        const messageEl = document.getElementById('signup-message');
        
        // Validações
        if (nome.length < 3) {
            this.mostrarErro(messageEl, 'O nome deve ter pelo menos 3 caracteres.');
            return;
        }
        
        if (!this.validarEmail(email)) {
            this.mostrarErro(messageEl, 'Por favor, insira um e-mail válido.');
            return;
        }
        
        if (password.length < 6) {
            this.mostrarErro(messageEl, 'A senha deve ter pelo menos 6 caracteres.');
            return;
        }
        
        if (password !== confirm) {
            this.mostrarErro(messageEl, 'As senhas não coincidem.');
            return;
        }
        
        // Loading
        this.setLoading(btn, true);
        
        try {
            const response = await api.auth.registro(nome, email, password);
            
            if (response.success) {
                this.salvarSessao(response.data.token, response.data.usuario);
                this.mostrarSucesso(messageEl, 'Conta criada com sucesso! Redirecionando...');
                
                setTimeout(() => {
                    window.location.href = 'explorar.html';
                }, 1500);
            }
        } catch (error) {
            this.mostrarErro(messageEl, error.message || 'Erro ao criar conta. Tente novamente.');
        } finally {
            this.setLoading(btn, false);
        }
    },
    
    // Salvar sessão
    salvarSessao(token, usuario) {
        authState.token = token;
        authState.usuario = usuario;
        
        localStorage.setItem('catbook_token', token);
        localStorage.setItem('catbook_usuario', JSON.stringify(usuario));
    },
    
    // Logout
    logout() {
        authState.token = null;
        authState.usuario = null;
        
        localStorage.removeItem('catbook_token');
        localStorage.removeItem('catbook_usuario');
        
        window.location.href = 'index.html';
    },
    
    // Verificar autenticação
    async verificarAuth() {
        const token = localStorage.getItem('catbook_token');
        
        if (!token) {
            return false;
        }
        
        try {
            const response = await api.auth.verificar();
            
            if (response.success) {
                authState.usuario = response.data;
                localStorage.setItem('catbook_usuario', JSON.stringify(response.data));
                return true;
            }
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
        }
        
        // Token inválido, limpar sessão
        this.logout();
        return false;
    },
    
    // Proteger rota (redirecionar se não autenticado)
    async protegerRota() {
        const autenticado = await this.verificarAuth();
        
        if (!autenticado) {
            window.location.href = 'login.html';
            return false;
        }
        
        return true;
    },
    
    // Atualizar UI baseada no estado
    atualizarUI() {
        const navActions = document.querySelector('.nav-actions');
        if (!navActions || !authState.usuario) return;
        
        navActions.innerHTML = `
            <div class="nav-user" onclick="window.location.href='perfil.html'">
                <div class="nav-user-avatar">${authState.usuario.nome.charAt(0)}</div>
                <span>${authState.usuario.nome.split(' ')[0]}</span>
            </div>
            <button class="btn btn-secondary" onclick="auth.logout()">Sair</button>
        `;
    },
    
    // Utilitários de UI
    mostrarErro(element, mensagem) {
        if (!element) return;
        element.className = 'message error show';
        element.querySelector('span').textContent = mensagem;
        
        setTimeout(() => {
            element.className = 'message';
        }, 5000);
    },
    
    mostrarSucesso(element, mensagem) {
        if (!element) return;
        element.className = 'message success show';
        element.querySelector('span').textContent = mensagem;
    },
    
    setLoading(btn, loading) {
        if (!btn) return;
        
        if (loading) {
            btn.classList.add('loading');
            btn.disabled = true;
        } else {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    },
    
    validarEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    // Getters
    get usuario() {
        return authState.usuario;
    },
    
    get token() {
        return authState.token;
    },
    
    get estaAutenticado() {
        return !!authState.token;
    }
};

// ========================================
// TOGGLE LOGIN/CADASTRO
// ========================================
function initAuthToggle() {
    const container = document.getElementById('container');
    const signUpBtn = document.getElementById('signUp');
    const signInBtn = document.getElementById('signIn');
    const loginSection = document.getElementById('login-form');
    const signupSection = document.getElementById('signup-form');
    
    if (signUpBtn) {
        signUpBtn.addEventListener('click', () => {
            container.classList.add('sign-up-mode');
            setTimeout(() => {
                loginSection.classList.remove('active');
                signupSection.classList.add('active');
            }, 300);
        });
    }
    
    if (signInBtn) {
        signInBtn.addEventListener('click', () => {
            container.classList.remove('sign-up-mode');
            setTimeout(() => {
                signupSection.classList.remove('active');
                loginSection.classList.add('active');
            }, 300);
        });
    }
    
    // Animação de entrada
    if (container) {
        container.style.opacity = '0';
        container.style.transform = 'scale(0.9)';
        container.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            container.style.opacity = '1';
            container.style.transform = 'scale(1)';
        }, 100);
    }
}

// ========================================
// INICIALIZAÇÃO
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    auth.init();
    initAuthToggle();
});

// Exportar
window.auth = auth;
