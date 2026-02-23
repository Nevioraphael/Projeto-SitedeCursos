// Obter ID do curso da URL
const pathParts = window.location.pathname.split('/');
const cursoId = pathParts[pathParts.length - 1];

// Carregar dados do curso
fetch(`/api/curso/${cursoId}`)
    .then(response => response.json())
    .then(curso => {
        if (!curso.error) {
            exibirDetalhesCurso(curso);
        } else {
            window.location.href = '/';
        }
    });

function exibirDetalhesCurso(curso) {
    const container = document.querySelector('.curso-detalhes-container');
    
    container.innerHTML = `
        <div class="curso-detalhes-card">
            <div class="curso-detalhes-header">
                <h2>${curso.nome}</h2>
                <span class="nivel ${curso.nivel.toLowerCase()}">${curso.nivel}</span>
            </div>
            
            <div class="curso-detalhes-body">
                <div class="curso-info">
                    <p><strong>Descrição:</strong> ${curso.descricao}</p>
                    <p><strong>Instrutor:</strong> ${curso.instrutor}</p>
                    <p><strong>Data de Início:</strong> ${curso.dataInicio}</p>
                    <p><strong>Duração:</strong> ${curso.duracao}</p>
                    <p><strong>Carga Horária:</strong> ${curso.cargaHoraria}</p>
                    <p><strong>Vagas Disponíveis:</strong> <span id="vagas-disponiveis">${curso.vagas}</span></p>
                    <p><strong>Preço por vaga:</strong> R$ ${curso.preco.toFixed(2)}</p>
                </div>
                
                <div class="curso-compra">
                    <h3>Comprar Curso</h3>
                    
                    <div class="form-group">
                        <label for="quantidade">Quantidade de vagas:</label>
                        <input type="number" 
                               id="quantidade" 
                               min="1" 
                               max="${curso.vagas}" 
                               value="1"
                               onchange="calcularTotal(${curso.preco}, ${curso.vagas})">
                    </div>
                    
                    <div class="valor-total">
                        <p><strong>Valor Total:</strong> R$ <span id="valor-total">${curso.preco.toFixed(2)}</span></p>
                    </div>
                    
                    <button class="btn-comprar" onclick="comprarCurso(${curso.id})">
                        Finalizar Compra
                    </button>
                </div>
            </div>
        </div>
    `;
}

function calcularTotal(preco, vagasDisponiveis) {
    const quantidade = parseInt(document.getElementById('quantidade').value) || 1;
    const maxVagas = vagasDisponiveis;
    
    if (quantidade > maxVagas) {
        alert(`Apenas ${maxVagas} vaga(s) disponível(is)!`);
        document.getElementById('quantidade').value = maxVagas;
        document.getElementById('valor-total').textContent = (preco * maxVagas).toFixed(2);
    } else if (quantidade < 1) {
        document.getElementById('quantidade').value = 1;
        document.getElementById('valor-total').textContent = preco.toFixed(2);
    } else {
        const total = preco * quantidade;
        document.getElementById('valor-total').textContent = total.toFixed(2);
    }
}

function comprarCurso(cursoId) {
    const quantidade = document.getElementById('quantidade').value;
    const total = document.getElementById('valor-total').textContent;
    
    alert(`Compra realizada com sucesso!\nCurso ID: ${cursoId}\nQuantidade: ${quantidade}\nValor Total: R$ ${total}`);
    // Aqui seria implementada a lógica real de compra
}