//GERENCIAMENTO DE CURSOS
 
// Variável para armazenar ID do curso em edição
let cursoEmEdicao = null;

//SEÇÃO 1: CARREGAR E EXIBIR CURSOS

async function carregarCursos() {
    try {
        const response = await fetch('/api/cursos');
        if (!response.ok) throw new Error('Erro ao carregar cursos');
        
        const cursos = await response.json();
        exibirTabelaCursos(cursos);
    } catch (error) {
        console.error('Erro ao carregar cursos:', error);
        document.getElementById('espacoTabela').innerHTML = '<p class="alert alert-danger"><i class="bi bi-exclamation-triangle"></i> Erro ao carregar cursos. Tente novamente.</p>';
    }
}

//Exibe os cursos em uma tabela com opções de editar e deletar
function exibirTabelaCursos(cursos) {
    if (cursos.length === 0) {
        document.getElementById('espacoTabela').innerHTML = '<p class="alert alert-info text-center"><i class="bi bi-info-circle"></i> Nenhum curso cadastrado ainda.</p>';
        return;
    }
    
    let html = `<div class="table-responsive mt-4">
        <table class="table table-striped table-hover align-middle">
            <thead class="table-dark">
                <tr>
                    <th>#ID</th>
                    <th>Nome</th>
                    <th>Instrutor</th>
                    <th class="text-center">Nível</th>
                    <th class="text-center">Preço</th>
                    <th class="text-center">Vagas</th>
                    <th class="text-center">Ações</th>
                </tr>
            </thead>
            <tbody>`;
    
    cursos.forEach(curso => {
        const preco = parseFloat(curso.preco || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const nivel = curso.nivel || 'N/A';
        
        html += `<tr id="row-${curso.id}">
            <td><span class="badge bg-secondary">${curso.id}</span></td>
            <td><strong>${curso.nome}</strong></td>
            <td>${curso.instrutor || 'N/A'}</td>
            <td class="text-center">
                <span class="badge bg-${getNivelBadgeClass(nivel)}">${nivel}</span>
            </td>
            <td class="text-center"><strong>${preco}</strong></td>
            <td class="text-center">
                <span class="badge bg-success">${curso.vagas_disponiveis || 0}</span>
            </td>
            <td class="text-center">
                <div class="btn-group btn-group-sm" role="group">
                    <button class="btn btn-warning" onclick="preencherFormularioEdicao(${curso.id})" title="Editar curso" data-toggle="tooltip">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deletarCurso(${curso.id})" title="Deletar curso" data-toggle="tooltip">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>`;
    });
    
    html += `</tbody></table></div>`;
    document.getElementById('espacoTabela').innerHTML = html;
}

/**
 * Define a classe de badge baseado no nível do curso
 */
function getNivelBadgeClass(nivel) {
    const niveis = {
        'iniciante': 'info',
        'intermediario': 'warning',
        'avancado': 'danger'
    };
    return niveis[nivel] || 'secondary';
}

//SEÇÃO 2: CADASTRAR NOVO CURSO

async function cadastrarCurso(event) {
    event.preventDefault();
    
    // Validação básica
    if (!document.getElementById('formCurso').checkValidity() === false) {
        event.stopPropagation();
    }
    
    // Se está em modo edição, atualizar em vez de criar
    if (cursoEmEdicao) {
        atualizarCurso();
        return;
    }
    
    // Coletar dados do formulário
    const dadosCurso = {
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value,
        instrutor: document.getElementById('instrutor').value,
        carga_horaria: parseInt(document.getElementById('carga_horaria').value),
        duracao: document.getElementById('duracao').value,
        preco: parseFloat(document.getElementById('preco').value),
        vagas_disponiveis: parseInt(document.getElementById('vagas_disponiveis').value),
        data_inicio: document.getElementById('data_inicio').value,
        nivel: document.getElementById('nivel').value,
        imagem: document.getElementById('imagem').value || '/images/default.jpg'
    };
    
    try {
        const response = await fetch('/api/cursos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosCurso)
        });
        
        if (response.ok) {
            const novoCurso = await response.json();
            mostrarMensagem('success', `✓ Curso "${novoCurso.nome}" cadastrado com sucesso!`);
            document.getElementById('formCurso').reset();
            carregarCursos();
            setTimeout(() => limparFormulario(), 1500);
        } else {
            const erro = await response.json();
            mostrarMensagem('danger', `✗ Erro: ${erro.erro || 'Erro ao cadastrar curso'}`);
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('danger', '✗ Erro ao conectar com o servidor');
    }
}

//SEÇÃO 3: EDITAR CURSO

async function preencherFormularioEdicao(cursoId) {
    try {
        const response = await fetch(`/api/cursos/${cursoId}`);
        if (!response.ok) throw new Error('Curso não encontrado');
        
        const curso = await response.json();
        
        // Preencher formulário com dados do curso
        document.getElementById('nome').value = curso.nome;
        document.getElementById('descricao').value = curso.descricao;
        document.getElementById('instrutor').value = curso.instrutor;
        document.getElementById('carga_horaria').value = curso.carga_horaria;
        document.getElementById('duracao').value = curso.duracao;
        document.getElementById('preco').value = curso.preco;
        document.getElementById('vagas_disponiveis').value = curso.vagas_disponiveis;
        document.getElementById('data_inicio').value = curso.data_inicio;
        document.getElementById('nivel').value = curso.nivel;
        document.getElementById('imagem').value = curso.imagem;
        
        // Modo edição
        cursoEmEdicao = cursoId;
        document.getElementById('cadastrar').style.display = 'none';
        document.getElementById('atualizar').style.display = 'inline-block';
        document.getElementById('excluir').style.display = 'inline-block';
        
        // Scroll para o formulário
        document.getElementById('formCurso').scrollIntoView({ behavior: 'smooth' });
        mostrarMensagem('info', `ℹ Editando curso ID #${cursoId}`);
        
    } catch (error) {
        console.error('Erro ao carregar curso:', error);
        mostrarMensagem('danger', '✗ Erro ao carregar dados do curso');
    }
}

//Atualizar curso existente

async function atualizarCurso() {
    if (!cursoEmEdicao) {
        mostrarMensagem('danger', '✗ Nenhum curso selecionado para edição');
        return;
    }
    
    const dadosCurso = {
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value,
        instrutor: document.getElementById('instrutor').value,
        carga_horaria: parseInt(document.getElementById('carga_horaria').value),
        duracao: document.getElementById('duracao').value,
        preco: parseFloat(document.getElementById('preco').value),
        vagas_disponiveis: parseInt(document.getElementById('vagas_disponiveis').value),
        data_inicio: document.getElementById('data_inicio').value,
        nivel: document.getElementById('nivel').value,
        imagem: document.getElementById('imagem').value
    };
    
    try {
        const response = await fetch(`/api/cursos/${cursoEmEdicao}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosCurso)
        });
        
        if (response.ok) {
            const cursoAtualizado = await response.json();
            mostrarMensagem('success', `✓ Curso "${cursoAtualizado.nome}" atualizado com sucesso!`);
            limparFormulario();
            carregarCursos();
            setTimeout(() => limparMensagem(), 2000);
        } else {
            const erro = await response.json();
            mostrarMensagem('danger', `✗ Erro: ${erro.erro || 'Erro ao atualizar curso'}`);
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('danger', '✗ Erro ao conectar com o servidor');
    }
}

//SEÇÃO 4: DELETAR CURSO
async function deletarCurso(cursoId) {
    // Confirmação de segurança
    if (!confirm('⚠️ Tem certeza que deseja DELETAR este curso?\\n\\nEsta ação não pode ser desfeita!')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/cursos/${cursoId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            // Remover linha da tabela com animação
            const row = document.getElementById(`row-${cursoId}`);
            if (row) {
                row.style.opacity = '0.5';
                row.style.textDecoration = 'line-through';
            }
            
            mostrarMensagem('success', '✓ Curso deletado com sucesso!');
            
            setTimeout(() => {
                carregarCursos();
                limparFormulario();
            }, 500);
        } else {
            const erro = await response.json();
            mostrarMensagem('danger', `✗ Erro: ${erro.erro || 'Erro ao deletar curso'}`);
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('danger', '✗ Erro ao conectar com o servidor');
    }
}

//SEÇÃO 5: FUNÇÕES AUXILIARES

/**
 * Obter parâmetro da URL
 */
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * Exibe mensagem de feedback ao usuário
 */
function mostrarMensagem(tipo, mensagem) {
    const msgDiv = document.getElementById('mensagem');
    if (!msgDiv) return;
    
    const alertClass = `alert alert-${tipo === 'danger' ? 'danger' : tipo === 'success' ? 'success' : tipo === 'warning' ? 'warning' : 'info'}`;
    msgDiv.innerHTML = `<div class="${alertClass} alert-dismissible fade show" role="alert">
        ${mensagem}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
}

/**
 * Limpa mensagens
 */
function limparMensagem() {
    const msgDiv = document.getElementById('mensagem');
    if (msgDiv) msgDiv.innerHTML = '';
}

/**
 * Limpa formulário e volta ao modo cadastro
 */
function limparFormulario() {
    cursoEmEdicao = null;
    document.getElementById('formCurso').reset();
    document.getElementById('cadastrar').style.display = 'inline-block';
    document.getElementById('atualizar').style.display = 'none';
    document.getElementById('excluir').style.display = 'none';
    limparMensagem();
}

/**
 * INICIALIZAÇÃO
 */
document.addEventListener('DOMContentLoaded', () => {
    // Carregar cursos ao abrir a página
    carregarCursos();
    
    // Verificar se há edição via URL
    const editId = getUrlParameter('edit');
    if (editId) {
        preencherFormularioEdicao(editId);
    }
    
    // Evento do formulário
    const form = document.getElementById('formCurso');
    if (form) {
        form.addEventListener('submit', cadastrarCurso);
    }
    
    // Botão de excluir
    const btnExcluir = document.getElementById('excluir');
    if (btnExcluir) {
        btnExcluir.addEventListener('click', () => {
            if (cursoEmEdicao) {
                deletarCurso(cursoEmEdicao);
            }
        });
    }
});