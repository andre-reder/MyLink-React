export default function formatCurrency(currency) {
  const toNumber = typeof currency === 'number' ? Number(String(currency).replace(/\D/g, '')) / 100 : Number(currency.replace(/\D/g, '')) / 100;
  const valueBr = toNumber.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return valueBr;
}
