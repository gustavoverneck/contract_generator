// Serviço para fornecer templates de contratos com campos dinâmicos
// Cada template tem: id, nome, campos, xmlBase

// Catálogo de tipos de campo padrão para facilitar máscaras/validações
const FIELD_TYPES = {
  nome: { tipo: 'text', label: 'Nome Completo' },
  cpf: { tipo: 'cpf', label: 'CPF' },
  cnpj: { tipo: 'cnpj', label: 'CNPJ' },
  telefone: { tipo: 'tel', label: 'Telefone' },
  dinheiro: { tipo: 'money', label: 'Valor (R$)' },
  email: { tipo: 'email', label: 'E-mail' },
  data: { tipo: 'date', label: 'Data' },
  texto: { tipo: 'text', label: 'Texto' },
  textarea: { tipo: 'textarea', label: 'Descrição' }
};

const templates = [
  {
    id: 'servico',
    nome: 'Prestação de Serviços',
    descricao: 'Ideal para contratação de autônomos, freelancers e empresas para prestação de serviços em geral.',
    campos: [
      { ...FIELD_TYPES.nome, nome: 'contratante' },
      { ...FIELD_TYPES.cpf, nome: 'cpf_contratante', label: 'CPF do Contratante' },
      { ...FIELD_TYPES.nome, nome: 'contratado', label: 'Contratado' },
      { ...FIELD_TYPES.cnpj, nome: 'cnpj_contratado', label: 'CNPJ do Contratado', opcional: true },
      { ...FIELD_TYPES.telefone, nome: 'telefone_contratante', label: 'Telefone do Contratante', opcional: true },
      { ...FIELD_TYPES.texto, nome: 'servico', label: 'Serviço' },
      { ...FIELD_TYPES.dinheiro, nome: 'valor' },
      { ...FIELD_TYPES.data, nome: 'data' },
      { ...FIELD_TYPES.texto, nome: 'prazo', label: 'Prazo de Execução', opcional: true },
      { tipo: 'number', nome: 'multa', label: 'Multa por Descumprimento (%)', opcional: true },
      { ...FIELD_TYPES.texto, nome: 'reajuste', label: 'Índice de Reajuste', opcional: true },
      { ...FIELD_TYPES.textarea, nome: 'testemunhas', label: 'Testemunhas', opcional: true },
      { ...FIELD_TYPES.textarea, nome: 'descricao', label: 'Descrição (opcional)', opcional: true },
      { nome: 'clausulas', label: 'Cláusulas Adicionais', tipo: 'clausulas', opcional: true }
    ],
    xmlBase: `<contrato>
  <titulo>Contrato de Prestação de Serviços</titulo>
  <partes>
    <contratante>{{contratante}}</contratante>
    <contratado>{{contratado}}</contratado>
  </partes>
  <corpo>
    O contratante {{contratante}} contrata o serviço de {{servico}} do contratado {{contratado}} pelo valor de R$ {{valor}} na data {{data}}.
    {{descricao}}
    {{#if prazo}}\nPrazo de execução: {{prazo}}.{{/if}}
    {{#if multa}}\nMulta por descumprimento: {{multa}}%.{{/if}}
    {{#if reajuste}}\nReajuste anual pelo índice: {{reajuste}}.{{/if}}
  </corpo>
  <clausulas>
    {{clausulas}}
  </clausulas>
  <testemunhas>
    {{testemunhas}}
  </testemunhas>
</contrato>`
  },
  {
    id: 'produto',
    nome: 'Venda de Produto',
    descricao: 'Utilize para formalizar a venda de bens móveis, eletrônicos, veículos, etc.',
    campos: [
      { ...FIELD_TYPES.nome, nome: 'vendedor', label: 'Vendedor' },
      { ...FIELD_TYPES.cpf, nome: 'cpf_vendedor', label: 'CPF do Vendedor', opcional: true },
      { ...FIELD_TYPES.cnpj, nome: 'cnpj_vendedor', label: 'CNPJ do Vendedor', opcional: true },
      { ...FIELD_TYPES.nome, nome: 'comprador', label: 'Comprador' },
      { ...FIELD_TYPES.cpf, nome: 'cpf_comprador', label: 'CPF do Comprador', opcional: true },
      { ...FIELD_TYPES.cnpj, nome: 'cnpj_comprador', label: 'CNPJ do Comprador', opcional: true },
      { ...FIELD_TYPES.texto, nome: 'produto', label: 'Produto' },
      { ...FIELD_TYPES.dinheiro, nome: 'valor', label: 'Valor' },
      { ...FIELD_TYPES.data, nome: 'data' },
      { tipo: 'number', nome: 'garantia', label: 'Garantia (meses)', opcional: true },
      { ...FIELD_TYPES.textarea, nome: 'descricao', label: 'Descrição (opcional)', opcional: true },
      { nome: 'clausulas', label: 'Cláusulas Adicionais', tipo: 'clausulas', opcional: true }
    ],
    xmlBase: `<contrato>
  <titulo>Contrato de Venda de Produto</titulo>
  <partes>
    <vendedor>{{vendedor}}</vendedor>
    <comprador>{{comprador}}</comprador>
  </partes>
  <corpo>
    O vendedor {{vendedor}} vende o produto {{produto}} ao comprador {{comprador}} pelo valor de R$ {{valor}} na data {{data}}.
    {{descricao}}
    {{#if garantia}}\nGarantia: {{garantia}} meses.{{/if}}
  </corpo>
  <clausulas>
    {{clausulas}}
  </clausulas>
</contrato>`
  },
  {
    id: 'aluguel',
    nome: 'Contrato de Aluguel',
    descricao: 'Para locação de imóveis residenciais, comerciais ou equipamentos.',
    campos: [
      { ...FIELD_TYPES.nome, nome: 'locador', label: 'Locador' },
      { ...FIELD_TYPES.cpf, nome: 'cpf_locador', label: 'CPF do Locador', opcional: true },
      { ...FIELD_TYPES.cnpj, nome: 'cnpj_locador', label: 'CNPJ do Locador', opcional: true },
      { ...FIELD_TYPES.nome, nome: 'locatario', label: 'Locatário' },
      { ...FIELD_TYPES.cpf, nome: 'cpf_locatario', label: 'CPF do Locatário' },
      { ...FIELD_TYPES.cnpj, nome: 'cnpj_locatario', label: 'CNPJ do Locatário', opcional: true },
      { ...FIELD_TYPES.texto, nome: 'imovel', label: 'Imóvel' },
      { ...FIELD_TYPES.dinheiro, nome: 'valor', label: 'Valor Mensal' },
      { ...FIELD_TYPES.data, nome: 'data_inicio', label: 'Data de Início' },
      { ...FIELD_TYPES.data, nome: 'data_fim', label: 'Data de Término' },
      { ...FIELD_TYPES.textarea, nome: 'descricao', label: 'Descrição (opcional)', opcional: true },
      { nome: 'clausulas', label: 'Cláusulas Adicionais', tipo: 'clausulas', opcional: true }
    ],
    xmlBase: `<contrato>
  <titulo>Contrato de Aluguel</titulo>
  <partes>
    <locador>{{locador}}</locador>
    <locatario>{{locatario}}</locatario>
  </partes>
  <corpo>
    O locador {{locador}} aluga o imóvel {{imovel}} ao locatário {{locatario}} pelo valor mensal de R$ {{valor}}, com início em {{data_inicio}} e término em {{data_fim}}.
    {{descricao}}
  </corpo>
  <clausulas>
    {{clausulas}}
  </clausulas>
</contrato>`
  },
  {
    id: 'parceria',
    nome: 'Contrato de Parceria',
    descricao: 'Formalize parcerias comerciais, joint ventures ou projetos colaborativos.',
    campos: [
      { ...FIELD_TYPES.nome, nome: 'parceiro1', label: 'Parceiro 1' },
      { ...FIELD_TYPES.cpf, nome: 'cpf_parceiro1', label: 'CPF do Parceiro 1', opcional: true },
      { ...FIELD_TYPES.cnpj, nome: 'cnpj_parceiro1', label: 'CNPJ do Parceiro 1', opcional: true },
      { ...FIELD_TYPES.nome, nome: 'parceiro2', label: 'Parceiro 2' },
      { ...FIELD_TYPES.cpf, nome: 'cpf_parceiro2', label: 'CPF do Parceiro 2', opcional: true },
      { ...FIELD_TYPES.cnpj, nome: 'cnpj_parceiro2', label: 'CNPJ do Parceiro 2', opcional: true },
      { ...FIELD_TYPES.texto, nome: 'objeto', label: 'Objeto da Parceria' },
      { tipo: 'number', nome: 'percentual', label: 'Percentual de Participação (%)' },
      { ...FIELD_TYPES.data, nome: 'data' },
      { ...FIELD_TYPES.textarea, nome: 'descricao', label: 'Descrição (opcional)', opcional: true },
      { nome: 'clausulas', label: 'Cláusulas Adicionais', tipo: 'clausulas', opcional: true }
    ],
    xmlBase: `<contrato>
  <titulo>Contrato de Parceria</titulo>
  <partes>
    <parceiro1>{{parceiro1}}</parceiro1>
    <parceiro2>{{parceiro2}}</parceiro2>
  </partes>
  <corpo>
    Os parceiros {{parceiro1}} e {{parceiro2}} firmam parceria para {{objeto}}, com participação de {{percentual}}% para cada, a partir de {{data}}.
    {{descricao}}
  </corpo>
  <clausulas>
    {{clausulas}}
  </clausulas>
</contrato>`
  },
  {
    id: 'nda',
    nome: 'NDA (Acordo de Confidencialidade)',
    descricao: 'Proteja informações sigilosas em negociações, projetos ou parcerias.',
    campos: [
      { ...FIELD_TYPES.nome, nome: 'parte1', label: 'Parte 1' },
      { ...FIELD_TYPES.cpf, nome: 'cpf_parte1', label: 'CPF da Parte 1', opcional: true },
      { ...FIELD_TYPES.cnpj, nome: 'cnpj_parte1', label: 'CNPJ da Parte 1', opcional: true },
      { ...FIELD_TYPES.nome, nome: 'parte2', label: 'Parte 2' },
      { ...FIELD_TYPES.cpf, nome: 'cpf_parte2', label: 'CPF da Parte 2', opcional: true },
      { ...FIELD_TYPES.cnpj, nome: 'cnpj_parte2', label: 'CNPJ da Parte 2', opcional: true },
      { ...FIELD_TYPES.texto, nome: 'assunto', label: 'Assunto' },
      { tipo: 'number', nome: 'prazo', label: 'Prazo de Confidencialidade (meses)' },
      { ...FIELD_TYPES.data, nome: 'data' },
      { ...FIELD_TYPES.textarea, nome: 'descricao', label: 'Descrição (opcional)', opcional: true },
      { nome: 'clausulas', label: 'Cláusulas Adicionais', tipo: 'clausulas', opcional: true }
    ],
    xmlBase: `<contrato>
  <titulo>Acordo de Confidencialidade (NDA)</titulo>
  <partes>
    <parte1>{{parte1}}</parte1>
    <parte2>{{parte2}}</parte2>
  </partes>
  <corpo>
    As partes {{parte1}} e {{parte2}} concordam em manter confidencial o assunto {{assunto}} pelo prazo de {{prazo}} meses, a partir de {{data}}.
    {{descricao}}
  </corpo>
  <clausulas>
    {{clausulas}}
  </clausulas>
</contrato>`
  },
  {
    id: 'estagio',
    nome: 'Contrato de Estágio',
    descricao: 'Para formalizar estágios obrigatórios ou não obrigatórios em empresas.',
    campos: [
      { ...FIELD_TYPES.nome, nome: 'empresa', label: 'Empresa' },
      { ...FIELD_TYPES.cnpj, nome: 'cnpj_empresa', label: 'CNPJ da Empresa', opcional: true },
      { ...FIELD_TYPES.nome, nome: 'estagiario', label: 'Estagiário' },
      { ...FIELD_TYPES.cpf, nome: 'cpf_estagiario', label: 'CPF do Estagiário', opcional: true },
      { ...FIELD_TYPES.texto, nome: 'curso', label: 'Curso' },
      { ...FIELD_TYPES.dinheiro, nome: 'valor_bolsa', label: 'Valor da Bolsa' },
      { ...FIELD_TYPES.data, nome: 'data_inicio', label: 'Data de Início' },
      { ...FIELD_TYPES.data, nome: 'data_fim', label: 'Data de Término' },
      { ...FIELD_TYPES.textarea, nome: 'descricao', label: 'Descrição (opcional)', opcional: true },
      { nome: 'clausulas', label: 'Cláusulas Adicionais', tipo: 'clausulas', opcional: true }
    ],
    xmlBase: `<contrato>
  <titulo>Contrato de Estágio</titulo>
  <partes>
    <empresa>{{empresa}}</empresa>
    <estagiario>{{estagiario}}</estagiario>
  </partes>
  <corpo>
    A empresa {{empresa}} oferece um estágio para {{estagiario}} no curso de {{curso}} com bolsa de R$ {{valor_bolsa}}.
    Início em {{data_inicio}} e término em {{data_fim}}.
    {{descricao}}
  </corpo>
  <clausulas>
    {{clausulas}}
  </clausulas>
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
    Object.entries(campos).forEach(([key, value]) => {
      xml = xml.replaceAll(`{{${key}}}`, value);
    });
    return xml;
  }
};

export default TemplateService;
