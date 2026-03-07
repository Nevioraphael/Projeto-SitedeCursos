import { executarQuery } from '../../db/connection.js';

class Curso {
    /**
     * Carrega todos os cursos do banco de dados
     */
    static async todos() {
        try {
            const sql = `
                SELECT 
                    id,
                    nome,
                    descricao,
                    data_inicio,
                    duracao,
                    preco,
                    carga_horaria,
                    instrutor,
                    nivel,
                    vagas_disponiveis,
                    imagem,
                    ativo,
                    criado_em,
                    atualizado_em
                FROM cursos
                WHERE ativo = 1
                ORDER BY data_inicio
            `;
            return await executarQuery(sql);
        } catch (erro) {
            console.error('Erro ao ler cursos:', erro);
            return [];
        }
    }

    /**
     * Busca um curso pelo ID
     */
    static async buscarPorId(id) {
        try {
            const sql = `
                SELECT 
                    id,
                    nome,
                    descricao,
                    data_inicio,
                    duracao,
                    preco,
                    carga_horaria,
                    instrutor,
                    nivel,
                    vagas_disponiveis,
                    imagem,
                    ativo,
                    criado_em,
                    atualizado_em
                FROM cursos
                WHERE id = ? AND ativo = 1
            `;
            const resultado = await executarQuery(sql, [id]);
            return resultado.length > 0 ? resultado[0] : null;
        } catch (erro) {
            console.error('Erro ao buscar curso:', erro);
            return null;
        }
    }

    /**
     * Salva um novo curso
     */
    static async salvar(curso) {
        try {
            const sql = `
                INSERT INTO cursos 
                (nome, descricao, data_inicio, duracao, preco, carga_horaria, instrutor, nivel, vagas_disponiveis, imagem, ativo)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
            `;
            
            const valores = [
                curso.nome,
                curso.descricao,
                curso.data_inicio || new Date().toISOString().split('T')[0],
                curso.duracao || 'A definir',
                curso.preco || 0,
                curso.carga_horaria || 0,
                curso.instrutor || 'A definir',
                curso.nivel || 'iniciante',
                curso.vagas_disponiveis || 0,
                curso.imagem || '/images/default.jpg'
            ];

            const resultado = await executarQuery(sql, valores);
            return {
                id: resultado.insertId,
                ...curso
            };
        } catch (erro) {
            console.error('Erro ao criar curso:', erro);
            throw erro;
        }
    }

    /**
     * Atualiza um curso existente
     */
    static async atualizar(id, dados) {
        try {
            const sql = `
                UPDATE cursos
                SET 
                    nome = COALESCE(?, nome),
                    descricao = COALESCE(?, descricao),
                    data_inicio = COALESCE(?, data_inicio),
                    duracao = COALESCE(?, duracao),
                    preco = COALESCE(?, preco),
                    carga_horaria = COALESCE(?, carga_horaria),
                    instrutor = COALESCE(?, instrutor),
                    nivel = COALESCE(?, nivel),
                    vagas_disponiveis = COALESCE(?, vagas_disponiveis),
                    imagem = COALESCE(?, imagem),
                    atualizado_em = NOW()
                WHERE id = ? AND ativo = 1
            `;

            const valores = [
                dados.nome || null,
                dados.descricao || null,
                dados.data_inicio || null,
                dados.duracao || null,
                dados.preco || null,
                dados.carga_horaria || null,
                dados.instrutor || null,
                dados.nivel || null,
                dados.vagas_disponiveis || null,
                dados.imagem || null,
                id
            ];

            const resultado = await executarQuery(sql, valores);
            
            if (resultado.affectedRows > 0) {
                return await this.buscarPorId(id);
            }
            return null;
        } catch (erro) {
            console.error('Erro ao atualizar curso:', erro);
            throw erro;
        }
    }

    /**
     * Exclui um curso (soft delete)
     */
    static async excluir(id) {
        try {
            const sql = `UPDATE cursos SET ativo = 0, atualizado_em = NOW() WHERE id = ?`;
            const resultado = await executarQuery(sql, [id]);
            return resultado.affectedRows > 0;
        } catch (erro) {
            console.error('Erro ao deletar curso:', erro);
            throw erro;
        }
    }

    /**
     * Busca cursos por nível
     */
    static async buscarPorNivel(nivel) {
        try {
            const sql = `
                SELECT * FROM cursos
                WHERE nivel = ? AND ativo = 1
                ORDER BY data_inicio
            `;
            return await executarQuery(sql, [nivel]);
        } catch (erro) {
            console.error('Erro ao buscar cursos por nível:', erro);
            return [];
        }
    }

    /**
     * Busca cursos por instrutor
     */
    static async buscarPorInstrutor(instrutor) {
        try {
            const sql = `
                SELECT * FROM cursos
                WHERE instrutor = ? AND ativo = 1
                ORDER BY data_inicio
            `;
            return await executarQuery(sql, [instrutor]);
        } catch (erro) {
            console.error('Erro ao buscar cursos por instrutor:', erro);
            return [];
        }
    }

    /**
     * Retorna estatísticas dos cursos
     */
    static async estatisticas() {
        try {
            const sql = `
                SELECT 
                    COUNT(*) as total_cursos,
                    SUM(vagas_disponiveis) as total_vagas,
                    MIN(preco) as preco_minimo,
                    MAX(preco) as preco_maximo,
                    AVG(preco) as preco_medio
                FROM cursos
                WHERE ativo = 1
            `;
            const resultado = await executarQuery(sql);
            return resultado[0];
        } catch (erro) {
            console.error('Erro ao buscar estatísticas:', erro);
            return null;
        }
    }
}

export default Curso;