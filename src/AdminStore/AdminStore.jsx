import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./adminStore.css"
import { QrCode } from "lucide-react";
import QRCode from "react-qr-code";
import API_URL from "../api/api_images"
import { updateOrder } from "../api/auth"


const AdminStore = ({user, customers, setCustomers, logout }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedCustomerId, setExpandedCustomerId] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [activeQR, setActiveQR] = useState(null);
  const [orders, setOrders] = useState([]);
  const [guestOrder, setGuestOrder] = useState([])

    // const handleEdit = (customerId) => {
    // setExpandedCustomerId(prev =>
    //     prev === customerId ? null : customerId
    // );
    // };

    const handleEdit = (orderId) => {
      console.log("order id", orderId)
        setExpandedOrderId(prev =>
            prev === orderId ? null : orderId
        );
        console.log(expandedOrderId)
     };
//   const [orders, setOrders] = useState([]);


  const deleteProduct = (id) => {
    fetch(`/api/admin/products/${id}`, {
      method: "DELETE"
    }).then(() => {
      setProducts(prev => prev.filter(p => p.id !== id));
    });
  };

//   const handleEdit = (customer) => {
//     setSelectedOrder(customer); // this will open your sub card
//   };

  const handleConfirm = (customerId, orderId) => {
    const updatedCustomers = [user].map(c => {
        if (c.customerId === customerId) {
        return {
            ...c,
            order: c.order.map(o =>
            o.id === orderId
                ? { ...o, statusSell: "Pagada" }
                : o
            )
        };
        }
        return c;
    });

    setCustomers(updatedCustomers);
    };

  const getOrderTotal = (order) => {
    return order.orders.reduce((total, item) => {
        return total + (item.price * item.qty);
    }, 0);
    };

  const handleComplete = (customerId, orderId) => {
    const updatedCustomers = [user].map(c => {
        if (c.customerId === customerId) {
        return {
            ...c,
            order: c.order.map(o =>
            o.id === orderId
                ? { ...o, status_sell: "Completed" }
                : o
            )
        };
        }
        return c;
    });

    setCustomers(updatedCustomers);
    };

  const handleComplete2 = async (customerid, orderId) => {

    console.log( "id of user", customerid)
    console.log( "id order", orderId)
    setExpandedOrderId(null)


    //  await updateOrder(orderId, {
    //     status_sell: "Lista"
    //   });

  };


    useEffect(() => {
      const token = localStorage.getItem("token");

      fetch(`${API_URL}/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log("data", data)

          // setOrders(data.customers.map(a => a.order.map(b => b.date)));
          setGuestOrder(data.guestOrder)
        });
    }, []);

    useEffect(() => {

      const token =
        localStorage.getItem("token");

      fetch(
        `${API_URL}/api/admin/dashboard`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      )
        .then(res => res.json())
        .then(data => {

          const customerOrders =
            (data.customers || [])
              .flatMap(customer =>
                (customer.order || [])
                  .map(order => ({

                    type: "customer",

                    customer_id:
                      customer.customer_id,

                    name:
                      customer.name,

                    email:
                      customer.email,

                    phone:
                      customer.phone,

                    address:
                      customer.address,

                    user_create:
                      customer.user_create,

                    order

                  }))
              );

          const guestOrders =
            (data.guest || [])
              .flatMap(guest =>
                (guest.order || [])
                  .map(order => ({

                    type: "guest",

                    customer_id:
                      guest.guestid,

                    name:
                      guest.name,

                    email:
                      guest.email,

                    phone:
                      guest.phone,

                    address:
                      guest.address,

                    user_create:
                      guest.user_create,

                    order

                  }))
              );

          const allOrders = [

            ...customerOrders,

            ...guestOrders

          ].sort(
            (a, b) =>
              new Date(b.order.date) -
              new Date(a.order.date)
          );

          console.log(
            "allOrders",
            allOrders
          );

          setOrders(allOrders);

        })
        .catch(console.error);

    }, []);

console.log( "guest orders", orders)


  return (
    <div className="admin-page">
      <h2>🛒 Administrador Tienda</h2>

      {/* PRODUCTS */}
      {/* <h3>Productos</h3>
      <div className="product-list">
        {customers.map(p => (
          <div key={p.customerId} className="admin-card">
            <img src={p.img[0] || ""} alt="" width="80" />
            <p>{p.name}</p>
            <p>${p.phone}</p>
            <p>{p.userCreate}</p>

            <button onClick={() => deleteProduct(p.id)}>
              Borrar
            </button>
          </div>
        ))}
      </div> */}

        <button
          className="logout-btn"
          onClick={() => {
              logout();
              navigate("/login");
            }}
          // onClick={logout}
        >
          Cerrar Sesión
        </button>


      {/* ORDERS */}
      <h3>Ordenes</h3>
      <table>
        <thead>
          <tr>
            <th># Cuenta</th>
            <th>Usuarios</th>
            <th>Direccion</th>
            <th>Telefono</th>
            <th># Orden</th>
            <th>Estado</th>
            <th>Editar</th>
            <th>Procesar</th>
          </tr>
        </thead>

        <tbody>
            {orders.map( customer => (
               <React.Fragment key={customer.order.id}>
                   <tr>
                        <td>{customer.customer_id}</td>
                        <td>{customer.name}</td>
                        <td>{customer.address}</td>
                        <td>{customer.phone}</td>

                          {/* ORDER ID */}
                        <td>{customer.order.id}</td>
                          {/* STATUS */}
                        <td>
                            {customer.order.status_sell === "Pendiente"
                            ? "Pendiente"
                            : "Pagada"}
                        </td>
                          {/* EDIT */}
                        <td>
                            <div
                            className="action-btn edit"
                            onClick={() => handleEdit(customer.order.id)}
                            >
                            Editar
                            </div>
                        </td>
                         <td>
                            <div
                            className="action-btn edit"
                            onClick={() =>
                                handleConfirm(customer.id)
                            }
                            >
                            Confirmar
                            </div>
                        </td>
                   </tr>
                   {expandedOrderId === customer.order.id && (
                       <tr className="order-details-row">
                           <td colSpan="8">
                               <div className="order-details">
                                     <h4>Detalle Orden #{customer.order.id}</h4>

                                    <p><strong>Cliente:</strong> {customer.name}</p>
                                    <p><strong>Teléfono:</strong> +{customer.phone}</p>
                                    <p><strong>Encargada:</strong> {customer.order.adm_in_charge}</p>
                                    {customer.order.gestor_sell !== "" && <p><strong>Gestor de Ventas:</strong> {customer.order.gestor_sell}</p> }

                                    <div className="qr-icons"
                                            onClick={() => {
                                                if (!customer.qrcode) return;
                                               
                                                setActiveQR(customer.qrcode)
                                                }} >
                                        <QrCode   size={56} />
                                    </div>

                                     <div className="order-item">
                                          <p><strong>Estado:</strong> {customer.order.status_sell === "Pendiente"
                                      ? "Pendiente"
                                      : "Pagada"}</p>

                                          <p><strong>Total:</strong> ${customer.order.revenew_total}</p>
                                          <p><strong>Pago:</strong> {customer.order.payment_format}</p>
                                    </div>

                                    {customer.order.orders?.map((prod, i) => (

                                    <div key={i} className="order-item2">
                                          
            
                                          {/* LEFT → PRODUCT IMAGE */}
                                          <img
                                              src={prod.img?.[0]}
                                              alt={prod.name || "product"}
                                              className="order-img"
                                              />

                                          {/* CENTER → TEXT */}
                                          <div className="order-info">
                                              <p><strong>Producto:</strong> {prod.name}</p>
                                              <p><strong>Cantidad:</strong> {prod.qty}</p>
                                              <p><strong>Precio:</strong> ${prod.price}</p>
                                          </div>
                                    </div>
                                    ))}

                                    <div
                                      className="action-btn2 complete"
                                      onClick={() =>  handleComplete2(customer.customer_id, customer.order.id)}
                                      >
                                      Marcar como listo
                                    </div>
                               </div>
                           </td>
                       </tr>
                   )}
               </React.Fragment>
            )

            )}
            </tbody>
      </table>
              {activeQR  && (
                                <div className="qr-modal" onClick={() => setActiveQR(null)}>
      
                                  <div
                                    className="qr-modal-content"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                  <QRCode value={activeQR} size={200} />
                                    <p>Escanear</p>
      
                                    <button onClick={() => setActiveQR(null)}>
                                      Cerrar
                                    </button>
      
                                  </div>
      
                                </div>
                              )}
    </div>
  );
};

export default AdminStore;

