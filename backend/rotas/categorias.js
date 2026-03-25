const express = require('express');
const db = require('../banco/conexao');

const router = express.Router();

// Listar todas as categorias
router.get('/', (req, res) => {
    try {
        // Atualizar quantidade de histórias por categoria
        const categoriasAtualizadas = db.categorias.map(cat => {
            const quantidade = db.historias.filter(h => h.categoria === cat.nome).length;
            return {
                ...cat,
                quantidade
            };
        });
        
        res.json({
            success: true,
            data: categoriasAtualizadas,
            total: categoriasAtualizadas.length
        });
        
    } catch (error) {
        console.error('Erro ao listar categorias:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao listar categorias'
        });
    }
});

// Obter categoria específica
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const categoria = db.categorias.find(c => c.id === id);
        
        if (!categoria) {
            return res.status(404).json({
                success: false,
                message: 'Categoria não encontrada'
            });
        }
        
        // Buscar histórias da categoria
        const historias = db.historias.filter(h => h.categoria === categoria.nome);
        
        res.json({
            success: true,
            data: {
                ...categoria,
                quantidade: historias.length,
                historias: historias.map(h => ({
                    id: h.id,
                    titulo: h.titulo,
                    autorNome: h.autorNome,
                    capa: h.capa,
                    sinopse: h.sinopse,
                    status: h.status,
                    visualizacoes: h.visualizacoes,
                    curtidas: h.curtidas,
                    classificacao: h.classificacao
                }))
            }
        });
        
    } catch (error) {
        console.error('Erro ao buscar categoria:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar categoria'
        });
    }
});

// Obter estatísticas das categorias
router.get('/estatisticas/geral', (req, res) => {
    try {
        const estatisticas = db.categorias.map(cat => {
            const historias = db.historias.filter(h => h.categoria === cat.nome);
            return {
                id: cat.id,
                nome: cat.nome,
                icone: cat.icone,
                quantidade: historias.length,
                totalVisualizacoes: historias.reduce((acc, h) => acc + h.visualizacoes, 0),
                totalCurtidas: historias.reduce((acc, h) => acc + h.curtidas, 0),
                mediaClassificacao: historias.length > 0
                    ? (historias.reduce((acc, h) => acc + h.classificacao, 0) / historias.length).toFixed(1)
                    : 0
            };
        }).sort((a, b) => b.quantidade - a.quantidade);
        
        res.json({
            success: true,
            data: estatisticas
        });
        
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar estatísticas'
        });
    }
});

module.exports = router;
