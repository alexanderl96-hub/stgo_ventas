import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./adminStore.css"
import { QrCode } from "lucide-react";
import QRCode from "react-qr-code";
import API_URL from "../api/api_images"
import { updateOrder, updateOrderStatus, 
         deleteOrderAndUpdateUser, restoreProductsInventory } from "../api/auth"
import Ordenes from "../updateDB/OrdenDasboard"

const AdminStore = ({user, customers, setCustomers, 
  logout, dataUpdateDB }) => {
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

const groupedByPerson = orders.reduce((acc, item) => {
  const person = item.order.adm_in_charge;

  if (!acc[person]) {
    acc[person] = {
      person_in_charge: person,
      total_seller_cash: 0,
      total_cup_price: 0,
      total_tienda: 0,
      total_revenew: 0,
      orders: []
    };
  }

  acc[person].total_seller_cash += Number(item.order.seller_cash) || 0;
  acc[person].total_cup_price += Number(item.order.cup_price) || 0;
  acc[person].total_tienda += Number(item.order.tienda) || 0;
  acc[person].total_revenew += Number(item.order.revenew_total) || 0;

  // Keep the complete original object
  acc[person].orders.push(item);

  return acc;
}, {});

const result = Object.values(groupedByPerson);

const isAdmin = user?.name === "Alexander La Rosa";

const normalizeName = (name = "") =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .trim()
    .toLowerCase();

const mySales = result.find(
  item =>
    normalizeName(item.person_in_charge) ===
    normalizeName(user?.name)
);
console.log("is Admin", isAdmin, result.map(a => a.person_in_charge), user?.name, mySales)

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
      sum + Number(order.cup_price || 0),
    0
  );

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


  const getSalesAnalytics = (orders) => {
      const now = new Date();

      const analytics = {
        month: {
          revenue: 0,
          sellerCash: 0,
          storeProfit: 0,
          orders: 0,
        },
        sixMonths: {
          revenue: 0,
          sellerCash: 0,
          storeProfit: 0,
          orders: 0,
        },
        year: {
          revenue: 0,
          sellerCash: 0,
          storeProfit: 0,
          orders: 0,
        },
      };

      orders.forEach(({ order }) => {
        const date = new Date(order.date);

        const diffMonths =
          (now.getFullYear() - date.getFullYear()) * 12 +
          (now.getMonth() - date.getMonth());

        const diffYears = now.getFullYear() - date.getFullYear();

        // Current month
        if (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        ) {
          analytics.month.revenue += Number(order.revenew_total);
          analytics.month.sellerCash += Number(order.seller_cash);
          analytics.month.storeProfit += Number(order.tienda);
          analytics.month.orders++;
        }

        // Last 6 months
        if (diffMonths >= 0 && diffMonths < 6) {
          analytics.sixMonths.revenue += Number(order.revenew_total);
          analytics.sixMonths.sellerCash += Number(order.seller_cash);
          analytics.sixMonths.storeProfit += Number(order.tienda);
          analytics.sixMonths.orders++;
        }

        // Current year
        if (diffYears === 0) {
          analytics.year.revenue += Number(order.revenew_total);
          analytics.year.sellerCash += Number(order.seller_cash);
          analytics.year.storeProfit += Number(order.tienda);
          analytics.year.orders++;
        }
      });

      return analytics;
    };


  return (
    <div className="admin-dashboard">

      <div className="dashboard-header">
        <h1>📊 Panel Administrativo</h1>
        <p>Ventas Express - Gestión Comercial</p>
      </div>

      {isAdmin ? (
        result.map((seller) => (
          <div key={seller.person_in_charge} className="sales-summary">
            <h2 className="sales-title">
              {seller.person_in_charge}
            </h2>

            <div className="sales-grid">
              <div className="sales-card">
                <span>Ingresos Totales</span>
                <strong>${seller.total_revenew}</strong>
              </div>

              <div className="sales-card">
                <span>CUP Precio</span>
                <strong>${seller.total_cup_price}</strong>
              </div>

              <div className="sales-card">
                <span>Ganancia Tienda</span>
                <strong>${seller.total_tienda}</strong>
              </div>

              <div className="sales-card">
                <span>Ganancia del Vendedor</span>
                <strong>${seller.total_seller_cash}</strong>
              </div>
            </div>
          </div>
        ))
      ) : (
        mySales && (
          <div className="sales-summary">
            <div className="seller-summary">
              <h2 className="sales-title seller-name">
                {mySales.person_in_charge}
              </h2>

              <div className="sales-card">
                <span>Ganancia del Vendedor</span>
                <strong>${mySales.total_seller_cash}</strong>
              </div>
            </div>
          </div>
        )
      )}

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

