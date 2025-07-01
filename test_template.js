// Teste simples para verificar a limpeza de campos vazios
import TemplateService from './src/services/TemplateService.js';

// Simula um contrato de serviço com campos vazios
const templateServico = TemplateService.getTemplateById('servico');
const camposComVazios = {
  nomeRazao_contratante: 'João Silva',
  cpfCnpj_contratante: '12345678901',
  nomeRazao_contratado: 'Maria Santos',
  cpfCnpj_contratado: '98765432100',
  servico: 'Desenvolvimento de website',
  valor: '5000,00',
  data: '2025-01-15',
  // Campos opcionais vazios que devem ser removidos
  prazo: '',
  multa: '',
  reajuste: '',
  descricao: '',
  testemunhas: ''
};

console.log('Template original:');
console.log(templateServico.xmlBase);
console.log('\n' + '='.repeat(50) + '\n');

console.log('Resultado após processamento:');
const xmlProcessado = TemplateService.fillTemplateXml(templateServico.xmlBase, camposComVazios);
console.log(xmlProcessado);

// Teste com produto
console.log('\n' + '='.repeat(50) + '\n');
console.log('TESTE PRODUTO:');
const templateProduto = TemplateService.getTemplateById('produto');
const camposProdutoVazios = {
  nomeRazao_vendedor: 'Loja ABC',
  cpfCnpj_vendedor: '12345678000195',
  nomeRazao_comprador: 'Carlos Lima',
  cpfCnpj_comprador: '11122233344',
  produto: 'Notebook Dell',
  valor: '3500,00',
  data: '2025-01-20',
  // Campos vazios
  garantia: '',
  descricao: ''
};

const xmlProdutoProcessado = TemplateService.fillTemplateXml(templateProduto.xmlBase, camposProdutoVazios);
console.log(xmlProdutoProcessado);
