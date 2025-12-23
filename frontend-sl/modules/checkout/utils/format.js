export function formatAmount(amount) {
  if (!amount || isNaN(amount)) return "0";
  return Number(amount).toLocaleString("en-BD");
}
