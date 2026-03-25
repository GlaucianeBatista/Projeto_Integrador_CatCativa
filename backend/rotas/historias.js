const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../banco/conexao');

const router = express.Router();

// Middleware de autenticação simples
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        try {
            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'catbook_secret');
            req.usuario = decoded;
        } catch (error) {
            // Continua sem usuário autenticado
        }
    }
    next();
};

// Listar todas as histórias
router.get('/', (req, res) => {
    try {
        const { categoria, busca, ordenar = 'recentes' } = req.query;
        let historias = [...db.historias];
        
        // Filtrar por categoria
        if (categoria && categoria !== 'Todas') {
            historias = historias.filter(h => h.categoria === categoria);
        }
        
        // Buscar por texto
        if (busca) {
            const termo = busca.toLowerCase();
            historias = historias.filter(h => 
                h.titulo.toLowerCase().includes(termo) ||
                h.sinopse.toLowerCase().includes(termo) ||
                h.autorNome.toLowerCase().includes(termo) ||
                h.tags.some(tag => tag.toLowerCase().includes(termo))
            );
        }
        
        // Ordenar
        switch (ordenar) {
            case 'visualizacoes':
                historias.sort((a, b) => b.visualizacoes - a.visualizacoes);
                break;
            case 'curtidas':
                historias.sort((a, b) => b.curtidas - a.curtidas);
                break;
            case 'classificacao':
                historias.sort((a, b) => b.classificacao - a.classificacao);
                break;
            case 'recentes':
            default:
                historias.sort((a, b) => new Date(b.dataAtualizacao) - new Date(a.dataAtualizacao));
        }
        
        // Retornar sem o conteúdo completo para lista
        const historiasResumo = historias.map(h => ({
            id: h.id,
            titulo: h.titulo,
            autorId: h.autorId,
            autorNome: h.autorNome,
            capa: h.capa,
            sinopse: h.sinopse,
            categoria: h.categoria,
            tags: h.tags,
            status: h.status,
            visualizacoes: h.visualizacoes,
            curtidas: h.curtidas,
            comentarios: h.comentarios,
            classificacao: h.classificacao,
            dataCriacao: h.dataCriacao,
            dataAtualizacao: h.dataAtualizacao,
            capitulos: h.capitulos.length
        }));
        
        res.json({
            success: true,
            data: historiasResumo,
            total: historiasResumo.length
        });
        
    } catch (error) {
        console.error('Erro ao listar histórias:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao listar histórias'
        });
    }
});

// Obter história por ID
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const historia = db.findHistoriaById(id);
        
        if (!historia) {
            return res.status(404).json({
                success: false,
                message: 'História não encontrada'
            });
        }
        
        // Incrementar visualizações
        historia.visualizacoes++;
        
        res.json({
            success: true,
            data: historia
        });
        
    } catch (error) {
        console.error('Erro ao buscar história:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar história'
        });
    }
});

// Criar nova história
router.post('/', authMiddleware, (req, res) => {
    try {
        const { titulo, sinopse, conteudo, categoria, tags, status } = req.body;
        
        if (!titulo || !sinopse || !conteudo) {
            return res.status(400).json({
                success: false,
                message: 'Título, sinopse e conteúdo são obrigatórios'
            });
        }
        
        const novaHistoria = {
            id: uuidv4(),
            titulo,
            autorId: req.usuario?.userId || 'anonimo',
            autorNome: req.usuario?.nome || 'Anônimo',
            capa: null,
            sinopse,
            conteudo,
            categoria: categoria || 'Romance',
            tags: tags || [],
            status: status || 'Em andamento',
            visualizacoes: 0,
            curtidas: 0,
            comentarios: 0,
            classificacao: 0,
            dataCriacao: new Date().toISOString(),
            dataAtualizacao: new Date().toISOString(),
            capitulos: [
                { id: uuidv4(), titulo: 'Capítulo 1', numero: 1 }
            ]
        };
        
        db.historias.push(novaHistoria);
        
        res.status(201).json({
            success: true,
            message: 'História criada com sucesso',
            data: novaHistoria
        });
        
    } catch (error) {
        console.error('Erro ao criar história:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao criar história'
        });
    }
});

// Atualizar história
router.put('/:id', authMiddleware, (req, res) => {
    try {
        const { id } = req.params;
        const historia = db.findHistoriaById(id);
        
        if (!historia) {
            return res.status(404).json({
                success: false,
                message: 'História não encontrada'
            });
        }
        
        // Verificar se é o autor
        if (req.usuario?.userId !== historia.autorId) {
            return res.status(403).json({
                success: false,
                message: 'Você não tem permissão para editar esta história'
            });
        }
        
        const { titulo, sinopse, conteudo, categoria, tags, status } = req.body;
        
        if (titulo) historia.titulo = titulo;
        if (sinopse) historia.sinopse = sinopse;
        if (conteudo) historia.conteudo = conteudo;
        if (categoria) historia.categoria = categoria;
        if (tags) historia.tags = tags;
        if (status) historia.status = status;
        
        historia.dataAtualizacao = new Date().toISOString();
        
        res.json({
            success: true,
            message: 'História atualizada com sucesso',
            data: historia
        });
        
    } catch (error) {
        console.error('Erro ao atualizar história:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar história'
        });
    }
});

// Deletar história
router.delete('/:id', authMiddleware, (req, res) => {
    try {
        const { id } = req.params;
        const index = db.historias.findIndex(h => h.id === id);
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'História não encontrada'
            });
        }
        
        const historia = db.historias[index];
        
        // Verificar se é o autor
        if (req.usuario?.userId !== historia.autorId) {
            return res.status(403).json({
                success: false,
                message: 'Você não tem permissão para deletar esta história'
            });
        }
        
        db.historias.splice(index, 1);
        
        res.json({
            success: true,
            message: 'História deletada com sucesso'
        });
        
    } catch (error) {
        console.error('Erro ao deletar história:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao deletar história'
        });
    }
});

// Curtir história
router.post('/:id/curtir', authMiddleware, (req, res) => {
    try {
        const { id } = req.params;
        const historia = db.findHistoriaById(id);
        
        if (!historia) {
            return res.status(404).json({
                success: false,
                message: 'História não encontrada'
            });
        }
        
        historia.curtidas++;
        
        res.json({
            success: true,
            message: 'História curtida com sucesso',
            data: { curtidas: historia.curtidas }
        });
        
    } catch (error) {
        console.error('Erro ao curtir história:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao curtir história'
        });
    }
});

// Obter histórias do usuário
router.get('/usuario/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const historias = db.historias.filter(h => h.autorId === userId);
        
        res.json({
            success: true,
            data: historias,
            total: historias.length
        });
        
    } catch (error) {
        console.error('Erro ao buscar histórias do usuário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar histórias do usuário'
        });
    }
});

module.exports = router;
