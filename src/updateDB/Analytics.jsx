import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QrCode, ArrowLeft } from "lucide-react";
import "./Analytics.css";
import { useMemo } from "react";
import API_URL from "../api/api_images"

export default function Analytics() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

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
  
  const analytics = useMemo(() => {
    const now = new Date();

    const data = {
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
      if (!order) return;

      const date = new Date(order.date);

      const diffMonths =
        (now.getFullYear() - date.getFullYear()) * 12 +
        (now.getMonth() - date.getMonth());

      const diffYears =
        now.getFullYear() - date.getFullYear();

      // Current month
      if (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      ) {
        data.month.revenue += Number(order.revenew_total || 0);
        data.month.sellerCash += Number(order.seller_cash || 0);
        data.month.storeProfit += Number(order.tienda || 0);
        data.month.orders++;
      }

      // Last 6 months
      if (diffMonths >= 0 && diffMonths < 6) {
        data.sixMonths.revenue += Number(order.revenew_total || 0);
        data.sixMonths.sellerCash += Number(order.seller_cash || 0);
        data.sixMonths.storeProfit += Number(order.tienda || 0);
        data.sixMonths.orders++;
      }

      // Current year
      if (diffYears === 0) {
        data.year.revenue += Number(order.revenew_total || 0);
        data.year.sellerCash += Number(order.seller_cash || 0);
        data.year.storeProfit += Number(order.tienda || 0);
        data.year.orders++;
      }
    });

    return data;
  }, [orders]);

  const cards = [
    {
      title: "Este Mes",
      data: analytics.month,
    },
    {
      title: "Últimos 6 Meses",
      data: analytics.sixMonths,
    },
    {
      title: "Este Año",
      data: analytics.year,
    },
  ];

    useEffect(() => {
        window.scrollTo({
        top: 0,
        behavior: "smooth",
        });
    }, [])

  return (
    <div className="analytics-page">

    <button
            className="back-btn-icon"
            onClick={() => navigate("/Admin")}
        >
            <ArrowLeft size={20} />
            <span>Volver al Panel</span>
        </button>

      <h1>📊 Proyección de Ventas</h1>

      <div className="analytics-grid">
        {cards.map((card) => (
          <div className="analytics-card" key={card.title}>
            <h2>{card.title}</h2>

            <div className="analytics-item">
              <span>Ingresos Totales</span>
              <strong>${card.data.revenue.toLocaleString()}</strong>
            </div>

            <div className="analytics-item">
              <span>Ganancia Tienda</span>
              <strong>${card.data.storeProfit.toLocaleString()}</strong>
            </div>

            <div className="analytics-item">
              <span>Efectivo Vendedor</span>
              <strong>${card.data.sellerCash.toLocaleString()}</strong>
            </div>

            <div className="analytics-item">
              <span>Pedidos</span>
              <strong>{card.data.orders}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}