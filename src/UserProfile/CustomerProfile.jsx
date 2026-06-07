// import React, { useEffect, useState, useMemo } from "react";
// import "./customerProfile.css"

// const CustomerProfile = ({customers, setCustomers}) => {
//   // const [user, setUser] = useState([]);
//   // //  const [user, setUser] = useState(null);
//   // const [orders, setOrders] = useState([]);
//   const [form, setForm] = useState({
//   name: "",
//   email: "",
//   phone: ""
// });

//   const user = customers[0];
//   // const user = customers.find(c => c.phone === currentPhone);

//   const orders = useMemo(() => {
//   return customers.flatMap(customer => customer.order || []);
// }, [customers]);

// const filterColor = (value, color) => {
//    let stringChar = value.filter(a => a.includes(color));
//    return stringChar;
// }

// const handleRegister = () => {
//   if (!form.email || !form.phone) return;

//   const newUser = {
//     name: form.name,
//     email: form.email,
//     phone: form.phone,
//     imagen: "",
//     address: "",
//     userCreate: new Date(),
//     order: [],
//     orderProccess: [],
//     delivered: []
//   };

//   setCustomers(prev => [...prev, newUser]);
// };



// // setSelectedUser(form.email);

//   // useEffect(() => {
//   //   const token = JSON.parse(localStorage.getItem("auth"))?.token;

//   //   fetch("/api/user/profile", {
//   //     headers: { Authorization: `Bearer ${token}` }
//   //   })
//   //     .then(res => res.json())
//   //     .then(data => setUser(data));

//   //   fetch("/api/user/orders", {
//   //     headers: { Authorization: `Bearer ${token}` }
//   //   })
//   //     .then(res => res.json())
//   //     .then(data => setOrders(data));
//   // }, []);

//   // if (!user) return <p>Loading...</p>;
//   if (!user) {
//   return (
//     <div className="profile-page">

//       <h2 className="profile-title">👤 Crear Cuenta</h2>

//       <div className="profile-box register-box">

//         <div className="profile-row column">
//           <label>Nombre</label>
//           <input
//             type="text"
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//             placeholder="Tu nombre"
//           />
//         </div>

//         <div className="profile-row column">
//           <label>Correo</label>
//           <input
//             type="email"
//             value={form.email}
//             onChange={(e) => setForm({ ...form, email: e.target.value })}
//             placeholder="ejemplo@email.com"
//           />
//         </div>

//         <div className="profile-row column">
//           <label>Teléfono</label>
//           <input
//             type="text"
//             value={form.phone}
//             onChange={(e) => setForm({ ...form, phone: e.target.value })}
//             placeholder="+53 55555555"
//           />
//         </div>

//         <button className="confirm-btn" onClick={handleRegister}>
//           Crear Cuenta
//         </button>

//       </div>

//     </div>
//   );
// }


//     const formatPhone = (value) => {
//     const cleaned = value.replace(/\D/g, "").slice(0, 8);

//     const part1 = cleaned.slice(0, 2); // 55
//     const part2 = cleaned.slice(2, 5); // 555
//     const part3 = cleaned.slice(5, 8); // 555

//     if (cleaned.length === 0) return "";
//     if (cleaned.length < 3) return `(${part1}`;
//     if (cleaned.length < 6) return `(${part1}) ${part2}`;
//     return `(${part1}) ${part2}-${part3}`;
//     };

//   return (
//     <div className="profile-page">

//       <h2 className="profile-title">👤 Mi Cuenta</h2>

//       {/* USER INFO */}
//       <div className="profile-box">
//         <div className="profile-row">
//           <span>Nombre</span>
//           <strong>{user?.name ? user?.name : ""}</strong>
//         </div>

//         <div className="profile-row">
//           <span>Correo</span>
//           <strong>{user?.email}</strong>
//         </div>

//         <div className="profile-row">
//           <span>Telefono</span>
//           <strong>{user?.phone ? `+53 ${formatPhone(user?.phone)}` : ""}</strong>
//         </div>

//         <div className="profile-row">
//           <span>Creada</span>
//           <strong>{user?.userCreate ? new Date(user?.userCreate).toLocaleDateString() : ""}</strong>
//         </div>
//       </div>

//       {/* ORDERS */}
//       <h3 className="orders-title">📦 Mi Ordenes</h3>

//       <div className="orders">
//         {orders.length === 0 ? (
//           <p className="no-orders">No ordenes todavia</p>
//         ) : (
//           orders.reverse().map(order => (
//             <div key={order.id} className="order-card">

//               <div className="order-header">
//                 <span>Order #{order.id}</span>
//                 <span className="status new">NEW</span>
//               </div>

//               <div className="order-body">

//                 <p><strong>Fecha:</strong> {new Date(order.date).toLocaleString()}</p>
//                 <p><strong>Pago:</strong> {order.paymentOption}</p>
//                 <p><strong>Metodo:</strong> {order.paymentFormat}</p>

//                 {/* PRODUCTS */}
//                 <div className="order-products">
//                     {order.orders.map((item, i) => (
//                       <div key={i} className="product-row">

//                         <div className="product-left">
//                           <img src={filterColor(item.img, item.color)[0]} alt={item.name} />
//                         </div>

//                         <div className="product-info">
//                           <span>{item.name}</span>
//                           <span>x{item.qty}</span>
//                         </div>

//                       </div>
//                     ))}
//                   </div>

//               </div>

//             </div>
//           ))
//         )}
//       </div>

//     </div>
//   );
// };

// export default CustomerProfile;


import React, { useEffect, useState, useMemo } from "react";
import "./customerProfile.css";

const CustomerProfile = ({ user, customers, setCustomers, logout }) => {

  // ---------------------------
  // STATE
  // ---------------------------
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const [selectedUser, setSelectedUser] = useState(null);

  // ---------------------------
  // SELECT USER
  // ---------------------------
  const users = customers.find(c => c.email === selectedUser);

  // ---------------------------
  // ORDERS (ONLY USER)
  // ---------------------------
  // const orders = user?.order || [];
    const orders = useMemo(() => {
  return [user]?.flatMap(customer => customer.order || []);
}, [user]);
//  const orders = useMemo(() => {
//   return customers.flatMap(customer => customer.order || []);
// }, [customers]);

  // ---------------------------
  // AUTO SELECT LAST USER (STATIC APP)
  // ---------------------------
  useEffect(() => {
    if (customers.length > 0 && !selectedUser) {
      setSelectedUser(customers[customers.length - 1].email);
    }
  }, [customers, selectedUser]);

  // ---------------------------
  // REGISTER NEW USER
  // ---------------------------
  const handleRegister = () => {
    if (!form.email || !form.phone) return;

    const newUser = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      imagen: "",
      address: "",
      userCreate: new Date(),
      order: [],
      orderProccess: [],
      delivered: []
    };

    setCustomers(prev => [...prev, newUser]);

    // select user
    setSelectedUser(form.email);

    // reset form
    setForm({ name: "", email: "", phone: "" });
  };

  // ---------------------------
  // FORMAT PHONE
  // ---------------------------
  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 8);

    const part1 = cleaned.slice(0, 2);
    const part2 = cleaned.slice(2, 5);
    const part3 = cleaned.slice(5, 8);

    if (cleaned.length === 0) return "";
    if (cleaned.length < 3) return `(${part1}`;
    if (cleaned.length < 6) return `(${part1}) ${part2}`;
    return `(${part1}) ${part2}-${part3}`;
  };

  // ---------------------------
  // FILTER IMAGE BY COLOR
  // ---------------------------
  const filterColor = (imgs = [], color) => {
    return imgs.filter(a => a.includes(color));
  };

  const getTotal = (items) => {
  return items.reduce((sum, item) => {
    return sum + (item.price || 0) * (item.qty || 1);
  }, 0);
};


  // ---------------------------
  // REGISTER VIEW
  // ---------------------------
  if (!user) {
    return (
      <div className="profile-page">

        <h2 className="profile-title">👤 Crear Cuenta</h2>

        <div className="profile-box register-box">

          <div className="profile-row column">
            <label>Nombre</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Tu nombre"
            />
          </div>

          <div className="profile-row column">
            <label>Correo</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="ejemplo@email.com"
            />
          </div>

          <div className="profile-row column">
            <label>Teléfono</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+53 55555555"
            />
          </div>

          <button className="confirm-btn" onClick={handleRegister}>
            Crear Cuenta
          </button>

        </div>

      </div>
    );
  }

  // ---------------------------
  // PROFILE VIEW
  // ---------------------------
  return (
    <div className="profile-page">

      <h2 className="profile-title">👤 Mi Cuenta</h2>

      {/* USER INFO */}
      <div className="profile-box">
        <div className="profile-row">
          <span>Nombre</span>
          <strong>{user?.name || ""}</strong>
        </div>

        <div className="profile-row">
          <span>Correo</span>
          <strong>{user?.email}</strong>
        </div>

        <div className="profile-row">
          <span>Telefono</span>
          <strong>{user?.phone ? `+53 ${formatPhone(user?.phone)}` : ""}</strong>
        </div>

        <div className="profile-row">
          <span>Creada</span>
          <strong>
            {user?.user_create

              ? new Date(user?.user_create).toLocaleDateString()
              : ""}
          </strong>
        </div>

             <button
          className="logout-btn"
          onClick={logout}
        >
          Cerrar Sesión
        </button>

      </div>

      {/* ORDERS */}
      <h3 className="orders-title">📦 Mis Ordenes</h3>

      <div className="orders">
        {orders.length === 0 ? (
          <p className="no-orders">No ordenes todavía</p>
        ) : (
          [...orders].reverse().map(order => (
            <div key={order.id} className="order-card">

              <div className="order-header">
                <span>Order #{order.id}</span>
                <span className={`status ${order.statusSell.includes("Pending") ? "new" : "pago"}`}>
                  {order.statusSell.includes("Pending") ? "Nueva Orden" : "Pagada"}
                  </span>
              </div>

              <div className="order-body">

                <p><strong>Fecha:</strong> {new Date(order.date).toLocaleString()}</p>
                <p><strong>Pago:</strong> {order.paymentOption}</p>
                <p><strong>Metodo:</strong> {order.paymentFormat}</p>
                <p><strong>Monto:</strong> ${getTotal(order.orders)} cup</p>

                {/* PRODUCTS */}
                <div className="order-products">
                  {order.orders.map((item, i) => {
                    // `http://localhost:5001${product.img[0]}`
                    // const img =
                    // `http://localhost:5001${
                    //   filterColor(item.img || [], item.color)?.[0] ||
                    //   item.img?.[0]}`;

                    const imgPath =
                      filterColor(item.img || [], item.color)?.[0] ||
                      item.img?.[0];

                    const img = imgPath
                      ? `http://localhost:5001${imgPath}`
                      : "/fallback.png"; // optional

                    return (
                      <div key={i} className="product-row">

                        <div className="product-left">
                          <img src={img} alt={item.name} />
                        </div>

                        <div className="product-info">
                          <span>{item.name}</span>
                          <span>x{item.qty}</span>
                        </div>
                        <div className="product-info">
                          <span>$ {item.price} cup</span>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default CustomerProfile;