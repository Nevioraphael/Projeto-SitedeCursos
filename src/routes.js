import express from 'express';
import * as authController from './controllers/authController.js';
import * as cursoController from './controllers/cursoController.js';
import { REFUSED } from 'dns';

const router = express.Router();

/**
 * ============================================
 * ROTAS PÚBLICAS (sem autenticação)
 * ============================================
 */

// Login
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/logout', authController.getLogout);

/**
 * ============================================
 * ROTAS PROTEGIDAS (requer autenticação)
 * ============================================
 */

// Página principal
router.get('/index.html', authController.requireAuth, authController.getHome);

// Cadastro de cursos
router.get('/cadastro', authController.requireAuth, authController.getCadastro);

// Detalhes do curso
router.get('/detalhes', authController.getDetalhes);


router.post('/nevio', (req, res) => {
    
    const body = req.body;

    console.log("Recebido POST /nevio com body:", body);

    res.send("Olá, Nevio!FXDFXDFXDFXDFXDFXDFXDFXDFXD " + body.usuario) ;
});

/**
 * ============================================
 * ROTAS DA API - CURSOS (JSON)
 * ============================================
 */

// Retorna todos os cursos (público)
router.get('/api/cursos', cursoController.getCursos);

// Retorna um curso específico (público)
router.get('/api/cursos/:id', cursoController.getCursoById);

// Retorna cursos por nível (público)
router.get('/api/nivel/:nivel', cursoController.getCursosPorNivel);

// Retorna estatísticas de cursos (público)
router.get('/api/estatisticas/cursos', cursoController.getEstatisticasCursos);

// Criar novo curso (protegido)
router.post('/api/cursos', authController.requireAuth, cursoController.criarCurso);

// Atualizar curso (protegido)
router.put('/api/cursos/:id', authController.requireAuth, cursoController.atualizarCurso);

// Deletar curso (protegido)
router.delete('/api/cursos/:id', authController.requireAuth, cursoController.deletarCurso);

/**
 * ============================================
 * ROTAS DA API - INSCRIÇÕES (JSON)
 * ============================================
 */

// Retorna inscrições de um curso (público)
router.get('/api/inscricoes/curso/:cursoId', cursoController.getInscricoesPorCurso);

// Retorna estatísticas de inscrições (público)
router.get('/api/estatisticas/inscricoes', cursoController.getEstatisticasInscricoes);

// Criar nova inscrição (público)
router.post('/api/inscricoes', cursoController.criarInscricao);

export default router;