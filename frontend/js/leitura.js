/**
 * CATBOOK - Módulo de Leitura
 * Gerencia a experiência de leitura estilo Kindle + Comentários Wattpad
 */

// ========================================
// ESTADO DA LEITURA
// ========================================
const readingState = {
    historia: null,
    capituloAtual: 0,
    comentarios: [],
    config: {
        fonte: 'font-serif',
        tamanho: 'size-medium',
        tema: 'light'
    }
};

// ========================================
// MÓDULO DE LEITURA
// ========================================
const reading = {
    // Inicializar
    async init() {
        const params = navigation.getParams();
        const historiaId = params.id;
        
        if (!historiaId) {
            window.location.href = 'explorar.html';
            return;
        }
        
        try {
            // Carregar história
            const response = await api.historias.obter(historiaId);
            
            if (response.success) {
                readingState.historia = response.data;
                this.renderizarHistoria();
                this.carregarComentarios();
                this.configurarEventos();
                this.carregarConfiguracoes();
            }
        } catch (error) {
            console.error('Erro ao carregar história:', error);
            utils.mostrarMensagem('Erro ao carregar história', 'error');
        }
    },
    
    // Renderizar história
    renderizarHistoria() {
        const historia = readingState.historia;
        
        // Atualizar título
        document.title = `${historia.titulo} - Catbook`;
        
        // Atualizar header
        document.querySelector('.reading-title-info h1').textContent = historia.titulo;
        document.querySelector('.reading-title-info span').textContent = `por ${historia.autorNome}`;
        
        // Renderizar conteúdo
        const contentDiv = document.querySelector('.reading-content');
        
        // Dividir conteúdo em parágrafos
        const paragrafos = historia.conteudo.split('\n\n').filter(p => p.trim());
        
        contentDiv.innerHTML = `
            <h2>${historia.capitulos[readingState.capituloAtual]?.titulo || 'Capítulo 1'}</h2>
            ${paragrafos.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('')}
        `;
        
        // Atualizar progresso
        this.atualizarProgresso();
        
        // Atualizar info na sidebar
        this.renderizarInfoSidebar();
        
        // Atualizar seletor de capítulos
        this.atualizarSeletorCapitulos();
    },
    
    // Renderizar info na sidebar
    renderizarInfoSidebar() {
        const historia = readingState.historia;
        const sidebar = document.querySelector('.story-info-sidebar');
        
        if (sidebar) {
            sidebar.innerHTML = `
                <div class="story-info-cover">
                    <span class="story-info-cover-icon">📖</span>
                </div>
                <h3 class="story-info-title">${historia.titulo}</h3>
                <p class="story-info-author">por ${historia.autorNome}</p>
                <div class="story-info-stats">
                    <div class="story-info-stat">
                        <div class="story-info-stat-value">${utils.formatarNumero(historia.visualizacoes)}</div>
                        <div class="story-info-stat-label">leituras</div>
                    </div>
                    <div class="story-info-stat">
                        <div class="story-info-stat-value">${utils.formatarNumero(historia.curtidas)}</div>
                        <div class="story-info-stat-label">curtidas</div>
                    </div>
                    <div class="story-info-stat">
                        <div class="story-info-stat-value">${historia.capitulos.length}</div>
                        <div class="story-info-stat-label">capítulos</div>
                    </div>
                </div>
                <div class="story-info-actions">
                    <button class="btn btn-primary" onclick="reading.curtirHistoria()">
                        ❤️ Curtir
                    </button>
                    <button class="btn btn-secondary" onclick="reading.adicionarBiblioteca()">
                        📚 Salvar
                    </button>
                </div>
            `;
        }
    },
    
    // Atualizar seletor de capítulos
    atualizarSeletorCapitulos() {
        const select = document.querySelector('.chapter-selector select');
        
        if (select && readingState.historia) {
            select.innerHTML = readingState.historia.capitulos.map((cap, index) => `
                <option value="${index}" ${index === readingState.capituloAtual ? 'selected' : ''}>
                    ${cap.titulo}
                </option>
            `).join('');
            
            select.addEventListener('change', (e) => {
                this.mudarCapitulo(parseInt(e.target.value));
            });
        }
    },
    
    // Mudar capítulo
    mudarCapitulo(index) {
        if (index < 0 || index >= readingState.historia.capitulos.length) return;
        
        readingState.capituloAtual = index;
        this.renderizarHistoria();
        smoothScroll.toTop();
    },
    
    // Capítulo anterior
    capituloAnterior() {
        this.mudarCapitulo(readingState.capituloAtual - 1);
    },
    
    // Próximo capítulo
    proximoCapitulo() {
        this.mudarCapitulo(readingState.capituloAtual + 1);
    },
    
    // Atualizar barra de progresso
    atualizarProgresso() {
        const totalCapitulos = readingState.historia.capitulos.length;
        const progresso = ((readingState.capituloAtual + 1) / totalCapitulos) * 100;
        
        document.querySelector('.reading-progress-fill').style.width = `${progresso}%`;
        
        // Atualizar estado dos botões
        const btnAnterior = document.querySelector('.nav-chapter-btn:first-child');
        const btnProximo = document.querySelector('.nav-chapter-btn:last-child');
        
        if (btnAnterior) {
            btnAnterior.disabled = readingState.capituloAtual === 0;
        }
        if (btnProximo) {
            btnProximo.disabled = readingState.capituloAtual === totalCapitulos - 1;
        }
    },
    
    // Carregar comentários
    async carregarComentarios() {
        try {
            const response = await api.comentarios.listar(readingState.historia.id, {
                ordenar: 'recentes'
            });
            
            if (response.success) {
                readingState.comentarios = response.data;
                this.renderizarComentarios();
            }
        } catch (error) {
            console.error('Erro ao carregar comentários:', error);
        }
    },
    
    // Renderizar comentários
    renderizarComentarios() {
        const container = document.querySelector('.comments-list');
        
        if (!container) return;
        
        if (readingState.comentarios.length === 0) {
            container.innerHTML = `
                <div class="text-center" style="padding: 40px; color: var(--blue-gray);">
                    <p style="font-size: 40px; margin-bottom: 15px;">💬</p>
                    <p>Seja o primeiro a comentar!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = readingState.comentarios
            .map(c => components.commentItem(c))
            .join('');
        
        // Atualizar contador
        const countEl = document.querySelector('.comments-count');
        if (countEl) {
            countEl.textContent = readingState.comentarios.length;
        }
    },
    
    // Enviar comentário
    async enviarComentario() {
        const input = document.querySelector('.comment-input');
        const conteudo = input.value.trim();
        
        if (!conteudo) return;
        
        // Pegar figurinhas selecionadas
        const figurinhasSelecionadas = Array.from(
            document.querySelectorAll('.sticker-btn.selected')
        ).map(btn => btn.dataset.sticker);
        
        try {
            const response = await api.comentarios.criar({
                historiaId: readingState.historia.id,
                conteudo,
                figurinhas: figurinhasSelecionadas
            });
            
            if (response.success) {
                input.value = '';
                this.limparStickersSelecionados();
                this.carregarComentarios();
                utils.mostrarMensagem('Comentário enviado!');
            }
        } catch (error) {
            utils.mostrarMensagem('Erro ao enviar comentário', 'error');
        }
    },
    
    // Limpar stickers selecionados
    limparStickersSelecionados() {
        document.querySelectorAll('.sticker-btn.selected').forEach(btn => {
            btn.classList.remove('selected');
        });
    },
    
    // Configurar eventos
    configurarEventos() {
        // Botão de configurações
        const settingsBtn = document.querySelector('.reading-action-btn[title="Configurações"]');
        const settingsPanel = document.querySelector('.reading-settings');
        
        if (settingsBtn && settingsPanel) {
            settingsBtn.addEventListener('click', () => {
                settingsPanel.classList.toggle('show');
            });
            
            // Fechar ao clicar fora
            document.addEventListener('click', (e) => {
                if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) {
                    settingsPanel.classList.remove('show');
                }
            });
        }
        
        // Configurações de fonte
        document.querySelectorAll('.settings-btn[data-font]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.mudarFonte(btn.dataset.font);
                document.querySelectorAll('.settings-btn[data-font]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Configurações de tamanho
        document.querySelectorAll('.settings-btn[data-size]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.mudarTamanho(btn.dataset.size);
                document.querySelectorAll('.settings-btn[data-size]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Configurações de tema
        document.querySelectorAll('.settings-btn[data-theme]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.mudarTema(btn.dataset.theme);
                document.querySelectorAll('.settings-btn[data-theme]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Botão de enviar comentário
        const submitBtn = document.querySelector('.comment-submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.enviarComentario());
        }
        
        // Enter no input de comentário
        const commentInput = document.querySelector('.comment-input');
        if (commentInput) {
            commentInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.enviarComentario();
                }
            });
        }
        
        // Seleção de stickers
        document.querySelectorAll('.sticker-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('selected');
            });
        });
        
        // Botões de ordenação de comentários
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                // Recarregar comentários com nova ordenação
                this.carregarComentarios();
            });
        });
        
        // Scroll para atualizar progresso
        window.addEventListener('scroll', utils.debounce(() => {
            this.atualizarProgressoScroll();
        }, 100));
    },
    
    // Mudar fonte
    mudarFonte(fonte) {
        const content = document.querySelector('.reading-content');
        content.classList.remove('font-serif', 'font-sans', 'font-mono');
        content.classList.add(fonte);
        readingState.config.fonte = fonte;
        this.salvarConfiguracoes();
    },
    
    // Mudar tamanho
    mudarTamanho(tamanho) {
        const content = document.querySelector('.reading-content');
        content.classList.remove('size-small', 'size-medium', 'size-large');
        content.classList.add(tamanho);
        readingState.config.tamanho = tamanho;
        this.salvarConfiguracoes();
    },
    
    // Mudar tema
    mudarTema(tema) {
        const area = document.querySelector('.reading-area');
        
        if (tema === 'dark') {
            area.classList.add('dark-mode');
        } else {
            area.classList.remove('dark-mode');
        }
        
        readingState.config.tema = tema;
        this.salvarConfiguracoes();
    },
    
    // Salvar configurações
    salvarConfiguracoes() {
        localStorage.setItem('catbook_reading_config', JSON.stringify(readingState.config));
    },
    
    // Carregar configurações
    carregarConfiguracoes() {
        const saved = localStorage.getItem('catbook_reading_config');
        
        if (saved) {
            readingState.config = JSON.parse(saved);
            
            // Aplicar configurações
            const content = document.querySelector('.reading-content');
            const area = document.querySelector('.reading-area');
            
            content.classList.add(readingState.config.fonte);
            content.classList.add(readingState.config.tamanho);
            
            if (readingState.config.tema === 'dark') {
                area.classList.add('dark-mode');
            }
            
            // Atualizar botões ativos
            document.querySelectorAll('.settings-btn').forEach(btn => {
                btn.classList.remove('active');
                
                if (btn.dataset.font === readingState.config.fonte ||
                    btn.dataset.size === readingState.config.tamanho ||
                    btn.dataset.theme === readingState.config.tema) {
                    btn.classList.add('active');
                }
            });
        }
    },
    
    // Atualizar progresso baseado no scroll
    atualizarProgressoScroll() {
        const content = document.querySelector('.reading-content');
        if (!content) return;
        
        const rect = content.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const contentHeight = content.offsetHeight;
        
        // Calcular progresso baseado na posição do scroll
        const scrollTop = window.pageYOffset;
        const contentTop = content.offsetTop;
        const scrollProgress = Math.max(0, Math.min(100, 
            ((scrollTop - contentTop + windowHeight) / contentHeight) * 100
        ));
        
        // Atualizar barra de progresso
        document.querySelector('.reading-progress-fill').style.width = `${scrollProgress}%`;
    },
    
    // Curtir história
    async curtirHistoria() {
        try {
            await api.historias.curtir(readingState.historia.id);
            readingState.historia.curtidas++;
            this.renderizarInfoSidebar();
            utils.mostrarMensagem('História curtida! ❤️');
        } catch (error) {
            utils.mostrarMensagem('Erro ao curtir história', 'error');
        }
    },
    
    // Adicionar à biblioteca
    adicionarBiblioteca() {
        // Implementar quando tiver sistema de biblioteca
        utils.mostrarMensagem('Adicionado à biblioteca! 📚');
    }
};

// ========================================
// INICIALIZAÇÃO
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    reading.init();
});

// Exportar
window.reading = reading;
