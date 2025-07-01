// Verificação completa de todos os templates
import TemplateService from './src/services/TemplateService.js';

console.log('='.repeat(80));
console.log('VERIFICAÇÃO COMPLETA DE TODOS OS TEMPLATES');
console.log('='.repeat(80));

const templates = TemplateService.getTemplates();

templates.forEach((template, index) => {
  console.log(`\n${index + 1}. TEMPLATE: ${template.nome.toUpperCase()}`);
  console.log('-'.repeat(60));
  
  // Mostra os campos do template
  console.log('CAMPOS:');
  template.campos.forEach(campo => {
    const obrigatorio = campo.opcional ? '(opcional)' : '(obrigatório)';
    console.log(`  - ${campo.nome}: ${campo.label} ${obrigatorio}`);
  });
  
  console.log('\nTEMPLATE XML:');
  console.log(template.xmlBase);
  
  // Teste com campos obrigatórios preenchidos e opcionais vazios
  console.log('\n🧪 TESTE COM CAMPOS OPCIONAIS VAZIOS:');
  
  const camposTeste = {};
  template.campos.forEach(campo => {
    if (!campo.opcional) {
      // Preenche campos obrigatórios com valores de teste
      switch (campo.nome) {
        case 'nomeRazao_contratante':
        case 'nomeRazao_vendedor':
        case 'nomeRazao_locador':
        case 'nomeRazao_parceiro1':
        case 'nomeRazao_parte1':
        case 'nomeRazao_empresa':
          camposTeste[campo.nome] = 'João Silva Ltda';
          break;
        case 'nomeRazao_contratado':
        case 'nomeRazao_comprador':
        case 'nomeRazao_locatario':
        case 'nomeRazao_parceiro2':
        case 'nomeRazao_parte2':
        case 'nomeRazao_estagiario':
          camposTeste[campo.nome] = 'Maria Santos';
          break;
        case 'cpfCnpj_contratante':
        case 'cpfCnpj_vendedor':
        case 'cpfCnpj_locador':
        case 'cpfCnpj_parceiro1':
        case 'cpfCnpj_parte1':
        case 'cpfCnpj_empresa':
          camposTeste[campo.nome] = '12345678000195';
          break;
        case 'cpfCnpj_contratado':
        case 'cpfCnpj_comprador':
        case 'cpfCnpj_locatario':
        case 'cpfCnpj_parceiro2':
        case 'cpfCnpj_parte2':
        case 'cpfCnpj_estagiario':
          camposTeste[campo.nome] = '12345678901';
          break;
        case 'servico':
          camposTeste[campo.nome] = 'Desenvolvimento de software';
          break;
        case 'produto':
          camposTeste[campo.nome] = 'Notebook Dell Inspiron';
          break;
        case 'imovel':
          camposTeste[campo.nome] = 'Apartamento na Rua das Flores, 123';
          break;
        case 'objeto':
          camposTeste[campo.nome] = 'desenvolvimento de aplicativo móvel';
          break;
        case 'assunto':
          camposTeste[campo.nome] = 'informações sobre novo produto';
          break;
        case 'curso':
          camposTeste[campo.nome] = 'Ciência da Computação';
          break;
        case 'valor':
        case 'valor_bolsa':
          camposTeste[campo.nome] = 'R$ 5.000,00';
          break;
        case 'data':
        case 'data_inicio':
          camposTeste[campo.nome] = '2025-07-01';
          break;
        case 'data_fim':
          camposTeste[campo.nome] = '2025-12-31';
          break;
        case 'percentual':
          camposTeste[campo.nome] = '50';
          break;
        case 'prazo':
          if (template.id === 'nda') {
            camposTeste[campo.nome] = '12';
          }
          break;
        default:
          camposTeste[campo.nome] = 'Valor de teste';
      }
    }
    // Campos opcionais ficam vazios para teste
  });
  
  const xmlProcessado = TemplateService.fillTemplateXml(template.xmlBase, camposTeste);
  console.log(xmlProcessado);
  
  console.log('\n' + '='.repeat(80));
});

console.log('\n✅ VERIFICAÇÃO CONCLUÍDA');
console.log('Todos os templates foram testados com campos opcionais vazios.');
console.log('Verifique se não há linhas órfãs ou placeholders não substituídos.');
