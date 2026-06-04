import { useState } from "react";
import "../Checkout/paymentSelector.css";
import InPersonPaymentGuess from "./InpersonPaymentGuess";
import DeliveryPaymentGuess from "./DeliveryPaymentGuess";

export default function PaymentSelectorGuess({
  user,
  cart,
  setCart,
  amountOrder,
  setAmountOrder,
  customers,
  setCustomers,
  administratorDB
}) {

  const [method, setMethod] = useState(null);
  const [formatPay, setFormatPay] = useState(null)
  const [selectPay, setSelectPay] = useState(null)

  return (
    <div className="checkout">

      <h2>Selecciona método de pago</h2>

      {/* 👉 ONLY SELECT METHOD (NO ORDER CREATION HERE) */}
      <div className="payment-options">

        <button onClick={() => setMethod("En person")}>
          💵 En Persona Guess
        </button>

        <button onClick={() => setMethod("Domicilio")}>
          🚚 Entrega a Domicilio Guess
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
            
    

      {/* 👇 ONLY UI COMPONENTS */}
      {(method === "En person" && formatPay !== null ) &&  (
        <InPersonPaymentGuess
          user={user}
          cart={cart}
          setCart={setCart}
          administratorDB={administratorDB}
          amountOrder={amountOrder}
          setCustomers={setCustomers}
          customers={customers}
          method={method}
          formatPay={formatPay}
        />
      )}

      {(method === "Domicilio" && formatPay !==  null) && (
        <DeliveryPaymentGuess
          user={user}
          cart={cart}
          setCart={setCart}
          administratorDB={administratorDB}
          amountOrder={amountOrder}
          setCustomers={setCustomers}
          customers={customers}
          method={method}
          formatPay={formatPay}
        />
      )}

    </div>
  );
}