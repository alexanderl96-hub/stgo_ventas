
//  export const modifyOrderPricing = ({
//   usdPrice,
//   exchangeRate,
//   formatPay
// }) => {


//   // 2️⃣ fee rule
//   let feePercent = 0.10;
//   let feeTotal = 0.55;
//   let totalVenta2 = 0;

//   let cupPrice =  usdPrice * exchangeRate;


//   if(usdPrice > 1){
//    totalVenta2 = Math.round((usdPrice * exchangeRate * (1 + feeTotal)) / 500) * 500
//   }else{
//    totalVenta2 = Math.round(usdPrice * exchangeRate * (1 + feeTotal))
//   }


//   let totalEfectivo = 0;
//   let gananciaVenta = 0;
//   let gananciaVendedor = 0;
//   let gananciaTienda = 0;



//   console.log("totalVenat 2", totalVenta2)


//     if (totalVenta2 > 5000 && formatPay?.trim() === "Transferencia") {

//         // ❗ FIX: totalEfectivo should NOT be 10% of totalVenta
//         totalEfectivo = Math.round(totalVenta2 * (1 + feePercent));

//         gananciaVenta = totalEfectivo - cupPrice;

//         gananciaVendedor = Math.round(gananciaVenta * 0.4);

//         gananciaTienda = gananciaVenta - gananciaVendedor;

//     } else if (totalVenta2 > 20000 && formatPay?.trim() === "Zelle") {
       
//         totalEfectivo = Math.round(totalVenta2 / exchangeRate);

//         gananciaVenta = totalVenta2 - cupPrice;

//         gananciaVendedor = Math.round(gananciaVenta * 0.4);

//         gananciaTienda = gananciaVenta - gananciaVendedor;

//     } else {
        
//         totalEfectivo = totalVenta2;

//         gananciaVenta = totalVenta2 - cupPrice;

//         gananciaVendedor = Math.round(gananciaVenta * 0.4);

//         gananciaTienda = gananciaVenta - gananciaVendedor;
//     }

//   return {
//     cupPrice,
//     feePercent: feePercent * 100,
//     feeTotal: feeTotal * 100,
//     totalVenta: totalVenta2, 

//     totalEfectivo,
//     gananciaVenta,
//     gananciaVendedor,
//     gananciaTienda

//   };
// };

// export const modifyOrderPricing = ({
//   usdPrice,
//   exchangeRate,
//   formatPay,
//   quantity
// }) => {

//   const feePercent = 0.10; // 10%
//   const feeTotal = 0.55;   // 55%
//   const realUSD = Number(usdPrice) / Number(quantity)

//   console.log("realUSD", realUSD)

//   // Cost in CUP
//   const cupPrice =
//     Number(usdPrice) *
//     Number(exchangeRate);

//   // Sale price in CUP
//   let totalVenta = 0;

//   if (realUSD > 1) {

//     totalVenta =
//       Math.round(
//         (
//           Number(usdPrice) *
//           Number(exchangeRate) *
//           (1 + feeTotal)
//         ) / 500
//       ) * 500;

//   } else {

//     totalVenta =
//       Math.round(
//         Number(usdPrice) *
//         Number(exchangeRate) *
//         (1 + feeTotal)
//       );

//   }

//   let totalEfectivo = totalVenta;

//   // Transferencia surcharge
//   if (
//     formatPay?.trim() === "Transferencia" &&
//     totalVenta > 5000
//   ) {

//     totalEfectivo =
//       Math.round(
//         totalVenta *
//         (1 + feePercent)
//       );
//   }

//   // Zelle always pays in USD
//   else if (
//     formatPay?.trim() === "Zelle"
//   ) {

//     totalEfectivo =
//       Math.round(
//         (totalVenta / exchangeRate) * 100
//       ) / 100;
//   }

//   // Profit calculations remain in CUP
//   const gananciaVenta =
//     totalVenta - cupPrice;

//   const gananciaVendedor =
//     Math.round(
//       gananciaVenta * 0.4
//     );

//   const gananciaTienda =
//     gananciaVenta -
//     gananciaVendedor;

//   return {
//     cupPrice,                 // CUP
//     feePercent: feePercent * 100,
//     feeTotal: feeTotal * 100,

//     totalVenta,               // CUP

//     totalEfectivo,            // CUP or USD depending on payment method

//     paymentCurrency:
//       formatPay?.trim() === "Zelle"
//         ? "USD"
//         : "CUP",

//     gananciaVenta,            // CUP
//     gananciaVendedor,         // CUP
//     gananciaTienda            // CUP
//   };
// };


export const modifyOrderPricing = ({
  usdPrice,
  exchangeRate,
  formatPay,
  quantity,
  price2
}) => {

  const feePercent = 0.10; // 10%
  const feeTotal = 0.55;   // 55%
  const realUSD = Number(usdPrice) / Number(quantity)

  console.log("realUSD", realUSD)
   console.log("price", price2)

  // Cost in CUP
  const cupPrice =
    Number(usdPrice) *
    Number(exchangeRate);

  // Sale price in CUP
  let totalVenta = price2;

  // if (realUSD > 1) {

    // totalVenta =
    //   Math.round(
    //     (
    //       Number(usdPrice) *
    //       Number(exchangeRate) *
    //       (1 + feeTotal)
    //     ) / 500
    //   ) * 500;
    // totalVenta = ((Number(price2) * (1 + feeTotal)) / 500) * 500
    // totalVenta = (Number(price2) / 500) * 500;
    // totalVenta = Number(price2);

  // } else {

    // totalVenta =
    //   Math.round(
    //     Number(usdPrice) *
    //     Number(exchangeRate) *
    //     (1 + feeTotal)
    //   );
    // totalVenta = (Number(price2) * (1 + feeTotal));
    // totalVenta = Number(price2);
  // }

  console.log("totalventa", totalVenta)

  let totalEfectivo = totalVenta;

  // Transferencia surcharge
  if (
    formatPay?.trim() === "Transferencia" &&
    totalVenta > 5000
  ) {

    totalEfectivo =
      Math.round(
        Number(totalVenta) *
        (1 + feePercent)
      );
  }

  // Zelle always pays in USD
  else if (
    formatPay?.trim() === "Zelle" && 
    totalVenta > 20000 
  ) {

    totalEfectivo =
      Math.round(
        (totalVenta / exchangeRate) * 100
      ) / 100;
  }

  // Profit calculations remain in CUP
  const gananciaVenta =
    totalVenta - cupPrice;

  const gananciaVendedor =
    Math.round(
      gananciaVenta * 0.4
    );

  const gananciaTienda =
    gananciaVenta -
    gananciaVendedor;

  return {
    cupPrice,                 // CUP
    feePercent: feePercent * 100,
    feeTotal: feeTotal * 100,

    totalVenta,               // CUP

    totalEfectivo,            // CUP or USD depending on payment method

    paymentCurrency:
      formatPay?.trim() === "Zelle"
        ? "USD"
        : "CUP",

    gananciaVenta,            // CUP
    gananciaVendedor,         // CUP
    gananciaTienda            // CUP
  };
};




 export const modifySalePrice = (value) => {
    return Math.round(value / 500) * 500;
  };