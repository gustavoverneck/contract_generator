// src/utils/FieldFormatter.js
// Utilitário para formatação/máscara de campos padrão

export function formatCPF(value) {
  if (!value) return '';
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14);
}

export function formatCNPJ(value) {
  if (!value) return '';
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
    .slice(0, 18);
}

export function formatTelefone(value) {
  if (!value) return '';
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2')
    .slice(0, 15);
}

export function formatMoney(value) {
  if (!value) return '';
  // Remove tudo que não for dígito
  const onlyNums = value.replace(/\D/g, '');
  // Se vazio, retorna vazio
  if (!onlyNums) return '';
  // Converte para centavos
  const cents = parseInt(onlyNums, 10);
  // Divide por 100 para obter reais
  const reais = cents / 100;
  // Formata para BRL
  return reais.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  });
}

export function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d)) return value;
  return d.toLocaleDateString('pt-BR');
}

// Converte de YYYY-MM-DD para DD/MM/YYYY
export function formatDateToBR(dateStr) {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

// Converte de DD/MM/YYYY para YYYY-MM-DD
export function formatDateToISO(dateStr) {
  if (!dateStr) return '';
  // Remove caracteres não numéricos
  const numbers = dateStr.replace(/\D/g, '');
  if (numbers.length !== 8) return '';
  
  // Assume formato DDMMYYYY
  const day = numbers.substring(0, 2);
  const month = numbers.substring(2, 4);
  const year = numbers.substring(4, 8);
  
  // Valida se é uma data válida
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  if (date.getFullYear() != parseInt(year) || 
      date.getMonth() != parseInt(month) - 1 || 
      date.getDate() != parseInt(day)) {
    return '';
  }
  
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// Aplica máscara DD/MM/YYYY enquanto o usuário digita
export function formatDateBRMask(value) {
  if (!value) return '';
  // Remove tudo que não for número
  const numbers = value.replace(/\D/g, '');
  // Aplica a máscara gradualmente
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 4) return `${numbers.substring(0, 2)}/${numbers.substring(2)}`;
  return `${numbers.substring(0, 2)}/${numbers.substring(2, 4)}/${numbers.substring(4, 8)}`;
}

export function formatField(tipo, value) {
  switch (tipo) {
    case 'cpf': return formatCPF(value);
    case 'cnpj': return formatCNPJ(value);
    case 'tel': return formatTelefone(value);
    case 'money': return formatMoney(value);
    case 'date': return formatDate(value);
    default: return value;
  }
}
