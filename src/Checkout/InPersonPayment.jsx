// import {useEffect, useState} from "react";
// import "./inPerson.css"

// export default function InPersonPayment ({ cart }) {
//   return (
//     <div className="payment-box">

//       <h3>Pago en persona</h3>

//       <p>Podrás pagar al momento de recoger tu pedido.</p>

//       <ul>
//         <li>💵 Efectivo</li>
//         <li>💳 Transferencia</li>
//       </ul>

//       <button className="confirm-btn">
//         Confirmar pedido
//       </button>

//     </div>
//   );
// };

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useDataProducts from "../api/dataProducts";
import useDataOrders from "../api/useDataOrders";
import { generateOrderQr } from "../utils/orderQrGenerator";
import { calculateOrderPricing } from "../utils/pricing";

export default function InPersonPayment({ 
  user,
  cart,
  setCart,
  amountOrder,
  customers,
  setCustomers,
  method,
  formatPay,
  administrator,
  administratorDB
}) {

    console.log("amountOrder", amountOrder)

    const navigate = useNavigate();
    const { admin } = useDataProducts();
    const { ordersQR } = useDataOrders();
  
    const [step, setStep] = useState("idle");
    const [phone, setPhone] = useState("");

    const person = amountOrder.map(a => a.person_in_charge)?.[0] || "";


    console.log("person", person)
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
        (sum, a) => sum + (a.dollarPrice || 0),
        0
    );

    const exchangeRate = amountOrder[0]?.currentDollarPrice ;

    const pricing = calculateOrderPricing({
        usdPrice: usdTotal,
        exchangeRate,
        formatPay
    });

    return {
        id: Date.now(),
        qrcode: generateOrderQr(ordersQR.map(c => c.qrcode)),
        admInCharge: person,
        gestorSell: "",

        orders: amountOrder.map(item => ({
        name: item.name,
        qty: item.qty || 1,
        img: item.img || "",
        price: item.price || 0,
        color: item.color || "",
        size: item.size || "",
        dollarPrice: item.dollarPrice || 0,
        })),

        dollarPrice: usdTotal,
        cupPrice: pricing.cupPrice,
        revenewTotal: pricing.totalEfectivo ,
        sellerCash: pricing.gananciaVendedor ,
        tienda: pricing.gananciaTienda ,
        phone,
        date: new Date(),
        paymentFormat: formatPay,
        paymentOption: method,
        statusSell: "Pendiente"
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
              (sum, o) => sum + (o.dollarPrice || 0),
              0
            );

            const cupPrice = newOrders.reduce(
              (sum, o) => sum + (o.cupPrice || 0),
              0
            );

            const revenewTotal = newOrders.reduce(
              (sum, o) => sum + (o.revenewTotal || 0),
              0
            );

            const sellerCash = newOrders.reduce(
              (sum, o) => sum + (o.sellerCash || 0),
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

// -----------------------------------
  // ✅ GENERIC UPDATE FUNCTION
  // -----------------------------------

  const updateCustomerSection = (prevCustomers, email, section, data) => {
    let found = false;

    const updated = prevCustomers.map(customer => {
      if (customer.email === email) {
        found = true;
        return {
          ...customer,
          [section]: [...(customer[section] || []), data]
        };
      }
      return customer;
    });

    // ✅ If customer does NOT exist → create it
    if (!found) {
      return [
        ...updated,
        { customerId: 1,
          name: "Roberto Pablo",
          email: email,
          phone: phone,
          imagen: "",
          address: "L-12 apt #7, Distrito J.M, Santiago de Cuba, Cuba",
          userCreate: new Date(),
          order: section === "order" ? [data] : [],
          orderProccess: [],
          delivered: []
        }
      ];
    }

    return updated;
  };

    // -----------------------------------
  // ✅ CREATE ORDER OBJECT
  // -----------------------------------

  const createOrderObject = () => {
  return {
    id: Date.now(),
    qrcode: amountOrder?.map(a => a.qrCode)[0],
    admInCharge: person,
    gestorSell: "",
    orders: (amountOrder || []).map(item => ({
      name: item.name,
      qty: item.qty || 1,
      img: item.img || item.imagen || "",   // ✅ include image
      price: item.price || 0,
      color: item.color || ""
    })),
    dollarPrice: 0,
    cupPrice: 0,
    revenewTotal: 0,
    sellerCash: 0,
    date: new Date(),
    paymentFormat: "Por determinar",
    paymentOption: "En persona",
    statusSell: "Pending..."
  };
};

  // const createOrderObject = () => {
  //   return {
  //     id: Date.now(),
  //     qrcode: "",
  //     admInCharge: person,
  //     gestorSell: "",
  //     orders: amountOrder || [],
  //     dollarPrice: 0,
  //     cupPrice: 0,
  //     revenewTotal: 0,
  //     date: new Date(),
  //     paymentFormat: "Transfermovil",
  //     paymentOption:  "In-Person",
  //   };
  // };


  const handleConfirm = () => {
    setStep("phone");
    setCart([])
  };

  // const handleSend = () => {
  //   if (!phone) return;

  //   // 👉 here you can later call API / send SMS
  //   // 1 Step: Send info of product sell to admin
  //   // 2 Step: Admin need to send a text by (sms/whatsapp) to user with address info
  //   // 3 Step: (Optional) call the user to confirm when want to pick up the product.
  //   // 4 Step: (Note) The product will be hold for at least 24-48 hours. after that 
  //   //                the order will be remove and sell to the next customer. 
  //   //   Step: All this infor mation will be store in the data based to keep track 
  //   //         of wha is the movement of the application.
  //   //         Notificatyion need to be create for the admin, so they can be alert 
  //   //         about the orders.


  //    // ✅ CREATE ORDER
  //   const newOrder = createOrderObject();

  //   // ⚠️ Replace this with real user email later
  //   const userEmail = phone + "@temp.com";

  //   // ✅ SAVE ORDER INTO CUSTOMER
  //   setCustomers(prev =>
  //     updateCustomerSection(prev, userEmail, "order", newOrder)
  //   );


  //   setStep("success");
  //   setCart([])
   
  // };

    // -----------------------------
  // 🚀 FINAL CONFIRMATION
  // -----------------------------
  const handleSend = () => {

    if (!user.phone || user.phone.length !== 10) return;

    const newOrder = createOrder();

    saveOrder(newOrder);

    setStep("success");
    setCart([]);

    setTimeout(() => {
      navigate("/");
    }, 15000);
  };



//   useEffect(() => {
//   if (step === "success") {
//     const timer = setTimeout(() => {
//       setStep("idle");
//       setCart([])
//        navigate("/");
//     }, 10000); // wait 4 seconds

//     return () => clearTimeout(timer);
//   }
// }, [step, navigate, setCart]);

   const normalize = (str) =>
      str
        .toLowerCase()
        .normalize("NFD")           // remove accents
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    console.log("administrator", administratorDB)

    const filterAdmin2 = administratorDB?.filter(
       a => normalize(a.name) === normalize(person)
    );

    console.log("filterAdmin2", filterAdmin2)

  return (
    <div className="payment-box">

      <h3>Pago en persona</h3>

      <p>Podrás pagar al momento de recoger tu pedido.</p>

      <ul>
            {formatPay === "Efectivo" && <li>💵 Efectivo</li>}
            {formatPay === "Transferencia" && <li>💳 Transferencia</li>}
            {formatPay === "Zelle" && <li>💳 Zelle</li>}
      </ul>

      {/* STEP 1: BUTTON */}
      {/* {step === "idle" && (
        <button className="confirm-btn" onClick={handleConfirm}>
          Confirmar pedido
        </button>
      )} */}

      {/* STEP 2: PHONE INPUT */}
      {step === "idle" && user.phone && (
        <div className="phone-box">

          <p>📱 La direccion sera enviada a este numero</p>

          {/* <div className="phone-input-wrapper">
  
                <input
                    type="text"
                    value={phone ? `+53 ${formatPhone(phone)}` : ""}
                    onChange={(e) => {

                    let value = e.target.value;

                        // ❗ remove +53 if it exists
                        value = value.replace("+53", "").trim();

                        // keep only numbers
                        value = value.replace(/\D/g, "");

                        if (value.length <= 10) {
                            setPhone(value);
                        }

                    }}
                    placeholder={user.phone}
                />

                </div> */}

          <button
            className="confirm-btn"
            onClick={handleSend}
             disabled={user.phone.length !== 10}
          >
            Enviar información
          </button>

        </div>
      )}

      {/* STEP 3: SUCCESS */}
      {step === "success" && (
        <div className="success-box">
          {/* <p>✅ Te hemos enviado la dirección del local y el nombre del encargado</p> */}
           {/* <p>✅ Te enviaremos la dirección del local</p> */}
           <p>*  Direccion: {filterAdmin2.map(a => a.address)} </p>
           <p>*  Telefono: +{filterAdmin2.map(a => a.phone)}</p> 
           <p>👤 Pregunta por: <strong>{person}</strong></p>
           {/* <p>✅ Le llamaremos para confirmar</p> */}
           <p>!!!! Gracias por elegirnos !!!!</p>
        </div>
      )}

    </div>
  );
}