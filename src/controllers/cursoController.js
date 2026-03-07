import Curso from '../models/Curso.js';
import Inscricao from '../models/Inscricao.js';

/**
 * GET /api/cursos - Retorna todos os cursos
 */
export const getCursos = async (req, res) => {
    try {
        const cursos = await Curso.todos();



        res.json(cursos);
    } catch (erro) {
        console.error('Erro ao buscar cursos:', erro);
        res.status(500).json({ erro: "Erro ao buscar cursos" });
    }
};

/**
 * GET /api/cursos/:id - Retorna um curso específico
 */
export const getCursoById = async (req, res) => {
    try {
        const { id } = req.params;
        const curso = await Curso.buscarPorId(id);

        console.log("Curso ", curso);
        
        if (!curso) {
            return res.status(404).json({ erro: "Curso não encontrado" });
        }
        
        res.json(curso);
    } catch (erro) {
        console.error('Erro ao buscar curso:', erro);
        res.status(500).json({ erro: "Erro ao buscar curso" });
    }
};

/**
 * GET /api/cursos/nivel/:nivel - Retorna cursos por nível
 */
export const getCursosPorNivel = async (req, res) => {
    try {
        const { nivel } = req.params;
        const nivelValidos = ['iniciante', 'intermediario', 'avancado'];
        
        if (!nivelValidos.includes(nivel)) {
            return res.status(400).json({ erro: "Nível inválido" });
        }

        const cursos = await Curso.buscarPorNivel(nivel);
        res.json(cursos);
    } catch (erro) {
        console.error('Erro ao buscar cursos por nível:', erro);
        res.status(500).json({ erro: "Erro ao buscar cursos" });
    }
};

/**
 * GET /api/estatisticas/cursos - Retorna estatísticas dos cursos
 */
export const getEstatisticasCursos = async (req, res) => {
    try {
        const stats = await Curso.estatisticas();
        res.json(stats);
    } catch (erro) {
        console.error('Erro ao buscar estatísticas:', erro);
        res.status(500).json({ erro: "Erro ao buscar estatísticas" });
    }
};

/**
 * POST /api/cursos - Cria um novo curso
 */
export const criarCurso = async (req, res) => {
    try {
        const { nome, descricao, data_inicio, duracao, preco, carga_horaria, instrutor, nivel, vagas_disponiveis, imagem } = req.body;
        
        if (!nome || !descricao) {
            return res.status(400).json({ erro: "Nome e descrição são obrigatórios" });
        }

        const novoCurso = await Curso.salvar({
            nome,
            descricao,
            data_inicio,
            duracao,
            preco,
            carga_horaria,
            instrutor,
            nivel,
            vagas_disponiveis,
            imagem
        });

        res.status(201).json(novoCurso);
    } catch (erro) {
        console.error('Erro ao criar curso:', erro);
        res.status(500).json({ erro: "Erro ao criar curso" });
    }
};

/**
 * PUT /api/cursos/:id - Atualiza um curso
 */
export const atualizarCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const cursoAtualizado = await Curso.atualizar(id, req.body);
        
        if (!cursoAtualizado) {
            return res.status(404).json({ erro: "Curso não encontrado" });
        }

        res.json(cursoAtualizado);
    } catch (erro) {
        console.error('Erro ao atualizar curso:', erro);
        res.status(500).json({ erro: "Erro ao atualizar curso" });
    }
};

/**
 * DELETE /api/cursos/:id - Exclui um curso
 */
export const deletarCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await Curso.excluir(id);
        
        if (!resultado) {
            return res.status(404).json({ erro: "Curso não encontrado" });
        }

        res.json({ mensagem: "Curso excluído com sucesso" });
    } catch (erro) {
        console.error('Erro ao deletar curso:', erro);
        res.status(500).json({ erro: "Erro ao deletar curso" });
    }
};

/**
 * GET /api/inscricoes/curso/:cursoId - Lista inscrições de um curso
 */
export const getInscricoesPorCurso = async (req, res) => {
    try {
        const { cursoId } = req.params;
        const inscricoes = await Inscricao.buscarPorCurso(cursoId);
        res.json(inscricoes);
    } catch (erro) {
        console.error('Erro ao buscar inscrições:', erro);
        res.status(500).json({ erro: "Erro ao buscar inscrições" });
    }
};

/**
 * POST /api/inscricoes - Cria uma nova inscrição
 */
export const criarInscricao = async (req, res) => {
    try {
        const { curso_id, nome_aluno, email, quantidade_vagas, valor_total, status } = req.body;
        
        if (!curso_id || !nome_aluno || !email || !valor_total) {
            return res.status(400).json({ erro: "Campos obrigatórios: curso_id, nome_aluno, email, valor_total" });
        }

        // Verificar se o curso existe
        const curso = await Curso.buscarPorId(curso_id);
        if (!curso) {
            return res.status(404).json({ erro: "Curso não encontrado" });
        }

        const novaInscricao = await Inscricao.criar({
            curso_id,
            nome_aluno,
            email,
            quantidade_vagas,
            valor_total,
            status
        });

        res.status(201).json(novaInscricao);
    } catch (erro) {
        console.error('Erro ao criar inscrição:', erro);
        res.status(500).json({ erro: "Erro ao criar inscrição" });
    }
};

/**
 * GET /api/estatisticas/inscricoes - Retorna estatísticas de inscrições
 */
export const getEstatisticasInscricoes = async (req, res) => {
    try {
        const stats = await Inscricao.estatisticas();
        res.json(stats);
    } catch (erro) {
        console.error('Erro ao buscar estatísticas:', erro);
        res.status(500).json({ erro: "Erro ao buscar estatísticas" });
    }
};