// Teste das correções na geração de PDF
import TemplateService from './src/services/TemplateService.js';

// Teste com contrato de serviço incluindo campos vazios
const templateServico = TemplateService.getTemplateById('servico');
const camposTeste = {
  nomeRazao_contratante: 'aaaaa',
  cpfCnpj_contratante: '12345678901',
  nomeRazao_contratado: 'bbbbbb',
  cpfCnpj_contratado: '98765432100',
  servico: 'Teste',
  valor: 'R$ 1,00', // Valor já formatado
  data: '2025-07-01',
  prazo: '30 dias',
  // Campos vazios que devem gerar placeholders não substituídos
  multa: '',
  reajuste: ''
};

console.log('Teste com campos vazios:');
const xmlProcessado = TemplateService.fillTemplateXml(templateServico.xmlBase, camposTeste);
console.log(xmlProcessado);

console.log('\n' + '='.repeat(60) + '\n');

// Teste sem campos opcionais
const camposSemOpcionais = {
  nomeRazao_contratante: 'João Silva',
  cpfCnpj_contratante: '12345678901',
  nomeRazao_contratado: 'Maria Santos',
  cpfCnpj_contratado: '98765432100',
  servico: 'Desenvolvimento web',
  valor: 'R$ 5.000,00',
  data: '2025-07-01'
};

console.log('Teste sem campos opcionais:');
const xmlLimpo = TemplateService.fillTemplateXml(templateServico.xmlBase, camposSemOpcionais);
console.log(xmlLimpo);
