import React, { useEffect, useState } from "react";
import "./adminStore.css"
import { QrCode } from "lucide-react";
import QRCode from "react-qr-code";


const AdminStore = ({user, customers, setCustomers }) => {
  const [products, setProducts] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedCustomerId, setExpandedCustomerId] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [activeQR, setActiveQR] = useState(null);
  const [orders, setOrders] = useState([]);

    // const handleEdit = (customerId) => {
    // setExpandedCustomerId(prev =>
    //     prev === customerId ? null : customerId
    // );
    // };

    const handleEdit = (orderId) => {
        setExpandedOrderId(prev =>
            prev === orderId ? null : orderId
        );
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
                ? { ...o, statusSell: "Completed" }
                : o
            )
        };
        }
        return c;
    });

    setCustomers(updatedCustomers);
    };


useEffect(() => {
  const token = localStorage.getItem("token");

  fetch("http://localhost:5001/api/admin/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      setOrders(data.orders);
    });
}, []);


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
            {orders.flatMap(customer =>
                customer.order.map(order => (
                <React.Fragment key={order.id}>

                    {/* MAIN ROW (per order) */}
                    <tr>
                    <td>{customer.customerId}</td>
                    <td>{customer.name}</td>
                    <td>{customer.address}</td>
                    <td>{customer.phone}</td>

                    {/* ORDER ID */}
                    <td>{order.id}</td>

                    {/* STATUS */}
                    <td>
                        {order.statusSell === "Pending..."
                        ? "Pendiente"
                        : "Pagada"}
                    </td>

                    {/* EDIT */}
                    <td>
                        <div
                        className="action-btn edit"
                        onClick={() => handleEdit(order.id)}
                        >
                        Editar
                        </div>
                    </td>

                    {/* CONFIRM */}
                    <td>
                        <div
                        className="action-btn edit"
                        onClick={() =>
                            handleConfirm(customer.customerId, order.id)
                        }
                        >
                        Confirmar
                        </div>
                    </td>
                    </tr>

                    {/* 🔽 EXPAND PER ORDER */}
                    {expandedOrderId === order.id && (
                    <tr className="order-details-row">
                        <td colSpan="8">
                        <div className="order-details">
                            <h4>Detalle Orden #{order.id}</h4>

                            <p><strong>Cliente:</strong> {customer.name}</p>
                            <p><strong>Teléfono:</strong> +{customer.phone}</p>
                            <p><strong>Encargada:</strong> {customer.order.map(a => a.admInCharge)}</p>
                            {customer.order.map(a => a.gestorSell) !== "" && <p><strong>Gestor de Ventas:</strong> {customer.order.map(a => a.gestorSell)}</p> }

                            <div className="qr-icons"
                                    onClick={() => {
                                        if (!customer.qrcode) return;
                                        // setActiveQR(customer.qrcode);
                                        setActiveQR(`http://localhost:3000/qr/order/${customer.qrcode}`)
                                        }} >
                                 <QrCode   size={56} />
                            </div>
                            <div className="order-item">
                            <p><strong>Estado:</strong> {order.statusSell === "Pending..."
                        ? "Pendiente"
                        : "Pagada"}</p>
                            <p><strong>Total:</strong> ${getOrderTotal(order)}</p>
                            <p><strong>Pago:</strong> {order.paymentFormat}</p>
                            </div>

                            {/* PRODUCTS */}
                            {order.orders?.map((prod, i) => (

                            <div key={i} className="order-item2">
                                
  
                                {/* LEFT → PRODUCT IMAGE */}
                                <img
                                    src={prod.img?.[0] ? `http://localhost:5001${prod.img[0]}` : ""}
                                    alt={prod.name || "product"}
                                    className="order-img"
                                    />

                                {/* CENTER → TEXT */}
                                <div className="order-info">
                                    <p><strong>Producto:</strong> {prod.name}</p>
                                    <p><strong>Cantidad:</strong> {prod.qty}</p>
                                    <p><strong>Precio:</strong> ${prod.price}</p>
                                </div>

                                {/* RIGHT → QR CODE */}

                                <div
                                    className="qr-icon"
                                    onClick={() => {
                                        if (!order.qrcode) return;
                                        setActiveQR(order.qrcode);
                                        }}
                                >
                                    <QrCode   size={56} />
                                </div>
                                </div>
                            ))}

                            <div
                            className="action-btn2 complete"
                            onClick={() => handleComplete(customer.customerId, order.id)}
                            >
                            Marcar como listo
                            </div>
                            {/* <div
                                className={`action-btn2 complete ${
                                    order.statusSell === "Pagada" ? "disabled" : ""
                                }`}
                                onClick={() => {
                                    if (order.statusSell === "Pagada") return;
                                    handleComplete(customer.customerId, order.id);
                                }}
                                >
                                Marcar como listo
                                </div> */}
                        </div>
                        </td>
                    </tr>
                    )}

                </React.Fragment>

                ))
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