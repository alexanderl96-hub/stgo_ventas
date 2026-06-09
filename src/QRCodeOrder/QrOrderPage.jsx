import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./qr-order.css";
import API_URL from "../api/api_images";

export default function QrOrderPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [orderset, setOrderset] = useState(null);
  const [paymentProcess, setPaymentProcess] = useState(null)


  useEffect(() => {
  fetch(`${API_URL}/api/guest-orders/${orderId}`)
    .then(res => res.json())
    .then(data => {

      console.log("data order", data);

      const found = data.order;

      setOrder(found);

      setPaymentProcess(found);

      setOrderset(found.orders);
    });
}, [orderId]);


  if (!order) {
    return <div className="qr-loading">Loading order...</div>;
  }

  return (
    <div className="qr-order-container">
      <h2>Order Details</h2>

      <div className="qr-order-card">
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Estado:</strong> {order.status_sell}</p>
       {order.guest_name  && 
         <p><strong>Customer:</strong> {order.guest_name}</p>}
        <p><strong>Forma de pago:</strong> {paymentProcess.payment_option}</p>

        <div className="qr-items">
          {orderset?.map((item, i) => (
            <div className="qr-item" key={i}>
              <img
                src={item.img?.[0]}
                alt={item.name}
              />

              <div className="qr-item-info">
                <span>Nombre: {item.name}</span>
                <span>Cantidad: {item.qty}</span>
                <span>Precio: ${item.price}</span>
                <span>Talla: {item.sizes}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="qr-status">
          {paymentProcess.payment_format}
        </div>

        <p><strong>Monto:</strong> ${paymentProcess.revenew_total} cup</p>
        <p><strong>Porcentage:</strong> ${paymentProcess.seller_cash} cup</p>
      {paymentProcess.gestor_sell !== "" && 
      <p><strong>Gestor de Venta:</strong> {paymentProcess.gestor_sell}</p>}
        <p><strong>Dependiente:</strong> {paymentProcess.adm_in_charge}</p>

      </div>
    </div>
  );
}