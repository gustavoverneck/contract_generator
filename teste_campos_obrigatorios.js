import TemplateService from './src/services/TemplateService.js';

// Teste específico para verificar campos obrigatórios do template de serviços

console.log('=== TESTE: Campos Obrigatórios do Template de Serviços ===\n');

const template = TemplateService.getTemplateById('servico');
console.log('Template encontrado:', template.nome);
console.log('Total de campos:', template.campos.length);

// Separa campos obrigatórios e opcionais
const camposObrigatorios = template.campos.filter(c => !c.opcional);
const camposOpcionais = template.campos.filter(c => c.opcional);

console.log('\n--- CAMPOS OBRIGATÓRIOS ---');
camposObrigatorios.forEach(campo => {
  console.log(`✓ ${campo.nome} (${campo.label}) - Tipo: ${campo.tipo}`);
});

console.log('\n--- CAMPOS OPCIONAIS ---');
camposOpcionais.forEach(campo => {
  console.log(`- ${campo.nome} (${campo.label}) - Tipo: ${campo.tipo || 'text'}`);
});

console.log('\n--- SIMULAÇÃO DE PREENCHIMENTO ---');

// Simula um preenchimento típico
const dadosMinimos = {
  nomeRazao_contratante: 'João Silva',
  cpfCnpj_contratante: '123.456.789-01',
  nomeRazao_contratado: 'Maria Santos',
  cpfCnpj_contratado: '98.765.432/0001-10',
  servico: 'Desenvolvimento de Website',
  valor: 'R$ 5.000,00',
  forma_pagamento: 'pix',
  data: '02/07/2024'
};

console.log('Dados mínimos simulados:');
Object.entries(dadosMinimos).forEach(([campo, valor]) => {
  console.log(`  ${campo}: "${valor}"`);
});

// Verifica se todos os campos obrigatórios estão cobertos
console.log('\n--- VERIFICAÇÃO DE COBERTURA ---');
const camposNaoPreenchidos = camposObrigatorios.filter(campo => 
  !(campo.nome in dadosMinimos)
);

if (camposNaoPreenchidos.length === 0) {
  console.log('✅ Todos os campos obrigatórios estão cobertos nos dados mínimos');
} else {
  console.log('❌ Campos obrigatórios faltando:');
  camposNaoPreenchidos.forEach(campo => {
    console.log(`  - ${campo.nome} (${campo.label})`);
  });
}

// Valida individualmente cada campo obrigatório
console.log('\n--- VALIDAÇÃO INDIVIDUAL ---');

function validarCampoTeste(campo, valor) {
  if (!valor || valor.toString().trim() === '') return false;
  
  if (campo.tipo === 'date') {
    return /^\d{2}\/\d{2}\/\d{4}$/.test(valor);
  }
  
  if (campo.nome.startsWith('cpfCnpj_')) {
    const digits = valor.replace(/\D/g, '');
    return digits.length >= 11;
  }
  
  return true;
}

let todosValidos = true;
camposObrigatorios.forEach(campo => {
  const valor = dadosMinimos[campo.nome];
  const valido = validarCampoTeste(campo, valor);
  const status = valido ? '✅' : '❌';
  console.log(`${status} ${campo.nome}: "${valor}" -> ${valido ? 'VÁLIDO' : 'INVÁLIDO'}`);
  if (!valido) todosValidos = false;
});

console.log('\n=== RESULTADO FINAL ===');
console.log(`Validação geral: ${todosValidos ? '✅ SUCESSO' : '❌ FALHA'}`);

if (todosValidos) {
  console.log('Os dados mínimos deveriam permitir habilitar o botão de preview.');
} else {
  console.log('Há problemas na validação que impedem o botão de preview.');
}
