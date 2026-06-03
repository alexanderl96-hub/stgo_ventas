export const generateOrderQr = (orders = []) => {
  if (!orders || orders.length === 0) {
    return "ORDER1QR";
  }

//   🔥 extract numbers from existing QR codes
  const numbers = orders
    .map(o => o)
    // .filter(Boolean)
    .map(qr => parseInt(qr.replace("ORDER", "").replace("QR", "")))
    .filter(n => !isNaN(n));

  const nextNumber = numbers.length > 0
    ? Math.max(...numbers) + 1
    : 1;

  return `ORDER${nextNumber}QR`;
};