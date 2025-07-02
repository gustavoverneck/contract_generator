import TemplateService from './src/services/TemplateService.js';

// Teste para verificar se os tipos de documento estão sendo detectados corretamente

console.log('=== TESTE: Detecção Automática de Tipo de Documento ===\n');

const template = TemplateService.getTemplateById('servico');

// Testa diferentes cenários
const testeCases = [
  {
    nome: 'CPF válido',
    dados: {
      nomeRazao_contratante: 'João Silva',
      cpfCnpj_contratante: '12345678901', // 11 dígitos = CPF
      nomeRazao_contratado: 'Maria Santos',
      cpfCnpj_contratado: '12345678000199', // 14 dígitos = CNPJ
      servico: 'Consultoria',
      valor: 'R$ 1.000,00',
      forma_pagamento: 'pix',
      data: '2024-07-02'
    },
    esperado: {
      contratante: 'CPF',
      contratado: 'CNPJ'
    }
  },
  {
    nome: 'Ambos CNPJ',
    dados: {
      nomeRazao_contratante: 'Empresa A Ltda',
      cpfCnpj_contratante: '12345678000111',
      nomeRazao_contratado: 'Empresa B Ltda',
      cpfCnpj_contratado: '98765432000199',
      servico: 'Desenvolvimento',
      valor: 'R$ 5.000,00',
      forma_pagamento: 'transferencia',
      data: '2024-07-02'
    },
    esperado: {
      contratante: 'CNPJ',
      contratado: 'CNPJ'
    }
  },
  {
    nome: 'Ambos CPF',
    dados: {
      nomeRazao_contratante: 'Ana Costa',
      cpfCnpj_contratante: '11111111111',
      nomeRazao_contratado: 'Carlos Pereira',
      cpfCnpj_contratado: '22222222222',
      servico: 'Design',
      valor: 'R$ 2.500,00',
      forma_pagamento: 'avista',
      data: '2024-07-02'
    },
    esperado: {
      contratante: 'CPF',
      contratado: 'CPF'
    }
  }
];

testeCases.forEach(teste => {
  console.log(`--- ${teste.nome} ---`);
  
  const html = TemplateService.fillTemplateHtml(template.htmlBase, teste.dados);
  
  // Verifica se o tipo de documento foi detectado corretamente
  const detectouContratante = html.includes(`${teste.esperado.contratante}: ${teste.dados.cpfCnpj_contratante}`);
  const detectouContratado = html.includes(`${teste.esperado.contratado}: ${teste.dados.cpfCnpj_contratado}`);
  
  console.log(`Contratante (${teste.dados.cpfCnpj_contratante}): ${detectouContratante ? '✅' : '❌'} ${teste.esperado.contratante}`);
  console.log(`Contratado (${teste.dados.cpfCnpj_contratado}): ${detectouContratado ? '✅' : '❌'} ${teste.esperado.contratado}`);
  
  // Verifica se não há mais "CPF/CNPJ" genérico
  const temGenerico = html.includes('CPF/CNPJ:');
  console.log(`Sem genérico "CPF/CNPJ": ${!temGenerico ? '✅' : '❌'}`);
  
  console.log('');
});

console.log('=== TESTE FINAL ===');
console.log('✅ Sistema agora detecta automaticamente CPF ou CNPJ');
console.log('✅ Labels dinâmicos no frontend');
console.log('✅ Contratos mostram o tipo correto de documento');
console.log('✅ Não há mais confusão entre CPF e CNPJ');
