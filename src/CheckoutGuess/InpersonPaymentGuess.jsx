import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useDataProducts from "../api/dataProducts";
import useDataOrders from "../api/useDataOrders";
import { generateOrderQr } from "../utils/orderQrGenerator";
import { calculateOrderPricing } from "../utils/pricing";

export default function InPersonPaymentGuess({
  user,
  cart,
  setCart,
  amountOrder,
  customers,
  setCustomers,
  method,
  formatPay
}) {

  const navigate = useNavigate();
  const { admin } = useDataProducts();
  // const { ordersQR } = useDataOrders();

  const [step, setStep] = useState("idle");
  const [phone, setPhone] = useState("");


  const person = amountOrder.map(a => a.person_in_charge)?.[0] || "";
  console.log("person", person)
   console.log("admin", admin)

  // -----------------------------
  // 🧠 FORMAT PHONE
  // -----------------------------
  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 8);

    const part1 = cleaned.slice(0, 2);
    const part2 = cleaned.slice(2, 5);
    const part3 = cleaned.slice(5, 8);

    if (cleaned.length < 3) return `(${part1}`;
    if (cleaned.length < 6) return `(${part1}) ${part2}`;
    return `(${part1}) ${part2}-${part3}`;
  };

  // -----------------------------
  // 🧠 CREATE ORDER (FINAL STEP ONLY)
  // -----------------------------

  const createOrder = () => {

    const usdTotal = amountOrder.reduce(
        (sum, a) => sum + (a.dollar_price || 0),
        0
    );

    const exchangeRate = amountOrder[0]?.current_dollar_price ;

    const pricing = calculateOrderPricing({
        usdPrice: usdTotal,
        exchangeRate,
        formatPay
    });

    return {
        id: Date.now(),
        // qrcode: generateOrderQr(ordersQR.map(c => c.qrcode)),
        qrcode: "",
        adm_in_charge: person,
        gestor_sell: "",

        orders: amountOrder.map(item => ({
        name: item.name,
        qty: item.qty || 1,
        img: item.img || "",
        price: item.price || 0,
        color: item.color || "",
        size: item.size || "",
        dollar_price: item.dollar_price || 0,
        })),

        dollar_price: usdTotal,
        cup_price: pricing.cupPrice,
        revenew_total: pricing.totalEfectivo ,
        seller_cash: pricing.gananciaVendedor ,
        tienda: pricing.gananciaTienda ,
        phone,
        date: new Date(),
        payment_format: formatPay,
        payment_option: method,
        status_sell: "Pendiente"
    };
    };

  // -----------------------------
  // 🧠 SAVE ORDER
  // -----------------------------
  const saveOrder = (order) => {
  const email = user?.email || `guest_${Date.now()}@local`;

  setCustomers(prev => {

    let found = false;

    const updated = prev.map(customer => {

      if (customer.email === email) {
        found = true;

        const newOrders = [...(customer.order || []), order];

        const dollarPrice = newOrders.reduce(
          (sum, o) => sum + (o.dollar_price || 0),
          0
        );

        const cupPrice = newOrders.reduce(
          (sum, o) => sum + (o.cup_price || 0),
          0
        );

        const revenewTotal = newOrders.reduce(
          (sum, o) => sum + (o.revenew_total || 0),
          0
        );

        const sellerCash = newOrders.reduce(
          (sum, o) => sum + (o.seller_cash || 0),
          0
        );

        return {
          ...customer,
          order: newOrders,
          dollarPrice,
          cupPrice,
          revenewTotal,
          sellerCash
        };
      }

      return customer;
    });

    // 👻 CREATE GUEST IF NOT FOUND
    if (!found) {
      return [
        ...updated,
        {
          customerId: Date.now(),
          name: "Guest",
          email,
          phone,
          password: "",
          birthday: "",
          imagen: "",
          address: "",
          userCreate: new Date(),

          order: [order],
          orderProccess: [],
          delivered: []
        }
      ];
    }

    return updated;
  });
};

  // -----------------------------
  // 🚀 FINAL CONFIRMATION
  // -----------------------------
  const handleSend = () => {

    if (!phone || phone.length !== 8) return;

    const newOrder = createOrder();

    saveOrder(newOrder);

    setStep("success");
    setCart([]);

    setTimeout(() => {
      navigate("/");
    }, 15000);
  };

    const normalize = (str) =>
      str
        .toLowerCase()
        .normalize("NFD")           // remove accents
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    const filterAdmin = admin.filter(
       a => normalize(a.name) === normalize(person)
    );



  console.log("customer", customers)

  return (
    <div className="payment-box">

     <h3>Pago en persona</h3>

       <p>Podrás pagar al momento de recoger tu pedido.</p>

         <ul>
            {formatPay === "Efectivo" && <li>💵 Efectivo</li>}
            {formatPay === "Transferencia" && <li>💳 Transferencia</li>}
            {formatPay === "Zelle" && <li>💳 Zelle</li>}
         </ul>

       {step === "idle" && (
        <button 
          className="confirm-btn"
          onClick={() => setStep("phone")}
          >
          Confirmar pedido
        </button>
      )}

     {step === "phone" && (
            <div className="phone-box">

            <p>📱 Ingresa tu número para enviarte la dirección</p>

            <div className="phone-input-wrapper">
    
                    <input
                        type="text"
                        value={phone ? `+53 ${formatPhone(phone)}` : ""}
                        onChange={(e) => {

                        let value = e.target.value;

                            // ❗ remove +53 if it exists
                            value = value.replace("+53", "").trim();

                            // keep only numbers
                            value = value.replace(/\D/g, "");

                            if (value.length <= 8) {
                                setPhone(value);
                            }

                        }}
                        placeholder="+53 (55) 555-555"
                    />

                    </div>

            <button
                className="confirm-btn"
                onClick={handleSend}
                disabled={phone.length !== 8}
            >
                Enviar información
            </button>

            </div>
        )}

      {step === "success" && (
        <div>
          <p>✔ Pedido confirmado</p>
          {/* <p>Gracias por tu compra</p> */}
        </div>
      )}
        {step === "success" && (
                <div className="success-box">
                {/* <p>✅ Te hemos enviado la dirección del local y el nombre del encargado</p> */}
                {/* <p>✅ Te enviaremos la dirección del local</p> */}
                <p>*  Direccion: {filterAdmin.map(a => a.address)} </p>
                <p>*  Telefono: + {filterAdmin.map(a => a.phone)}</p> 
                <p>👤 Pregunta por: <strong>{person}</strong></p>
                {/* <p>✅ Le llamaremos para confirmar</p> */}
                <p>!!!! Gracias por elegirnos !!!!</p>
                </div>
            )}

    </div>
  );
}