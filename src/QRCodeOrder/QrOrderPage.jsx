import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./qr-order.css";

export default function QrOrderPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [orderset, setOrderset] = useState(null);
  const [paymentProcess, setPaymentProcess] = useState(null)


  useEffect(() => {
    fetch("http://localhost:5001/api/orders/admin")
      .then(res => res.json())
      .then(data => {

        const found = data.filter(o => o.qrcode === orderId);
        setOrder(found);
        setPaymentProcess(found?.map(a => a.order)[0])
        setOrderset(found?.map(a => a.order)[0].map(b => b.orders)[0])
      });
  }, [orderId]);


  if (!order) {
    return <div className="qr-loading">Loading order...</div>;
  }

  return (
    <div className="qr-order-container">
      <h2>Order Details</h2>

      <div className="qr-order-card">
        <p><strong>Order ID:</strong> {order.map(a => a.qrcode)}</p>
        <p><strong>Estado:</strong> {order.map(a => a.order.map(b => b.statusSell))}</p>
        <p><strong>Customer:</strong> {order.map(a => a.name)}</p>
        <p><strong>Forma de pago:</strong> {paymentProcess.map(a => a.paymentOption)}</p>

        <div className="qr-items">
          {orderset?.map((item, i) => (
            <div className="qr-item" key={i}>
              <img
                src={`http://localhost:5001${item.img?.[0]}`}
                alt={item.name}
              />

              <div className="qr-item-info">
                <span>{item.name}</span>
                <span>Qty: {item.qty}</span>
                <span>${item.price}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="qr-status">
          {paymentProcess.map(a => a.paymentFormat)}
        </div>

        <p><strong>Monto:</strong> ${paymentProcess.map(a => a.revenewTotal)} cup</p>
        <p><strong>Porcentage:</strong> ${paymentProcess.map(a => a.sellerCash)} cup</p>
        <p><strong>Gestor:</strong> {paymentProcess.map(a => a.gestorSell)}</p>
        <p><strong>Dependiente:</strong> {paymentProcess.map(a => a.admInCharge)}</p>

      </div>
    </div>
  );
}