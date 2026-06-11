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
import { modifyOrderPricing } from "../utils/newSalePricing";
import { createNewOrderUser, 
         updateCustomerOrder, 
         addCustomerOrder, 
         getCustomer 
        } from "../api/auth"
import API_URL from "../api/api_images";
import APP_URL from "../api/endPoint"

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
  administratorDB,
  setUser
}) {

    // console.log("amountOrder", amountOrder)

    const navigate = useNavigate();  
    const [step, setStep] = useState("idle");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");

    const person = amountOrder.map(a => a.person_in_charge)?.[0] || "";


//   // const handleSend = () => {
//   //   if (!phone) return;

//   //   // 👉 here you can later call API / send SMS
//   //   // 1 Step: Send info of product sell to admin
//   //   // 2 Step: Admin need to send a text by (sms/whatsapp) to user with address info
//   //   // 3 Step: (Optional) call the user to confirm when want to pick up the product.
//   //   // 4 Step: (Note) The product will be hold for at least 24-48 hours. after that 
//   //   //                the order will be remove and sell to the next customer. 
//   //   //   Step: All this infor mation will be store in the data based to keep track 
//   //   //         of wha is the movement of the application.
//   //   //         Notificatyion need to be create for the admin, so they can be alert 
//   //   //         about the orders.



  // -----------------------------
  // 🧠 CREATE ORDER (FINAL STEP ONLY)
  // -----------------------------
  const createOrder = () => {

    const ordersCalculation = amountOrder.map(item => ({
        name: item.name,
        qty: item.qty || 1,
        img: item.img || "",
        price: (Number(item.price) * item.qty) || 0,
        colors: item.colors || "",
        sizes: item.sizes || "",
        dollar_price: (Number(item.dollar_price) * item.qty) || 0,
        }))


    const usdTotal = ordersCalculation.reduce(
        (sum, a) => sum + (Number(a.dollar_price) || 0),
        0
    );

    const exchangeRate = amountOrder[0]?.current_dollar_price ;

    const pricing = modifyOrderPricing({
        usdPrice: usdTotal,
        exchangeRate,
        formatPay
    });

    const idQRcode = Date.now();

    return {
        id: idQRcode,
        qrcode: `${APP_URL}/#/order/${idQRcode}`,
        adm_in_charge: person,
        gestor_sell: "",
        orders: ordersCalculation,
        dollar_price: usdTotal,
        cup_price: pricing.cupPrice,
        revenew_total: pricing.totalEfectivo ,
        seller_cash: pricing.gananciaVendedor ,
        tienda: pricing.gananciaTienda ,
        phone: user?.phone,
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

  console.log("email", email)

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
      console.log("Adding value")
      return [
        ...updated,
        {
          customerId: Date.now(),
          name: user.name,
          email,
          phone: user.phone,
          password: user.password,
          birthday: user.birthday,
          imagen: user.imagen,
          address: user.address,
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
  const handleSend = async () => {

    if (!user.phone  || user.phone.length !== 8) return;

    const newOrder = createOrder();
   
       saveOrder(newOrder);
   
       const data = await createNewOrderUser(newOrder);
       await addCustomerOrder( user.customer_id, newOrder);

       const updatedCustomer =
        await getCustomer(user.customer_id);


        if (updatedCustomer ) {
           console.log("Save user")
          localStorage.setItem(
            "user",
            JSON.stringify(updatedCustomer)
          );
        } else {
          console.log("Remove user")
          localStorage.removeItem("user");
        }

        setUser(updatedCustomer);
       
       
   
          if (data.success) {
           setMessage("Solicitud Creada");
   
         } else {
           setMessage(data.message || data.error);
         }
   
         console.log("message", message)


    setStep("success");
    setCart([]);
    setCustomers([])

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

    const filterAdmin = administratorDB.filter(
       a => normalize(a.name) === normalize(person)
    );

    console.log("customers", customers)
     console.log("user", user)




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
             disabled={user.phone.length !== 8}
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
           <p>*  Direccion: {filterAdmin.map(a => a.address)} </p>
           <p>*  Telefono: +{filterAdmin.map(a => a.phone)}</p> 
           <p>👤 Pregunta por: <strong>{person}</strong></p>
           {/* <p>✅ Le llamaremos para confirmar</p> */}
           <p>!!!! Gracias por elegirnos !!!!</p>
        </div>
      )}

    </div>
  );
}