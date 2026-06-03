export const calculateOrderPricing = ({
  usdPrice,
  exchangeRate,
  formatPay
}) => {

  // 1️⃣ base conversion
  let cupPrice = Math.round(usdPrice * exchangeRate);

  // 2️⃣ fee rule
  let feePercent = 0.10;
  let feeTotal = 0.55;

  const totalVenta = Math.round(usdPrice * exchangeRate * (1 + feeTotal));
  let totalZelle = totalVenta;
  let totalEfectivo = 0;
  let gananciaVenta = 0;
  let gananciaVendedor = 0;
  let gananciaTienda = 0;


    if (cupPrice > 5000 && formatPay === "Tranferencia") {

        // ❗ FIX: totalEfectivo should NOT be 10% of totalVenta
        totalEfectivo = Math.round(totalVenta * (1 + feePercent));

        gananciaVenta = totalEfectivo - cupPrice;

        gananciaVendedor = Math.round(gananciaVenta * 0.4);

        gananciaTienda = gananciaVenta - gananciaVendedor;

        console.log("transfer", totalEfectivo, gananciaVenta, gananciaVendedor, gananciaTienda);

    } else if (totalZelle > 20000 && formatPay === "Zelle") {
       
        totalEfectivo = Math.round(totalVenta / exchangeRate);

        gananciaVenta = totalVenta - cupPrice;

        gananciaVendedor = Math.round(gananciaVenta * 0.4);

        gananciaTienda = gananciaVenta - gananciaVendedor;

    } else {

        totalEfectivo = totalVenta;

        gananciaVenta = totalVenta - cupPrice;

        gananciaVendedor = Math.round(gananciaVenta * 0.4);

        gananciaTienda = gananciaVenta - gananciaVendedor;
    }

  return {
    cupPrice,
    feePercent: feePercent * 100,
    feeTotal: feeTotal * 100,
    totalVenta, 

    totalEfectivo,
    gananciaVenta,
    gananciaVendedor,
    gananciaTienda

  };
};


export const calculateOrder = (  usdPrice,
  exchangeRate,
  formatPay
) => {

    // 1️⃣ base conversion
  let cupPrice = Math.round(usdPrice * exchangeRate);

  // 2️⃣ fee rule
  let feePercent = 0.10;
  let feeTotal = 0.55;

  const totalVenta = Math.round(usdPrice * exchangeRate * (1 + feeTotal));
  let totalZelle = totalVenta;
  let totalEfectivo = 0;
//   let gananciaVenta = 0;
//   let gananciaVendedor = 0;
//   let gananciaTienda = 0;


    if (cupPrice > 5000 && formatPay === "Tranferencia") {

        // ❗ FIX: totalEfectivo should NOT be 10% of totalVenta
        totalEfectivo = Math.round(totalVenta * (1 + feePercent));

        // gananciaVenta = totalEfectivo - cupPrice;

        // gananciaVendedor = Math.round(gananciaVenta * 0.4);

        // gananciaTienda = gananciaVenta - gananciaVendedor;

        // console.log("transfer", totalEfectivo, gananciaVenta, gananciaVendedor, gananciaTienda);

    } else if (totalZelle > 20000 && formatPay === "Zelle") {
       
        totalEfectivo = Math.round(totalVenta / exchangeRate);

        // gananciaVenta = totalVenta - cupPrice;

        // gananciaVendedor = Math.round(gananciaVenta * 0.4);

        // gananciaTienda = gananciaVenta - gananciaVendedor;

    } else {

        totalEfectivo = totalVenta;

        // gananciaVenta = totalVenta - cupPrice;

        // gananciaVendedor = Math.round(gananciaVenta * 0.4);

        // gananciaTienda = gananciaVenta - gananciaVendedor;
    }

    return totalEfectivo;
   
}

