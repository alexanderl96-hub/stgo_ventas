import { useState, useEffect } from "react";
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
  administratorDB,
  setUser
}) {

  const { administrator } = useDataProducts();

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
  
  const dollar = Number(zellePermitions.map(a => a.current_dollar_price)[0])
  
  const zelleBlocked =
         formatPay === "Zelle" && Number(permision) < 50;

  useEffect(() => {
    if (!zelleBlocked) return;

    const timer = setTimeout(() => {
      setSelectPay(null);
      setFormatPay(null);
      setPermision(0);
    }, 3000);

    return () => clearTimeout(timer);
  }, [zelleBlocked]);


  console.log("User", user)


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
                 setPermision(usdTotal / dollar)
                }}>
                Zelle
                </button>
            </>
            )}

            {selectPay && !zelleBlocked && (
            <div className="selected-payment">
                <button> ✔ {selectPay}</button>
             </div>
            )}

        </div>
        )}



      {zelleBlocked && (
          <div className="zelle-warning">
            ⚠️ Pago vía Zelle debe ser mayor a $50 USD
          </div>
        )}

      {/* CONDITIONAL PAYMENT UI */}
      {!zelleBlocked && method === "En person" && formatPay !== null && (
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
          setUser={setUser}
        />
      )}

      {!zelleBlocked && method === "Domicilio" && formatPay !== null && (
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
          setUser={setUser}
        />
      )}

    </div>
  );
}