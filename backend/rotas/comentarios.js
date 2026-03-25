const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../banco/conexao');

const router = express.Router();

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        try {
            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'catbook_secret');
            req.usuario = decoded;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }
    } else {
        return res.status(401).json({
            success: false,
            message: 'Token não fornecido'
        });
    }
    next();
};

// Listar comentários de uma história
router.get('/historia/:historiaId', (req, res) => {
    try {
        const { historiaId } = req.params;
        const { ordenar = 'recentes' } = req.query;
        
        let comentarios = db.findComentariosByHistoriaId(historiaId);
        
        // Ordenar
        if (ordenar === 'populares') {
            comentarios.sort((a, b) => b.likes - a.likes);
        } else {
            comentarios.sort((a, b) => new Date(b.data) - new Date(a.data));
        }
        
        res.json({
            success: true,
            data: comentarios,
            total: comentarios.length
        });
        
    } catch (error) {
        console.error('Erro ao listar comentários:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao listar comentários'
        });
    }
});

// Criar comentário
router.post('/', authMiddleware, (req, res) => {
    try {
        const { historiaId, conteudo, figurinhas = [] } = req.body;
        
        if (!historiaId || !conteudo) {
            return res.status(400).json({
                success: false,
                message: 'ID da história e conteúdo são obrigatórios'
            });
        }
        
        if (conteudo.length < 3) {
            return res.status(400).json({
                success: false,
                message: 'O comentário deve ter pelo menos 3 caracteres'
            });
        }
        
        // Verificar se a história existe
        const historia = db.findHistoriaById(historiaId);
        if (!historia) {
            return res.status(404).json({
                success: false,
                message: 'História não encontrada'
            });
        }
        
        // Buscar usuário
        const usuario = db.findUserById(req.usuario.userId);
        
        const novoComentario = {
            id: uuidv4(),
            historiaId,
            usuarioId: req.usuario.userId,
            usuarioNome: usuario?.nome || 'Anônimo',
            conteudo,
            data: new Date().toISOString(),
            likes: 0,
            figurinhas
        };
        
        db.comentarios.push(novoComentario);
        
        // Incrementar contador de comentários da história
        historia.comentarios++;
        
        res.status(201).json({
            success: true,
            message: 'Comentário adicionado com sucesso',
            data: novoComentario
        });
        
    } catch (error) {
        console.error('Erro ao criar comentário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao criar comentário'
        });
    }
});

// Atualizar comentário
router.put('/:id', authMiddleware, (req, res) => {
    try {
        const { id } = req.params;
        const { conteudo } = req.body;
        
        const comentario = db.comentarios.find(c => c.id === id);
        
        if (!comentario) {
            return res.status(404).json({
                success: false,
                message: 'Comentário não encontrado'
            });
        }
        
        // Verificar se é o autor
        if (comentario.usuarioId !== req.usuario.userId) {
            return res.status(403).json({
                success: false,
                message: 'Você não tem permissão para editar este comentário'
            });
        }
        
        comentario.conteudo = conteudo;
        
        res.json({
            success: true,
            message: 'Comentário atualizado com sucesso',
            data: comentario
        });
        
    } catch (error) {
        console.error('Erro ao atualizar comentário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar comentário'
        });
    }
});

// Deletar comentário
router.delete('/:id', authMiddleware, (req, res) => {
    try {
        const { id } = req.params;
        const index = db.comentarios.findIndex(c => c.id === id);
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Comentário não encontrado'
            });
        }
        
        const comentario = db.comentarios[index];
        
        // Verificar se é o autor
        if (comentario.usuarioId !== req.usuario.userId) {
            return res.status(403).json({
                success: false,
                message: 'Você não tem permissão para deletar este comentário'
            });
        }
        
        db.comentarios.splice(index, 1);
        
        // Decrementar contador de comentários da história
        const historia = db.findHistoriaById(comentario.historiaId);
        if (historia && historia.comentarios > 0) {
            historia.comentarios--;
        }
        
        res.json({
            success: true,
            message: 'Comentário deletado com sucesso'
        });
        
    } catch (error) {
        console.error('Erro ao deletar comentário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao deletar comentário'
        });
    }
});

// Curtir comentário
router.post('/:id/curtir', authMiddleware, (req, res) => {
    try {
        const { id } = req.params;
        const comentario = db.comentarios.find(c => c.id === id);
        
        if (!comentario) {
            return res.status(404).json({
                success: false,
                message: 'Comentário não encontrado'
            });
        }
        
        comentario.likes++;
        
        res.json({
            success: true,
            message: 'Comentário curtido com sucesso',
            data: { likes: comentario.likes }
        });
        
    } catch (error) {
        console.error('Erro ao curtir comentário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao curtir comentário'
        });
    }
});

// Responder comentário (comentário aninhado)
router.post('/:id/responder', authMiddleware, (req, res) => {
    try {
        const { id } = req.params;
        const { conteudo, historiaId } = req.body;
        
        if (!conteudo) {
            return res.status(400).json({
                success: false,
                message: 'Conteúdo é obrigatório'
            });
        }
        
        const comentarioPai = db.comentarios.find(c => c.id === id);
        
        if (!comentarioPai) {
            return res.status(404).json({
                success: false,
                message: 'Comentário não encontrado'
            });
        }
        
        const usuario = db.findUserById(req.usuario.userId);
        
        const resposta = {
            id: uuidv4(),
            historiaId: historiaId || comentarioPai.historiaId,
            usuarioId: req.usuario.userId,
            usuarioNome: usuario?.nome || 'Anônimo',
            conteudo,
            respostaPara: id,
            data: new Date().toISOString(),
            likes: 0,
            figurinhas: []
        };
        
        db.comentarios.push(resposta);
        
        // Incrementar contador de comentários da história
        const historia = db.findHistoriaById(resposta.historiaId);
        if (historia) {
            historia.comentarios++;
        }
        
        res.status(201).json({
            success: true,
            message: 'Resposta adicionada com sucesso',
            data: resposta
        });
        
    } catch (error) {
        console.error('Erro ao responder comentário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao responder comentário'
        });
    }
});

module.exports = router;
