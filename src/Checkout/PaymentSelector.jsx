import { useState } from "react";
import "./paymentSelector.css";
import InPersonPayment from "./InPersonPayment";
import DeliveryPayment from "./DeliveryPayment";
import useDataProducts from "../api/dataProducts";

export default function PaymentSelector({
  token,
  user,
  cart,
  setCart,
  amountOrder,
  setAmountOrder,
  customers,
  setCustomers,
  orderConfig,
  administratorDB
}) {

  const { administrator } = useDataProducts();

  const [method, setMethod] = useState(null);
  const [formatPay, setFormatPay] = useState(null)
  const [selectPay, setSelectPay] = useState(null)

  const person = amountOrder.map(a => a.personInCharge)?.[0] || "";

  // -----------------------------
  // 🧠 CREATE ORDER OBJECT
  // -----------------------------
  // const createOrderObject = () => {
  //   return {
  //     id: Date.now(),
  //     qrcode: "",
  //     admInCharge: person,
  //     gestorSell: "",
  //     orders: (amountOrder || []).map(item => ({
  //       name: item.name,
  //       qty: item.qty || 1,
  //       img: item.img || "",
  //       price: item.price || 0,
  //       color: item.color || ""
  //     })),
  //     dollarPrice: 0,
  //     cupPrice: 0,
  //     revenewTotal: 0,
  //     sellerCash: 0,
  //     date: new Date(),
  //     paymentFormat: "Pending",
  //     paymentOption: method === "inperson" ? "En Persona" : "Domicilio",
  //     statusSell: "Pending"
  //   };
  // };

  // -----------------------------
  // 🧠 UPDATE CUSTOMER OR GUEST
  // -----------------------------
  // const saveOrder = (order) => {
  //   const email = user?.email;

  //   // 👤 CASE 1: REAL USER EXISTS
  //   if (email) {
  //     setCustomers(prev => {
  //       let found = false;

  //       const updated = prev.map(customer => {
  //         if (customer.email === email) {
  //           found = true;

  //           return {
  //             ...customer,
  //             order: [...(customer.order || []), order]
  //           };
  //         }
  //         return customer;
  //       });

  //       return updated;
  //     });

  //     return;
  //   }

  //   // 👻 CASE 2: GUEST USER
  //   setCustomers(prev => [
  //     ...prev,
  //     {
  //       customerId: Date.now(),
  //       name: "Guest",
  //       email: "guest@local",
  //       phone: "",
  //       password: "",
  //       birthday: "",
  //       imagen: "",
  //       address: "",
  //       userCreate: new Date(),

  //       order: [order],
  //       orderProccess: [],
  //       delivered: []
  //     }
  //   ]);

  // };

  // -----------------------------
  // 🚀 HANDLE SEND
  // -----------------------------
  // const handleSend = () => {
  //   const newOrder = createOrderObject();
  //   saveOrder(newOrder);
  // };

  return (
    <div className="checkout">

      <h2>Selecciona método de pago</h2>

      <div className="payment-options">

        <button onClick={() => setMethod("En person")}>
          💵 En Persona
        </button>

        <button onClick={() => setMethod("Domicilio")}>
          🚚 Entrega a Domicilio
        </button>

      </div>

       {method !== null && (
        <div className="payment-options">

            {selectPay === null && (
            <>
                <button onClick={() => {
                setFormatPay("Efectivo");
                setSelectPay("Efectivo");
                }}>
                Efectivo
                </button>

                <button onClick={() => {
                setFormatPay("Transferencia");
                setSelectPay("Transferencia");
                }}>
                Transferencia
                </button>

                <button onClick={() => {
                setFormatPay("Zelle");
                setSelectPay("Zelle");
                }}>
                Zelle
                </button>
            </>
            )}

            {selectPay && (
            <div className="selected-payment">
                <button> ✔ {selectPay}</button>
             </div>
            )}

        </div>
        )}

      {/* CONDITIONAL PAYMENT UI */}
      {(method === "En person" && formatPay !== null ) &&   (
        <InPersonPayment
          user={user}
          cart={cart}
          setCart={setCart}
          administratorDB={administratorDB}
          amountOrder={amountOrder}
          customers={customers}
          setCustomers={setCustomers}
          administrator={administrator}
          method={method}
          formatPay={formatPay}
        />
      )}

      {(method === "Domicilio" && formatPay !==  null) &&  (
        <DeliveryPayment
           user={user}
          cart={cart}
          setCart={setCart}
          administratorDB={administratorDB}
          amountOrder={amountOrder}
          customers={customers}
          setCustomers={setCustomers}
          admin={administrator}
          method={method}
          formatPay={formatPay}
        />
      )}

    </div>
  );
}