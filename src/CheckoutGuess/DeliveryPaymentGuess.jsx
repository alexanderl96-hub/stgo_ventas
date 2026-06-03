import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import useDataProducts from "../api/dataProducts";
import useDataOrders from "../api/useDataOrders";
import { generateOrderQr } from "../utils/orderQrGenerator";
import { calculateOrderPricing, calculateOrder } from "../utils/pricing";
import "../Checkout/delivery.css"
import WhatsAppOrder from "../WhatsAppOrder/WhatsAppOrder";
import data from "../data_json";

export default function DeliveryPaymentGuess ({ 
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
  const { ordersQR } = useDataOrders();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullname] = useState("")
  const [step, setStep] = useState("idle");
  const [moneyType, setMoneyType] = useState("cup")



  const person = amountOrder.map(a => a.personInCharge)?.[0] || "";
  

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
          price: calculateOrder(item.dollarPrice, exchangeRate, formatPay)  || 0,
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
  
      return updated;
    });
  };

  const handleConfirmInformation = () => {
    if (!fullName || !address || phone.length !== 8) return;

        
        const newOrder = createOrder();

        saveOrder(newOrder);

        console.log("NEW ORDER SAVED:", newOrder);
        if(formatPay === "Zelle"){
            setMoneyType("usd")
        }
        };

const handleConfirmDelivery = () => {
  if (!fullName || !address || phone.length !== 8) return;

    
    // const newOrder = createOrder();

    // saveOrder(newOrder);

    // console.log("NEW ORDER SAVED:", newOrder);

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


const filterAdmin2 = admin.filter(
  a => normalize(a.name) === normalize(person)
);


const revenuesPayTotal = customers.flatMap(
  c => (c.order || []).map(o => o.revenewTotal)
)[0];

const revenuesPayFormat = customers.flatMap(
  c => (c.order || []).map(o => o.paymentFormat)
)[0];

const revenuesSeller = customers.flatMap(
  c => (c.order || []).map(o => o.sellerCash)
)[0];

const revenuesTienda = customers.flatMap(
  c => (c.order || []).map(o => o.tienda)
)[0];


 useEffect(() => {
  if (fullName && address && phone.length === 8) {
    const timer = setTimeout(() => {

    handleConfirmInformation()
    console.log("customers", customers)
    

    }, 1000); // wait 4 seconds

    return () => clearTimeout(timer);
  }
}, [fullName, address, phone]);

// const orderssss = customers.flatMap(
//   c => (c.order || []).map(o => o.orders)
// )[0]

// console.log("admin", filterAdmin2)
// console.log("orders", amountOrder.map(a => a))
//  console.log("customers state", customers);
//   console.log("customers state amount", 
//     revenuesPayTotal, revenuesPayFormat, revenuesPyaOption);
    // console.log("customers", customers.map(a => a.order))  
    // console.log("revenuesPayTotal", revenuesPayTotal)  
    // console.log("revenuesPayFormat", revenuesPayFormat)  
    // console.log("revenuesPyaOption", revenuesPyaOption)  
    // console.log("name", fullName)  
    // console.log("address", address)  
    // console.log("phone", formatPhone(phone)) 
    // console.log("admin", filterAdmin2)  
    // console.log("")  
    // console.log("")  
    // console.log("customers", orderssss)  

 
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
             
             />

    </div>
  );
};