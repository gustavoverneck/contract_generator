// Teste rápido para verificar validação de campos obrigatórios

console.log('=== TESTE: Validação de Campos Obrigatórios ===\n');

// Simula validação de data
function testarValidacaoData(valor) {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  return regex.test(valor);
}

// Simula validação de CPF/CNPJ
function testarValidacaoCpfCnpj(valor) {
  const digits = valor.replace(/\D/g, '');
  return digits.length >= 11;
}

// Testes
const testeCases = [
  { tipo: 'date', valor: '02/07/2024', esperado: true },
  { tipo: 'date', valor: '2024-07-02', esperado: false },
  { tipo: 'date', valor: '', esperado: false },
  { tipo: 'date', valor: '02/07/24', esperado: false },
  { tipo: 'cpfCnpj', valor: '123.456.789-01', esperado: true },
  { tipo: 'cpfCnpj', valor: '12.345.678/0001-99', esperado: true },
  { tipo: 'cpfCnpj', valor: '12345678901', esperado: true },
  { tipo: 'cpfCnpj', valor: '1234567890', esperado: false },
  { tipo: 'cpfCnpj', valor: '', esperado: false }
];

console.log('Testando validações:');
testeCases.forEach(test => {
  let resultado;
  if (test.tipo === 'date') {
    resultado = testarValidacaoData(test.valor);
  } else if (test.tipo === 'cpfCnpj') {
    resultado = testarValidacaoCpfCnpj(test.valor);
  }
  
  const status = resultado === test.esperado ? 'OK' : 'ERRO';
  console.log(`${test.tipo} "${test.valor}" -> ${resultado} (esperado: ${test.esperado}) [${status}]`);
});

console.log('\n=== RESULTADO ===');
const erros = testeCases.filter(test => {
  let resultado;
  if (test.tipo === 'date') {
    resultado = testarValidacaoData(test.valor);
  } else if (test.tipo === 'cpfCnpj') {
    resultado = testarValidacaoCpfCnpj(test.valor);
  }
  return resultado !== test.esperado;
});

if (erros.length === 0) {
  console.log('✅ Todas as validações estão funcionando corretamente');
} else {
  console.log(`❌ ${erros.length} validações falharam`);
  erros.forEach(erro => console.log(`  - ${erro.tipo}: "${erro.valor}"`));
}
