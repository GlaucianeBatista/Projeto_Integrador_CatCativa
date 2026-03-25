const express = require('express');
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

// Obter perfil do usuário
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const usuario = db.findUserById(id);
        
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }
        
        // Buscar histórias do usuário
        const historias = db.historias.filter(h => h.autorId === id);
        
        // Retornar sem a senha
        const { senha, ...usuarioSemSenha } = usuario;
        
        res.json({
            success: true,
            data: {
                ...usuarioSemSenha,
                historias: historias.map(h => ({
                    id: h.id,
                    titulo: h.titulo,
                    capa: h.capa,
                    sinopse: h.sinopse,
                    categoria: h.categoria,
                    status: h.status,
                    visualizacoes: h.visualizacoes,
                    curtidas: h.curtidas,
                    classificacao: h.classificacao,
                    dataCriacao: h.dataCriacao
                }))
            }
        });
        
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar usuário'
        });
    }
});

// Atualizar perfil
router.put('/:id', authMiddleware, (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar se o usuário está editando seu próprio perfil
        if (req.usuario.userId !== id) {
            return res.status(403).json({
                success: false,
                message: 'Você não tem permissão para editar este perfil'
            });
        }
        
        const usuario = db.findUserById(id);
        
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }
        
        const { nome, bio, avatar } = req.body;
        
        if (nome) usuario.nome = nome;
        if (bio !== undefined) usuario.bio = bio;
        if (avatar !== undefined) usuario.avatar = avatar;
        
        res.json({
            success: true,
            message: 'Perfil atualizado com sucesso',
            data: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                avatar: usuario.avatar,
                bio: usuario.bio,
                seguidores: usuario.seguidores,
                seguindo: usuario.seguindo,
                historiasEscritas: usuario.historiasEscritas,
                totalLikes: usuario.totalLikes,
                stickers: usuario.stickers
            }
        });
        
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar perfil'
        });
    }
});

// Obter estatísticas do usuário
router.get('/:id/estatisticas', (req, res) => {
    try {
        const { id } = req.params;
        const usuario = db.findUserById(id);
        
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }
        
        const historias = db.historias.filter(h => h.autorId === id);
        
        const estatisticas = {
            totalHistorias: historias.length,
            totalVisualizacoes: historias.reduce((acc, h) => acc + h.visualizacoes, 0),
            totalCurtidas: historias.reduce((acc, h) => acc + h.curtidas, 0),
            totalComentarios: historias.reduce((acc, h) => acc + h.comentarios, 0),
            mediaClassificacao: historias.length > 0 
                ? (historias.reduce((acc, h) => acc + h.classificacao, 0) / historias.length).toFixed(1)
                : 0,
            historiasCompletas: historias.filter(h => h.status === 'Completa').length,
            historiasEmAndamento: historias.filter(h => h.status === 'Em andamento').length
        };
        
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

// Seguir usuário
router.post('/:id/seguir', authMiddleware, (req, res) => {
    try {
        const { id } = req.params;
        const usuarioSeguir = db.findUserById(id);
        const usuarioAtual = db.findUserById(req.usuario.userId);
        
        if (!usuarioSeguir || !usuarioAtual) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }
        
        if (id === req.usuario.userId) {
            return res.status(400).json({
                success: false,
                message: 'Você não pode seguir a si mesmo'
            });
        }
        
        usuarioSeguir.seguidores++;
        usuarioAtual.seguindo++;
        
        res.json({
            success: true,
            message: `Você agora segue ${usuarioSeguir.nome}`,
            data: {
                seguindo: true,
                seguidores: usuarioSeguir.seguidores
            }
        });
        
    } catch (error) {
        console.error('Erro ao seguir usuário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao seguir usuário'
        });
    }
});

// Listar todos os usuários (para descoberta)
router.get('/', (req, res) => {
    try {
        const { limite = 10 } = req.query;
        
        const usuarios = db.usuarios
            .sort((a, b) => b.seguidores - a.seguidores)
            .slice(0, parseInt(limite))
            .map(u => ({
                id: u.id,
                nome: u.nome,
                avatar: u.avatar,
                bio: u.bio,
                seguidores: u.seguidores,
                historiasEscritas: u.historiasEscritas
            }));
        
        res.json({
            success: true,
            data: usuarios,
            total: usuarios.length
        });
        
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao listar usuários'
        });
    }
});

module.exports = router;
