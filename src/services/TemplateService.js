// Serviço para fornecer templates de contratos com campos dinâmicos
// Cada template tem: id, nome, campos, xmlBase

// Catálogo de tipos de campo padrão para facilitar máscaras/validações
const FIELD_TYPES = {
  nome: { tipo: 'text', label: 'Nome Completo' },
  razaoSocial: { tipo: 'text', label: 'Razão Social' },
  cpf: { tipo: 'cpf', label: 'CPF' },
  cnpj: { tipo: 'cnpj', label: 'CNPJ' },
  telefone: { tipo: 'tel', label: 'Telefone' },
  dinheiro: { tipo: 'money', label: 'Valor (R$)' },
  email: { tipo: 'email', label: 'E-mail' },
  data: { tipo: 'date', label: 'Data' },
  texto: { tipo: 'text', label: 'Texto' },
  textarea: { tipo: 'textarea', label: 'Descrição' },
  formaPagamento: { 
    tipo: 'select', 
    label: 'Forma de Pagamento',
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
    { tipo: 'text', nome: `nomeRazao_${grupo}`, label: `Nome/Razão Social ${labelBase}` },
    // Campo único para CPF/CNPJ (tipo 'text' para garantir input no frontend)
    { tipo: 'text', nome: `cpfCnpj_${grupo}`, label: `CPF/CNPJ ${labelBase}` }
  ];
}

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
    ],
    xmlBase: `<contrato>
  <titulo>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</titulo>
  <partes>
    <contratante>{{nomeRazao_contratante}}, CPF/CNPJ: {{cpfCnpj_contratante}}</contratante>
    <contratado>{{nomeRazao_contratado}}, CPF/CNPJ: {{cpfCnpj_contratado}}</contratado>
  </partes>
  <corpo>
    Pelo presente instrumento particular, as partes acima qualificadas têm entre si justo e acordado o presente CONTRATO DE PRESTAÇÃO DE SERVIÇOS, que se regerá pelas cláusulas e condições seguintes:

    CLÁUSULA 1ª - DO OBJETO
    O CONTRATADO compromete-se a prestar ao CONTRATANTE o seguinte serviço: {{servico}}.

    CLÁUSULA 2ª - DO VALOR E FORMA DE PAGAMENTO
    Pelo serviço ora contratado, o CONTRATANTE pagará ao CONTRATADO o valor total de {{valor}}, mediante {{forma_pagamento}}.

    CLÁUSULA 3ª - DO PRAZO
    O presente contrato terá vigência a partir de {{data}}.
    Prazo de execução: {{prazo}}

    CLÁUSULA 4ª - DAS PENALIDADES
    Multa por descumprimento: {{multa}}%

    CLÁUSULA 5ª - DO REAJUSTE
    Reajuste anual pelo índice: {{reajuste}}

    CLÁUSULA 6ª - DAS DISPOSIÇÕES GERAIS
    {{descricao}}

    CLÁUSULA 7ª - DO FORO
    Fica eleito o foro da comarca de residência do CONTRATANTE para dirimir quaisquer dúvidas ou questões oriundas do presente contrato.

    E por estarem assim justos e contratados, firmam o presente instrumento em duas vias de igual teor.

    {{data}}
  </corpo>
  <clausulas>
    {{clausulas}}
  </clausulas>
  <testemunhas>
    TESTEMUNHAS:
    {{testemunhas}}
  </testemunhas>
  <assinaturas>
    _____________________________        _____________________________
    {{nomeRazao_contratante}}            {{nomeRazao_contratado}}
    CONTRATANTE                          CONTRATADO
  </assinaturas>
</contrato>`
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
      { tipo: 'number', nome: 'garantia', label: 'Garantia (meses)', opcional: true },
      { ...FIELD_TYPES.textarea, nome: 'descricao', label: 'Descrição (opcional)', opcional: true },
      { nome: 'clausulas', label: 'Cláusulas Adicionais', tipo: 'clausulas', opcional: true }
    ],
    xmlBase: `<contrato>
  <titulo>CONTRATO DE COMPRA E VENDA</titulo>
  <partes>
    <vendedor>{{nomeRazao_vendedor}}, CPF/CNPJ: {{cpfCnpj_vendedor}}</vendedor>
    <comprador>{{nomeRazao_comprador}}, CPF/CNPJ: {{cpfCnpj_comprador}}</comprador>
  </partes>
  <corpo>
    Pelo presente instrumento particular, as partes acima qualificadas têm entre si justo e acordado o presente CONTRATO DE COMPRA E VENDA, que se regerá pelas cláusulas e condições seguintes:

    CLÁUSULA 1ª - DO OBJETO
    O VENDEDOR vende ao COMPRADOR o seguinte bem: {{produto}}.

    CLÁUSULA 2ª - DO PREÇO E FORMA DE PAGAMENTO
    O preço total da venda é de {{valor}}, que será pago mediante {{forma_pagamento}} na data de {{data}}.

    CLÁUSULA 3ª - DA GARANTIA
    Garantia: {{garantia}} meses

    CLÁUSULA 4ª - DAS DISPOSIÇÕES GERAIS
    {{descricao}}

    CLÁUSULA 5ª - DO FORO
    Fica eleito o foro da comarca de residência do COMPRADOR para dirimir quaisquer dúvidas ou questões oriundas do presente contrato.

    E por estarem assim justos e contratados, firmam o presente instrumento em duas vias de igual teor.

    {{data}}
  </corpo>
  <clausulas>
    {{clausulas}}
  </clausulas>
  <assinaturas>
    _____________________________        _____________________________
    {{nomeRazao_vendedor}}               {{nomeRazao_comprador}}
    VENDEDOR                             COMPRADOR
  </assinaturas>
</contrato>`
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
    ],
    xmlBase: `<contrato>
  <titulo>CONTRATO DE LOCAÇÃO</titulo>
  <partes>
    <locador>{{nomeRazao_locador}}, CPF/CNPJ: {{cpfCnpj_locador}}</locador>
    <locatario>{{nomeRazao_locatario}}, CPF/CNPJ: {{cpfCnpj_locatario}}</locatario>
  </partes>
  <corpo>
    Pelo presente instrumento particular, as partes acima qualificadas têm entre si justo e acordado o presente CONTRATO DE LOCAÇÃO, que se regerá pelas cláusulas e condições seguintes:

    CLÁUSULA 1ª - DO OBJETO
    O LOCADOR dá em locação ao LOCATÁRIO o seguinte imóvel: {{imovel}}.

    CLÁUSULA 2ª - DO VALOR E FORMA DE PAGAMENTO
    O valor mensal da locação é de {{valor}}, vencível todo dia 10 de cada mês, mediante {{forma_pagamento}}.

    CLÁUSULA 3ª - DO PRAZO
    O prazo da locação é de {{data_inicio}} até {{data_fim}}.

    CLÁUSULA 4ª - DAS OBRIGAÇÕES
    O LOCATÁRIO se obriga a:
    a) Pagar pontualmente o aluguel;
    b) Usar o imóvel para a finalidade contratada;
    c) Restituir o imóvel nas mesmas condições que recebeu.

    CLÁUSULA 5ª - DAS DISPOSIÇÕES GERAIS
    {{descricao}}

    CLÁUSULA 6ª - DO FORO
    Fica eleito o foro da comarca onde se situa o imóvel para dirimir quaisquer dúvidas ou questões oriundas do presente contrato.

    E por estarem assim justos e contratados, firmam o presente instrumento em duas vias de igual teor.

    {{data_inicio}}
  </corpo>
  <clausulas>
    {{clausulas}}
  </clausulas>
  <assinaturas>
    _____________________________        _____________________________
    {{nomeRazao_locador}}                {{nomeRazao_locatario}}
    LOCADOR                              LOCATÁRIO
  </assinaturas>
</contrato>`
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
    ],
    xmlBase: `<contrato>
  <titulo>CONTRATO DE PARCERIA COMERCIAL</titulo>
  <partes>
    <parceiro1>{{nomeRazao_parceiro1}}, CPF/CNPJ: {{cpfCnpj_parceiro1}}</parceiro1>
    <parceiro2>{{nomeRazao_parceiro2}}, CPF/CNPJ: {{cpfCnpj_parceiro2}}</parceiro2>
  </partes>
  <corpo>
    Pelo presente instrumento particular, as partes acima qualificadas têm entre si justo e acordado o presente CONTRATO DE PARCERIA COMERCIAL, que se regerá pelas cláusulas e condições seguintes:

    CLÁUSULA 1ª - DO OBJETO
    As partes firmam parceria para {{objeto}}.

    CLÁUSULA 2ª - DA PARTICIPAÇÃO
    A participação de cada parceiro será de {{percentual}}% para cada parte.

    CLÁUSULA 3ª - DO INÍCIO DA PARCERIA
    A parceria terá início em {{data}}.

    CLÁUSULA 4ª - DAS RESPONSABILIDADES
    Cada parceiro será responsável por suas respectivas obrigações conforme acordado entre as partes.

    CLÁUSULA 5ª - DAS DISPOSIÇÕES GERAIS
    {{descricao}}

    CLÁUSULA 6ª - DO FORO
    Fica eleito o foro da comarca de comum acordo entre as partes para dirimir quaisquer dúvidas ou questões oriundas do presente contrato.

    E por estarem assim justos e contratados, firmam o presente instrumento em duas vias de igual teor.

    {{data}}
  </corpo>
  <clausulas>
    {{clausulas}}
  </clausulas>
  <assinaturas>
    _____________________________        _____________________________
    {{nomeRazao_parceiro1}}              {{nomeRazao_parceiro2}}
    PARCEIRO 1                           PARCEIRO 2
  </assinaturas>
</contrato>`
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
    ],
    xmlBase: `<contrato>
  <titulo>ACORDO DE CONFIDENCIALIDADE (NDA)</titulo>
  <partes>
    <parte1>{{nomeRazao_parte1}}, CPF/CNPJ: {{cpfCnpj_parte1}}</parte1>
    <parte2>{{nomeRazao_parte2}}, CPF/CNPJ: {{cpfCnpj_parte2}}</parte2>
  </partes>
  <corpo>
    Pelo presente instrumento particular, as partes acima qualificadas têm entre si justo e acordado o presente ACORDO DE CONFIDENCIALIDADE, que se regerá pelas cláusulas e condições seguintes:

    CLÁUSULA 1ª - DO OBJETO
    As partes concordam em manter confidencial as informações relacionadas a: {{assunto}}.

    CLÁUSULA 2ª - DO PRAZO DE CONFIDENCIALIDADE
    O prazo de confidencialidade será de {{prazo}} meses, contados a partir de {{data}}.

    CLÁUSULA 3ª - DAS OBRIGAÇÕES
    As partes se comprometem a:
    a) Não divulgar informações confidenciais a terceiros;
    b) Utilizar as informações apenas para os fins acordados;
    c) Devolver ou destruir as informações ao final do prazo.

    CLÁUSULA 4ª - DAS PENALIDADES
    O descumprimento do presente acordo implicará em indenização por perdas e danos.

    CLÁUSULA 5ª - DAS DISPOSIÇÕES GERAIS
    {{descricao}}

    CLÁUSULA 6ª - DO FORO
    Fica eleito o foro da comarca de comum acordo entre as partes para dirimir quaisquer dúvidas ou questões oriundas do presente acordo.

    E por estarem assim justos e acordados, firmam o presente instrumento em duas vias de igual teor.

    {{data}}
  </corpo>
  <clausulas>
    {{clausulas}}
  </clausulas>
  <assinaturas>
    _____________________________        _____________________________
    {{nomeRazao_parte1}}                 {{nomeRazao_parte2}}
    PARTE 1                              PARTE 2
  </assinaturas>
</contrato>`
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
    ],
    xmlBase: `<contrato>
  <titulo>CONTRATO DE ESTÁGIO</titulo>
  <partes>
    <empresa>{{nomeRazao_empresa}}, CPF/CNPJ: {{cpfCnpj_empresa}}</empresa>
    <estagiario>{{nomeRazao_estagiario}}, CPF/CNPJ: {{cpfCnpj_estagiario}}</estagiario>
  </partes>
  <corpo>
    Pelo presente instrumento particular, as partes acima qualificadas têm entre si justo e acordado o presente CONTRATO DE ESTÁGIO, que se regerá pelas cláusulas e condições seguintes:

    CLÁUSULA 1ª - DO OBJETO
    A EMPRESA oferece ao ESTAGIÁRIO oportunidade de estágio no curso de {{curso}}.

    CLÁUSULA 2ª - DA BOLSA-AUXÍLIO
    O valor da bolsa-auxílio será de {{valor_bolsa}} mensais, pago mediante {{forma_pagamento}}.

    CLÁUSULA 3ª - DO PRAZO
    O estágio terá duração de {{data_inicio}} até {{data_fim}}.

    CLÁUSULA 4ª - DAS OBRIGAÇÕES DO ESTAGIÁRIO
    O ESTAGIÁRIO se compromete a:
    a) Cumprir a carga horária estabelecida;
    b) Seguir as normas internas da empresa;
    c) Manter sigilo das informações da empresa.

    CLÁUSULA 5ª - DAS OBRIGAÇÕES DA EMPRESA
    A EMPRESA se compromete a:
    a) Proporcionar experiência prática ao estagiário;
    b) Pagar a bolsa-auxílio pontualmente;
    c) Fornecer certificado de estágio ao final.

    CLÁUSULA 6ª - DAS DISPOSIÇÕES GERAIS
    {{descricao}}

    CLÁUSULA 7ª - DO FORO
    Fica eleito o foro da comarca onde se situa a empresa para dirimir quaisquer dúvidas ou questões oriundas do presente contrato.

    E por estarem assim justos e contratados, firmam o presente instrumento em duas vias de igual teor.

    {{data_inicio}}
  </corpo>
  <clausulas>
    {{clausulas}}
  </clausulas>
  <assinaturas>
    _____________________________        _____________________________
    {{nomeRazao_empresa}}                {{nomeRazao_estagiario}}
    EMPRESA                              ESTAGIÁRIO
  </assinaturas>
</contrato>`
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

const TemplateService = {
  getTemplates() {
    return templates;
  },
  getTemplateById(id) {
    return templates.find(t => t.id === id);
  },
  // Preenche o xmlBase substituindo os campos
  fillTemplateXml(xmlBase, campos) {
    let xml = xmlBase;
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
        xml = xml.replaceAll(`{{${grupo}}}`, camposFormatados[key] || '');
        xml = xml.replaceAll(`{{nome_${grupo}}}`, camposFormatados[key] || '');
        xml = xml.replaceAll(`{{razaoSocial_${grupo}}}`, camposFormatados[key] || '');
        xml = xml.replaceAll(`{{nome}}`, camposFormatados[key] || '');
        xml = xml.replaceAll(`{{razaoSocial}}`, camposFormatados[key] || '');
      }
    });
    
    // Processa campos de CPF/CNPJ
    Object.keys(camposFormatados).forEach(key => {
      const matchId = /^cpfCnpj_(\w+)$/.exec(key);
      if (matchId) {
        const grupo = matchId[1];
        const raw = (camposFormatados[key] || '').replace(/\D/g, '');
        let formatted = '';
        if (raw.length > 11) {
          // CNPJ
          formatted = raw.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5').slice(0,18);
        } else if (raw.length === 11) {
          // CPF
          formatted = raw.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4').slice(0,14);
        } else {
          formatted = camposFormatados[key] || '';
        }
        // Preenche todos os campos de id possíveis
        xml = xml.replaceAll(`{{cpf_${grupo}}}`, formatted);
        xml = xml.replaceAll(`{{cnpj_${grupo}}}`, formatted);
        xml = xml.replaceAll(`{{cpf}}`, formatted);
        xml = xml.replaceAll(`{{cnpj}}`, formatted);
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
        xml = xml.replaceAll(`{{${key}}}`, formasPagamento[value] || value);
      } else {
        xml = xml.replaceAll(`{{${key}}}`, value || '');
      }
    });
    
    // Remove qualquer placeholder restante que não foi preenchido
    xml = xml.replace(/\{\{[^}]+\}\}/g, '');
    
    // Primeira passada: remove linhas inteiras que contêm apenas campos vazios ou ficaram malformadas
    xml = xml.split('\n').filter(linha => {
      const linhaTrimmed = linha.trim();
      
      // Remove linhas completamente vazias
      if (!linhaTrimmed) return false;
      
      // Remove linhas que só contêm placeholders vazios
      if (linhaTrimmed.match(/^{{[^}]+}}$/)) return false;
      
      // Remove linhas que ficaram malformadas por campos obrigatórios vazios
      const padroesMalformados = [
        /O CONTRATADO compromete-se a prestar ao CONTRATANTE o seguinte serviço:\s*\./,
        /O VENDEDOR vende ao COMPRADOR o seguinte bem:\s*\./,
        /O LOCADOR dá em locação ao LOCATÁRIO o seguinte imóvel:\s*\./,
        /As partes firmam parceria para\s*,/,
        /As partes concordam em manter confidencial as informações relacionadas a:\s*\./,
        /A EMPRESA oferece ao ESTAGIÁRIO oportunidade de estágio no curso de\s*\./,
        /pelo valor de\s+(na|,)/,
        /na data\s*\.$/,
        /pelo valor de na data/,
        /\bde\s{2,}do\b/,
        /\bproduto\s{2,}ao\b/,
        /valor de\s+(na data|,)/,
        /com bolsa de\s*\./,
        /CPF\/CNPJ:\s*,/,
        /CPF\/CNPJ:\s*$/
      ];
      
      return !padroesMalformados.some(padrao => padrao.test(linhaTrimmed));
    }).map(linha => {
      // Limpa espaços duplos e triplos
      return linha.replace(/\s{2,}/g, ' ');
    }).join('\n');
    
    // Segunda passada: remove linhas com campos opcionais vazios e melhora a formatação
    xml = xml.split('\n').filter(linha => {
      const linhaTrimmed = linha.trim();
      
      // Remove linhas completamente vazias
      if (!linhaTrimmed) return false;
      
      // Remove linhas que ficaram só com texto fixo sem valor útil
      const padroesTextoFixo = [
        'Prazo de execução:',
        'Multa por descumprimento: %',
        'Reajuste anual pelo índice:',
        'Garantia: meses',
        'Garantia:  meses',
        'CLÁUSULA 3ª - DO PRAZO',
        'CLÁUSULA 4ª - DAS PENALIDADES',
        'CLÁUSULA 5ª - DO REAJUSTE',
        'CLÁUSULA 3ª - DA GARANTIA',
        'CPF/CNPJ:',
        'TESTEMUNHAS:',
        /^[^:]*:\s*$/,  // Linhas que terminam com ':' sem valor
        /^[^:]*:\s*%\s*$/,  // Linhas que terminam com ': %'
        /^[^:]*:\s+meses\s*$/,  // Linhas que terminam com ': meses'
        /^[^:]*:\s+anos\s*$/,   // Linhas que terminam com ': anos'
        /^[^:]*:\s*R\$\s*$/,     // Linhas que terminam com ': R$'
        /\{\{[^}]+\}\}/,  // Linhas que ainda contêm placeholders não substituídos
        /CPF\/CNPJ:\s*,$/,  // CPF/CNPJ vazios
        /CPF\/CNPJ:\s*$/,
        /^CLÁUSULA \d+ª - DAS DISPOSIÇÕES GERAIS\s*$/,  // Cláusula vazia de disposições gerais
        /^CLÁUSULA \d+ª - DA GARANTIA\s*$/,  // Cláusula vazia de garantia
        /^CLÁUSULA \d+ª - DAS PENALIDADES\s*$/,  // Cláusula vazia de penalidades
        /^CLÁUSULA \d+ª - DO REAJUSTE\s*$/   // Cláusula vazia de reajuste
      ];
      
      if (padroesTextoFixo.some(padrao => {
        if (typeof padrao === 'string') return linhaTrimmed === padrao;
        return padrao.test(linhaTrimmed);
      })) {
        return false;
      }
      
      // Remove linhas que ainda contêm frases problemáticas específicas
      const padroesProblematicosMelhorados = [
        /contrata o serviço de\s+do/,
        /vende o produto\s+ao/,
        /pelo valor de\s+na/,
        /na data\s*\.$/,
        /pelo valor de na data[\s.]*$/,
        /\bde\s+do\b/,
        /\bproduto\s+ao\b/,
        /valor de\s+(na|,)/,
        /firmam parceria para\s*,/,
        /pelo prazo de\s+meses/,
        /concordam em manter confidencial o assunto\s+pelo/,
        /oferece um estágio para\s+no curso de/,
        /com bolsa de\s*\./,
        /Início em\s+e término em/
      ];
      
      return !padroesProblematicosMelhorados.some(padrao => padrao.test(linhaTrimmed));
    }).filter((linha, index, array) => {
      // Remove linhas vazias duplicadas consecutivas
      const linhaTrimmed = linha.trim();
      if (!linhaTrimmed) {
        const proximaLinha = array[index + 1];
        return proximaLinha && proximaLinha.trim() !== '';
      }
      return true;
    }).join('\n');
    
    // Terceira passada: remove seções XML vazias
    xml = xml
      // Remove seções de clausulas vazias
      .replace(/<clausulas>\s*<\/clausulas>/g, '')
      // Remove seções de testemunhas vazias
      .replace(/<testemunhas>\s*<\/testemunhas>/g, '')
      // Remove cláusulas que ficaram vazias (com apenas o título)
      .replace(/CLÁUSULA \d+ª - DAS DISPOSIÇÕES GERAIS\s*$/gm, '')
      .replace(/CLÁUSULA \d+ª - DA GARANTIA\s*$/gm, '')
      .replace(/CLÁUSULA \d+ª - DAS PENALIDADES\s*$/gm, '')
      .replace(/CLÁUSULA \d+ª - DO REAJUSTE\s*$/gm, '');
    
    // Quarta passada: limpeza final e formatação
    xml = xml
      // Remove linhas vazias no início e fim
      .replace(/^\s*\n+/, '')
      .replace(/\n+\s*$/, '')
      // Remove múltiplas linhas vazias consecutivas
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      // Remove espaços em branco no final das linhas
      .split('\n')
      .map(linha => linha.trimEnd())
      .join('\n');
    
    return xml;
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
