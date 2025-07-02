// Serviço para geração de PDF a partir de HTML
// Dependências: jsPDF

import jsPDF from 'jspdf';

export default {
  // Função utilitária para verificar quebra de página
  _createPageBreakChecker(doc, margin) {
    const pageHeight = doc.internal.pageSize.getHeight();
    return (y, neededSpace) => {
      if (y + neededSpace > pageHeight - margin) {
        doc.addPage();
        return margin;
      }
      return y;
    };
  },

  // Gera PDF a partir de HTML
  generatePdfFromHtml(htmlContent, style = 'moderno') {
    // Cria uma div temporária para renderizar o HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.width = '210mm'; // A4 width
    document.body.appendChild(tempDiv);

    // Extrai o conteúdo do HTML
    const title = tempDiv.querySelector('.title')?.textContent || 'Contrato';
    const parties = Array.from(tempDiv.querySelectorAll('.party')).map(p => p.textContent);
    
    // Filtra cláusulas que têm conteúdo válido e renumera
    const allClauses = Array.from(tempDiv.querySelectorAll('.clause')).map(clause => ({
      title: clause.querySelector('.clause-title')?.textContent || '',
      content: clause.querySelector('.clause-content')?.textContent || ''
    }));
    
    // Remove cláusulas vazias e renumera
    const clauses = allClauses
      .filter(clause => {
        // Remove se título ou conteúdo estão vazios
        if (!clause.title || !clause.content) return false;
        
        // Remove se contém apenas texto de placeholder vazio
        const cleanContent = clause.content.trim();
        if (!cleanContent) return false;
        
        // Remove cláusulas que contêm apenas ":" sem valor
        if (cleanContent.endsWith(':') && cleanContent.length < 50) return false;
        
        // Remove cláusulas que contêm apenas "%" sem valor numérico antes
        if (/:\s*%\s*$/.test(cleanContent)) return false;
        
        // Remove cláusulas que só têm ":" seguido de quebra de linha ou espaços
        if (/:\s*(<br>|\n)?\s*$/.test(cleanContent)) return false;
        
        // Remove cláusulas que contêm apenas "meses" ou "%" sem valor
        return !/^[^:]*:\s*(meses|%|\d+%?)\s*(<br>|\n)?\s*$/.test(cleanContent);
      })
      .map((clause, index) => ({
        ...clause,
        // Renumera as cláusulas sequencialmente
        title: clause.title.replace(/CLÁUSULA \d+ª/, `CLÁUSULA ${index + 1}ª`)
      }));

    const signatures = Array.from(tempDiv.querySelectorAll('.signature-block')).map(sig => ({
      name: sig.querySelector('.signature-name')?.textContent || '',
      role: sig.querySelector('.signature-role')?.textContent || ''
    }));

    // Remove a div temporária
    document.body.removeChild(tempDiv);

    // Gera o PDF baseado no estilo
    if (style === 'formal') {
      return this._generateFormalPdf(title, parties, clauses, signatures);
    }
    // Default: moderno
    return this._generateModernPdf(title, parties, clauses, signatures);
  },

  // PDF estilo moderno
  _generateModernPdf(title, parties, clauses, signatures) {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 60;
    let y = 80;

    // Função para verificar quebra de página
    const checkPageBreak = this._createPageBreakChecker(doc, margin);

    // Título
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor('#2563eb');
    doc.text(title.toUpperCase(), pageWidth / 2, y, { align: 'center' });
    y += 40;

    // Linha decorativa
    doc.setDrawColor('#e5e7eb');
    doc.setLineWidth(2);
    doc.line(margin, y, pageWidth - margin, y);
    y += 30;

    // Partes
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor('#374151');
    
    parties.forEach(party => {
      y = checkPageBreak(y, 20);
      doc.text(party, margin, y);
      y += 25;
    });
    y += 10;

    // Cláusulas
    clauses.forEach((clause) => {
      if (clause.title && clause.content) {
        y = checkPageBreak(y, 40);
        
        // Título da cláusula
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor('#1f2937');
        doc.text(clause.title, margin, y);
        y += 20;

        // Conteúdo da cláusula
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor('#4b5563');
        
        const lines = doc.splitTextToSize(clause.content, pageWidth - 2 * margin);
        lines.forEach(line => {
          y = checkPageBreak(y, 15);
          doc.text(line, margin + 20, y);
          y += 15;
        });
        y += 15;
      }
    });

    // Assinaturas
    y += 30;
    y = checkPageBreak(y, 80);
    
    const signatureWidth = (pageWidth - 3 * margin) / 2;
    signatures.forEach((sig, index) => {
      const x = margin + (index * (signatureWidth + margin));
      
      // Linha de assinatura
      doc.setDrawColor('#6b7280');
      doc.setLineWidth(1);
      doc.line(x, y, x + signatureWidth, y);
      
      // Nome
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor('#1f2937');
      doc.text(sig.name, x + signatureWidth / 2, y + 20, { align: 'center' });
      
      // Função
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor('#6b7280');
      doc.text(sig.role, x + signatureWidth / 2, y + 35, { align: 'center' });
    });

    return doc;
  },

  // PDF estilo formal
  _generateFormalPdf(title, parties, clauses, signatures) {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 72;
    let y = 100;

    // Função para verificar quebra de página
    const checkPageBreak = (neededSpace) => {
      if (y + neededSpace > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };

    // Título
    doc.setFont('times', 'bold');
    doc.setFontSize(16);
    doc.setTextColor('#000000');
    doc.text(title.toUpperCase(), pageWidth / 2, y, { align: 'center' });
    y += 50;

    // Partes
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    
    parties.forEach(party => {
      checkPageBreak(20);
      doc.text(party, margin, y);
      y += 25;
    });
    y += 20;

    // Texto introdutório
    const intro = 'Pelo presente instrumento particular, as partes acima qualificadas têm entre si justo e acordado o presente contrato, que se regerá pelas cláusulas e condições seguintes:';
    const introLines = doc.splitTextToSize(intro, pageWidth - 2 * margin);
    introLines.forEach(line => {
      checkPageBreak(15);
      doc.text(line, margin, y);
      y += 15;
    });
    y += 20;

    // Cláusulas
    clauses.forEach((clause, index) => {
      if (clause.title && clause.content) {
        checkPageBreak(40);
        
        // Título da cláusula
        doc.setFont('times', 'bold');
        doc.text(clause.title, margin, y);
        y += 20;

        // Conteúdo da cláusula
        doc.setFont('times', 'normal');
        const lines = doc.splitTextToSize(clause.content, pageWidth - 2 * margin);
        lines.forEach(line => {
          checkPageBreak(15);
          doc.text(line, margin + 20, y);
          y += 15;
        });
        y += 20;
      }
    });

    // Texto de encerramento
    y += 20;
    checkPageBreak(40);
    const closing = 'E por estarem assim justos e contratados, firmam o presente instrumento em duas vias de igual teor.';
    doc.text(closing, margin, y);
    y += 40;

    // Assinaturas
    checkPageBreak(100);
    const signatureWidth = (pageWidth - 3 * margin) / 2;
    signatures.forEach((sig, index) => {
      const x = margin + (index * (signatureWidth + margin));
      
      // Linha de assinatura
      doc.setDrawColor('#000000');
      doc.setLineWidth(1);
      doc.line(x, y, x + signatureWidth, y);
      
      // Nome
      doc.setFont('times', 'normal');
      doc.setFontSize(11);
      doc.text(sig.name, x + signatureWidth / 2, y + 20, { align: 'center' });
      
      // Função
      doc.setFont('times', 'normal');
      doc.setFontSize(10);
      doc.text(sig.role, x + signatureWidth / 2, y + 35, { align: 'center' });
    });

    return doc;
  }
};
