import { executarQuery } from '../../db/connection.js';

class Inscricao {
    /**
     * Carrega todas as inscrições
     */
    static async todas() {
        try {
            const sql = `
                SELECT 
                    id,
                    curso_id,
                    nome_aluno,
                    email,
                    quantidade_vagas,
                    valor_total,
                    status,
                    data_inscricao,
                    criado_em,
                    atualizado_em
                FROM inscricoes
                ORDER BY data_inscricao DESC
            `;
            return await executarQuery(sql);
        } catch (erro) {
            console.error('Erro ao ler inscrições:', erro);
            return [];
        }
    }

    /**
     * Busca uma inscrição pelo ID
     */
    static async buscarPorId(id) {
        try {
            const sql = `
                SELECT * FROM inscricoes
                WHERE id = ?
            `;
            const resultado = await executarQuery(sql, [id]);
            return resultado.length > 0 ? resultado[0] : null;
        } catch (erro) {
            console.error('Erro ao buscar inscrição:', erro);
            return null;
        }
    }

    /**
     * Busca inscrições de um aluno
     */
    static async buscarPorEmail(email) {
        try {
            const sql = `
                SELECT * FROM inscricoes
                WHERE email = ?
                ORDER BY data_inscricao DESC
            `;
            return await executarQuery(sql, [email]);
        } catch (erro) {
            console.error('Erro ao buscar inscrições por email:', erro);
            return [];
        }
    }

    /**
     * Busca inscrições de um curso
     */
    static async buscarPorCurso(cursoId) {
        try {
            const sql = `
                SELECT * FROM inscricoes
                WHERE curso_id = ?
                ORDER BY data_inscricao DESC
            `;
            return await executarQuery(sql, [cursoId]);
        } catch (erro) {
            console.error('Erro ao buscar inscrições por curso:', erro);
            return [];
        }
    }

    /**
     * Cria uma nova inscrição
     */
    static async criar(inscricao) {
        try {
            const sql = `
                INSERT INTO inscricoes 
                (curso_id, nome_aluno, email, quantidade_vagas, valor_total, status, data_inscricao)
                VALUES (?, ?, ?, ?, ?, ?, NOW())
            `;
            
            const valores = [
                inscricao.curso_id,
                inscricao.nome_aluno,
                inscricao.email,
                inscricao.quantidade_vagas || 1,
                inscricao.valor_total,
                inscricao.status || 'pendente'
            ];

            const resultado = await executarQuery(sql, valores);
            return {
                id: resultado.insertId,
                ...inscricao
            };
        } catch (erro) {
            console.error('Erro ao criar inscrição:', erro);
            throw erro;
        }
    }

    /**
     * Atualiza o status de uma inscrição
     */
    static async atualizarStatus(id, novoStatus) {
        try {
            const sql = `
                UPDATE inscricoes
                SET status = ?, atualizado_em = NOW()
                WHERE id = ?
            `;
            const resultado = await executarQuery(sql, [novoStatus, id]);
            return resultado.affectedRows > 0;
        } catch (erro) {
            console.error('Erro ao atualizar status:', erro);
            throw erro;
        }
    }

    /**
     * Atualiza uma inscrição completa
     */
    static async atualizar(id, dados) {
        try {
            const sql = `
                UPDATE inscricoes
                SET 
                    nome_aluno = COALESCE(?, nome_aluno),
                    email = COALESCE(?, email),
                    quantidade_vagas = COALESCE(?, quantidade_vagas),
                    valor_total = COALESCE(?, valor_total),
                    status = COALESCE(?, status),
                    atualizado_em = NOW()
                WHERE id = ?
            `;

            const valores = [
                dados.nome_aluno || null,
                dados.email || null,
                dados.quantidade_vagas || null,
                dados.valor_total || null,
                dados.status || null,
                id
            ];

            const resultado = await executarQuery(sql, valores);
            return resultado.affectedRows > 0;
        } catch (erro) {
            console.error('Erro ao atualizar inscrição:', erro);
            throw erro;
        }
    }

    /**
     * Deleta uma inscrição
     */
    static async deletar(id) {
        try {
            const sql = `DELETE FROM inscricoes WHERE id = ?`;
            const resultado = await executarQuery(sql, [id]);
            return resultado.affectedRows > 0;
        } catch (erro) {
            console.error('Erro ao deletar inscrição:', erro);
            throw erro;
        }
    }

    /**
     * Retorna estatísticas de inscrições
     */
    static async estatisticas() {
        try {
            const sql = `
                SELECT 
                    COUNT(*) as total_inscricoes,
                    SUM(CASE WHEN status = 'confirmada' THEN 1 ELSE 0 END) as confirmadas,
                    SUM(CASE WHEN status = 'pendente' THEN 1 ELSE 0 END) as pendentes,
                    SUM(CASE WHEN status = 'cancelada' THEN 1 ELSE 0 END) as canceladas,
                    SUM(valor_total) as receita_total,
                    SUM(CASE WHEN status = 'confirmada' THEN valor_total ELSE 0 END) as receita_confirmada
                FROM inscricoes
            `;
            const resultado = await executarQuery(sql);
            return resultado[0];
        } catch (erro) {
            console.error('Erro ao buscar estatísticas:', erro);
            return null;
        }
    }

    /**
     * Retorna inscrições por status
     */
    static async porStatus(status) {
        try {
            const sql = `
                SELECT * FROM inscricoes
                WHERE status = ?
                ORDER BY data_inscricao DESC
            `;
            return await executarQuery(sql, [status]);
        } catch (erro) {
            console.error('Erro ao buscar inscrições por status:', erro);
            return [];
        }
    }
}

export default Inscricao;