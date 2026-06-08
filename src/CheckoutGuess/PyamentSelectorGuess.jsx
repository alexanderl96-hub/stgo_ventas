import { useState, useEffect } from "react";
import "../Checkout/paymentSelector.css";
import InPersonPaymentGuess from "./InpersonPaymentGuess";
import DeliveryPaymentGuess from "./DeliveryPaymentGuess";
import "./inPersonGuess.css"


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
  const [permision, setPermision] = useState(0)
  const [checkAmount, setCheckAmount] = useState([])


  useEffect(()=>{
      setCheckAmount(amountOrder)
  }, [amountOrder])

  const zellePermitions = checkAmount.map(item => ({
        price: (Number(item.price) * item.qty) || 0,
        dollar_price: (Number(item.dollar_price) * item.qty) || 0,
        current_dollar_price: item.current_dollar_price || 0,
        qty: item.qty
        })) 

  const usdTotal = zellePermitions.reduce(
        (sum, a) => sum + (Number(a.price) || 0),
        0
    );
  
  // const dollar = zellePermitions.reduce(
  //       (sum, a) => sum + (Number(a.current_dollar_price) || 0),
  //       0
  //   )
  const dollar = Number(zellePermitions.map(a => a.current_dollar_price)[0])
  
  const zelleBlocked =
  formatPay === "Zelle" && Number(permision) < 50;

  return (
    <div className="checkout">

      <h2>Selecciona método de pago</h2>

      {/* 👉 ONLY SELECT METHOD (NO ORDER CREATION HERE) */}
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
                setPermision(usdTotal / dollar)
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
      {/* {(method === "En person" && formatPay !== null ) &&  (
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
      )} */}

      {zelleBlocked && (
          <div className="zelle-warning">
            ⚠️ Pago vía Zelle debe ser mayor a $50 USD
          </div>
        )}

        {!zelleBlocked && method === "En person" && formatPay !== null && (
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

        {!zelleBlocked && method === "Domicilio" && formatPay !== null && (
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