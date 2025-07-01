// Script para testar todos os templates e verificar se geram PDFs limpos
import TemplateService from './src/services/TemplateService.js';

console.log('🔍 Verificando templates...\n');

const templates = TemplateService.getTemplates();

// Dados de exemplo para testes
const dadosExemplo = {
  // Dados comuns
  data: '2024-01-15',
  data_inicio: '2024-01-15',
  data_fim: '2024-12-15',
  valor: 'R$ 1.500,00',
  valor_bolsa: 'R$ 800,00',
  
  // Pessoas exemplo (físicas e jurídicas)
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
  
  // Campos específicos por template
  servico: 'Desenvolvimento de Sistema Web',
  produto: 'Notebook Dell Inspiron 15',
  imovel: 'Apartamento localizado na Rua das Flores, 123, Centro',
  objeto: 'Desenvolvimento conjunto de aplicativo mobile',
  assunto: 'Informações técnicas sobre nova tecnologia',
  curso: 'Ciência da Computação',
  
  // Campos numéricos
  percentual: 50,
  prazo: 12,
  garantia: 12
};

templates.forEach(template => {
  console.log(`📋 Testando template: ${template.nome}`);
  console.log(`   Descrição: ${template.descricao}`);
  
  try {
    // Gera o XML preenchido
    const xmlPreenchido = TemplateService.fillTemplateXml(template.xmlBase, dadosExemplo);
    
    // Verifica se há placeholders não substituídos
    const placeholdersRestantes = xmlPreenchido.match(/\{\{[^}]+\}\}/g);
    if (placeholdersRestantes) {
      console.log(`   ❌ ERRO: Placeholders não substituídos encontrados:`);
      placeholdersRestantes.forEach(p => console.log(`      - ${p}`));
    }
    
    // Verifica se há problemas de formatação conhecidos
    const problemasFormatacao = [
      /O CONTRATADO compromete-se a prestar ao CONTRATANTE o seguinte serviço:\s*\./,
      /O VENDEDOR vende ao COMPRADOR o seguinte bem:\s*\./,
      /pelo valor de\s+na/,
      /CPF\/CNPJ:\s*,/,
      /:\s*$/
    ];
    
    const problemasEncontrados = [];
    problemasFormatacao.forEach(padrao => {
      if (padrao.test(xmlPreenchido)) {
        problemasEncontrados.push(padrao.toString());
      }
    });
    
    if (problemasEncontrados.length > 0) {
      console.log(`   ⚠️  PROBLEMAS DE FORMATAÇÃO:`);
      problemasEncontrados.forEach(p => console.log(`      - ${p}`));
    }
    
    // Verifica se há linhas vazias excessivas
    const linhasVazias = xmlPreenchido.match(/\n\s*\n\s*\n/g);
    if (linhasVazias) {
      console.log(`   ⚠️  Múltiplas linhas vazias encontradas: ${linhasVazias.length}`);
    }
    
    // Se não há problemas, marca como OK
    if (!placeholdersRestantes && problemasEncontrados.length === 0 && !linhasVazias) {
      console.log(`   ✅ Template OK - Sem problemas detectados`);
    }
    
    console.log('');
    
  } catch (error) {
    console.log(`   ❌ ERRO ao processar template: ${error.message}`);
    console.log('');
  }
});

console.log('✅ Verificação concluída!');
