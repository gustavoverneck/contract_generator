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
