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

  function gerarPdfPreview(e) {
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
    // Geração do XML base para personalizado
    let xml;
    if (isPersonalizado) {
      xml = `<contrato>\n  <titulo>${customTitle || 'Contrato'}</titulo>\n` + camposParaExibir.map(c => `<${c.nome}>${campos[c.nome] || ''}</${c.nome}>`).join('\n') + '\n</contrato>';
    } else {
      xml = TemplateService.fillTemplateXml(template.xmlBase, campos);
    }
    const doc = PdfService.generatePdfFromXml(xml, pdfStyle);
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

  // Função para validar se todos os campos obrigatórios estão preenchidos
  function validarCamposObrigatorios() {
    // Valida título para modo personalizado
    if (isPersonalizado && (!customTitle || customTitle.trim() === '')) {
      return false;
    }
    
    // Valida campos obrigatórios básicos
    const camposObrigatorios = (camposParaExibir || []).filter(c => !c.opcional);
    const campoBasicoInvalido = camposObrigatorios.some(campo => {
      const valor = fields[campo.nome];
      return !validarCampoIndividual(campo, valor);
    });
    
    if (campoBasicoInvalido) return false;
    
    // Valida cláusulas obrigatórias
    return validarClausulasObrigatorias();
  }
  
  function validarCampoIndividual(campo, valor) {
    if (!valor || valor.trim() === '') return false;
    
    // Validação específica para datas
    if (campo.tipo === 'date') {
      return /^\d{2}\/\d{2}\/\d{4}$/.test(valor);
    }
    
    // Validação específica para CPF/CNPJ
    if (campo.nome.startsWith('cpfCnpj_')) {
      const digits = valor.replace(/\D/g, '');
      return digits.length >= 11;
    }
    
    return true;
  }
  
  function validarClausulasObrigatorias() {
    const campoClaususlas = camposParaExibir.find(c => c.nome === 'clausulas' && !c.opcional);
    if (!campoClaususlas) return true;
    
    return clausulas.some(c => c.texto.trim() !== '');
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
              placeholder: isCpfCnpj ? 'Digite o CPF ou CNPJ' : '',
            };
            // Adiciona maxLength apenas para campos que não são de data
            if (campo.tipo !== 'date') {
              inputProps.maxLength = isCpfCnpj ? 18 : maxLength;
            }
            if (campo.tipo === 'number') inputProps.inputMode = 'numeric';
            if (campo.tipo === 'money') {
              inputProps.inputMode = 'decimal';
              inputProps.placeholder = 'Ex: 1000,00';
            }
            if (campo.tipo === 'date') {
              const currentValue = fields[campo.nome] || '';
              
              return (
                <div key={campo.nome} className="field">
                  <label>{campo.label}{obrigatorio && <span style={{color:'#d00',marginLeft:4}}>*</span>}:</label>
                  <input 
                    type="text"
                    name={campo.nome}
                    value={currentValue}
                    onChange={handleChange}
                    placeholder="dd/mm/aaaa"
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
                  <label>{campo.label}{obrigatorio && <span style={{color:'#d00',marginLeft:4}}>*</span>}:</label>
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
                    >
                      + Adicionar Cláusula
                    </button>
                  </div>
                </div>
              );
            }
            
            if (campo.tipo === 'select') {
              return (
                <div key={campo.nome} className="field">
                  <label>{campo.label}{obrigatorio && <span style={{color:'#d00',marginLeft:4}}>*</span>}:</label>
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
                <label>{campo.label}{obrigatorio && <span style={{color:'#d00',marginLeft:4}}>*</span>}:</label>
                <input {...inputProps} />
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
          className="btn btn-primary" 
          style={{
            marginTop: '1rem',
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
