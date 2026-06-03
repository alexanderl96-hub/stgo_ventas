import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import "./delivery.css"
import WhatsAppOrder from "../WhatsAppOrder/WhatsAppOrder";
import data from "../data_json";

export default function DeliveryPayment ({ cart, setCart, amountOrder,
   customers, setCustomers  }) {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullname] = useState("")
  const [step, setStep] = useState("idle");
  const [admin, setAdmin] = useState(data.administrador)
  const [ person ] = useState(amountOrder.map(a => a.personInCharge)[0])


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
  

  const formatPhone = (value) => {
  const cleaned = value.replace(/\D/g, "").slice(0, 8);

  const part1 = cleaned.slice(0, 2); // 55
  const part2 = cleaned.slice(2, 5); // 555
  const part3 = cleaned.slice(5, 8); // 555

  if (cleaned.length === 0) return "";
  if (cleaned.length < 3) return `(${part1}`;
  if (cleaned.length < 6) return `(${part1}) ${part2}`;
  return `(${part1}) ${part2}-${part3}`;
};

const handleConfirmDelivery = () => {
  if (!fullName || !address || phone.length !== 8) return;

    // console.log("Send pickup info to:", phone);

    //  // ✅ CREATE ORDER
    // const newOrder = createOrderObject();

    // // ⚠️ Replace this with real user email later
    // const userEmail = phone + "@temp.com";

    // // ✅ SAVE ORDER INTO CUSTOMER
    // setCustomers(prev =>
    //   updateCustomerSection(prev, userEmail, "order", newOrder)
    // );

    // console.log("NEW ORDER SAVED:", newOrder);

  // 👉 here you can later send to backend / API
    console.log("Order Delivery Info:", {
        fullName,
        address,
        phone: `+53 ${formatPhone(phone)}`
    });
    setAddress("");
    setFullname("");
    setPhone("") 

    // ✅ trigger success UI
    setStep("success");
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

  useEffect(() => {
  if (step === "success") {
    const timer = setTimeout(() => {
      setStep("idle");
      setAddress("");
      setFullname("");
      setPhone("");
      setCart([])
       navigate("/");
    }, 6000); // wait 4 seconds

    return () => clearTimeout(timer);
  }
}, [step, navigate, setCart]);

const normalize = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")           // remove accents
    .replace(/[\u0300-\u036f]/g, "")
    .trim();


//  console.log("orden:", amountOrder)
//  const person = amountOrder.map(a => a.personInCharge)[0]

const filterAdmin2 = admin.filter(
  a => normalize(a.name) === normalize(person)
);

console.log("admin", filterAdmin2)
console.log("orders", amountOrder.map(a => a))
 console.log("customers state", customers);
// console.log(admin, person, filterAdmin2)
// console.log(filterAdmin2.map(a => a.phone))

 
  return (
    <div className="payment-box">

      <h3>Entrega a domicilio</h3>

      <input
        type="text"
        placeholder="Nombre y Appellidos"
        value={fullName}
        onChange={(e) => {
          // setFullname(e.target.value);
          // setCustomers((prev) => ({...prev, name: fullName }))
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
          // setAddress(e.target.value);
          // setCustomers((prev) => ({...prev, address: address }))
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
              //  customers={customers}
             
             />
       {/* {step === "success" && (
  <div className="modal-overlay" onClick={() => setStep("idle")}>

    <div
      className="modal-boxx success-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <h3>{fullName}</h3>
      <h4>🚚 Orden Confirmada</h4>

      <p>
        📦 Será entregada en un plazo de <strong>24–48 horas</strong>
      </p>

      <p>
        📍 Nuestro equipo se pondrá en contacto usted antes de la entrega
      </p>

      <button
        className="confirm-btn"
        onClick={() => {
            setStep("idle");
            setAddress("");
            setFullname("");
            setPhone("") 
            setCart([])
        }}
      >
        Cerrar
      </button>

    </div>
  </div>
)}
         */}

    </div>
  );
};