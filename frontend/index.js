/**
 * CATBOOK - Módulo da Landing Page
 * Gerencia a página inicial de apresentação
 */

// ========================================
// ESTADO DA LANDING PAGE
// ========================================
const landingState = {
    estatisticas: {
        historias: 0,
        leitores: 0,
        escritores: 0
    },
    categorias: [],
    historiasDestaque: []
};

// ========================================
// MÓDULO DA LANDING PAGE
// ========================================
const landing = {
    // Inicializar
    async init() {
        await this.carregarDados();
        this.renderizar();
        this.configurarEventos();
        this.iniciarAnimacoes();
    },
    
    // Carregar dados
    async carregarDados() {
        try {
            // Carregar categorias
            const catResponse = await api.categorias.estatisticas();
            if (catResponse.success) {
                landingState.categorias = catResponse.data;
            }
            
            // Carregar histórias em destaque
            const histResponse = await api.historias.listar({ ordenar: 'visualizacoes', limite: 6 });
            if (histResponse.success) {
                landingState.historiasDestaque = histResponse.data;
                
                // Calcular estatísticas
                landingState.estatisticas.historias = histResponse.total;
                landingState.estatisticas.leitores = histResponse.data.reduce((acc, h) => acc + h.visualizacoes, 0);
                landingState.estatisticas.escritores = new Set(histResponse.data.map(h => h.autorId)).size;
            }
        } catch (error) {
            console.error('Erro ao carregar dados da landing:', error);
        }
    },
    
    // Renderizar
    renderizar() {
        this.renderizarEstatisticas();
        this.renderizarCategorias();
        this.renderizarHistoriasDestaque();
    },
    
    // Renderizar estatísticas
    renderizarEstatisticas() {
        const stats = landingState.estatisticas;
        
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length >= 3) {
            statNumbers[0].textContent = stats.historias;
            statNumbers[1].textContent = stats.leitores + '+';
            statNumbers[2].textContent = stats.escritores;
        }
    },
    
    // Renderizar categorias
    renderizarCategorias() {
        const container = document.querySelector('.categories-grid');
        
        if (!container) return;
        
        // Pegar as 4 categorias com mais histórias
        const topCategorias = landingState.categorias
            .sort((a, b) => b.quantidade - a.quantidade)
            .slice(0, 4);
        
        container.innerHTML = topCategorias.map(cat => `
            <div class="category-card" onclick="window.location.href='explorar.html?categoria=${encodeURIComponent(cat.nome)}'">
                <div class="category-icon">${cat.icone}</div>
                <h3 class="category-name">${cat.nome}</h3>
                <p class="category-count">${cat.quantidade} história${cat.quantidade !== 1 ? 's' : ''}</p>
            </div>
        `).join('');
    },
    
    // Renderizar histórias em destaque
    renderizarHistoriasDestaque() {
        const container = document.querySelector('#stories-grid');
        
        if (!container) return;
        
        if (landingState.historiasDestaque.length === 0) {
            container.innerHTML = `
                <div class="text-center" style="grid-column: 1 / -1; padding: 40px;">
                    <p style="color: var(--blue-gray);">Nenhuma história publicada ainda. Seja o primeiro!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = landingState.historiasDestaque
            .slice(0, 6)
            .map(h => components.storyCard(h))
            .join('');
    },
    
    // Configurar eventos
    configurarEventos() {
        // Busca na landing page
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-container .btn');
        
        if (searchInput && searchBtn) {
            const handleSearch = () => {
                const termo = searchInput.value.trim();
                if (termo) {
                    window.location.href = `explorar.html?busca=${encodeURIComponent(termo)}`;
                }
            };
            
            searchBtn.addEventListener('click', handleSearch);
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleSearch();
            });
        }
        
        // Filtros de tags
        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const categoria = tag.textContent;
                window.location.href = `explorar.html?categoria=${encodeURIComponent(categoria)}`;
            });
        });
        
        // Botão flutuante
        const floatingCat = document.querySelector('.floating-cat');
        if (floatingCat) {
            floatingCat.addEventListener('click', () => {
                // Scroll para o topo ou abrir ajuda
                smoothScroll.toTop();
            });
        }
    },
    
    // Iniciar animações
    iniciarAnimacoes() {
        // Animação de contagem das estatísticas
        this.animarContagem();
        
        // Animação de entrada dos elementos
        this.animarEntrada();
    },
    
    // Animar contagem de números
    animarContagem() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const valorFinal = parseInt(stat.textContent) || 0;
            const duracao = 2000;
            const incremento = valorFinal / (duracao / 16);
            let valorAtual = 0;
            
            const animar = () => {
                valorAtual += incremento;
                
                if (valorAtual < valorFinal) {
                    stat.textContent = Math.floor(valorAtual);
                    requestAnimationFrame(animar);
                } else {
                    stat.textContent = valorFinal;
                }
            };
            
            // Iniciar animação quando o elemento estiver visível
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animar();
                        observer.disconnect();
                    }
                });
            });
            
            observer.observe(stat);
        });
    },
    
    // Animar entrada dos elementos
    animarEntrada() {
        const elementos = document.querySelectorAll('.story-card, .category-card, .feature-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        elementos.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
};

// ========================================
// INICIALIZAÇÃO
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    landing.init();
});

// Exportar
window.landing = landing;
