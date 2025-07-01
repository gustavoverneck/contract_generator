// Teste completo do sistema de geração de contratos
import TemplateService from './src/services/TemplateService.js';

console.log('🔍 TESTE COMPLETO DO SISTEMA DE CONTRATOS\n');

const templates = TemplateService.getTemplates();

// Cenários de teste
const cenarios = [
  {
    nome: 'Todos os campos preenchidos',
    dados: {
      data: '2024-01-15',
      data_inicio: '2024-01-15',
      data_fim: '2024-12-15',
      valor: 'R$ 2.500,00',
      valor_bolsa: 'R$ 1.200,00',
      
      // Pessoas físicas e jurídicas
      nomeRazao_contratante: 'João Silva Santos',
      cpfCnpj_contratante: '123.456.789-01',
      nomeRazao_contratado: 'TechSolutions Ltda',
      cpfCnpj_contratado: '12.345.678/0001-90',
      nomeRazao_vendedor: 'Maria Fernanda Costa',
      cpfCnpj_vendedor: '987.654.321-00',
      nomeRazao_comprador: 'Inovação Digital Corp',
      cpfCnpj_comprador: '98.765.432/0001-11',
      nomeRazao_locador: 'Imóveis Premium Ltda',
      cpfCnpj_locador: '11.222.333/0001-44',
      nomeRazao_locatario: 'Carlos Eduardo Silva',
      cpfCnpj_locatario: '555.666.777-88',
      nomeRazao_parceiro1: 'StartupX Inovações',
      cpfCnpj_parceiro1: '33.444.555/0001-66',
      nomeRazao_parceiro2: 'TechPartners Brasil',
      cpfCnpj_parceiro2: '77.888.999/0001-00',
      nomeRazao_parte1: 'Confidential Systems',
      cpfCnpj_parte1: '12.123.234/0001-34',
      nomeRazao_parte2: 'Secure Data Solutions',
      cpfCnpj_parte2: '45.567.678/0001-78',
      nomeRazao_empresa: 'Corporação de Estágios',
      cpfCnpj_empresa: '88.999.000/0001-12',
      nomeRazao_estagiario: 'Ana Beatriz Santos',
      cpfCnpj_estagiario: '111.222.333-44',
      
      // Campos específicos
      servico: 'Desenvolvimento de aplicativo mobile com backend em Node.js',
      produto: 'MacBook Pro 13" M2 com 16GB RAM e SSD 512GB',
      imovel: 'Casa térrea com 3 quartos localizada na Rua das Palmeiras, 456, Jardim América',
      objeto: 'Desenvolvimento conjunto de plataforma de e-commerce B2B',
      assunto: 'Informações sobre algoritmos proprietários de inteligência artificial',
      curso: 'Engenharia de Software',
      
      // Campos opcionais preenchidos
      percentual: 60,
      prazo: 24,
      garantia: 18,
      descricao: 'Projeto desenvolvido seguindo metodologia ágil com entregas quinzenais e documentação técnica completa.',
      clausulas: 'CLÁUSULA ADICIONAL: O presente contrato poderá ser renovado mediante acordo entre as partes.',
      testemunhas: '1. Roberto Silva - CPF: 123.456.789-00\n2. Fernanda Costa - CPF: 987.654.321-11',
      multa: 10,
      reajuste: 'IGPM'
    }
  },
  {
    nome: 'Apenas campos obrigatórios',
    dados: {
      data: '2024-02-01',
      data_inicio: '2024-02-01',
      data_fim: '2024-08-01',
      valor: 'R$ 1.000,00',
      valor_bolsa: 'R$ 600,00',
      
      // Pessoas mínimas
      nomeRazao_contratante: 'Pedro Santos',
      cpfCnpj_contratante: '456.789.123-45',
      nomeRazao_contratado: 'FreelanceX',
      cpfCnpj_contratado: '23.456.789/0001-01',
      nomeRazao_vendedor: 'Loja do João',
      cpfCnpj_vendedor: '34.567.890/0001-12',
      nomeRazao_comprador: 'Maria Silva',
      cpfCnpj_comprador: '678.901.234-56',
      nomeRazao_locador: 'José Oliveira',
      cpfCnpj_locador: '789.012.345-67',
      nomeRazao_locatario: 'Empresa ABC',
      cpfCnpj_locatario: '45.678.901/0001-23',
      nomeRazao_parceiro1: 'Tech1',
      cpfCnpj_parceiro1: '56.789.012/0001-34',
      nomeRazao_parceiro2: 'Tech2',
      cpfCnpj_parceiro2: '67.890.123/0001-45',
      nomeRazao_parte1: 'Empresa A',
      cpfCnpj_parte1: '78.901.234/0001-56',
      nomeRazao_parte2: 'Empresa B',
      cpfCnpj_parte2: '89.012.345/0001-67',
      nomeRazao_empresa: 'Corp Estágios',
      cpfCnpj_empresa: '90.123.456/0001-78',
      nomeRazao_estagiario: 'Paulo Costa',
      cpfCnpj_estagiario: '890.123.456-78',
      
      // Campos obrigatórios básicos
      servico: 'Criação de website',
      produto: 'Smartphone Samsung',
      imovel: 'Apartamento 2 quartos',
      objeto: 'Parceria comercial',
      assunto: 'Dados confidenciais',
      curso: 'Informática',
      percentual: 50,
      prazo: 6
    }
  }
];

console.log(`📊 RESUMO DOS TESTES:\n`);

let totalTestes = 0;
let testesPassaram = 0;

templates.forEach(template => {
  console.log(`\n📋 TEMPLATE: ${template.nome.toUpperCase()}`);
  console.log(`   ${template.descricao}\n`);
  
  cenarios.forEach((cenario, index) => {
    console.log(`   🧪 Cenário ${index + 1}: ${cenario.nome}`);
    totalTestes++;
    
    try {
      const xmlGerado = TemplateService.fillTemplateXml(template.xmlBase, cenario.dados);
      
      // Validações
      const problemas = [];
      
      // Verifica placeholders não substituídos
      const placeholders = xmlGerado.match(/\{\{[^}]+\}\}/g);
      if (placeholders) {
        problemas.push(`Placeholders não substituídos: ${placeholders.length}`);
      }
      
      // Verifica seções vazias
      if (xmlGerado.includes('<clausulas></clausulas>')) {
        problemas.push('Seção de cláusulas vazia não removida');
      }
      if (xmlGerado.includes('<testemunhas></testemunhas>')) {
        problemas.push('Seção de testemunhas vazia não removida');
      }
      
      // Verifica linhas problemáticas
      const linhasProblematicas = xmlGerado.split('\n').filter(linha => {
        const l = linha.trim();
        return l.endsWith(':') || l.includes(': %') || l.includes(': meses') || l.includes('CPF/CNPJ: ,');
      });
      
      if (linhasProblematicas.length > 0) {
        problemas.push(`${linhasProblematicas.length} linhas com formatação problemática`);
      }
      
      // Verifica se tem conteúdo mínimo
      if (xmlGerado.length < 500) {
        problemas.push('Conteúdo muito curto, possível erro na geração');
      }
      
      if (problemas.length === 0) {
        console.log(`      ✅ PASSOU - XML gerado corretamente`);
        testesPassaram++;
      } else {
        console.log(`      ❌ FALHOU - ${problemas.join(', ')}`);
      }
      
      // Mostra estatísticas do conteúdo
      const linhas = xmlGerado.split('\n').filter(l => l.trim()).length;
      const caracteres = xmlGerado.length;
      console.log(`      📊 Linhas: ${linhas}, Caracteres: ${caracteres}`);
      
    } catch (error) {
      console.log(`      ❌ ERRO - ${error.message}`);
    }
  });
});

console.log(`\n\n🎯 RESULTADO FINAL:`);
console.log(`   Total de testes: ${totalTestes}`);
console.log(`   Testes que passaram: ${testesPassaram}`);
console.log(`   Testes que falharam: ${totalTestes - testesPassaram}`);
console.log(`   Taxa de sucesso: ${((testesPassaram / totalTestes) * 100).toFixed(1)}%`);

if (testesPassaram === totalTestes) {
  console.log(`\n🎉 TODOS OS TESTES PASSARAM! Sistema está funcionando perfeitamente.`);
} else {
  console.log(`\n⚠️  Alguns testes falharam. Revisar os problemas identificados.`);
}

console.log(`\n✅ Teste completo finalizado!`);
