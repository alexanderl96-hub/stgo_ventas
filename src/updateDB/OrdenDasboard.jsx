import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QrCode, ArrowLeft } from "lucide-react";
import QRCode from "react-qr-code";
import API_URL from "../api/api_images"
import { updateOrder, updateOrderStatus, 
         deleteOrderAndUpdateUser, restoreProductsInventory } from "../api/auth"
import "./ordenes.css"

export default function Ordenes ({
   user, customers, setCustomers,
  }) {
     const navigate = useNavigate();
     const [products, setProducts] = useState([]);
      const [selectedOrder, setSelectedOrder] = useState(null);
      const [expandedCustomerId, setExpandedCustomerId] = useState(null);
      const [expandedOrderId, setExpandedOrderId] = useState(null);
      const [activeQR, setActiveQR] = useState(null);
      const [orders, setOrders] = useState([]);
      const [guestOrder, setGuestOrder] = useState([])
      const [showConfirm, setShowConfirm] = useState(false);


  const handleRemoveClick = (
      customerId,
      orderId,
      order
    ) => {

      setSelectedOrder({
        customerId,
        orderId,
        order
      });

      setShowConfirm(true);
    };


  const confirmRemove = async () => {

      if (!selectedOrder) return;

      await handleDelete(
        selectedOrder.customerId,
        selectedOrder.orderId,
        selectedOrder.order
      );

      setShowConfirm(false);
      setSelectedOrder(null);
    };


  const cancelRemove = () => {

  setShowConfirm(false);
  setSelectedOrder(null);

};



    const handleEdit = (orderId) => {
        setExpandedOrderId(prev =>
            prev === orderId ? null : orderId
        );
     };

  const deleteProduct = (id) => {
    fetch(`/api/admin/products/${id}`, {
      method: "DELETE"
    }).then(() => {
      setProducts(prev => prev.filter(p => p.id !== id));
    });
  };


  const handleConfirm = async (customerId, orderId) => {
   
      await updateOrderStatus(
        customerId,
        orderId,
        "Pagada"
      );
    };
  

  const handleDelete = async (
        customerId,
        orderId,
        order
      ) => {

        if (
          !customerId ||
          !orderId ||
          !order
        ) return;

        const items =
          order.orders?.map(item => ({
            product_id: item.product_id,
            name: item.name,
            qty: item.qty,
            colors: item.colors,
            sizes: item.sizes
          }));

        await restoreProductsInventory({
          items
        });

        const result =
          await deleteOrderAndUpdateUser(
            customerId,
            orderId
          );

        console.log(result);

         if (result.success) {
              console.log(result.success)
          }else{
            console.error()
          }

      };

  const handleRemove = (orderId) => {

    const confirmed = window.confirm(
      "¿Está seguro que desea eliminar esta orden?"
    );

    if (!confirmed) return;

    handleEdit(orderId);
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

    setExpandedOrderId(null)

     await updateOrder(orderId, {
        status_sell: "Lista"
      });

      await updateOrderStatus(
        customerid,
        orderId,
        "Lista"
      );

  };

    useEffect(() => {

        const fetchOrders = () => {

          const token =
            localStorage.getItem("token");

          fetch(
            `${API_URL}/api/admin/dashboard`,
            {
              headers: {
                Authorization: `Bearer ${token}`
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

              setOrders(allOrders);

            })
            .catch(console.error);

        };

        // Initial fetch
        fetchOrders();

        // Refresh every 5 seconds
        const interval =
          setInterval(fetchOrders, 2000);

        return () =>
          clearInterval(interval);

      }, []);
      console.log( "guest orders", orders)


  return (
    <div className="admin-page">
       
       <button
            className="back-btn-icon"
            onClick={() => navigate("/Admin")}
        >
            <ArrowLeft size={20} />
            <span>Volver al Panel</span>
        </button>

      {/* ORDERS */}
      <h3>Ordenes</h3>
      <table>
        <thead>
          <tr>
            <th># Orden</th>
            <th>Usuarios</th>
            <th>Direccion</th>
            <th>Telefono</th>
            <th>Estado</th>
            <th>Editar</th>
            <th>Procesar</th>
            <th>Borrar</th>
          </tr>
        </thead>

        <tbody>
            {orders.map( customer => (
               <React.Fragment key={customer.order.id}>
                   <tr>
                        {/* <td>{customer.customer_id}</td> */}
                         <td>{customer.order.id}</td>
                        <td>{customer.name}</td>
                        <td>{customer.address}</td>
                        <td>{customer.phone}</td>

                          {/* ORDER ID */}
                        {/* <td>{customer.order.id}</td> */}
                          {/* STATUS */}
                        <td>
                            {customer.order.status_sell}
                        </td>
                          {/* EDIT */}
                        <td>
                            <div
                            // className="action-btn edit"
                            className={`action-btn ${
                              customer.order.status_sell === "Pagada"
                                ? "edit disabled"
                                : "edit"
                            }`}
                            onClick={() => handleEdit(customer.order.id)}
                            >
                            Editar
                            </div>
                        </td>
                         <td>
                            <div
                            // className="action-btn edit"
                            className={`action-btn ${
                              customer.order.status_sell === "Pagada"
                                ? "done disabled"
                                : "edit"
                            }`}
                            onClick={() => {
                                if (customer.order.status_sell === "Pagada") return;

                                handleConfirm(
                                  customer.customer_id,
                                  customer.order.id
                                );
                              }}
                            >
                            {/* Confirmar */}
                            {
                              customer.order.status_sell === "Pagada"
                                ? "Completada"
                                : "Confirmar"
                            }
                            </div>
                        </td>
                         {/* BORRAR */}
                        <td>
                            <div
                            // className="action-btn remove"
                            className={`action-btn ${
                              customer.order.status_sell === "Pagada"
                                ? "remove disabled"
                                : "remove"
                            }`}
                            onClick={() => 
                              handleRemoveClick(customer.customer_id, 
                                                customer.order.id, 
                                                customer.order)}
                            
                            >
                             Cancelar
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
                                    {customer.order.payment_option  === "Domicilio"
                                       && (<p><strong>Direccion:</strong> {customer.address}</p>)
                                    }
                                    
                                    <p><strong>Encargada:</strong> {customer.order.adm_in_charge}</p>
                                    {customer.order.gestor_sell !== "" && <p><strong>Gestor de Ventas:</strong> {customer.order.gestor_sell}</p> }

                                    <div className="qr-icons"
                                            onClick={() => {
                                                if (!customer.order.qrcode) return;
                                               
                                                setActiveQR(customer.order.qrcode)
                                                }} >
                                        <QrCode   size={56} />
                                    </div>

                                     <div className="order-item">
                                          <p><strong>Estado:</strong> {customer.order.status_sell}</p>

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
              {
                  showConfirm && (
                    <div className="confirm-overlay">
                      <div className="confirm-modal">

                        <h3>Confirmar eliminación</h3>

                        <p>
                          ¿Está seguro que desea eliminar esta
                          orden?
                        </p>

                        <div className="confirm-actions">

                          <button
                            className="cancel-btn"
                            onClick={cancelRemove}
                          >
                            Cancelar
                          </button>

                          <button
                            className="delete-btn"
                            onClick={confirmRemove}
                            // onClick={() =>  confirmRemove(customer.customer_id, customer.order.id)}
                          >
                            Eliminar
                          </button>

                        </div>

                      </div>
                    </div>
                  )
                }
    </div>
  )
}
