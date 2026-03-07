-- ========================================
-- CRIAÇÃO DO BANCO DE DADOS
-- ========================================
CREATE DATABASE IF NOT EXISTS cursos_online;
USE cursos_online;

-- ========================================
-- TABELA: CURSOS
-- ========================================
CREATE TABLE IF NOT EXISTS cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE,
    descricao LONGTEXT NOT NULL,
    data_inicio DATE NOT NULL,
    duracao VARCHAR(100) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    carga_horaria INT NOT NULL DEFAULT 0,
    instrutor VARCHAR(150) NOT NULL,
    nivel ENUM('iniciante', 'intermediario', 'avancado') NOT NULL DEFAULT 'iniciante',
    vagas_disponiveis INT NOT NULL DEFAULT 0,
    imagem VARCHAR(255) DEFAULT '/images/default.jpg',
    ativo BOOLEAN DEFAULT 1,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nivel (nivel),
    INDEX idx_instrutor (instrutor),
    INDEX idx_data_inicio (data_inicio),
    INDEX idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABELA: INSCRIÇÕES
-- ========================================
CREATE TABLE IF NOT EXISTS inscricoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    curso_id INT NOT NULL,
    nome_aluno VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    quantidade_vagas INT NOT NULL DEFAULT 1,
    valor_total DECIMAL(10, 2) NOT NULL,
    status ENUM('pendente', 'confirmada', 'cancelada') NOT NULL DEFAULT 'pendente',
    data_inscricao DATE NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
    INDEX idx_curso_id (curso_id),
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_data_inscricao (data_inscricao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- LIMPAR DADOS EXISTENTES
-- ========================================
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE inscricoes;
TRUNCATE TABLE cursos;
SET FOREIGN_KEY_CHECKS = 1;

-- ========================================
-- INSERIR 6 CURSOS
-- ========================================

INSERT INTO cursos (nome, descricao, data_inicio, duracao, preco, carga_horaria, instrutor, nivel, vagas_disponiveis, imagem) VALUES

-- Curso 1: Desenvolvimento Web
('Desenvolvimento Web Completo', 
'Aprenda a criar sites e aplicações web do zero! Este curso abrangente cobre HTML5, CSS3, JavaScript moderno, frameworks como React e Vue.js, além de boas práticas de desenvolvimento web. Ideal para quem quer se tornar um desenvolvedor web full-stack.', 
'2026-03-15', 
'6 meses', 
499.90, 
120, 
'Prof. João Silva', 
'iniciante', 
50, 
'/images/web-dev.jpg'),

-- Curso 2: Machine Learning
('Machine Learning com Python', 
'Domine as técnicas de aprendizado de máquina e inteligência artificial! Neste curso você aprenderá desde os fundamentos até algoritmos avançados, usando Python, NumPy, Pandas, Scikit-learn, TensorFlow e PyTorch. Projetos práticos incluídos.', 
'2026-04-10', 
'4 meses', 
699.90, 
80, 
'Dra. Maria Santos', 
'intermediario', 
30, 
'/images/ml.jpg'),

-- Curso 3: Desenvolvimento Mobile
('Desenvolvimento Mobile com React Native', 
'Crie aplicativos nativos para iOS e Android com uma única base de código! Aprenda React Native, gerenciamento de estado, navegação, APIs RESTful e publicação nas lojas de aplicativos. Do zero ao app publicado!', 
'2026-05-05', 
'5 meses', 
599.90, 
100, 
'Prof. Carlos Oliveira', 
'intermediario', 
40, 
'/images/mobile.jpg'),

-- Curso 4: Segurança da Informação
('Segurança da Informação e Ethical Hacking', 
'Torne-se um especialista em segurança cibernética! Este curso avançado cobre criptografia, testes de penetração, análise de vulnerabilidades, segurança de redes, forense digital e compliance. Certificação reconhecida no mercado.', 
'2026-03-20', 
'3 meses', 
799.90, 
60, 
'Especialista Ana Costa', 
'avancado', 
25, 
'/images/security.jpg'),

-- Curso 5: Design Gráfico
('Design Gráfico com Adobe Creative Suite', 
'Domine as ferramentas profissionais de design! Aprenda Photoshop para edição de imagens, Illustrator para ilustrações vetoriais, InDesign para diagramação e muito mais. Crie logotipos, banners, materiais de marketing e portfólio profissional.', 
'2026-04-12', 
'4 meses', 
449.90, 
80, 
'Designer Pedro Almeida', 
'iniciante', 
35, 
'/images/design.jpg'),

-- Curso 6: Banco de Dados
('Banco de Dados com MySQL e SQL Avançado', 
'Torne-se um especialista em bancos de dados relacionais! Aprenda desde conceitos básicos de SQL até consultas complexas, otimização de queries, procedures, triggers, modelagem de dados e administração de bancos MySQL. Essencial para desenvolvedores e DBAs.', 
'2026-03-25', 
'3 meses', 
399.90, 
60, 
'Prof. Ricardo Mendes', 
'intermediario', 
45, 
'/images/database.jpg');

-- ========================================
-- INSERIR INSCRIÇÕES DE TESTE
-- ========================================

INSERT INTO inscricoes (curso_id, nome_aluno, email, quantidade_vagas, valor_total, status, data_inscricao) VALUES

-- Inscrições para Curso 1 (Desenvolvimento Web)
(1, 'Ana Souza', 'ana.souza@email.com', 1, 499.90, 'confirmada', '2026-03-01'),
(1, 'Carlos Santos', 'carlos.santos@email.com', 2, 999.80, 'confirmada', '2026-03-02'),
(1, 'Mariana Lima', 'mariana.lima@email.com', 1, 499.90, 'pendente', '2026-03-05'),

-- Inscrições para Curso 2 (Machine Learning)
(2, 'Roberto Silva', 'roberto.silva@email.com', 1, 699.90, 'confirmada', '2026-03-08'),
(2, 'Fernanda Costa', 'fernanda.costa@email.com', 1, 699.90, 'pendente', '2026-03-10'),

-- Inscrições para Curso 3 (Mobile)
(3, 'Lucas Oliveira', 'lucas.oliveira@email.com', 1, 599.90, 'confirmada', '2026-03-12'),
(3, 'Patrícia Almeida', 'patricia.almeida@email.com', 2, 1199.80, 'confirmada', '2026-03-15'),

-- Inscrições para Curso 4 (Segurança)
(4, 'Bruno Ferreira', 'bruno.ferreira@email.com', 1, 799.90, 'cancelada', '2026-03-01'),
(4, 'Camila Rodrigues', 'camila.rodrigues@email.com', 1, 799.90, 'confirmada', '2026-03-18'),

-- Inscrições para Curso 5 (Design)
(5, 'Rafael Gomes', 'rafael.gomes@email.com', 1, 449.90, 'confirmada', '2026-03-20'),
(5, 'Juliana Mendes', 'juliana.mendes@email.com', 3, 1349.70, 'confirmada', '2026-03-22'),

-- Inscrições para Curso 6 (Banco de Dados)
(6, 'Paulo Henrique', 'paulo.henrique@email.com', 1, 399.90, 'pendente', '2026-03-25'),
(6, 'Aline Santos', 'aline.santos@email.com', 1, 399.90, 'confirmada', '2026-03-28');

-- ========================================
-- VERIFICAÇÃO DOS DADOS INSERIDOS
-- ========================================

SELECT '✅ Dados inseridos com sucesso!' AS mensagem;

SELECT COUNT(*) AS total_cursos FROM cursos WHERE ativo = 1;
SELECT COUNT(*) AS total_inscricoes FROM inscricoes;

SELECT 
    'Resumo por Status' AS tipo,
    status,
    COUNT(*) AS total,
    CONCAT('R$ ', FORMAT(SUM(valor_total), 2)) AS receita
FROM inscricoes
GROUP BY status;