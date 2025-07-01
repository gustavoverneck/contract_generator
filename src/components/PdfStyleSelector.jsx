import React from "react";
import "./PdfStyleSelector.css";

function PdfStyleMiniatura({ styleId }) {
  // Miniaturas CSS para cada estilo
  if (styleId === 'moderno') {
    return (
      <div className="pdf-miniatura moderno">
        <div className="pdf-titulo" />
        <div className="pdf-linha" />
        <div className="pdf-corpo" />
        <div className="pdf-rodape" />
      </div>
    );
  }
  // Estilo formal
  return (
    <div className="pdf-miniatura formal">
      <div className="pdf-titulo" />
      <div className="pdf-partes" />
      <div className="pdf-corpo" />
      <div className="pdf-rodape" />
    </div>
  );
}

export default function PdfStyleSelector({ styles, selectedStyle, onSelect }) {
  return (
    <div className="pdf-style-selector-cards">
      {styles.map(style => (
        <button
          key={style.id}
          type="button"
          className={`pdf-style-card${selectedStyle === style.id ? " selected" : ""}`}
          onClick={() => onSelect(style.id)}
          tabIndex={0}
          aria-pressed={selectedStyle === style.id}
        >
          <div className="pdf-style-preview">
            <PdfStyleMiniatura styleId={style.id} />
          </div>
          <div className="pdf-style-info">
            <div className="pdf-style-title">{style.nome}</div>
            <div className="pdf-style-desc">{style.descricao}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
