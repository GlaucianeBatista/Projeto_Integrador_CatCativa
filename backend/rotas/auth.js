const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../banco/database.js');

const router = express.Router();

// Registro de usuário
router.post('/registro', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        
        // Validações
        if (!nome || !email || !senha) {
            return res.status(400).json({
                success: false,
                message: 'Todos os campos são obrigatórios'
            });
        }
        
        if (nome.length < 3) {
            return res.status(400).json({
                success: false,
                message: 'O nome deve ter pelo menos 3 caracteres'
            });
        }
        
        if (senha.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'A senha deve ter pelo menos 6 caracteres'
            });
        }
        
        // Verificar se email já existe
        const usuarioExistente = db.findUserByEmail(email);
        if (usuarioExistente) {
            return res.status(400).json({
                success: false,
                message: 'Este email já está cadastrado'
            });
        }
        
        // Criptografar senha
        const senhaHash = await bcrypt.hash(senha, 10);
        
        // Criar novo usuário
        const novoUsuario = {
            id: uuidv4(),
            nome,
            email,
            senha: senhaHash,
            avatar: null,
            bio: '',
            seguidores: 0,
            seguindo: 0,
            historiasEscritas: 0,
            totalLikes: 0,
            dataCriacao: new Date().toISOString(),
            stickers: ['gatinho', 'coracao', 'estrela']
        };
        
        db.usuarios.push(novoUsuario);
        
        // Gerar token JWT
        const token = jwt.sign(
            { userId: novoUsuario.id, email: novoUsuario.email },
            process.env.JWT_SECRET || 'catbook_secret',
            { expiresIn: '7d' }
        );
        
        res.status(201).json({
            success: true,
            message: 'Usuário criado com sucesso',
            data: {
                token,
                usuario: {
                    id: novoUsuario.id,
                    nome: novoUsuario.nome,
                    email: novoUsuario.email,
                    avatar: novoUsuario.avatar,
                    bio: novoUsuario.bio,
                    seguidores: novoUsuario.seguidores,
                    seguindo: novoUsuario.seguindo,
                    historiasEscritas: novoUsuario.historiasEscritas,
                    totalLikes: novoUsuario.totalLikes,
                    stickers: novoUsuario.stickers
                }
            }
        });
        
    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao criar usuário'
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        
        // Validações
        if (!email || !senha) {
            return res.status(400).json({
                success: false,
                message: 'Email e senha são obrigatórios'
            });
        }
        
        // Buscar usuário
        const usuario = db.findUserByEmail(email);
        
        // Para desenvolvimento - login simulado
        if (email === 'teste@catbook.com' && senha === 'Lyn999358848#') {
            const token = jwt.sign(
                { userId: 'teste', email: 'teste@catbook.com' },
                process.env.JWT_SECRET || 'catbook_secret',
                { expiresIn: '7d' }
            );
            
            return res.json({
                success: true,
                message: 'Login realizado com sucesso',
                data: {
                    token,
                    usuario: {
                        id: 'teste',
                        nome: 'Usuário Teste',
                        email: 'teste@catbook.com',
                        avatar: null,
                        bio: 'Bem-vindo ao Catbook! 🐱',
                        seguidores: 0,
                        seguindo: 0,
                        historiasEscritas: 0,
                        totalLikes: 0,
                        stickers: ['gatinho', 'coracao', 'estrela']
                    }
                }
            });
        }
        
        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: 'Email ou senha incorretos'
            });
        }
        
        // Verificar senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        
        if (!senhaValida) {
            return res.status(401).json({
                success: false,
                message: 'Email ou senha incorretos'
            });
        }
        
        // Gerar token JWT
        const token = jwt.sign(
            { userId: usuario.id, email: usuario.email },
            process.env.JWT_SECRET || 'catbook_secret',
            { expiresIn: '7d' }
        );
        
        res.json({
            success: true,
            message: 'Login realizado com sucesso',
            data: {
                token,
                usuario: {
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
            }
        });
        
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao realizar login'
        });
    }
});

// Verificar token
router.get('/verificar', (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token não fornecido'
            });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'catbook_secret');
        const usuario = db.findUserById(decoded.userId);
        
        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }
        
        res.json({
            success: true,
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
        res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }
});

module.exports = router;
