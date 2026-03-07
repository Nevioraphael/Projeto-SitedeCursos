import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const VIEWS_DIR = join(__dirname, '../views');
const PUBLIC_DIR = join(__dirname, '../../public');

/**
 * Middleware para verificar autenticação
 */
export const requireAuth = (req, res, next) => {
    if (req.session.usuarioLogado) {
        return next();
    }
    return res.redirect('/login');
};

/**
 * GET /login - Exibe a página de login
 */
export const getLogin = (req, res) => {
    console.log("🔍 GET /login");
    
    if (req.session.usuarioLogado) {
        return res.redirect("/index.html");
    }
    res.sendFile(join(VIEWS_DIR, 'login.html'));
};

/**
 * POST /login - Processa autenticação
 */
export const postLogin = (req, res) => {
    const { usuario, senha } = req.body;

    console.log("🔐 Tentativa de login:", { usuario });
    
    if (usuario === "admin" && senha === "123") {
        req.session.usuarioLogado = true;
        req.session.usuario = usuario;

        console.log("✅ LOGOU:", usuario);
        
        req.session.save((err) => {
            if (err) {
                console.error("❌ Erro ao salvar sessão:", err);
                return res.status(500).send("Erro interno ao fazer login");
            }
            res.redirect("/index.html");
        });
    } else {
        console.log("❌ Credenciais inválidas");
        res.status(401).json({ erro: "Credenciais inválidas" });
    }
};

/**
 * GET /logout - Encerra sessão
 */
export const getLogout = (req, res) => {
    console.log("🚪 GET /logout");
    
    req.session.destroy((err) => {
        if (err) {
            console.error("❌ Erro ao destruir sessão:", err);
            return res.status(500).send("Erro ao fazer logout");
        }
        res.clearCookie('connect.sid');
        res.redirect("/login");
    });
};


export const getHome = (req, res) => {
    res.sendFile(join(VIEWS_DIR, 'index.html'));
};

export const getCadastro = (req, res) => {
    res.sendFile(join(VIEWS_DIR, 'cadastro.html'));
};

export const getDetalhes = (req, res) => {
    res.sendFile(join(VIEWS_DIR, 'detalhes.html'));
};