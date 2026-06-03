// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import QRCode from "react-qr-code";

// export default function WhatsAppOrder({
//   fullName,
//   address,
//   phone,
//   formatPhone,
//   cart,
//   step,
//   setStep,
//   setAddress, setFullname, setPhone, setCart
// }) {

//   const navigate = useNavigate();

//  const BUSINESS_PHONES = [ "5350031672" , "5356428430"];


// const handleSendWhatsApp = () => {
//   if (!fullName || !address || phone.length !== 8) return;

//   const message = buildOrderMessage(cart, fullName, address, phone);

  


//     // ✅ open WhatsApp (only one)
//   window.open(`https://wa.me/${BUSINESS_PHONES[0]}?text=${message}`, "_blank");

//   setFullname("");
//   setAddress("");
//   setPhone("");
//   setCart([])
//   setStep("succes");
//    navigate("/");
// };

// const buildOrderMessage = (cart, fullName, address, phone) => {
//   const mainImage = "https://via.placeholder.com/300"; // replace later

//   let productsText = cart.map((item, index) => {
//     return `
// ${index + 1}. 👟 ${item.name}
//    🏷 ${item.category}
//    💲 Precio: ${item.price}
//    🔢 Cantidad: ${item.qty}
//    📏 Talla: ${item.size || "N/A"}
// `;
//   }).join("\n");

//   const message = `
// 🖼 Producto:
// ${mainImage}

// 🚚 NUEVA ORDEN

// 👤 Nombre: ${fullName}
// 📍 Dirección: ${address}
// 📞 Teléfono: +53 ${formatPhone(phone)}

// 🛒 PRODUCTOS:
// ${productsText}

// 📦 Entrega: 24–48 horas
// `;

//   return encodeURIComponent(message.trim());
// };
//   const handleClose = () => {
//     setStep("idle");
//   };

//   return (
//     <>
//       {/* BUTTON */}
//       <button
//         className="confirm-btn"
//         disabled={!fullName || !address || phone.length !== 8}
//         onClick={handleSendWhatsApp}
//       >
//         Confirmar por WhatsApp
//       </button>

//       {/* MODAL */}
//       {step === "success" && (
//         <div className="modal-overlay" onClick={handleClose}>
//           <div
//             className="modal-box success-modal"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h3>📲 Redirigiendo a WhatsApp</h3>

//             <p>
//               Tu pedido será enviado por WhatsApp para confirmación.
//             </p>

//             <p>
//               📦 Entrega estimada: <strong>24–48 horas</strong>
//             </p>

//             <button className="confirm-btn" onClick={handleClose}>
//               Cerrar
//             </button>
//           </div>
//         </div>
//       )}

  
//     </>
//   );
// }

import { useNavigate } from "react-router-dom";
// import { ShoppingCart, Menu, X, Search, QrCode, Store,
//    XCircle, } from "lucide-react";
import data from "../data_json"

export default function WhatsAppOrder({
  fullName,
  address,
  phone,
  formatPhone,
  cart,
  step,
  setStep,
  setAddress,
  setFullname,
  setPhone,
  setCart,
  result,
  customers,
  revenuesPayTotal, 
  revenuesPayFormat,
  revenuesSeller,
  revenuesTienda,
  formatPay,
  setMoneyType,
  moneyType
}) {
  const navigate = useNavigate();

  const MAIN_PHONE =  `${result.map(a => a.phone)[0]}` ; // 👈 use one number

  const translateColor = (color) => {
     return data.colorMap[color?.toLowerCase()] || color;
  };
  
  const ordersUser = customers?.flatMap(
    c => (c.order || []).map(o => o.orders)
  )[0]


  console.log("result", result)
  console.log("cart", cart)
  console.log("customers whatsapp new order", customers)


  const handleSendWhatsApp = () => {
    // if( customers.length === 0) return
    if (!fullName || !address || phone.length !== 8) return;

    const message = buildOrderMessage(ordersUser, fullName, address, phone );

    window.open(`https://wa.me/${MAIN_PHONE}?text=${message}`, "_blank");

    // ✅ reset state
    setFullname("");
    setAddress("");
    setPhone("");
    setCart([]);
    setMoneyType("cup")

    setStep("success"); // ✅ fixed typo

    navigate("/");
  };

  const buildOrderMessage = (ordersUser, fullName, address, phone, ) => {
  //   const orderId = Date.now();

  //   const orderLink = `https://yourapp.com/order/${orderId}`;

  //   const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(orderLink)}`;

    let productsText = ordersUser.map((item, index) => {
      return `• *${item.name}*
          Precio: $${item.price}
          Cantidad: ${item.qty}
          Talla: ${item.size || "N/A"}
          Color: ${translateColor(item.color)}`
          ;

    }).join("\n\n");

    // let proooo = customers.map(a => a.order.map( b => a.orders))

  const message = `
  🛍 *NUEVA ORDEN*

  ━━━━━━━━━━━━━━━
  👤 *Cliente*
  ━━━━━━━━━━━━━━━
  Nombre: ${fullName}
  Dirección: ${address}
  Teléfono: +53 ${formatPhone(phone)}

  ━━━━━━━━━━━━━━━
  🛒 *Productos*
  ━━━━━━━━━━━━━━━
  ${productsText}

  ━━━━━━━━━━━━━━━
  📦 *Entrega a Domicilio*
    * Forma de pago: 
        > ${formatPay}
    * Total: $${revenuesPayTotal} ${moneyType}
    * Vendedor: $${revenuesSeller} cup
    * Tienda: $${revenuesTienda} cup
        
  ━━━━━━━━━━━━━━━
  Tiempo estimado: *24–48 horas*
  !!Domicilio no esta incluido!!


  Gracias por su compra!!!
  `;

    return encodeURIComponent(message.trim());
  };


  const handleClose = () => {
    setStep("idle");
  };

  return (
    <>
      <button
        className="confirm-btn"
        disabled={!fullName || !address || phone.length !== 8}
        onClick={handleSendWhatsApp}
      >
        Confirmar por WhatsApp
      </button>

      {step === "success" && (
        <div className="modal-overlay" onClick={handleClose}>
          <div
            className="modal-box success-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>📲 Redirigiendo a WhatsApp</h3>

            <p>Tu pedido fue enviado correctamente.</p>

            <p>
              📦 Entrega estimada: <strong>24–48 horas</strong>
            </p>

            <button className="confirm-btn" onClick={handleClose}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}