import express from 'express';



const host = "0.0.0.0"; //requisições podem vir de todas as interfaces do host local
const porta = 3000; //identifica unica e exclusivamente uma aplicação nesse host
const app = express();

//Todo o conteúdo do direório views/public estará disponível na raiz do servidor
app.use(express.static('./views/public'));

app.post("/login", (requisicao, resposta) =>{
    //precisa extrair os dados da requisição
    const dados = requisicao.body;
    
});
// Iniciar servidor
app.listen(porta, host, () => { //arrow function
    console.log(`Servidor rodando em http://${host}:${porta}`);
}); //javascript aceita funções como parâmetros de outras funções