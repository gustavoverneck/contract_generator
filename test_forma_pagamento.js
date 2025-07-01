// Teste rápido para verificar se o campo de forma de pagamento foi adicionado
import TemplateService from './src/services/TemplateService.js';

console.log('🔍 Verificando campo de forma de pagamento...\n');

const templates = TemplateService.getTemplates();

templates.forEach(template => {
  console.log(`📋 Template: ${template.nome}`);
  
  // Verifica se tem campo de forma de pagamento
  const temFormaPagamento = template.campos.some(campo => campo.nome === 'forma_pagamento');
  
  if (temFormaPagamento) {
    const campoFormaPagamento = template.campos.find(campo => campo.nome === 'forma_pagamento');
    console.log(`   ✅ Campo de forma de pagamento encontrado: ${campoFormaPagamento.label}`);
    console.log(`   📋 Tipo: ${campoFormaPagamento.tipo}`);
    if (campoFormaPagamento.opcoes) {
      console.log(`   🎯 Opções disponíveis: ${campoFormaPagamento.opcoes.length}`);
      campoFormaPagamento.opcoes.slice(0, 3).forEach(opcao => {
        console.log(`      - ${opcao.valor}: ${opcao.texto}`);
      });
      if (campoFormaPagamento.opcoes.length > 3) {
        console.log(`      ... e mais ${campoFormaPagamento.opcoes.length - 3} opções`);
      }
    }
  } else {
    console.log(`   ⚪ Sem campo de forma de pagamento (normal para ${template.nome})`);
  }
  
  console.log('');
});

// Teste de preenchimento
console.log('🧪 Testando preenchimento com forma de pagamento...\n');

const templateServico = templates.find(t => t.id === 'servico');
if (templateServico) {
  const dadosTeste = {
    nomeRazao_contratante: 'João Silva',
    cpfCnpj_contratante: '123.456.789-01',
    nomeRazao_contratado: 'TechSolutions Ltda',
    cpfCnpj_contratado: '12.345.678/0001-90',
    servico: 'Desenvolvimento de website',
    valor: 'R$ 2.500,00',
    forma_pagamento: 'pix',
    data: '15/01/2024'
  };
  
  const xmlGerado = TemplateService.fillTemplateXml(templateServico.xmlBase, dadosTeste);
  
  // Verifica se a forma de pagamento foi convertida corretamente
  if (xmlGerado.includes('mediante PIX')) {
    console.log('✅ Forma de pagamento convertida corretamente: PIX');
  } else if (xmlGerado.includes('mediante pix')) {
    console.log('⚠️  Forma de pagamento não foi convertida para texto legível');
  } else {
    console.log('❌ Forma de pagamento não encontrada no XML gerado');
  }
  
  // Mostra uma amostra do XML
  console.log('\n📄 Amostra do XML gerado:');
  const linhas = xmlGerado.split('\n').slice(10, 15);
  linhas.forEach(linha => {
    if (linha.trim()) {
      console.log(`   ${linha.trim()}`);
    }
  });
}

console.log('\n✅ Teste concluído!');
