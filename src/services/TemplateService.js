// Serviço para fornecer templates de contratos com campos dinâmicos
// Cada template tem: id, nome, campos, xmlBase

// Catálogo de tipos de campo padrão para facilitar máscaras/validações
const FIELD_TYPES = {
  nome: { tipo: 'text', label: 'Nome Completo', exemplo: 'Ex: João da Silva' },
  razaoSocial: { tipo: 'text', label: 'Razão Social', exemplo: 'Ex: ACME Ltda.' },
  cpf: { tipo: 'cpf', label: 'CPF', exemplo: 'Ex: 123.456.789-00' },
  cnpj: { tipo: 'cnpj', label: 'CNPJ', exemplo: 'Ex: 12.345.678/0001-99' },
  telefone: { tipo: 'tel', label: 'Telefone', exemplo: 'Ex: (11) 91234-5678' },
  dinheiro: { tipo: 'money', label: 'Valor (R$)', exemplo: 'Ex: 1000,00' },
  email: { tipo: 'email', label: 'E-mail', exemplo: 'Ex: contato@email.com' },
  data: { tipo: 'date', label: 'Data', exemplo: 'Ex: 01/07/2025' },
  texto: { tipo: 'text', label: 'Texto', exemplo: 'Ex: Serviços de consultoria' },
  textarea: { tipo: 'textarea', label: 'Descrição', exemplo: 'Ex: Detalhe aqui as condições, observações ou informações adicionais.' },
  testemunhas: { tipo: 'textarea', label: 'Testemunhas', exemplo: 'Ex: Maria Oliveira, CPF 123.456.789-00' },
  testemunhaNome: { tipo: 'text', label: 'Nome da Testemunha', exemplo: 'Ex: Maria Oliveira' },
  testemunhaId: { tipo: 'text', label: 'Identificação (CPF ou RG)', exemplo: 'Ex: 123.456.789-00 ou MG-12.345.678' },
  multa: { tipo: 'number', label: 'Multa por Descumprimento (%)', exemplo: 'Ex: 10 (para 10%)' },
  percentual: { tipo: 'number', label: 'Percentual de Participação (%)', exemplo: 'Ex: 50 (para 50%)' },
  garantia: { tipo: 'number', label: 'Garantia (meses)', exemplo: 'Ex: 12 (para 1 ano)' },
  prazo: { tipo: 'number', label: 'Prazo de Confidencialidade (meses)', exemplo: 'Ex: 24 (para 2 anos)' },
  formaPagamento: { 
    tipo: 'select', 
    label: 'Forma de Pagamento',
    exemplo: 'Selecione uma opção',
    opcoes: [
      { valor: 'avista', texto: 'À vista' },
      { valor: 'pix', texto: 'PIX' },
      { valor: 'transferencia', texto: 'Transferência bancária' },
      { valor: 'deposito', texto: 'Depósito bancário' },
      { valor: 'boleto', texto: 'Boleto bancário' },
      { valor: 'cartao_credito', texto: 'Cartão de crédito' },
      { valor: 'cartao_debito', texto: 'Cartão de débito' },
      { valor: 'cheque', texto: 'Cheque' },
      { valor: 'dinheiro', texto: 'Dinheiro' },
      { valor: 'parcelado', texto: 'Parcelado' },
      { valor: 'mensal', texto: 'Pagamento mensal' },
      { valor: 'outros', texto: 'Outros' }
    ]
  }
};

// Função utilitária para gerar campos de pessoa (nome/razaoSocial/cpf/cnpj) para um grupo
function pessoaFields(grupo, labelBase) {
  return [
    // Campo único para nome/razão social
    {
      tipo: 'text',
      nome: `nomeRazao_${grupo}`,
      label: `Nome/Razão Social ${labelBase}`,
      exemplo: 'Ex: João da Silva ou ACME Ltda.'
    },
    // Campo único para CPF/CNPJ (tipo 'text' para garantir input no frontend)
    // O label será dinâmico baseado no conteúdo digitado
    {
      tipo: 'text',
      nome: `cpfCnpj_${grupo}`,
      label: `Documento ${labelBase}`,
      isDynamic: true,
      exemplo: 'Ex: 123.456.789-00 ou 12.345.678/0001-99'
    }
  ];
}

// Array de templates sem htmlBase (apenas metadados e campos)
const templates = [
  {
    id: 'servico',
    nome: 'Prestação de Serviços',
    descricao: 'Ideal para contratação de autônomos, freelancers e empresas para prestação de serviços em geral.',
    campos: [
      ...pessoaFields('contratante', 'do Contratante'),
      ...pessoaFields('contratado', 'do Contratado'),
      { ...FIELD_TYPES.telefone, nome: 'telefone_contratante', label: 'Telefone do Contratante', opcional: true },
      { ...FIELD_TYPES.texto, nome: 'servico', label: 'Serviço' },
      { ...FIELD_TYPES.dinheiro, nome: 'valor' },
      { ...FIELD_TYPES.formaPagamento, nome: 'forma_pagamento', label: 'Forma de Pagamento' },
      { ...FIELD_TYPES.data, nome: 'data' },
      { ...FIELD_TYPES.texto, nome: 'prazo', label: 'Prazo de Execução', opcional: true },
      { tipo: 'number', nome: 'multa', label: 'Multa por Descumprimento (%)', opcional: true },
      { ...FIELD_TYPES.texto, nome: 'reajuste', label: 'Índice de Reajuste', opcional: true },
      { ...FIELD_TYPES.textarea, nome: 'testemunhas', label: 'Testemunhas', opcional: true },
      { ...FIELD_TYPES.textarea, nome: 'descricao', label: 'Descrição (opcional)', opcional: true },
      { nome: 'clausulas', label: 'Cláusulas Adicionais', tipo: 'clausulas', opcional: true }
    ]
  },
  {
    id: 'produto',
    nome: 'Venda de Produto',
    descricao: 'Utilize para formalizar a venda de bens móveis, eletrônicos, veículos, etc.',
    campos: [
      ...pessoaFields('vendedor', 'do Vendedor'),
      ...pessoaFields('comprador', 'do Comprador'),
      { ...FIELD_TYPES.texto, nome: 'produto', label: 'Produto' },
      { ...FIELD_TYPES.dinheiro, nome: 'valor', label: 'Valor' },
      { ...FIELD_TYPES.formaPagamento, nome: 'forma_pagamento', label: 'Forma de Pagamento' },
      { ...FIELD_TYPES.data, nome: 'data' },
      { ...FIELD_TYPES.garantia, nome: 'garantia', label: 'Garantia (meses)', opcional: true },
      { ...FIELD_TYPES.textarea, nome: 'descricao', label: 'Descrição (opcional)', opcional: true },
      { nome: 'clausulas', label: 'Cláusulas Adicionais', tipo: 'clausulas', opcional: true }
    ]
  },
  {
    id: 'aluguel',
    nome: 'Contrato de Aluguel',
    descricao: 'Para locação de imóveis residenciais, comerciais ou equipamentos.',
    campos: [
      ...pessoaFields('locador', 'do Locador'),
      ...pessoaFields('locatario', 'do Locatário'),
      { ...FIELD_TYPES.texto, nome: 'imovel', label: 'Imóvel' },
      { ...FIELD_TYPES.dinheiro, nome: 'valor', label: 'Valor Mensal' },
      { ...FIELD_TYPES.formaPagamento, nome: 'forma_pagamento', label: 'Forma de Pagamento' },
      { ...FIELD_TYPES.data, nome: 'data_inicio', label: 'Data de Início' },
      { ...FIELD_TYPES.data, nome: 'data_fim', label: 'Data de Término' },
      { ...FIELD_TYPES.textarea, nome: 'descricao', label: 'Descrição (opcional)', opcional: true },
      { nome: 'clausulas', label: 'Cláusulas Adicionais', tipo: 'clausulas', opcional: true }
    ]
  },
  {
    id: 'parceria',
    nome: 'Contrato de Parceria',
    descricao: 'Formalize parcerias comerciais, joint ventures ou projetos colaborativos.',
    campos: [
      ...pessoaFields('parceiro1', 'do Parceiro 1'),
      ...pessoaFields('parceiro2', 'do Parceiro 2'),
      { ...FIELD_TYPES.texto, nome: 'objeto', label: 'Objeto da Parceria' },
      { tipo: 'number', nome: 'percentual', label: 'Percentual de Participação (%)' },
      { ...FIELD_TYPES.data, nome: 'data' },
      { ...FIELD_TYPES.textarea, nome: 'descricao', label: 'Descrição (opcional)', opcional: true },
      { nome: 'clausulas', label: 'Cláusulas Adicionais', tipo: 'clausulas', opcional: true }
    ]
  },
  {
    id: 'nda',
    nome: 'NDA (Acordo de Confidencialidade)',
    descricao: 'Proteja informações sigilosas em negociações, projetos ou parcerias.',
    campos: [
      ...pessoaFields('parte1', 'da Parte 1'),
      ...pessoaFields('parte2', 'da Parte 2'),
      { ...FIELD_TYPES.texto, nome: 'assunto', label: 'Assunto' },
      { tipo: 'number', nome: 'prazo', label: 'Prazo de Confidencialidade (meses)' },
      { ...FIELD_TYPES.data, nome: 'data' },
      { ...FIELD_TYPES.textarea, nome: 'descricao', label: 'Descrição (opcional)', opcional: true },
      { nome: 'clausulas', label: 'Cláusulas Adicionais', tipo: 'clausulas', opcional: true }
    ]
  },
  {
    id: 'estagio',
    nome: 'Contrato de Estágio',
    descricao: 'Para formalizar estágios obrigatórios ou não obrigatórios em empresas.',
    campos: [
      ...pessoaFields('empresa', 'da Empresa'),
      ...pessoaFields('estagiario', 'do Estagiário'),
      { ...FIELD_TYPES.texto, nome: 'curso', label: 'Curso' },
      { ...FIELD_TYPES.dinheiro, nome: 'valor_bolsa', label: 'Valor da Bolsa' },
      { ...FIELD_TYPES.formaPagamento, nome: 'forma_pagamento', label: 'Forma de Pagamento da Bolsa' },
      { ...FIELD_TYPES.data, nome: 'data_inicio', label: 'Data de Início' },
      { ...FIELD_TYPES.data, nome: 'data_fim', label: 'Data de Término' },
      { ...FIELD_TYPES.textarea, nome: 'descricao', label: 'Descrição (opcional)', opcional: true },
      { nome: 'clausulas', label: 'Cláusulas Adicionais', tipo: 'clausulas', opcional: true }
    ]
  }
  // Adicione outros templates conforme necessário
];

// Catálogo de estilos de PDF com preview e descrição
export const PDF_STYLES = [
  {
    id: 'moderno',
    nome: 'Moderno',
    descricao: 'Layout limpo, com título centralizado, destaques em azul e rodapé minimalista.',
    preview: '/previews/pdf_moderno.png'
  },
  {
    id: 'formal',
    nome: 'Formal',
    descricao: 'Visual clássico, fontes serifadas, margens amplas e cabeçalho tradicional.',
    preview: '/previews/pdf_formal.png'
  }
];

// Função assíncrona para buscar o HTML do template no frontend
// Os arquivos devem estar em /public/templates/{id}.html
export async function fetchTemplateHtml(id) {
  const url = `/templates/${id}.html`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Erro ao carregar template HTML');
    return await res.text();
  } catch (e) {
    return '<p style="color:red">Erro ao carregar template HTML.</p>';
  }
}

const TemplateService = {
  getTemplates() {
    return templates;
  },
  getTemplateById(id) {
    return templates.find(t => t.id === id);
  },
  // Use TemplateService.fetchTemplateHtml(id) para obter o HTML do template
  fetchTemplateHtml,
  // Preenche o HTML do template substituindo os campos
  fillTemplateHtml(htmlBase, campos) {
    let html = htmlBase;
    // Cria uma cópia dos campos para não modificar o original
    const camposFormatados = { ...campos };
    
    // Formata campos de data para exibição (DD/MM/YYYY) apenas na cópia
    Object.entries(camposFormatados).forEach(([key, value]) => {
      if (key.includes('data') && value?.includes('-')) {
        // Verifica se é uma data válida no formato YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          const [y, m, d] = value.split('-');
          if (y && m && d && y.length === 4) {
            camposFormatados[key] = `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
          }
        } else {
          // Se não está no formato correto, remove do campo formatado
          camposFormatados[key] = '';
        }
      }
    });
    
    // Processa campos de nome/razão social
    Object.keys(camposFormatados).forEach(key => {
      const match = /^nomeRazao_(\w+)$/.exec(key);
      if (match) {
        const grupo = match[1];
        html = html.replaceAll(`{{${grupo}}}`, camposFormatados[key] || '');
        html = html.replaceAll(`{{nome_${grupo}}}`, camposFormatados[key] || '');
        html = html.replaceAll(`{{razaoSocial_${grupo}}}`, camposFormatados[key] || '');
        html = html.replaceAll(`{{nome}}`, camposFormatados[key] || '');
        html = html.replaceAll(`{{razaoSocial}}`, camposFormatados[key] || '');
      }
    });
    
    // Processa campos de CPF/CNPJ
    Object.keys(camposFormatados).forEach(key => {
      const matchId = /^cpfCnpj_(\w+)$/.exec(key);
      if (matchId) {
        const grupo = matchId[1];
        const raw = (camposFormatados[key] || '').replace(/\D/g, '');
        let formatted = '';
        let docType;
        
        if (raw.length > 11) {
          // CNPJ
          formatted = raw.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5').slice(0,18);
          docType = 'CNPJ';
        } else if (raw.length === 11) {
          // CPF
          formatted = raw.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4').slice(0,14);
          docType = 'CPF';
        } else {
          formatted = camposFormatados[key] || '';
          docType = 'Documento';
        }
        
        // Substitui o tipo de documento dinâmico
        html = html.replaceAll(`{{docType_${grupo}}}`, docType);
        
        // Preenche todos os campos de id possíveis
        html = html.replaceAll(`{{cpf_${grupo}}}`, formatted);
        html = html.replaceAll(`{{cnpj_${grupo}}}`, formatted);
        html = html.replaceAll(`{{cpf}}`, formatted);
        html = html.replaceAll(`{{cnpj}}`, formatted);
      }
    });
    
    // Processa todos os demais campos (incluindo servico, valor, etc.)
    Object.entries(camposFormatados).forEach(([key, value]) => {
      // Processa campo de forma de pagamento para converter valor para texto legível
      if (key === 'forma_pagamento' && value) {
        const formasPagamento = {
          'avista': 'à vista',
          'pix': 'PIX',
          'transferencia': 'transferência bancária',
          'deposito': 'depósito bancário',
          'boleto': 'boleto bancário',
          'cartao_credito': 'cartão de crédito',
          'cartao_debito': 'cartão de débito',
          'cheque': 'cheque',
          'dinheiro': 'dinheiro',
          'parcelado': 'pagamento parcelado',
          'mensal': 'pagamento mensal',
          'outros': 'outros meios de pagamento'
        };
        html = html.replaceAll(`{{${key}}}`, formasPagamento[value] || value);
      } else {
        html = html.replaceAll(`{{${key}}}`, value || '');
      }
    });
    
    // Remove qualquer placeholder restante que não foi preenchido
    html = html.replace(/\{\{[^}]+\}\}/g, '');
    
    // Limpeza específica para HTML: remove divs e elementos vazios
    html = html
      // Remove cláusulas com conteúdo vazio ou apenas pontuação
      .replace(/<div class="clause">\s*<div class="clause-title">[^<]*<\/div>\s*<div class="clause-content">\s*(<\/div>|\s*<\/div>)/g, '')
      // Remove cláusulas que só têm ":" sem valor significativo
      .replace(/<div class="clause">\s*<div class="clause-title">([^<]*)<\/div>\s*<div class="clause-content">\s*[^:]*:\s*(<br>)?\s*<\/div>\s*<\/div>/g, '')
      // Remove cláusulas que só têm texto seguido de "%" sem número
      .replace(/<div class="clause">\s*<div class="clause-title">([^<]*)<\/div>\s*<div class="clause-content">\s*[^:]*:\s*%\s*<\/div>\s*<\/div>/g, '')
      // Remove divs de testemunhas vazias
      .replace(/<div class="witnesses">\s*<strong>TESTEMUNHAS:<\/strong><br>\s*<\/div>/g, '')
      // Remove divs de cláusulas adicionais vazias
      .replace(/<div class="clausulas">\s*<\/div>/g, '')
      // Remove elementos com apenas espaços
      .replace(/>\s+</g, '><')
      // Remove linhas vazias excessivas
      .replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Renumera as cláusulas sequencialmente
    const clausulaRegex = /<div class="clause-title">CLÁUSULA \d+ª([^<]*)<\/div>/g;
    let clausulaCounter = 1;
    
    html = html.replace(clausulaRegex, (match, resto) => {
      return `<div class="clause-title">CLÁUSULA ${clausulaCounter++}ª${resto}</div>`;
    });
    
    return html;
  }
};

export default TemplateService;

// Função para detectar tipo de pessoa automaticamente pelo valor do campo
export function detectPessoaType(cpfCnpjValue) {
  // Remove caracteres não numéricos
  const digits = (cpfCnpjValue || '').replace(/\D/g, '');
  // CPF: 11 dígitos, CNPJ: 14 dígitos
  if (digits.length > 11) return 'cnpj';
  if (digits.length === 11) return 'cpf';
  return '';
}
