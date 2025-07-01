// Script para testar templates com campos opcionais vazios
import TemplateService from './src/services/TemplateService.js';

console.log('🔍 Testando templates com campos opcionais vazios...\n');

const templates = TemplateService.getTemplates();

// Dados apenas com campos obrigatórios preenchidos
const dadosMinimos = {
  // Dados básicos obrigatórios
  data: '2024-01-15',
  data_inicio: '2024-01-15',
  data_fim: '2024-12-15',
  valor: 'R$ 1.500,00',
  valor_bolsa: 'R$ 800,00',
  
  // Pessoas - apenas campos obrigatórios
  nomeRazao_contratante: 'João Silva Santos',
  cpfCnpj_contratante: '123.456.789-01',
  nomeRazao_contratado: 'Empresa ABC Ltda',
  cpfCnpj_contratado: '12.345.678/0001-90',
  nomeRazao_vendedor: 'Maria dos Santos',
  cpfCnpj_vendedor: '987.654.321-00',
  nomeRazao_comprador: 'Pedro Oliveira',
  cpfCnpj_comprador: '111.222.333-44',
  nomeRazao_locador: 'Imobiliária XYZ Ltda',
  cpfCnpj_locador: '98.765.432/0001-10',
  nomeRazao_locatario: 'Carlos Silva',
  cpfCnpj_locatario: '555.666.777-88',
  nomeRazao_parceiro1: 'Tech Solutions Ltda',
  cpfCnpj_parceiro1: '11.111.111/0001-11',
  nomeRazao_parceiro2: 'Innovation Corp',
  cpfCnpj_parceiro2: '22.222.222/0001-22',
  nomeRazao_parte1: 'Confidential Data Inc',
  cpfCnpj_parte1: '33.333.333/0001-33',
  nomeRazao_parte2: 'Secure Info Ltda',
  cpfCnpj_parte2: '44.444.444/0001-44',
  nomeRazao_empresa: 'Estágios & Cia Ltda',
  cpfCnpj_empresa: '55.555.555/0001-55',
  nomeRazao_estagiario: 'Ana Carolina Santos',
  cpfCnpj_estagiario: '999.888.777-66',
  
  // Campos específicos obrigatórios
  servico: 'Desenvolvimento de Sistema Web',
  produto: 'Notebook Dell Inspiron 15',
  imovel: 'Apartamento localizado na Rua das Flores, 123, Centro',
  objeto: 'Desenvolvimento conjunto de aplicativo mobile',
  assunto: 'Informações técnicas sobre nova tecnologia',
  curso: 'Ciência da Computação',
  percentual: 50,
  prazo: 12,
  
  // Campos opcionais intencionalmente vazios para teste
  garantia: '',
  descricao: '',
  clausulas: '',
  testemunhas: '',
  multa: '',
  reajuste: ''
};

templates.forEach(template => {
  console.log(`📋 Testando ${template.nome} com campos opcionais vazios...`);
  
  try {
    const xmlPreenchido = TemplateService.fillTemplateXml(template.xmlBase, dadosMinimos);
    
    // Verifica problemas específicos com campos vazios
    const problemasEncontrados = [];
    
    // Verifica se há placeholders não substituídos
    const placeholders = xmlPreenchido.match(/\{\{[^}]+\}\}/g);
    if (placeholders) {
      problemasEncontrados.push(`Placeholders restantes: ${placeholders.join(', ')}`);
    }
    
    // Verifica se há linhas problemáticas com campos vazios
    const linhasProblematicas = [
      /:\s*$/,  // Linhas que terminam com ':'
      /:\s*%\s*$/,  // Linhas que terminam com ': %'
      /:\s+meses\s*$/,  // Linhas que terminam com ': meses'
      /CPF\/CNPJ:\s*,/,  // CPF/CNPJ vazios
      /Garantia:\s*meses/,  // Garantia vazia
      /Multa por descumprimento:\s*%/,  // Multa vazia
      /Reajuste anual pelo índice:\s*$/,  // Reajuste vazio
    ];
    
    linhasProblematicas.forEach(padrao => {
      if (padrao.test(xmlPreenchido)) {
        problemasEncontrados.push(`Linha problemática: ${padrao.toString()}`);
      }
    });
    
    // Verifica se há seções vazias não removidas
    const secoesVazias = [
      /<clausulas>\s*<\/clausulas>/,
      /<testemunhas>\s*<\/testemunhas>/,
      /CLÁUSULA.*DAS DISPOSIÇÕES GERAIS\s*$/m
    ];
    
    secoesVazias.forEach(padrao => {
      if (padrao.test(xmlPreenchido)) {
        problemasEncontrados.push(`Seção vazia não removida: ${padrao.toString()}`);
      }
    });
    
    if (problemasEncontrados.length > 0) {
      console.log(`   ❌ PROBLEMAS ENCONTRADOS:`);
      problemasEncontrados.forEach(problema => {
        console.log(`      - ${problema}`);
      });
    } else {
      console.log(`   ✅ OK - Campos opcionais vazios tratados corretamente`);
    }
    
    // Mostra uma amostra do XML gerado (primeiras 10 linhas)
    const linhas = xmlPreenchido.split('\n').slice(0, 10);
    console.log(`   📄 Amostra do conteúdo gerado:`);
    linhas.forEach(linha => {
      if (linha.trim()) {
        console.log(`      ${linha.trim()}`);
      }
    });
    
    console.log('');
    
  } catch (error) {
    console.log(`   ❌ ERRO: ${error.message}`);
    console.log('');
  }
});

console.log('✅ Teste de campos opcionais vazios concluído!');
