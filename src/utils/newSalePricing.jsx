
 export const modifyOrderPricing = ({
  usdPrice,
  exchangeRate,
  formatPay
}) => {

  // 1️⃣ base conversion
  let cupPrice = Math.round(usdPrice * exchangeRate);

  // 2️⃣ fee rule
  let feePercent = 0.10;
  let feeTotal = 0.55;
  let totalVenta2 = 0;

  if(usdPrice > 1){
   totalVenta2 = Math.round(usdPrice * exchangeRate * (1 + feeTotal))
  }else{
   totalVenta2 = modifySalePrice(Math.round(usdPrice * exchangeRate * (1 + feeTotal)))
  }

//   const totalVenta2 = Math.round(usdPrice * exchangeRate * (1 + feeTotal));
     
//   const totalVenta2 = modifySalePrice(Math.round(usdPrice * exchangeRate * (1 + feeTotal)));
  let totalZelle = totalVenta2;
  let totalEfectivo = 0;
  let gananciaVenta = 0;
  let gananciaVendedor = 0;
  let gananciaTienda = 0;



  console.log("totalVenat 2", totalVenta2)


    if (totalVenta2 > 5000 && formatPay?.trim() === "Transferencia") {

        // ❗ FIX: totalEfectivo should NOT be 10% of totalVenta
        totalEfectivo = Math.round(totalVenta2 * (1 + feePercent));

        gananciaVenta = totalEfectivo - cupPrice;

        gananciaVendedor = Math.round(gananciaVenta * 0.4);

        gananciaTienda = gananciaVenta - gananciaVendedor;

    } else if (totalVenta2 > 20000 && formatPay?.trim() === "Zelle") {
       
        totalEfectivo = Math.round(totalVenta2 / exchangeRate);

        gananciaVenta = totalVenta2 - cupPrice;

        gananciaVendedor = Math.round(gananciaVenta * 0.4);

        gananciaTienda = gananciaVenta - gananciaVendedor;

    } else {
        
        totalEfectivo = totalVenta2;

        gananciaVenta = totalVenta2 - cupPrice;

        gananciaVendedor = Math.round(gananciaVenta * 0.4);

        gananciaTienda = gananciaVenta - gananciaVendedor;
    }

  return {
    cupPrice,
    feePercent: feePercent * 100,
    feeTotal: feeTotal * 100,
    totalVenta: totalVenta2, 

    totalEfectivo,
    gananciaVenta,
    gananciaVendedor,
    gananciaTienda

  };
};

 export const modifySalePrice = (value) => {
    return Math.round(value / 500) * 500;
  };