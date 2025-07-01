// Serviço para manipulação de contratos em XML e geração de PDF
// Dependências sugeridas: fast-xml-parser, jsPDF (instale depois com npm install fast-xml-parser jspdf)

import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import jsPDF from 'jspdf';

const parser = new XMLParser();
const builder = new XMLBuilder();

export default {
  // Converte XML string para objeto JS
  parseXml(xmlString) {
    return parser.parse(xmlString);
  },

  // Converte objeto JS para XML string
  buildXml(obj) {
    return builder.build(obj);
  },

  // Gera PDF a partir de um XML de contrato, com estilo selecionável
  generatePdfFromXml(xmlString, style = 'moderno') {
    const contrato = parser.parse(xmlString);
    if (style === 'formal') {
      return this._generateFormalPdf(contrato);
    }
    // Default: moderno
    return this._generateModernPdf(contrato);
  },

  // PDF moderno
  _generateModernPdf(contrato) {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 60;
    const titulo = contrato.contrato?.titulo || 'Contrato';
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor('#0074d9');
    doc.text(titulo, pageWidth / 2, y, { align: 'center' });
    y += 36;
    doc.setDrawColor('#e5e7eb');
    doc.setLineWidth(1);
    doc.line(60, y, pageWidth - 60, y);
    y += 20;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.setTextColor('#333');
    const partes = contrato.contrato?.partes || {};
    if (typeof partes === 'object') {
      Object.entries(partes).forEach(([key, value]) => {
        if (typeof value === 'string') {
          doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}:`, 70, y);
          doc.setFont('helvetica', 'bold');
          doc.text(value, 160, y);
          doc.setFont('helvetica', 'normal');
          y += 22;
        } else if (Array.isArray(value)) {
          value.forEach((v, i) => {
            doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)} ${i + 1}:`, 70, y);
            doc.setFont('helvetica', 'bold');
            doc.text(v.nome || v, 160, y);
            doc.setFont('helvetica', 'normal');
            y += 22;
          });
        }
      });
    }
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor('#222');
    const corpo = contrato.contrato?.corpo || '';
    const corpoLines = doc.splitTextToSize(corpo, pageWidth - 120);
    doc.setFillColor('#f9fafb');
    doc.roundedRect(60, y, pageWidth - 120, corpoLines.length * 20 + 32, 12, 12, 'F');
    doc.text(corpoLines, 80, y + 28);
    y += corpoLines.length * 20 + 48;
    doc.setFontSize(10);
    doc.setTextColor('#888');
    doc.text('Gerado por ContractGen', pageWidth - 60, doc.internal.pageSize.getHeight() - 30, { align: 'right' });
    return doc;
  },

  // PDF formal
  _generateFormalPdf(contrato) {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 80;
    // Título formal, caixa alta, preto
    const titulo = contrato.contrato?.titulo?.toUpperCase() || 'CONTRATO';
    doc.setFont('times', 'bold');
    doc.setFontSize(20);
    doc.setTextColor('#111');
    doc.text(titulo, pageWidth / 2, y, { align: 'center' });
    y += 40;
    // Partes, espaçamento clássico
    doc.setFont('times', 'italic');
    doc.setFontSize(13);
    doc.setTextColor('#222');
    const partes = contrato.contrato?.partes || {};
    if (typeof partes === 'object') {
      Object.entries(partes).forEach(([key, value]) => {
        if (typeof value === 'string') {
          doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`, 80, y);
          y += 20;
        } else if (Array.isArray(value)) {
          value.forEach((v, i) => {
            doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)} ${i + 1}: ${v.nome || v}`, 80, y);
            y += 20;
          });
        }
      });
    }
    y += 20;
    // Corpo do contrato, fonte clássica
    doc.setFont('times', 'normal');
    doc.setFontSize(13);
    doc.setTextColor('#111');
    const corpo = contrato.contrato?.corpo || '';
    const corpoLines = doc.splitTextToSize(corpo, pageWidth - 120);
    doc.text(corpoLines, 80, y + 10);
    y += corpoLines.length * 18 + 30;
    // Rodapé formal
    doc.setFontSize(10);
    doc.setTextColor('#888');
    doc.text('Gerado eletronicamente via ContractGen', pageWidth / 2, doc.internal.pageSize.getHeight() - 40, { align: 'center' });
    return doc;
  },

  // Salva o PDF gerado
  savePdf(doc, filename = 'contrato.pdf') {
    doc.save(filename);
  }
};
