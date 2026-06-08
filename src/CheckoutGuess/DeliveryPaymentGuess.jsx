import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import useDataProducts from "../api/dataProducts";
import useDataOrders from "../api/useDataOrders";
import { generateOrderQr } from "../utils/orderQrGenerator";
import { calculateOrderPricing, calculateOrder } from "../utils/pricing";
import {modifyOrderPricing, modifySalePrice } from "../utils/newSalePricing";
import "../Checkout/delivery.css"
import WhatsAppOrder from "../WhatsAppOrder/WhatsAppOrder";

export default function DeliveryPaymentGuess ({ 
    user,
    cart, 
    setCart, 
    amountOrder,
    customers, 
    setCustomers, 
    method,
    formatPay ,
    administratorDB
}) {
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullname] = useState("")
  const [step, setStep] = useState("idle");
  const [moneyType, setMoneyType] = useState("cup")
  const [sellOrder, setSellOrder] = useState([])

  const person = amountOrder.map(a => a.person_in_charge)?.[0] || "";

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


  // -----------------------------------
  // ✅ GENERIC UPDATE FUNCTION
  // -----------------------------------
  // const updateCustomerSection = (prevCustomers, email, section, data) => {
  //   let found = false;

  //   const updated = prevCustomers.map(customer => {
  //     if (customer.email === email) {
  //       found = true;
  //       return {
  //         ...customer,
  //         [section]: [...(customer[section] || []), data]
  //       };
  //     }
  //     return customer;
  //   });

  //   // ✅ If customer does NOT exist → create it
  //   if (!found) {
  //     return [
  //       ...updated,
  //       { customerId: 1,
  //         name: "Roberto Pablo",
  //         email: email,
  //         phone: phone,
  //         imagen: "",
  //         address: "L-12 apt #7, Distrito J.M, Santiago de Cuba, Cuba",
  //         userCreate: new Date(),
  //         order: section === "order" ? [data] : [],
  //         orderProccess: [],
  //         delivered: []
  //       }
  //     ];
  //   }

  //   return updated;
  // };

    // -----------------------------------
  // ✅ CREATE ORDER OBJECT
  // -----------------------------------
//   const createOrderObject = () => {
//   return {
//     id: Date.now(),
//     qrcode: "",
//     admInCharge: person,
//     gestorSell: "",
//     orders: (amountOrder || []).map(item => ({
//       name: item.name,
//       qty: item.qty || 1,
//       img: item.img || item.imagen || "",   // ✅ include image
//       price: item.price || 0,
//       color: item.color || ""
//     })),
//     dollarPrice: 0,
//     cupPrice: 0,
//     revenewTotal: 0,
//     date: new Date(),
//     paymentFormat: "Por determinar",
//     paymentOption: "En persona",
//     statusSell: "Pending..."
//   };
// };
  
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
  
       console.log("ordersCalculation", ordersCalculation)

    console.log("next step",

      ordersCalculation.reduce(
        (sum, a) => sum + (Number(a.dollar_price) || 0),
        0
    ) )

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
     

      return {
          id: Date.now(),
          // qrcode: generateOrderQr(ordersQR.map(c => c.qrcode)),
          qrcode: "",
          admInCharge: person,
          gestorSell: "",
  
          // orders: amountOrder.map(item => ({
          // name: item.name,
          // qty: item.qty || 1,
          // img: item.img || "",
          // price: modifySalePrice(calculateOrder(item.dollar_price, exchangeRate, formatPay))  || 0,
          // colors: item.colors || "",
          // sizes: item.sizes || "",
          // dollar_price: item.dollar_price || 0,
          // })),
          orders: ordersCalculation,
  
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

       console.log("email", email)
  
      setCustomers(prev => {
    
        let found = false;
    
        const updated = prev.map(customer => {
    
          if (customer.email === email) {
            found = true;
    
            const newOrders = [...(customer.order || []), order];

            console.log("newOrders inedes", newOrders)
    
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

          console.log("customer", customer);
    
          return customer;
        });
    
        // 👻 CREATE GUEST IF NOT FOUND
        if (!found) {
          return [
            ...updated,
            {
              customerId: Date.now(),
              name: fullName,
              email,
              phone,
              password: "",
              birthday: "",
              imagen: "",
              address: address,
              userCreate: new Date(),
    
              order: [order],
              orderProccess: [],
              delivered: []
            }
          ];
        }

        console.log(updated)
    
        return updated;
      });
    };

    console.log("customer out", customers)

  const handleConfirmInformation = () => {
    if (!fullName || !address || phone.length !== 8) return;

        
        const newOrder = createOrder();

        saveOrder(newOrder);

        console.log("newOrder", newOrder)
        setSellOrder(newOrder);

        if(formatPay === "Zelle"){
            setMoneyType("usd")
        }
        };

  const handleConfirmDelivery = () => {
    if (!fullName || !address || phone.length !== 8) return;

      
      // const newOrder = createOrder();

      // saveOrder(newOrder);


      setAddress("");
      setFullname("");
      setPhone("") 

      setStep("success");
      // setCart([]);

      setTimeout(() => {
        navigate("/");
      }, 50000);

      };

    const updateCustomerField = (field, value) => {
        setCustomers(prev =>
            prev.map((customer, index) => {
            // 👉 update last customer (or change logic if needed)
            if (index === prev.length - 1) {
                return {
                ...customer,
                [field]: value
                };
            }
            return customer;
            })
        );
    };

//   useEffect(() => {
//   if (step === "success") {
//     const timer = setTimeout(() => {
//       setStep("idle");
//     //   setAddress("");
//     //   setFullname("");
//     //   setPhone("");
//     //   setCart([])
//       navigate("/");
//     }, 16000); // wait 4 seconds

//     return () => clearTimeout(timer);
//   }
// }, [step, navigate, setCart]);

const normalize = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")           // remove accents
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

 
const filterAdmin2 = administratorDB.filter(
  a => normalize(a.name) === normalize(person)
);


const revenuesPayTotal = customers.flatMap(
  c => (c.order || []).map(o => o.revenewTotal
)
)[0];

const revenuesPayFormat = customers.flatMap(
  c => (c.order || []).map(o => o.payment_format)
)[0];

const revenuesSeller = customers.flatMap(
  c => (c.order || []).map(o => o.sellerCash)
)[0];

const revenuesTienda = customers.flatMap(
  c => (c.order || []).map(o => o.tienda)
)[0];

  const revenuesOrder = customers?.flatMap(
    c => (c.order || []).map(o => o.orders)
  )[0]


console.log("revenue Order", revenuesOrder)


console.log("revenuesPayTotal", revenuesPayTotal);
console.log("revenuesSeller", revenuesSeller);
console.log("revenuesSeller", revenuesSeller);




 useEffect(() => {
  if (fullName && address && phone.length === 8) {
    const timer = setTimeout(() => {

    handleConfirmInformation()

    }, 1000); // wait 4 seconds

    return () => clearTimeout(timer);
  }
}, [fullName, address, phone]);


  return (
    <div className="payment-box">

      <h3>Entrega a domicilio</h3>

      <input
        type="text"
        placeholder="Nombre y Appellidos"
        value={fullName}
        onChange={(e) => {
           const value = e.target.value;
            setFullname(value);
            updateCustomerField("name", value);
        }}
      />

      <input
        type="text"
        placeholder="Dirección"
        value={address}
        onChange={(e) => {
           const value = e.target.value;
          setAddress(value);
          updateCustomerField("address", value);
        }}
      />

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
                            //  setCustomers((prev) => ({...prev, phone: phone }))
                             updateCustomerField("phone", value);
                        }

                    }}
                    placeholder="Teléfono"
                />

      <p>🚚 Tiempo estimado: 24-48 horas </p>
      <p>!!Domicilio no esta incluido!!</p>

      {/* <button
        className="confirm-btn"
        disabled={!address || phone.length !== 8 || !fullName}
        onClick={handleConfirmDelivery}

      >
        Confirmar lugar de entrega
      </button> */}
       <WhatsAppOrder
               fullName={fullName}
               address={address}
               phone={phone}
               formatPhone={formatPhone}
               cart={amountOrder}
               onClick={handleConfirmDelivery}
               setStep={setStep}
               setFullname={setFullname}
               setAddress={setAddress}
               setPhone={setPhone}
               step={step}
               setCart={setCart}
               result={filterAdmin2}
               customers={customers}
               revenuesPayTotal={revenuesPayTotal}
               revenuesPayFormat={revenuesPayFormat}
               revenuesSeller={revenuesSeller}
               revenuesTienda={revenuesTienda}
               formatPay={formatPay}
               setMoneyType={setMoneyType}
               moneyType={moneyType}
               revenuesOrder={revenuesOrder}
             
             />

    </div>
  );
};