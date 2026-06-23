import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./adminStore.css"
import { QrCode } from "lucide-react";
import QRCode from "react-qr-code";
import API_URL from "../api/api_images"
import { updateOrder, updateOrderStatus, 
         deleteOrderAndUpdateUser, restoreProductsInventory } from "../api/auth"
import Ordenes from "../updateDB/OrdenDasboard"

const AdminStore = ({user, customers, setCustomers, logout }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedCustomerId, setExpandedCustomerId] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [activeQR, setActiveQR] = useState(null);
  const [orders, setOrders] = useState([]);
  const [guestOrder, setGuestOrder] = useState([])
  const [showConfirm, setShowConfirm] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");


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

    // useEffect(() => {

    //   const token =
    //     localStorage.getItem("token");

    //   fetch(
    //     `${API_URL}/api/admin/dashboard`,
    //     {
    //       headers: {
    //         Authorization:
    //           `Bearer ${token}`
    //       }
    //     }
    //   )
    //     .then(res => res.json())
    //     .then(data => {

    //       const customerOrders =
    //         (data.customers || [])
    //           .flatMap(customer =>
    //             (customer.order || [])
    //               .map(order => ({

    //                 type: "customer",

    //                 customer_id:
    //                   customer.customer_id,

    //                 name:
    //                   customer.name,

    //                 email:
    //                   customer.email,

    //                 phone:
    //                   customer.phone,

    //                 address:
    //                   customer.address,

    //                 user_create:
    //                   customer.user_create,

    //                 order

    //               }))
    //           );

    //       const guestOrders =
    //         (data.guest || [])
    //           .flatMap(guest =>
    //             (guest.order || [])
    //               .map(order => ({

    //                 type: "guest",

    //                 customer_id:
    //                   guest.guestid,

    //                 name:
    //                   guest.name,

    //                 email:
    //                   guest.email,

    //                 phone:
    //                   guest.phone,

    //                 address:
    //                   guest.address,

    //                 user_create:
    //                   guest.user_create,

    //                 order

    //               }))
    //           );

    //       const allOrders = [

    //         ...customerOrders,

    //         ...guestOrders

    //       ].sort(
    //         (a, b) =>
    //           new Date(b.order.date) -
    //           new Date(a.order.date)
    //       );

    //       console.log(
    //         "allOrders",
    //         allOrders
    //       );

    //       setOrders(allOrders);

    //     })
    //     .catch(console.error);

    // }, []);

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



const totalOrders =
  orders.length;

const totalProfit =
  orders.map(a => a.order).reduce(
    (sum, order) =>
      sum + Number(order.revenew_total || 0),
    0
  );

const recoveredInvestment =
  orders.map(a => a.order).reduce(
    (sum, order) =>
      sum + Number(order.tienda || 0),
    0
  ) * -1;

  const calculateMonthlyTarget = (orders) => {

      const now = new Date();

      const currentMonthOrders =
        orders.map(a => a.order).filter(order => {

          const orderDate =
            new Date(order.date);

          return (
            orderDate.getMonth() ===
              now.getMonth() &&
            orderDate.getFullYear() ===
              now.getFullYear()
          );
        });

      const currentRevenue =
        currentMonthOrders.reduce(
          (sum, order) =>
            sum +
            Number(
              order.revenew_total || 0
            ),
          0
        );

      const currentDay =
        now.getDate();

      const daysInMonth =
        new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0
        ).getDate();

      const projectedRevenue =
        (currentRevenue / currentDay) *
        daysInMonth;

      return Math.round(
        projectedRevenue
      );
    };

  const monthlyTarget =
  calculateMonthlyTarget(
    orders
  );


  return (
    <div className="admin-dashboard">

      <div className="dashboard-header">
        <h1>📊 Panel Administrativo</h1>
        <p>Ventas Express - Gestión Comercial</p>
      </div>

      <div className="dashboard-stats">

        <div className="stat-card">
          <h3>📦 Órdenes</h3>
          <span>{totalOrders}</span>
        </div>

        <div className="stat-card">
          <h3>💰 Ganancias Totales</h3>
          <span>${totalProfit}</span>
        </div>

        <div className="stat-card">
          <h3>📈 Inversión Recuperada</h3>
          <span>${recoveredInvestment}</span>
        </div>

        <div className="stat-card">
          <h3>🎯 Meta Mensual</h3>
          <span>${monthlyTarget}</span>
        </div>

      </div>

      <div className="dashboard-actions">

        <button
          className="action-card"
          onClick={() => navigate("/ordenes")}
        >
          📦
          <h3>Órdenes</h3>
          <p>Gestionar pedidos y entregas</p>
        </button>

        <button
          className="action-card"
          onClick={() => navigate("/create-product")}
        >
          ➕
          <h3>Nuevo Producto</h3>
          <p>Agregar productos al catálogo</p>
        </button>

        <button
          className="action-card"
          onClick={() => navigate("/update-products")}
        >
          ✏️
          <h3>Actualizar Producto</h3>
          <p>Modificar inventario y precios</p>
        </button>

        <button
          className="action-card"
          onClick={() => navigate("/admin/analytics")}
        >
          📊
          <h3>Proyección de Ventas</h3>
          <p>Mes · 6 Meses · Año</p>
        </button>

      </div>

      <button
        className="logout-btn"
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        Cerrar Sesión
      </button>

    </div>
  );
};

export default AdminStore;

