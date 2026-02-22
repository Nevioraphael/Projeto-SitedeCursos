// Função para calcular o preço total dos cursos
function calcularPrecoTotal() {
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const precoTotalElement = document.getElementById('precoTotal');
    
    if (quantidade > vagasDisponiveis) {
        alert(`Apenas ${vagasDisponiveis} vagas disponíveis!`);
        document.getElementById('quantidade').value = vagasDisponiveis;
        return;
    }
    
    if (quantidade < 1) {
        document.getElementById('quantidade').value = 1;
        return;
    }
    
    const total = quantidade * precoUnitario;
    precoTotalElement.textContent = `R$ ${total.toFixed(2)}`;
}

// Adicionar evento de mudança no input de quantidade
document.addEventListener('DOMContentLoaded', function() {
    const quantidadeInput = document.getElementById('quantidade');
    
    if (quantidadeInput) {
        quantidadeInput.addEventListener('input', calcularPrecoTotal);
        quantidadeInput.addEventListener('change', calcularPrecoTotal);
    }
});

// Função de compra
function comprar() {
    const quantidade = parseInt(document.getElementById('quantidade').value);
    
    if (quantidade > vagasDisponiveis) {
        alert(`Apenas ${vagasDisponiveis} vagas disponíveis!`);
        return;
    }
    
    const total = quantidade * precoUnitario;
    
    alert(`Compra realizada com sucesso!\n\n` +
          `Curso: ${document.querySelector('h2').textContent}\n` +
          `Quantidade: ${quantidade} vaga(s)\n` +
          `Total: R$ ${total.toFixed(2)}\n\n` +
          `Obrigado pela compra!`);
}