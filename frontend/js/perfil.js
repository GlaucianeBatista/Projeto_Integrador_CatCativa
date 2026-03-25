/**
 * CATBOOK - Módulo de Perfil
 * Gerencia a página de perfil do usuário estilo Spirit Fanfic
 */

// ========================================
// ESTADO DO PERFIL
// ========================================
const profileState = {
    usuario: null,
    historias: [],
    estatisticas: null,
    tabAtiva: 'historias',
    editando: false
};

// ========================================
// MÓDULO DE PERFIL
// ========================================
const profile = {
    // Inicializar
    async init() {
        // Verificar se é perfil do usuário logado ou de outro usuário
        const params = navigation.getParams();
        const userId = params.id || (auth.usuario?.id);
        
        if (!userId) {
            window.location.href = 'login.html';
            return;
        }
        
        try {
            // Carregar dados do usuário
            await this.carregarUsuario(userId);
            await this.carregarEstatisticas(userId);
            
            // Renderizar
            this.renderizarPerfil();
            this.configurarTabs();
            this.configurarEventos();
            
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            utils.mostrarMensagem('Erro ao carregar perfil', 'error');
        }
    },
    
    // Carregar dados do usuário
    async carregarUsuario(userId) {
        const response = await api.usuarios.obter(userId);
        
        if (response.success) {
            profileState.usuario = response.data;
            profileState.historias = response.data.historias || [];
        }
    },
    
    // Carregar estatísticas
    async carregarEstatisticas(userId) {
        const response = await api.usuarios.estatisticas(userId);
        
        if (response.success) {
            profileState.estatisticas = response.data;
        }
    },
    
    // Renderizar perfil
    renderizarPerfil() {
        const usuario = profileState.usuario;
        const isProprioPerfil = auth.usuario?.id === usuario.id;
        
        // Atualizar título
        document.title = `${usuario.nome} - Catbook`;
        
        // Renderizar header do perfil
        this.renderizarHeader(usuario, isProprioPerfil);
        
        // Renderizar conteúdo da tab ativa
        this.renderizarTabAtiva();
    },
    
    // Renderizar header
    renderizarHeader(usuario, isProprioPerfil) {
        const header = document.querySelector('.profile-info');
        
        if (header) {
            header.innerHTML = `
                <div class="profile-avatar-container">
                    <div class="profile-avatar">
                        ${usuario.avatar 
                            ? `<img src="${usuario.avatar}" alt="${usuario.nome}">`
                            : usuario.nome.charAt(0)
                        }
                    </div>
                    ${isProprioPerfil ? `
                        <div class="profile-avatar-edit" onclick="profile.editarAvatar()">
                            📷
                        </div>
                    ` : ''}
                </div>
                <div class="profile-details">
                    <h1 class="profile-name">${usuario.nome}</h1>
                    <p class="profile-username">@${usuario.email.split('@')[0]}</p>
                    <p class="profile-bio">${usuario.bio || 'Sem bio ainda...'}</p>
                    <div class="profile-stats">
                        <div class="profile-stat">
                            <div class="profile-stat-value">${utils.formatarNumero(usuario.seguidores)}</div>
                            <div class="profile-stat-label">Seguidores</div>
                        </div>
                        <div class="profile-stat">
                            <div class="profile-stat-value">${utils.formatarNumero(usuario.seguindo)}</div>
                            <div class="profile-stat-label">Seguindo</div>
                        </div>
                        <div class="profile-stat">
                            <div class="profile-stat-value">${usuario.historias?.length || 0}</div>
                            <div class="profile-stat-label">Histórias</div>
                        </div>
                        <div class="profile-stat">
                            <div class="profile-stat-value">${utils.formatarNumero(usuario.totalLikes || 0)}</div>
                            <div class="profile-stat-label">Curtidas</div>
                        </div>
                    </div>
                    <div class="profile-actions">
                        ${isProprioPerfil ? `
                            <button class="btn btn-primary" onclick="profile.toggleEdicao()">
                                ✏️ Editar Perfil
                            </button>
                        ` : `
                            <button class="btn btn-primary" onclick="profile.seguirUsuario()">
                                ➕ Seguir
                            </button>
                            <button class="btn btn-secondary">
                                💬 Mensagem
                            </button>
                        `}
                    </div>
                </div>
            `;
        }
    },
    
    // Configurar tabs
    configurarTabs() {
        const tabs = document.querySelectorAll('.profile-tab');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                
                // Atualizar estado
                profileState.tabAtiva = tabName;
                
                // Atualizar UI
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Renderizar conteúdo
                this.renderizarTabAtiva();
            });
        });
    },
    
    // Renderizar conteúdo da tab ativa
    renderizarTabAtiva() {
        const conteudos = document.querySelectorAll('.profile-content');
        
        conteudos.forEach(content => {
            content.classList.remove('active');
        });
        
        const tabAtiva = document.querySelector(`.profile-content[data-content="${profileState.tabAtiva}"]`);
        
        if (tabAtiva) {
            tabAtiva.classList.add('active');
            
            // Renderizar conteúdo específico
            switch (profileState.tabAtiva) {
                case 'historias':
                    this.renderizarHistorias(tabAtiva);
                    break;
                case 'estatisticas':
                    this.renderizarEstatisticas(tabAtiva);
                    break;
                case 'figurinhas':
                    this.renderizarFigurinhas(tabAtiva);
                    break;
                case 'sobre':
                    this.renderizarSobre(tabAtiva);
                    break;
                case 'seguidores':
                    this.renderizarSeguidores(tabAtiva);
                    break;
            }
        }
    },
    
    // Renderizar histórias
    renderizarHistorias(container) {
        const historias = profileState.historias;
        
        if (historias.length === 0) {
            container.innerHTML = `
                <div class="text-center" style="padding: 60px; color: var(--blue-gray);">
                    <p style="font-size: 60px; margin-bottom: 20px;">📚</p>
                    <h3 style="margin-bottom: 10px;">Nenhuma história ainda</h3>
                    <p>${profileState.usuario.id === auth.usuario?.id 
                        ? 'Que tal escrever sua primeira história?' 
                        : 'Este usuário ainda não publicou nenhuma história.'
                    }</p>
                    ${profileState.usuario.id === auth.usuario?.id ? `
                        <button class="btn btn-primary" style="margin-top: 20px;" onclick="window.location.href='editar_detalhes_obra.html'">
                            ✍️ Escrever Agora
                        </button>
                        
                    ` : ''}
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="stories-header">
                <h3 style="font-family: 'Quicksand', sans-serif; font-weight: 700;">
                    ${historias.length} história${historias.length !== 1 ? 's' : ''}
                </h3>
                <div class="stories-filter">
                    <button class="filter-btn active">Todas</button>
                    <button class="filter-btn">Completas</button>
                    <button class="filter-btn">Em andamento</button>
                </div>
            </div>
            <div class="profile-stories-grid">
                ${historias.map(h => `
                    <div class="profile-story-card" onclick="window.location.href='leitura.html?id=${h.id}'">
                        <div class="profile-story-cover">
                            <span class="profile-story-cover-icon">📖</span>
                            <span class="profile-story-status">${h.status}</span>
                        </div>
                        <div class="profile-story-content">
                            <h4 class="profile-story-title">${h.titulo}</h4>
                            <div class="profile-story-meta">
                                <span>👁 ${utils.formatarNumero(h.visualizacoes)}</span>
                                <span>❤️ ${utils.formatarNumero(h.curtidas)}</span>
                                <span>⭐ ${h.classificacao}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    // Renderizar estatísticas
    renderizarEstatisticas(container) {
        const stats = profileState.estatisticas;
        
        if (!stats) {
            container.innerHTML = '<p>Carregando estatísticas...</p>';
            return;
        }
        
        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-card-icon">📚</div>
                    <div class="stat-card-value">${stats.totalHistorias}</div>
                    <div class="stat-card-label">Total de Histórias</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-icon">👁</div>
                    <div class="stat-card-value">${utils.formatarNumero(stats.totalVisualizacoes)}</div>
                    <div class="stat-card-label">Visualizações</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-icon">❤️</div>
                    <div class="stat-card-value">${utils.formatarNumero(stats.totalCurtidas)}</div>
                    <div class="stat-card-label">Curtidas Recebidas</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-icon">💬</div>
                    <div class="stat-card-value">${stats.totalComentarios}</div>
                    <div class="stat-card-label">Comentários</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-icon">⭐</div>
                    <div class="stat-card-value">${stats.mediaClassificacao}</div>
                    <div class="stat-card-label">Média de Avaliação</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-icon">✅</div>
                    <div class="stat-card-value">${stats.historiasCompletas}</div>
                    <div class="stat-card-label">Histórias Completas</div>
                </div>
            </div>
        `;
    },
    
    // Renderizar figurinhas
    renderizarFigurinhas(container) {
        const stickers = profileState.usuario.stickers || [];
        const todasFigurinhas = [
            { codigo: 'gatinho', nome: 'Gatinho', icone: '🐱' },
            { codigo: 'coracao', nome: 'Coração', icone: '❤️' },
            { codigo: 'estrela', nome: 'Estrela', icone: '⭐' },
            { codigo: 'chorando', nome: 'Chorando', icone: '😢' },
            { codigo: 'fogo', nome: 'Fogo', icone: '🔥' },
            { codigo: 'olhos', nome: 'Olhos', icone: '👀' },
            { codigo: 'poeta', nome: 'Poeta', icone: '📜' },
            { codigo: 'lua', nome: 'Lua', icone: '🌙' },
            { codigo: 'flor', nome: 'Flor', icone: '🌸' },
            { codigo: 'risada', nome: 'Risada', icone: '😂' },
            { codigo: 'amor', nome: 'Amor', icone: '😍' },
            { codigo: 'pensativo', nome: 'Pensativo', icone: '🤔' }
        ];
        
        container.innerHTML = `
            <div class="stickers-section">
                <div class="stickers-header">
                    <h3 style="font-family: 'Quicksand', sans-serif; font-weight: 700;">
                        Minhas Figurinhas (${stickers.length}/${todasFigurinhas.length})
                    </h3>
                    ${profileState.usuario.id === auth.usuario?.id ? `
                        <button class="btn btn-primary btn-sm" onclick="profile.desbloquearFigurinha()">
                            🎁 Desbloquear Nova
                        </button>
                    ` : ''}
                </div>
                <div class="stickers-grid">
                    ${todasFigurinhas.map(sticker => {
                        const possui = stickers.includes(sticker.codigo);
                        return `
                            <div class="sticker-item ${!possui ? 'sticker-locked' : ''}">
                                <div class="sticker-icon">${sticker.icone}</div>
                                <div class="sticker-name">${sticker.nome}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },
    
    // Renderizar sobre
    renderizarSobre(container) {
        const usuario = profileState.usuario;
        
        container.innerHTML = `
            <div class="about-section">
                <div class="about-item">
                    <div class="about-icon">📧</div>
                    <div class="about-content">
                        <h4>Email</h4>
                        <p>${usuario.email}</p>
                    </div>
                </div>
                <div class="about-item">
                    <div class="about-icon">📅</div>
                    <div class="about-content">
                        <h4>Membro desde</h4>
                        <p>${new Date(usuario.dataCriacao).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        })}</p>
                    </div>
                </div>
                <div class="about-item">
                    <div class="about-icon">📝</div>
                    <div class="about-content">
                        <h4>Histórias Publicadas</h4>
                        <p>${usuario.historias?.length || 0} histórias</p>
                    </div>
                </div>
                <div class="about-item">
                    <div class="about-icon">❤️</div>
                    <div class="about-content">
                        <h4>Total de Curtidas</h4>
                        <p>${utils.formatarNumero(usuario.totalLikes || 0)} curtidas recebidas</p>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Renderizar seguidores
    renderizarSeguidores(container) {
        container.innerHTML = `
            <div class="text-center" style="padding: 60px; color: var(--blue-gray);">
                <p style="font-size: 60px; margin-bottom: 20px;">👥</p>
                <h3 style="margin-bottom: 10px;">Lista de Seguidores</h3>
                <p>Em breve você poderá ver todos os seus seguidores aqui!</p>
            </div>
        `;
    },
    
    // Configurar eventos
    configurarEventos() {
        // Filtros de histórias
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Implementar filtro
                const filtro = btn.textContent;
                this.filtrarHistorias(filtro);
            });
        });
    },
    
    // Filtrar histórias
    filtrarHistorias(filtro) {
        // Implementar filtro
        console.log('Filtrar por:', filtro);
    },
    
    // Toggle edição
    toggleEdicao() {
        profileState.editando = !profileState.editando;
        
        if (profileState.editando) {
            this.mostrarFormEdicao();
        } else {
            this.renderizarPerfil();
        }
    },
    
    // Mostrar formulário de edição
    mostrarFormEdicao() {
        const details = document.querySelector('.profile-details');
        const usuario = profileState.usuario;
        
        details.innerHTML = `
            <form id="edit-profile-form" onsubmit="profile.salvarEdicao(event)">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Nome</label>
                    <input type="text" name="nome" value="${usuario.nome}" 
                        style="width: 100%; padding: 12px; border: 2px solid var(--light-blue); border-radius: 10px; font-family: inherit;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Bio</label>
                    <textarea name="bio" rows="3"
                        style="width: 100%; padding: 12px; border: 2px solid var(--light-blue); border-radius: 10px; font-family: inherit; resize: vertical;">${usuario.bio || ''}</textarea>
                </div>
                <div class="profile-actions">
                    <button type="submit" class="btn btn-primary">💾 Salvar</button>
                    <button type="button" class="btn btn-secondary" onclick="profile.toggleEdicao()">❌ Cancelar</button>
                </div>
            </form>
        `;
    },
    
    // Salvar edição
    async salvarEdicao(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const dados = {
            nome: formData.get('nome'),
            bio: formData.get('bio')
        };
        
        try {
            const response = await api.usuarios.atualizar(profileState.usuario.id, dados);
            
            if (response.success) {
                profileState.usuario = { ...profileState.usuario, ...dados };
                utils.setUsuario(profileState.usuario);
                profileState.editando = false;
                this.renderizarPerfil();
                utils.mostrarMensagem('Perfil atualizado com sucesso!');
            }
        } catch (error) {
            utils.mostrarMensagem('Erro ao atualizar perfil', 'error');
        }
    },
    
    // Editar avatar
    editarAvatar() {
        // Implementar upload de avatar
        utils.mostrarMensagem('Upload de avatar em desenvolvimento!');
    },
    
    // Seguir usuário
    async seguirUsuario() {
        try {
            await api.usuarios.seguir(profileState.usuario.id);
            profileState.usuario.seguidores++;
            this.renderizarPerfil();
            utils.mostrarMensagem(`Você agora segue ${profileState.usuario.nome}!`);
        } catch (error) {
            utils.mostrarMensagem('Erro ao seguir usuário', 'error');
        }
    },
    
    // Desbloquear figurinha
    async desbloquearFigurinha() {
        try {
            const response = await api.figurinhas.desbloquear();
            
            if (response.success) {
                profileState.usuario.stickers.push(response.data.codigo);
                this.renderizarTabAtiva();
                utils.mostrarMensagem(`Nova figurinha desbloqueada: ${response.data.nome} ${response.data.icone}`);
            }
        } catch (error) {
            utils.mostrarMensagem(error.message || 'Erro ao desbloquear figurinha', 'error');
        }
    }
};

// ========================================
// INICIALIZAÇÃO
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    profile.init();
});

// Exportar
window.profile = profile;
