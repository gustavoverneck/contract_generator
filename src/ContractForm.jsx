import React, { useState, useEffect } from 'react';
import TemplateService, { PDF_STYLES } from './services/TemplateService';
import PdfService from './services/PdfService';
import TemplateSelector from './components/TemplateSelector';
import PdfStyleSelector from './components/PdfStyleSelector';
import { formatCPF, formatCNPJ, formatMoney, formatTelefone, formatDateBRMask, formatDateToBR } from './utils/FieldFormatter';
import './components/TemplateSelector.css';
import './components/PdfStyleSelector.css';
import './components/ContractForm.css';

// Lista de todos os campos possíveis para o modo personalizado
const ALL_FIELDS = [
  { nome: 'nome', label: 'Nome', tipo: 'text' },
  { nome: 'cpf', label: 'CPF', tipo: 'cpf' },
  { nome: 'cnpj', label: 'CNPJ', tipo: 'cnpj' },
  { nome: 'email', label: 'E-mail', tipo: 'email' },
  { nome: 'descricao', label: 'Descrição', tipo: 'textarea' },
  { nome: 'clausulas', label: 'Cláusulas', tipo: 'clausulas' },
  { nome: 'valor', label: 'Valor', tipo: 'money' },
  { nome: 'data', label: 'Data', tipo: 'date' },
  // Adicione outros campos conforme necessário
];

export default function ContractForm() {
  // Adiciona a opção personalizado na lista de templates
  const templates = [
    ...TemplateService.getTemplates(),
    { id: 'personalizado', nome: 'Personalizado', campos: [], xmlBase: '<contrato>{campos}</contrato>' }
  ];
  const [selectedId, setSelectedId] = useState(templates[0].id);
  const [fields, setFields] = useState({});
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfStyle, setPdfStyle] = useState(PDF_STYLES[0].id);
  const [clausulas, setClausulas] = useState([{ id: 1, texto: '' }]);
  const [customFields, setCustomFields] = useState([]);
  const [customTitle, setCustomTitle] = useState('');
  // Estado para alternância de tipo de pessoa por grupo
  const [cpfCnpjTypes, setCpfCnpjTypes] = useState({});
  // Estado para testemunhas dinâmicas
  const [testemunhas, setTestemunhas] = useState([{ id: 1, nome: '', identificacao: '' }]);
  // Estado para mostrar aviso de testemunha obrigatória
  const [testemunhaAviso, setTestemunhaAviso] = useState(false);

  const template = templates.find(t => t.id === selectedId);
  const isPersonalizado = selectedId === 'personalizado';
  const camposParaExibir = isPersonalizado ? customFields : template.campos;

  useEffect(() => {
    const initial = {};
    (camposParaExibir || []).forEach(c => { 
      // Mantém valores já preenchidos, só inicializa se vazio
      let value = fields[c.nome] || '';
      
      // Para campos de data, mantém o valor no formato brasileiro se já estiver
      if (c.tipo === 'date' && value) {
        // Se estiver no formato ISO, converte para BR
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          value = formatDateToBR(value);
        }
        // Se não estiver em nenhum formato válido, limpa
        else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
          value = '';
        }
      }
      
      initial[c.nome] = value; 
    });
    setFields(prevFields => ({ ...prevFields, ...initial }));
    setClausulas([{ id: 1, texto: '' }]);
    setPdfUrl(null);
    setCustomTitle('');
    setTestemunhas([{ id: 1, nome: '', identificacao: '' }]);
    // Inicializa o tipo de pessoa para cada grupo
    const grupos = getPessoaGroups(camposParaExibir);
    const novoCpfCnpjTypes = {};
    Object.keys(grupos).forEach(grupo => {
      // Default: 'cpf' se houver campo cpf/nome, senão 'cnpj'
      const temCpf = grupos[grupo].some(c => c.nome.endsWith('cpf'));
      novoCpfCnpjTypes[grupo] = temCpf ? 'cpf' : 'cnpj';
    });
    setCpfCnpjTypes(novoCpfCnpjTypes);
  }, [selectedId, customFields]);

  // Função utilitária para identificar grupos de pessoa
  function getPessoaGroups(campos) {
    // Considera grupos por prefixo antes de 'cpf', 'cnpj', 'nome', 'razaoSocial'
    const grupos = {};
    (campos || []).forEach(c => {
      const match = c.nome.match(/^(\w+)?(cpf|cnpj|nome|razaoSocial)$/i);
      if (match) {
        const grupo = match[1] || 'pessoa';
        if (!grupos[grupo]) grupos[grupo] = [];
        grupos[grupo].push(c);
      }
    });
    return grupos;
  }

  async function gerarPdfPreview(e) {
    e?.preventDefault();
    let campos = { ...fields };
    
    // Converte datas do formato brasileiro DD/MM/YYYY para ISO YYYY-MM-DD para o TemplateService
    Object.keys(campos).forEach(key => {
      if (key.includes('data') && campos[key]) {
        const brDate = campos[key];
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(brDate)) {
          const [day, month, year] = brDate.split('/');
          campos[key] = `${year}-${month}-${day}`;
        }
      }
    });
    // Para cada grupo de pessoa, se for tipo cnpj, usa razaoSocial/cnpj, se cpf, usa nome/cpf
    const grupos = Object.keys(cpfCnpjTypes || {});
    grupos.forEach(grupo => {
      const tipo = cpfCnpjTypes[grupo];
      if (tipo === 'cpf') {
        // Usa nome e cpf, limpa razaoSocial/cnpj
        campos[`razaoSocial_${grupo}`] = '';
        campos[`cnpj_${grupo}`] = '';
      } else if (tipo === 'cnpj') {
        // Usa razaoSocial e cnpj, limpa nome/cpf
        campos[grupo] = '';
        campos[`cpf_${grupo}`] = '';
      }
    });
    if (camposParaExibir.some(c => c.nome === 'descricao')) {
      campos['descricao'] = fields['descricao'] || '';
    }
    if (camposParaExibir.some(c => c.nome === 'clausulas')) {
      const clausulasTexto = clausulas.filter(c => c.texto.trim()).map((c, i) => `Cláusula ${i + 1}: ${c.texto}`).join('\n');
      if (clausulasTexto.trim()) {
        campos['clausulas'] = clausulasTexto;
      } else {
        // Se não há cláusulas, remove o campo para não exibir no PDF
        delete campos['clausulas'];
      }
    }
    // Testemunhas: monta string para o campo do template
    if (camposParaExibir.some(c => c.nome === 'testemunhas')) {
      const testemunhasTexto = testemunhas
        .filter(t => t.nome.trim() && t.identificacao.trim())
        .map((t, i) => `Testemunha ${i + 1}: ${t.nome} - ${t.identificacao}`)
        .join('\n');
      if (testemunhasTexto.trim()) {
        campos['testemunhas'] = testemunhasTexto;
      } else {
        delete campos['testemunhas'];
      }
    }
    
    // Remove campos opcionais vazios para não exibi-los no PDF
    (camposParaExibir || []).forEach(c => {
      if (c.opcional && (!campos[c.nome] || campos[c.nome].trim() === '')) {
        delete campos[c.nome];
      }
    });
    
    // Remove campos vazios que podem quebrar frases principais
    const camposEssenciais = ['servico', 'produto', 'valor', 'data', 'objeto', 'assunto', 'curso'];
    camposEssenciais.forEach(campo => {
      if (campos[campo] && campos[campo].trim() === '') {
        delete campos[campo];
      }
    });
    
    // Limpa campos de números que ficaram vazios
    Object.keys(campos).forEach(key => {
      if ((key === 'multa' || key === 'percentual' || key === 'prazo' || key === 'garantia') && 
          (!campos[key] || campos[key].toString().trim() === '')) {
        delete campos[key];
      }
    });
    // Geração do HTML base
    let html;
    if (isPersonalizado) {
      html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>${customTitle || 'Contrato'}</title>
    <style>
        body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; margin: 2cm; }
        .title { font-size: 16pt; font-weight: bold; text-align: center; margin-bottom: 30px; }
        .field { margin-bottom: 15px; }
        .field-label { font-weight: bold; }
    </style>
</head>
<body>
    <h1 class="title">${customTitle || 'Contrato'}</h1>
    ${camposParaExibir.map(c => `<div class="field"><span class="field-label">${c.label}:</span> ${campos[c.nome] || ''}</div>`).join('\n    ')}
</body>
</html>`;
    } else {
      try {
        const templateHtml = await TemplateService.fetchTemplateHtml(template.id);
        html = TemplateService.fillTemplateHtml(templateHtml, campos);
      } catch (error) {
        console.error('Erro ao carregar template HTML:', error);
        html = '<p style="color:red">Erro ao carregar template. Tente novamente.</p>';
      }
    }
    const doc = PdfService.generatePdfFromHtml(html, pdfStyle);
    const pdfBlob = doc.output('blob');
    setPdfUrl(URL.createObjectURL(pdfBlob));
  }

  function handleChange(e) {
    const { name, value, maxLength } = e.target;
    let val = value;
    
    // Para campos de data, aplica máscara brasileira DD/MM/YYYY
    if (name.includes('data')) {
      val = formatDateBRMask(val);
    }
    // Máscara dinâmica para CPF/CNPJ
    else if (name.startsWith('cpfCnpj_')) {
      const digits = val.replace(/\D/g, '');
      val = digits.length <= 11 ? formatCPF(digits) : formatCNPJ(digits);
    }
    // Máscara para telefone
    else if (name.includes('telefone') || name.includes('tel')) {
      val = formatTelefone(val);
    }
    // Máscara para valor/money
    else if (name === 'valor' || name === 'valor_bolsa' || name.includes('valor')) {
      val = formatMoney(val);
    }
    
    // NÃO aplicar maxLength para campos de data
    if (maxLength && val.length > maxLength && !name.includes('data')) {
      val = val.slice(0, maxLength);
    }
    setFields({ ...fields, [name]: val });
  }

  function handleClausulaChange(id, value) {
    const max = 300;
    const novas = clausulas.map(c => 
      c.id === id ? { ...c, texto: value.slice(0, max) } : c
    );
    setClausulas(novas);
  }

  function addClausula() {
    const novoId = Math.max(...clausulas.map(c => c.id)) + 1;
    setClausulas([...clausulas, { id: novoId, texto: '' }]);
  }

  function removeClausula(id) {
    setClausulas(clausulas.filter(c => c.id !== id));
  }

  // Handler para mudança de campos personalizados
  function handleCustomFieldChange(field, isChecked) {
    if (isChecked) {
      setCustomFields([...customFields, field]);
    } else {
      setCustomFields(customFields.filter(cf => cf.nome !== field.nome));
    }
  }

  // Handlers para testemunhas dinâmicas
  function handleTestemunhaChange(id, field, value) {
    setTestemunhas(testemunhas.map(t => t.id === id ? { ...t, [field]: value } : t));
  }
  function addTestemunha() {
    // Se algum campo da última testemunha estiver vazio, mostra aviso
    if (testemunhas.some(t => !t.nome.trim() || !t.identificacao.trim())) {
      setTestemunhaAviso(true);
      return;
    }
    setTestemunhaAviso(false);
    const novoId = Math.max(...testemunhas.map(t => t.id)) + 1;
    setTestemunhas([...testemunhas, { id: novoId, nome: '', identificacao: '' }]);
  }
  function removeTestemunha(id) {
    setTestemunhas(testemunhas.filter(t => t.id !== id));
  }

  // Função para validar se todos os campos obrigatórios estão preenchidos
  function validarCamposObrigatorios() {
    try {
      // Verifica se o template e campos estão carregados
      if (!template || !camposParaExibir || camposParaExibir.length === 0) {
        return false;
      }
      
      // Valida título para modo personalizado
      if (isPersonalizado && (!customTitle || customTitle.trim() === '')) {
        return false;
      }
      
      // Obtém campos obrigatórios
      const camposObrigatorios = camposParaExibir.filter(c => !c.opcional);
      
      // Se não há campos obrigatórios, considera válido
      if (camposObrigatorios.length === 0) {
        return true;
      }
      
      // Verifica cada campo obrigatório
      for (const campo of camposObrigatorios) {
        const valor = fields[campo.nome];
        if (!validarCampoIndividual(campo, valor)) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Erro na validação:', error);
      return false;
    }
  }
  
  function validarCampoIndividual(campo, valor) {
    try {
      // Se o valor não existe ou é vazio
      if (!valor || typeof valor !== 'string' || valor.trim() === '') {
        return false;
      }
      
      const valorLimpo = valor.trim();
      
      // Validação específica para datas (formato DD/MM/YYYY)
      if (campo.tipo === 'date') {
        return /^\d{2}\/\d{2}\/\d{4}$/.test(valorLimpo);
      }
      
      // Validação específica para CPF/CNPJ
      if (campo.nome?.startsWith('cpfCnpj_')) {
        const digits = valor.replace(/\D/g, '');
        return digits.length >= 11; // CPF tem 11, CNPJ tem 14
      }
      
      // Validação para valores monetários
      if (campo.tipo === 'money' || campo.nome?.includes('valor')) {
        // Verifica se tem pelo menos um dígito
        return /\d/.test(valor);
      }
      
      // Validação para campos select
      if (campo.tipo === 'select') {
        return valorLimpo !== '' && valorLimpo !== 'default';
      }
      
      // Para outros tipos, apenas verifica se não está vazio
      return valorLimpo.length > 0;
    } catch (error) {
      console.error('Erro validando campo individual:', error);
      return false;
    }
  }
  
  // Função para detectar tipo de documento baseado no valor
  function detectDocumentType(value) {
    if (!value) return 'Documento';
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 11) return 'CPF';
    return 'CNPJ';
  }

  // Função para gerar label dinâmico para campos de CPF/CNPJ
  function getDynamicLabel(campo, valor) {
    if (campo.nome?.startsWith('cpfCnpj_') && campo.isDynamic) {
      const baseLabel = campo.label.replace('Documento', '');
      const docType = detectDocumentType(valor);
      return `${docType}${baseLabel}`;
    }
    return campo.label;
  }

  return (
    <div className="contract-form">
      <h2>Gerador de Contratos</h2>
      <form onSubmit={gerarPdfPreview}>
        <label htmlFor="templateSelector">Tipo de contrato:</label>
        <TemplateSelector
          id="templateSelector"
          templates={templates}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        {isPersonalizado && (
          <section className="personalizado-section">
            <div className="section-title">Personalização do Contrato</div>
            <div className="field">
              <label htmlFor="customTitle">Título do Contrato:</label>
              <input
                id="customTitle"
                type="text"
                className="input"
                value={customTitle}
                onChange={e => setCustomTitle(e.target.value)}
                placeholder="Digite o título do contrato"
                maxLength={80}
                autoComplete="off"
              />
            </div>
            <div className="field">
              <span style={{marginBottom:8,display:'block'}}>Escolha os campos do seu contrato:</span>
              <div className="checkbox-columns">
                {[0,1,2].map(col => (
                  <div key={col} className="checkbox-col">
                    {ALL_FIELDS.filter((_,i)=>i%3===col).map(f => (
                      <label
                        key={f.nome}
                        className="checkbox-field"
                        htmlFor={`field_${f.nome}`}
                      >
                        <input
                          id={`field_${f.nome}`}
                          type="checkbox"
                          checked={customFields.some(cf => cf.nome === f.nome)}
                          onChange={e => handleCustomFieldChange(f, e.target.checked)}
                        />
                        {f.label}
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        <label htmlFor="pdfStyleSelector">Estilo do PDF:</label>
        <PdfStyleSelector
          id="pdfStyleSelector"
          styles={PDF_STYLES}
          selectedStyle={pdfStyle}
          onSelect={setPdfStyle}
        />
        <div className="fields">
          {/* Renderiza todos os campos definidos pelo template, na ordem */}
          {(camposParaExibir || []).map(campo => {
            const obrigatorio = !campo.opcional;
            let maxLength;
            switch (campo.tipo) {
              case 'textarea': maxLength = 600; break;
              case 'text': maxLength = 120; break;
              case 'tel': maxLength = 15; break;
              case 'money': maxLength = 20; break;
              case 'email': maxLength = 80; break;
              case 'number': maxLength = 12; break;
              default: maxLength = undefined;
            }
            let inputType = campo.tipo;
            if (campo.tipo === 'money') inputType = 'text';
            if (campo.tipo === 'date') inputType = 'date';
            // Máscara dinâmica apenas para cpfCnpj_*
            const isCpfCnpj = campo.nome.startsWith('cpfCnpj_');
            const inputProps = {
              type: inputType === 'text' ? 'text' : inputType,
              name: campo.nome,
              value: fields[campo.nome] || '',
              onChange: handleChange,
              required: obrigatorio,
              autoComplete: campo.tipo === 'email' ? 'email' : 'off',
              placeholder: campo.exemplo || (isCpfCnpj ? 'Digite o CPF ou CNPJ' : ''),
            };
            // Adiciona maxLength apenas para campos que não são de data
            if (campo.tipo !== 'date') {
              inputProps.maxLength = isCpfCnpj ? 18 : maxLength;
            }
            if (campo.tipo === 'number') inputProps.inputMode = 'numeric';
            if (campo.tipo === 'money') {
              inputProps.inputMode = 'decimal';
              inputProps.placeholder = campo.exemplo || 'Ex: 1000,00';
            }
            if (campo.tipo === 'date') {
              const currentValue = fields[campo.nome] || '';
              return (
                <div key={campo.nome} className="field">
                  <label>{getDynamicLabel(campo, fields[campo.nome])}{obrigatorio && <span style={{color:'#d00',marginLeft:4}}>*</span>}:</label>
                  <input 
                    type="text"
                    name={campo.nome}
                    value={currentValue}
                    onChange={handleChange}
                    placeholder={campo.exemplo || 'dd/mm/aaaa'}
                    maxLength={10}
                    required={obrigatorio}
                    autoComplete="off"
                  />
                  <div style={{fontSize:'0.85em',color:'#888',textAlign:'right'}}>{currentValue.length}/10</div>
                </div>
              );
            }
            
            if (campo.tipo === 'clausulas') {
              return (
                <div key={campo.nome} className="field">
                  <label>{getDynamicLabel(campo, fields[campo.nome])}{obrigatorio && <span style={{color:'#d00',marginLeft:4}}>*</span>}:</label>
                  <div className="clausulas-container">
                    {clausulas.map((clausula, idx) => (
                      <div key={clausula.id} className="clausula-item">
                        <textarea
                          value={clausula.texto}
                          onChange={(e) => handleClausulaChange(clausula.id, e.target.value)}
                          placeholder={`Digite a cláusula ${idx + 1}...`}
                          maxLength={300}
                          autoComplete="off"
                        />
                        {clausulas.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => removeClausula(clausula.id)}
                            className="clausula-remove-btn"
                            title="Remover cláusula"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={addClausula}
                      className="clausula-add-btn"
                      style={{marginTop:8}}
                    >+ Adicionar Cláusula</button>
                  </div>
                </div>
              );
            }
            
            if (campo.nome === 'testemunhas') {
              return (
                <div key="testemunhas" className="field">
                  <label>Testemunhas:</label>
                  <div className="clausulas-container">
                    {testemunhas.map((t, idx) => (
                      <div key={t.id} className="clausula-item" style={{flexDirection:'column',alignItems:'stretch',gap:8}}>
                        <label htmlFor={`testemunha_nome_${t.id}`} style={{fontWeight:'bold',marginBottom:2}}>Nome da Testemunha:</label>
                        <input
                          id={`testemunha_nome_${t.id}`}
                          type="text"
                          value={t.nome}
                          onChange={e => handleTestemunhaChange(t.id, 'nome', e.target.value)}
                          placeholder="Ex: Maria Oliveira"
                          maxLength={80}
                          className="input"
                          style={{marginBottom:6}}
                          required
                        />
                        <label htmlFor={`testemunha_id_${t.id}`} style={{fontWeight:'bold',marginBottom:2}}>Identificação (CPF ou RG):</label>
                        <input
                          id={`testemunha_id_${t.id}`}
                          type="text"
                          value={t.identificacao}
                          onChange={e => handleTestemunhaChange(t.id, 'identificacao', e.target.value)}
                          placeholder="Ex: 123.456.789-00 ou MG-12.345.678"
                          maxLength={40}
                          className="input"
                          required
                        />
                        {testemunhas.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTestemunha(t.id)}
                            className="clausula-remove-btn"
                            style={{alignSelf:'flex-end',marginTop:4}}
                            title="Remover testemunha"
                          >✕</button>
                        )}
                      </div>
                    ))}
                    {testemunhaAviso && (
                      <div className="testemunha-aviso">
                        Preencha nome e identificação para todas as testemunhas antes de adicionar outra.
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={addTestemunha}
                      className="testemunha-add-btn"
                      style={{marginTop:0}}
                    >+ Adicionar Testemunha</button>
                  </div>
                </div>
              );
            }
            
            if (campo.tipo === 'select') {
              return (
                <div key={campo.nome} className="field">
                  <label>{getDynamicLabel(campo, fields[campo.nome])}{obrigatorio && <span style={{color:'#d00',marginLeft:4}}>*</span>}:</label>
                  <select 
                    name={campo.nome}
                    value={fields[campo.nome] || ''}
                    onChange={handleChange}
                    required={obrigatorio}
                  >
                    <option value="">Selecione uma opção</option>
                    {campo.opcoes?.map(opcao => (
                      <option key={opcao.valor} value={opcao.valor}>
                        {opcao.texto}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }
            
            return (
              <div key={campo.nome} className="field">
                <label>{getDynamicLabel(campo, fields[campo.nome])}{obrigatorio && <span style={{color:'#d00',marginLeft:4}}>*</span>}:</label>
                {campo.tipo === 'textarea' ? (
                  <textarea
                    {...inputProps}
                    placeholder={campo.exemplo || ''}
                  />
                ) : (
                  <input {...inputProps} />
                )}
                {!!maxLength && campo.tipo !== 'date' && <div style={{fontSize:'0.85em',color:'#888',textAlign:'right'}}>{(fields[campo.nome]||'').length}/{maxLength}</div>}
              </div>
            );
          })}
        </div>
        {/* Botão de visualizar contrato com validação */}
        {!validarCamposObrigatorios() && (
          <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            marginTop: '1rem',
            color: '#856404'
          }}>
            ⚠️ Preencha todos os campos obrigatórios (marcados com *) para visualizar o contrato.
          </div>
        )}
        <button 
          type="button" 
          className="btn-visualizar-contrato" 
          style={{
            opacity: validarCamposObrigatorios() ? 1 : 0.6,
            cursor: validarCamposObrigatorios() ? 'pointer' : 'not-allowed'
          }} 
          onClick={gerarPdfPreview}
          disabled={!validarCamposObrigatorios()}
        >
          Visualizar Contrato
        </button>
      </form>
      <div className="preview-area">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1rem',gap:'1rem'}}>
          <h3 style={{margin:0}}>Pré-visualização do Contrato (PDF)</h3>
          {pdfUrl && (
            <a
              href={pdfUrl}
              download={customTitle ? `${customTitle}.pdf` : 'contrato.pdf'}
              className="btn btn-primary"
              style={{padding:'0.5rem 1.2rem',fontSize:'1rem',borderRadius:'0.5rem',textDecoration:'none'}}
            >
              Baixar Contrato
            </a>
          )}
        </div>
        {pdfUrl && (
          <iframe src={pdfUrl} title="Contrato PDF" width="100%" height="500px" style={{border:'1px solid #ccc',borderRadius:'0.5rem',background:'#fff'}}></iframe>
        )}
      </div>
    </div>
  );
}
