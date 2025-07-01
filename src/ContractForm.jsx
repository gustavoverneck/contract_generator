import React, { useState, useEffect } from 'react';
import TemplateService, { PDF_STYLES } from './services/TemplateService';
import PdfService from './services/PdfService';
import TemplateSelector from './components/TemplateSelector';
import PdfStyleSelector from './components/PdfStyleSelector';
import { formatField } from './utils/FieldFormatter';
import './components/TemplateSelector.css';
import './components/PdfStyleSelector.css';

export default function ContractForm() {
  const templates = TemplateService.getTemplates();
  const [selectedId, setSelectedId] = useState(templates[0].id);
  const [fields, setFields] = useState({});
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfStyle, setPdfStyle] = useState(PDF_STYLES[0].id);
  const [clausulas, setClausulas] = useState(['']);

  const template = TemplateService.getTemplateById(selectedId);

  useEffect(() => {
    const initial = {};
    template.campos.forEach(c => { initial[c.nome] = ''; });
    setFields(initial);
    setClausulas(['']);
    setPdfUrl(null);
  }, [selectedId]);

  function gerarPdfPreview(e) {
    e && e.preventDefault();
    let campos = { ...fields };
    if (template.campos.some(c => c.nome === 'descricao')) {
      campos['descricao'] = fields['descricao'] || '';
    }
    if (template.campos.some(c => c.nome === 'clausulas')) {
      campos['clausulas'] = clausulas.filter(Boolean).map((c, i) => `Cláusula ${i + 1}: ${c}`).join('\n');
    }
    template.campos.forEach(c => {
      if (c.opcional && !campos[c.nome]) campos[c.nome] = '';
    });
    const xml = TemplateService.fillTemplateXml(template.xmlBase, campos);
    const doc = PdfService.generatePdfFromXml(xml, pdfStyle);
    const pdfBlob = doc.output('blob');
    setPdfUrl(URL.createObjectURL(pdfBlob));
  }

  function handleChange(e) {
    const { name, value, maxLength, type } = e.target;
    let val = value;
    // Formatação automática
    const campo = template.campos.find(c => c.nome === name);
    if (campo && ['cpf', 'cnpj', 'tel', 'money', 'date'].includes(campo.tipo)) {
      val = formatField(campo.tipo, value);
    }
    // Limite de caracteres
    if (maxLength && val.length > maxLength) {
      val = val.slice(0, maxLength);
    }
    setFields({ ...fields, [name]: val });
  }

  function handleClausulaChange(idx, value) {
    const max = 300;
    const novas = [...clausulas];
    novas[idx] = value.slice(0, max);
    setClausulas(novas);
  }

  function addClausula() {
    setClausulas([...clausulas, '']);
  }

  function removeClausula(idx) {
    setClausulas(clausulas.filter((_, i) => i !== idx));
  }

  return (
    <div className="contract-form">
      <h2>Gerador de Contratos</h2>
      <form onSubmit={gerarPdfPreview}>
        <label>Tipo de contrato:</label>
        <TemplateSelector
          templates={templates}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <label>Estilo do PDF:</label>
        <PdfStyleSelector
          styles={PDF_STYLES}
          selectedStyle={pdfStyle}
          onSelect={setPdfStyle}
        />
        <div className="fields">
          {template.campos.map(campo => {
            const obrigatorio = !campo.opcional;
            const maxLength = campo.tipo === 'textarea' ? 600 : campo.tipo === 'text' ? 120 : campo.tipo === 'cpf' ? 14 : campo.tipo === 'cnpj' ? 18 : campo.tipo === 'tel' ? 15 : campo.tipo === 'money' ? 20 : campo.tipo === 'email' ? 80 : campo.tipo === 'number' ? 12 : undefined;
            if (campo.tipo === 'textarea') {
              return (
                <div key={campo.nome} className="field">
                  <label>{campo.label}{obrigatorio && <span style={{color:'#d00',marginLeft:4}}>*</span>}:</label>
                  <textarea
                    name={campo.nome}
                    value={fields[campo.nome] || ''}
                    onChange={handleChange}
                    rows={3}
                    maxLength={maxLength}
                    style={{width:'100%',padding:'0.7rem',borderRadius:'0.5rem',border:'1px solid #e5e7eb'}}
                  />
                  <div style={{fontSize:'0.85em',color:'#888',textAlign:'right'}}>{(fields[campo.nome]||'').length}/{maxLength}</div>
                </div>
              );
            }
            if (campo.tipo === 'clausulas') {
              return (
                <div key={campo.nome} className="field">
                  <label>{campo.label}{obrigatorio && <span style={{color:'#d00',marginLeft:4}}>*</span>}:</label>
                  {clausulas.map((cl, idx) => (
                    <div key={idx} style={{display:'flex',alignItems:'center',marginBottom:'0.5rem'}}>
                      <input
                        type="text"
                        value={cl}
                        onChange={e => handleClausulaChange(idx, e.target.value)}
                        placeholder={`Cláusula ${idx + 1}`}
                        maxLength={300}
                        style={{flex:1,marginRight:8,padding:'0.5rem',borderRadius:'0.5rem',border:'1px solid #e5e7eb'}}
                      />
                      {clausulas.length > 1 && (
                        <button type="button" onClick={() => removeClausula(idx)} style={{background:'#eee',border:'none',borderRadius:'0.5rem',padding:'0.3rem 0.7rem',cursor:'pointer'}}>✕</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={addClausula} style={{background:'#0074d9',color:'#fff',border:'none',borderRadius:'0.5rem',padding:'0.4rem 1rem',marginTop:'0.3rem',cursor:'pointer'}}>Adicionar Cláusula</button>
                  <div style={{fontSize:'0.85em',color:'#888',textAlign:'right'}}>{clausulas.reduce((acc, c) => acc + c.length, 0)}/300 cada</div>
                </div>
              );
            }
            // Campos normais
            return (
              <div key={campo.nome} className="field">
                <label>{campo.label}{obrigatorio && <span style={{color:'#d00',marginLeft:4}}>*</span>}:</label>
                <input
                  type={campo.tipo === 'money' ? 'text' : campo.tipo}
                  name={campo.nome}
                  value={fields[campo.nome] || ''}
                  onChange={handleChange}
                  required={obrigatorio}
                  maxLength={maxLength}
                  autoComplete={campo.tipo === 'email' ? 'email' : 'off'}
                  inputMode={campo.tipo === 'money' ? 'decimal' : campo.tipo === 'number' ? 'numeric' : undefined}
                />
                {maxLength && <div style={{fontSize:'0.85em',color:'#888',textAlign:'right'}}>{(fields[campo.nome]||'').length}/{maxLength}</div>}
              </div>
            );
          })}
        </div>
        <button type="button" className="btn btn-primary" style={{marginTop:'1rem'}} onClick={gerarPdfPreview}>Visualizar Contrato</button>
      </form>
      <div className="preview-area">
        <h3>Pré-visualização do Contrato (PDF)</h3>
        {pdfUrl && (
          <iframe src={pdfUrl} title="Contrato PDF" width="100%" height="500px" style={{border:'1px solid #ccc',borderRadius:'0.5rem',background:'#fff'}}></iframe>
        )}
      </div>
    </div>
  );
}
