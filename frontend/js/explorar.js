/**
 * CATBOOK - Módulo de Explorar
 * Gerencia o feed de histórias e descoberta
 */

// ========================================
// ESTADO DO EXPLORAR
// ========================================
const exploreState = {
    historias: [],
    categorias: [],
    filtroAtual: 'Todas',
    ordenacao: 'recentes',
    busca: '',
    carregando: false,
    pagina: 1
};

// ========================================
// MÓDULO DE EXPLORAR
// ========================================
const explore = {
    // Inicializar
    async init() {
        // Verificar parâmetros da URL
        const params = navigation.getParams();
        if (params.categoria) {
            exploreState.filtroAtual = params.categoria;
        }
        
        // Carregar dados
        await Promise.all([
            this.carregarCategorias(),
            this.carregarHistorias()
        ]);
        
        // Renderizar
        this.renderizar();
        this.configurarEventos();
    },
    
    // Carregar categorias
    async carregarCategorias() {
        try {
            const response = await api.categorias.listar();
            
            if (response.success) {
                exploreState.categorias = response.data;
            }
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
        }
    },
    
    // Carregar histórias
    async carregarHistorias() {
        if (exploreState.carregando) return;
        
        exploreState.carregando = true;
        
        try {
            const params = {
                categoria: exploreState.filtroAtual === 'Todas' ? '' : exploreState.filtroAtual,
                ordenar: exploreState.ordenacao,
                busca: exploreState.busca
            };
            
            const response = await api.historias.listar(params);
            
            if (response.success) {
                exploreState.historias = response.data;
            }
        } catch (error) {
            console.error('Erro ao carregar histórias:', error);
        } finally {
            exploreState.carregando = false;
        }
    },
    
    // Renderizar
    renderizar() {
        this.renderizarCategorias();
        this.renderizarHistorias();
        this.atualizarFiltros();
    },
    
    // Renderizar categorias
    renderizarCategorias() {
        const container = document.querySelector('.categories-grid');
        
        if (!container) return;
        
        container.innerHTML = exploreState.categorias
            .slice(0, 4)
            .map(c => components.categoryCard(c))
            .join('');
    },
    
    // Renderizar histórias
    renderizarHistorias() {
        const container = document.querySelector('.content-grid');
        
        if (!container) return;
        
        if (exploreState.historias.length === 0) {
            container.innerHTML = `
                <div class="text-center" style="grid-column: 1 / -1; padding: 60px; color: var(--blue-gray);">
                    <p style="font-size: 60px; margin-bottom: 20px;">🔍</p>
                    <h3 style="margin-bottom: 10px;">Nenhuma história encontrada</h3>
                    <p>Tente ajustar seus filtros ou buscar por outro termo.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = exploreState.historias
            .map(h => components.storyCard(h))
            .join('');
    },
    
    // Atualizar filtros visuais
    atualizarFiltros() {
        // Atualizar tags de filtro
        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.classList.toggle('active', tag.textContent === exploreState.filtroAtual);
        });
    },
    
    // Configurar eventos
    configurarEventos() {
        // Busca
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-container .btn');
        
        if (searchInput) {
            searchInput.addEventListener('input', utils.debounce((e) => {
                exploreState.busca = e.target.value;
                this.carregarHistorias().then(() => this.renderizarHistorias());
            }, 500));
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                exploreState.busca = searchInput.value;
                this.carregarHistorias().then(() => this.renderizarHistorias());
            });
        }
        
        // Filtros de categoria
        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                exploreState.filtroAtual = tag.textContent;
                this.carregarHistorias().then(() => {
                    this.renderizarHistorias();
                    this.atualizarFiltros();
                });
            });
        });
        
        // Infinite scroll (opcional)
        window.addEventListener('scroll', utils.debounce(() => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
                // Carregar mais histórias
                // this.carregarMaisHistorias();
            }
        }, 200));
    },
    
    // Filtrar por categoria
    filtrarPorCategoria(categoria) {
        exploreState.filtroAtual = categoria;
        this.carregarHistorias().then(() => {
            this.renderizarHistorias();
            this.atualizarFiltros();
        });
    },
    
    // Ordenar histórias
    ordenarHistorias(ordenacao) {
        exploreState.ordenacao = ordenacao;
        this.carregarHistorias().then(() => this.renderizarHistorias());
    }
};

// ========================================
// INICIALIZAÇÃO
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    explore.init();
});

// Exportar
window.explore = explore;
