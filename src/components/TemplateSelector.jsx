import React from "react";
import { FiFileText, FiBox, FiHome, FiUserCheck, FiShield, FiLock } from "react-icons/fi";
import "./TemplateSelector.css";

// Ícones por tipo de contrato
const ICONS = {
  servico: <FiFileText size={32} />, // Serviços
  produto: <FiBox size={32} />,     // Produto
  aluguel: <FiHome size={32} />,    // Aluguel
  nda: <FiUserCheck size={32} />,   // NDA
  parceria: <FiShield size={32} />, // Parceria
  estagio: <FiLock size={32} />,    // Estágio
  trabalho: <FiUserCheck size={32} />, // Contrato de Trabalho
  compra: <FiBox size={32} />,        // Compra e Venda
  comodato: <FiHome size={32} />,     // Comodato
  franquia: <FiShield size={32} />,   // Franquia
  confidencialidade: <FiLock size={32} /> // Confidencialidade
};

export default function TemplateSelector({ templates, selectedId, onSelect }) {
  return (
    <div className="template-selector-cards">
      {templates.map(t => (
        <button
          key={t.id}
          type="button"
          className={`template-card${selectedId === t.id ? " selected" : ""}`}
          onClick={() => onSelect(t.id)}
          tabIndex={0}
          aria-pressed={selectedId === t.id}
        >
          <div className="template-icon">{ICONS[t.id] || <FiFileText size={32} />}</div>
          <div className="template-info">
            <div className="template-title">{t.nome}</div>
            <div className="template-desc">{t.descricao}</div>
            {t.exemplos && <ul className="template-exemplos">{t.exemplos.map((ex, i) => <li key={i}>{ex}</li>)}</ul>}
          </div>
        </button>
      ))}
    </div>
  );
}
