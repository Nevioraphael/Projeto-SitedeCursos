// Script para gerenciar cadastro de cursos

async function carregarCursos() {
    try {
        const response = await fetch('/api/cursos');
        const cursos = await response.json();
        exibirTabelaCursos(cursos);
    } catch (error) {
        console.error('Erro ao carregar cursos:', error);
        document.getElementById('mensagem').innerHTML = '<p class="alert alert-danger">Erro ao carregar cursos</p>';
    }
}

function exibirTabelaCursos(cursos) {
    let html = '<table class="table table-striped"><thead><tr><th>ID</th><th>Nome</th><th>Descrição</th><th>Carga Horária</th><th>Ações</th></tr></thead><tbody>';
    
    cursos.forEach(curso => {
        html += `<tr>
            <td>${curso.id}</td>
            <td>${curso.nome}</td>
            <td>${curso.descricao}</td>
            <td>${curso.cargaHoraria}h</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarCurso(${curso.id})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="deletarCurso(${curso.id})">Deletar</button>
            </td>
        </tr>`;
    });
    
    html += '</tbody></table>';
    document.getElementById('espacoTabela').innerHTML = html;
}

async function cadastrarCurso(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;
    const cargahoraria = document.getElementById('cargahoraria').value;
    
    try {
        const response = await fetch('/api/cursos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome,
                descricao,
                cargaHoraria: parseInt(cargahoraria)
            })
        });
        
        if (response.ok) {
            document.getElementById('mensagem').innerHTML = '<p class="alert alert-success">Curso cadastrado com sucesso!</p>';
            document.getElementById('formCurso').reset();
            carregarCursos();
        } else {
            document.getElementById('mensagem').innerHTML = '<p class="alert alert-danger">Erro ao cadastrar curso</p>';
        }
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('mensagem').innerHTML = '<p class="alert alert-danger">Erro ao conectar com o servidor</p>';
    }
}

async function deletarCurso(cursoId) {
    if (!confirm('Tem certeza que deseja deletar este curso?')) return;
    
    try {
        const response = await fetch(`/api/cursos/${cursoId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            document.getElementById('mensagem').innerHTML = '<p class="alert alert-success">Curso deletado com sucesso!</p>';
            carregarCursos();
        } else {
            document.getElementById('mensagem').innerHTML = '<p class="alert alert-danger">Erro ao deletar curso</p>';
        }
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('mensagem').innerHTML = '<p class="alert alert-danger">Erro ao conectar com o servidor</p>';
    }
}

function editarCurso(cursoId) {
    alert('Função de edição em desenvolvimento. ID do curso: ' + cursoId);
}

// Carregar cursos ao abrir a página
document.addEventListener('DOMContentLoaded', () => {
    carregarCursos();
    
    const form = document.getElementById('formCurso');
    if (form) {
        form.addEventListener('submit', cadastrarCurso);
    }
});