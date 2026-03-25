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

// Listar todas as figurinhas disponíveis
router.get('/', (req, res) => {
    try {
        const { categoria } = req.query;
        
        let figurinhas = db.figurinhas;
        
        if (categoria) {
            figurinhas = figurinhas.filter(f => f.categoria === categoria);
        }
        
        res.json({
            success: true,
            data: figurinhas,
            total: figurinhas.length
        });
        
    } catch (error) {
        console.error('Erro ao listar figurinhas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao listar figurinhas'
        });
    }
});

// Obter figurinhas do usuário
router.get('/minhas', authMiddleware, (req, res) => {
    try {
        const usuario = db.findUserById(req.usuario.userId);
        
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }
        
        const minhasFigurinhas = usuario.stickers.map(stickerCode => {
            return db.figurinhas.find(f => f.codigo === stickerCode);
        }).filter(Boolean);
        
        res.json({
            success: true,
            data: minhasFigurinhas,
            total: minhasFigurinhas.length
        });
        
    } catch (error) {
        console.error('Erro ao buscar figurinhas do usuário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar figurinhas do usuário'
        });
    }
});

// Desbloquear nova figurinha (simulação)
router.post('/desbloquear', authMiddleware, (req, res) => {
    try {
        const usuario = db.findUserById(req.usuario.userId);
        
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }
        
        // Pegar figurinhas que o usuário ainda não tem
        const figurinhasDisponiveis = db.figurinhas.filter(
            f => !usuario.stickers.includes(f.codigo)
        );
        
        if (figurinhasDisponiveis.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Você já tem todas as figurinhas!'
            });
        }
        
        // Sortear uma figurinha aleatória
        const figurinhaSorteada = figurinhasDisponiveis[
            Math.floor(Math.random() * figurinhasDisponiveis.length)
        ];
        
        // Adicionar ao usuário
        usuario.stickers.push(figurinhaSorteada.codigo);
        
        res.json({
            success: true,
            message: 'Nova figurinha desbloqueada!',
            data: figurinhaSorteada
        });
        
    } catch (error) {
        console.error('Erro ao desbloquear figurinha:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao desbloquear figurinha'
        });
    }
});

// Obter categorias de figurinhas
router.get('/categorias/lista', (req, res) => {
    try {
        const categorias = [...new Set(db.figurinhas.map(f => f.categoria))];
        
        const categoriasComContagem = categorias.map(cat => ({
            nome: cat,
            quantidade: db.figurinhas.filter(f => f.categoria === cat).length
        }));
        
        res.json({
            success: true,
            data: categoriasComContagem
        });
        
    } catch (error) {
        console.error('Erro ao listar categorias:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao listar categorias'
        });
    }
});

module.exports = router;
