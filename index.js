/**
 * ============================================
 * CONFIGURAÇÕES INICIAIS E IMPORTAÇÕES
 * ============================================
 */
import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import multer from 'multer';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Importar rotas
import routes from './src/routes.js';

// Configurações do servidor
const HOST = "0.0.0.0";
const PORT = 3000;
const SESSION_SECRET = 'minh4ch@v&s3cr&t@';
const SESSION_DURATION = 1000 * 60 * 15; // 15 minutos

const app = express();

// Resolver __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Caminhos absolutos
const PUBLIC_DIR = join(__dirname, 'public');

// Configuração do multer para multipart/form-data
const envioDados = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
});

/**
 * ============================================
 * MIDDLEWARES GLOBAIS
 * ============================================
 */

// Parse de dados JSON
app.use(express.json());

// Parse de dados de formulários urlencoded
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta public
app.use(express.static(PUBLIC_DIR));

// Middleware para arquivos enviados
app.use(envioDados.none());

// Configuração da sessão do usuário
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: SESSION_DURATION
    }
}));

/**
 * ============================================
 * USAR ROTAS
 * ============================================
 */
app.use(routes);

/**
 * ============================================
 * INICIALIZAÇÃO DO SERVIDOR
 * ============================================
 */
app.listen(PORT, HOST, () => {
    const displayHost = HOST === '0.0.0.0' ? 'localhost' : HOST;
    console.log(`✅ Servidor rodando em http://${displayHost}:${PORT}`);
    console.log(`📁 Estrutura MVC + MySQL ativa`);
    console.log(`🔐 Autenticação por sessão ativa`);
    console.log(`📁 PUBLIC_DIR: ${PUBLIC_DIR}`);
    console.log(`🗄️  Banco de dados: ${process.env.DB_NAME || 'cursos_online'}`);
});