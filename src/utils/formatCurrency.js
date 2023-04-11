export default function formatCurrency(currency) {
  const toNumber = (
    typeof currency === 'number'
      ? Number(currency.toFixed(2).replace(/\D/g, '')) / 100
      : Number(currency.replace(/\D/g, '')).toFixed(2) / 100);
  const valueBr = toNumber.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return valueBr;
}
