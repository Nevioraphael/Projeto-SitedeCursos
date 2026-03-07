import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'cursos_online',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export async function executarQuery(sql, valores = []) {
    const connection = await pool.getConnection();
    try {
        const [resultado] = await connection.execute(sql, valores);
        return resultado;
    } catch (erro) {
        console.error('Erro ao executar query:', erro);
        throw erro;
    } finally {
        connection.release();
    }
}

export default pool;