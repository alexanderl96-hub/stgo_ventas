import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import "./delivery.css"
import { modifyOrderPricing } from "../utils/newSalePricing";
import WhatsAppOrder from "../WhatsAppOrder/WhatsAppOrder";
import useDataProducts from "../api/dataProducts";
import API_URL from "../api/api_images";
import APP_URL from "../api/endPoint"
import { createNewOrderUser,          
         addCustomerOrder, 
         getCustomer  } from "../api/auth"
         import { updateInventory } from "../utils/inventory";
         import { updateProduct, createGuestCustomer } from "../api/auth";

export default function DeliveryPayment ({
  user, setUser, cart, setCart, amountOrder,
   customers, setCustomers, administrator, administratorDB, method,
    formatPay , productsDB, triggerProductsRefresh }) {

  const { products, filtered, search, setSearch, category, } = useDataProducts();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullname] = useState("")
  const [step, setStep] = useState("idle");
  const [moneyType, setMoneyType] = useState("cup")
  const [sellOrder, setSellOrder] = useState([])
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    guestId: "",
    order: []
  });


  // const [admin, setAdmin] = useState(administrator)
  const person = amountOrder.map(a => a.person_in_charge)?.[0] || "";


  const createOrder = () => {

    const ordersCalculation = amountOrder.map(item => ({
      name: item.name,
      qty: item.qty || 1,
      img: item.img || "",
      price: (Number(item.price) * item.qty) || 0,
      colors: item.colors || "",
      sizes: item.sizes || "",
      dollar_price: (Number(item.dollar_price) * item.qty) || 0,
      product_id: item.productId
      }))

      console.log("ordersCalculation", ordersCalculation)

  // console.log("next step",

  // ordersCalculation.reduce(
  //     (sum, a) => sum + (Number(a.dollar_price) || 0),
  //     0
  // ) )

  const usdTotal = ordersCalculation.reduce(
      (sum, a) => sum + (Number(a.dollar_price) || 0),
      0
  );

    const exchangeRate = amountOrder[0]?.current_dollar_price ;

    const quantity = amountOrder[0]?.qty

     const price2 = ordersCalculation.reduce(
        (sum, item) => sum + item.price,
        0
      );


    const pricing = modifyOrderPricing({
        usdPrice: usdTotal,
        exchangeRate,
        formatPay,
        quantity,
        price2
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
        phone,
        date: new Date(),
        payment_format: formatPay,
        payment_option: method,
        status_sell: "Pendiente"
    };
    };

  const saveOrder = (order) => {
    // const email = user?.email || `guest_${Date.now()}@local`;
    const email =  user?.role !== "admin"
                  ? user?.email || `guest_${Date.now()}@local`
                  : `guest_${Date.now()}@local`

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
  // const handleSend = async () => {

  //   if (!user.phone  || user.phone.length !== 8) return;

  //   const newOrder = createOrder();
   
  //      saveOrder(newOrder);
   
  //      const data = await createNewOrderUser(newOrder);
  //      await addCustomerOrder( user.customer_id, newOrder);

  //      const updatedCustomer =
  //       await getCustomer(user.customer_id);


  //       if (updatedCustomer ) {
  //          console.log("Save user")
  //         localStorage.setItem(
  //           "user",
  //           JSON.stringify(updatedCustomer)
  //         );
  //       } else {
  //         console.log("Remove user")
  //         localStorage.removeItem("user");
  //       }

  //       setUser(updatedCustomer);
       
       
   
  //         if (data.success) {
  //          setMessage("Solicitud Creada");
   
  //        } else {
  //          setMessage(data.message || data.error);
  //        }
   
  //        console.log("message", message)


  //   setStep("success");
  //   setCart([]);
  //   setCustomers([])

  //   setTimeout(() => {
  //     navigate("/");
  //   }, 15000);
  // };

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

  const handleConfirmDelivery = async () => {
      if (!fullName || !address || phone.length !== 8) return;
  
        await addCustomerOrder( user.customer_id, sellOrder);
        const data = await createNewOrderUser(sellOrder);
        //  await addCustomerOrder( user.customer_id, sellOrder);

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

        for (const orderItem of sellOrder.orders) {

          const product = productsDB.find(
            p => p.id === orderItem.product_id
          );

          if (!product) continue;

          const inventoryData = updateInventory(
            product,
            orderItem
          );

          await updateProduct(
            product.id,
            inventoryData
          );
        }

       triggerProductsRefresh()
       
   
          if (data.success) {
           setMessage("Solicitud Creada");
   
         } else {
           setMessage(data.message || data.error);
         }
  
  
        setAddress("");
        setFullname("");
        setPhone("") 
  
        setStep("success");
        setCart([]);
        setCustomers([])
  
        setTimeout(() => {
          navigate("/");
        }, 10000);
  
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

  useEffect(()=>{
    if(user){
      setFullname(user.name);
      updateCustomerField("name", user.name);
      setAddress(user.address);
      updateCustomerField("address", user.address);
      setPhone(user.phone);
      updateCustomerField("phone", user.phone);
    }
  },[user])

   useEffect(() => {
    if (fullName && address && phone.length === 8) {
      const timer = setTimeout(() => {

      handleConfirmInformation()

      }, 1000); // wait 4 seconds

      return () => clearTimeout(timer);
    }
  }, [fullName, address, phone]);

    // useEffect(() => {

    //   if (!customers.length) return;

    //   const customer = customers[0];

    //   console.log("check inside of useeffect", customer)

    //   const guestData = {

    //     name: customer.name || "",

    //     email: customer.email || "",

    //     phone: customer.phone || "",

    //     address: customer.address || "",

    //     guestId:
    //       customer.customer_id ||
    //       customer.customerId ||
    //       "",

    //     order:
    //       customer.order || []
    //   };

    //   setForm(guestData);

    //   const createGuest = async () => {

    //     try {

    //       const result =
    //         await createGuestCustomer(
    //           guestData
    //         );

    //       console.log(
    //         "Guest created:",
    //         result
    //       );

    //     } catch (error) {

    //       console.error(error);

    //     }

    //   };

    //   createGuest();

    // }, [customers]);


    const normalize = (str) =>
      str
        .toLowerCase()
        .normalize("NFD")           // remove accents
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    const filterAdmin = administratorDB.filter(
       a => normalize(a.name) === normalize(person)
    );




  const revenuesPayTotal = customers.flatMap(
    c => (c.order || []).map(o => o.revenew_total
  )
  )[0];

  const revenuesPayFormat = customers.flatMap(
    c => (c.order || []).map(o => o.payment_format)
  )[0];

  const revenuesSeller = customers.flatMap(
    c => (c.order || []).map(o => o.seller_cash)
  )[0];

  const revenuesTienda = customers.flatMap(
    c => (c.order || []).map(o => o.tienda)
  )[0];

    const revenuesOrder = customers?.flatMap(
      c => (c.order || []).map(o => o.orders)
    )[0]


 
  return (
    <div className="payment-box">

      <h3>Entrega a domicilio</h3>

      {/* <input
        type="text"
        placeholder="Nombre y Appellidos"
        value={fullName}
        onChange={(e) => {
          // setFullname(e.target.value);
          // setCustomers((prev) => ({...prev, name: fullName }))
          //  const value = user?.name;
            setFullname(user.name);
            updateCustomerField("name", user.name);
        }}
      /> */}

      {/* <input
        type="text"
        placeholder="Dirección"
        value={address}
        onChange={(e) => {
          // setAddress(e.target.value);
          // setCustomers((prev) => ({...prev, address: address }))
           const value = user.address;
          setAddress(user.address);
          updateCustomerField("address", user.address);
        }}
      /> */}

       {/* <input
                    type="text"
                    value={user.phone ? `+53 ${formatPhone(user.phone)}` : ""}
                    onChange={(e) => {

                    let value = user.phone;

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
                /> */}

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
               handleConfirmDelivery={handleConfirmDelivery}
               setStep={setStep}
               setFullname={setFullname}
               setAddress={setAddress}
               setPhone={setPhone}
               step={step}
               setCart={setCart}
               result={filterAdmin}
               customers={customers}
               revenuesPayTotal={revenuesPayTotal}
               revenuesPayFormat={revenuesPayFormat}
               revenuesSeller={revenuesSeller}
               revenuesTienda={revenuesTienda}
               revenuesOrder={revenuesOrder}
               formatPay={formatPay}
               setMoneyType={setMoneyType}
               moneyType={moneyType}
             
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