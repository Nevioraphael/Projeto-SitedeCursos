import express from 'express';

const host = "0.0.0.0"; //requisições podem vir de todas as interfaces do host local
const porta = 3000; //identifica unica e exclusivamente uma aplicação nesse host
const app = express();

//Todo o conteúdo do direório views/public estará disponível na raiz do servidor
app.use(express.static('./views/public'));

//escolher a biblioteca que irá processar os parâmetros da reposição
//queryString - extended = false
//qs - extended = true
app.use(express.urlencoded({extended: true}));


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuração de sessão
app.use(session({
    secret: 'minh4ch@v&s3cr&t@',
    resave: false, 
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 15 // 15 minutos de sessão
    }
}
));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de autenticação
function requireAuth(req, res, next) {
    if (req.session.autenticado) {
        return next();
    }
    res.redirect('/login');
}

// Rota inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Rota de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Processamento de login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Usuário fixo para autenticação
    if (username === 'admin' && password === '123') {
        req.session.autenticado = true;
        res.redirect('/cursos');
    } else {
        res.send(`
            <script>
                alert('Usuário ou senha inválidos!');
                window.location.href='/login';
            </script>
        `);
    }
});

// Rota de logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Rota de cursos (protegida)
app.get('/cursos', requireAuth, (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cursos Disponíveis - Cursos Online</title>
        <link rel="stylesheet" href="/css/style.css">
    </head>
    <body>
        <header>
            <nav>
                <div class="container">
                    <h1>Cursos Online</h1>
                    <div class="nav-links">
                        <a href="/cursos">Cursos</a>
                        <a href="/logout">Sair</a>
                    </div>
                </div>
            </nav>
        </header>

        <main class="container">
            <h2>Nossos Cursos</h2>
            <div class="cursos-grid">
                ${cursosData.map(curso => `
                    <div class="curso-card">
                        <h3>${curso.nome}</h3>
                        <p class="curso-info"><strong>Início:</strong> ${curso.dataInicio}</p>
                        <p class="curso-info"><strong>Duração:</strong> ${curso.duracao}</p>
                        <p class="curso-info"><strong>Preço:</strong> R$ ${curso.preco.toFixed(2)}</p>
                        <a href="/curso/${curso.id}" class="btn">Ver Detalhes</a>
                    </div>
                `).join('')}
            </div>
        </main>

        <footer>
            <div class="container">
                <p>&copy; 2026 Cursos Online. Todos os direitos reservados.</p>
            </div>
        </footer>
    </body>
    </html>
    `;
    res.send(html);
});

// Rota de detalhes do curso (protegida)
app.get('/curso/:id', requireAuth, (req, res) => {
    const cursoId = parseInt(req.params.id);
    const curso = cursosData.find(c => c.id === cursoId);
    
    if (!curso) {
        return res.status(404).send('Curso não encontrado');
    }
    
    const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${curso.nome} - Cursos Online</title>
        <link rel="stylesheet" href="/css/style.css">
    </head>
    <body>
        <header>
            <nav>
                <div class="container">
                    <h1>Cursos Online</h1>
                    <div class="nav-links">
                        <a href="/cursos">Voltar</a>
                        <a href="/logout">Sair</a>
                    </div>
                </div>
            </nav>
        </header>

        <main class="container">
            <div class="curso-detalhes">
                <h2>${curso.nome}</h2>
                
                <div class="curso-info-detalhada">
                    <p><strong>Descrição:</strong> ${curso.descricao}</p>
                    <p><strong>Carga Horária:</strong> ${curso.cargaHoraria} horas</p>
                    <p><strong>Instrutor:</strong> ${curso.instrutor}</p>
                    <p><strong>Nível:</strong> ${curso.nivel}</p>
                    <p><strong>Preço por vaga:</strong> R$ ${curso.preco.toFixed(2)}</p>
                    <p><strong>Vagas Disponíveis:</strong> ${curso.vagasDisponiveis}</p>
                </div>

                <div class="compra-section">
                    <h3>Comprar Vagas</h3>
                    <div class="quantidade-control">
                        <label for="quantidade">Quantidade de vagas:</label>
                        <input type="number" id="quantidade" min="1" max="${curso.vagasDisponiveis}" value="1">
                    </div>
                    <div class="preco-total">
                        <p>Preço total: <span id="precoTotal">R$ ${curso.preco.toFixed(2)}</span></p>
                    </div>
                    <button class="btn-comprar" onclick="comprar()">Comprar Agora</button>
                </div>
            </div>
        </main>

        <footer>
            <div class="container">
                <p>&copy; 2026 Cursos Online. Todos os direitos reservados.</p>
            </div>
        </footer>

        <script src="/js/script.js"></script>
        <script>
            const precoUnitario = ${curso.preco};
            const vagasDisponiveis = ${curso.vagasDisponiveis};
        </script>
    </body>
    </html>
    `;
    res.send(html);
});

// Iniciar servidor
app.listen(porta, host, () => { //arrow function
    console.log(`Servidor rodando em http://${host}:${porta}`);
}); //javascript aceita funções como parâmetros de outras funções