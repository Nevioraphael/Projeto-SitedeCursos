// Script para gerenciar cursos

// Função para obter parâmetro da URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Carregar detalhes do curso na página de detalhes
async function carregarDetalhesCurso() {
    const cursoId = getUrlParameter('id');
    if (!cursoId) {
        document.querySelector('.detalhes-card').innerHTML = '<p>Curso não encontrado.</p>';
        return;
    }

    try {
        const response = await fetch(`/api/cursos/${cursoId}`);
        if (!response.ok) {
            throw new Error('Curso não encontrado');
        }

        const curso = await response.json();

        // Preencher os dados
        document.getElementById('curso-instrutor').textContent = curso.instrutor;
        document.getElementById('curso-nivel').textContent = curso.nivel;
        document.getElementById('curso-duracao').textContent = curso.carga_horaria;
        document.getElementById('curso-vagas').textContent = curso.vagas_disponiveis;
        document.getElementById('curso-desc').textContent = curso.descricao;

        const preco = parseFloat(curso.preco);
        document.getElementById('preco-display').textContent = `R$ ${preco.toFixed(2).replace('.', ',')}`;

        // Atualizar total inicial
        atualizarTotal(preco);

        // Configurar eventos
        document.getElementById('qtd-vagas').addEventListener('input', () => atualizarTotal(preco));
        document.querySelector('.btn-comprar').addEventListener('click', () => finalizarCompra(curso.id, preco));

    } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
        document.querySelector('.detalhes-card').innerHTML = '<p>Erro ao carregar detalhes do curso.</p>';
    }
}

// Atualizar valor total
function atualizarTotal(precoUnitario) {
    const quantidade = parseInt(document.getElementById('qtd-vagas').value) || 1;
    const total = precoUnitario * quantidade;
    document.getElementById('valor-total').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Finalizar compra
async function finalizarCompra(cursoId, precoUnitario) {
    const nomeAlunoInput = document.getElementById('nome-aluno');
    const emailAlunoInput = document.getElementById('email-aluno');
    const nomeAluno = nomeAlunoInput ? nomeAlunoInput.value.trim() : '';
    const emailAluno = emailAlunoInput ? emailAlunoInput.value.trim() : '';
    const quantidade = parseInt(document.getElementById('qtd-vagas').value) || 1;

    if (!nomeAluno || !emailAluno) {
        alert('Por favor, preencha nome e email para finalizar a inscrição.');
        return;
    }

    try {
        const response = await fetch('/api/inscricoes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                curso_id: cursoId,
                nome_aluno: nomeAluno,
                email: emailAluno,
                quantidade_vagas: quantidade,
                valor_total: precoUnitario * quantidade
            })
        });

        if (response.ok) {
            alert('Inscrição realizada com sucesso!');
            window.location.href = '/index.html';
        } else {
            const error = await response.json();
            alert('Erro ao realizar inscrição: ' + (error.erro || 'Erro desconhecido'));
        }
    } catch (error) {
        console.error('Erro na inscrição:', error);
        alert('Erro ao conectar com o servidor.');
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se estamos na página de detalhes
    if (document.getElementById('curso-instrutor')) {
        carregarDetalhesCurso();
    }
});
// busca e exibe total de inscrições de um curso
async function carregarInscricoes(cursoId) {
    try {
        const resp = await fetch(`/api/inscricoes/curso/${cursoId}`);
        const inscricoes = await resp.json();
        document.getElementById('curso-inscricoes').textContent = inscricoes.length;
    } catch (err) {
        console.error('Erro ao carregar inscrições:', err);
    }
}