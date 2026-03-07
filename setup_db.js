import 'dotenv/config';
import mysql from 'mysql2/promise';
import fs from 'fs';

async function executarSetup() {
    let connection;
    try {
        console.log('Executando setup do banco de dados...');

        // Criar conexão direta
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            multipleStatements: true
        });

        // Ler o arquivo setup.sql
        const sql = fs.readFileSync('./db/setup.sql', 'utf8');

        // Executar o SQL completo
        await connection.query(sql);

        console.log('✅ Setup concluído com sucesso!');
    } catch (error) {
        console.error('❌ Erro no setup:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

executarSetup();