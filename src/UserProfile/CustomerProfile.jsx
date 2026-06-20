import React, { useEffect, useState, useMemo } from "react";
import "./customerProfile.css";
import { submitReview } from "../api/auth"

const CustomerProfile = ({ user, customers, setCustomers, logout, productsDB }) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({
      rating: 5,
      title: "",
      comment: ""
      });
  const [selectedProductId, setSelectedProductId] = useState(null);



  const openReviewModal = (productId) => {
    setSelectedProductId(productId);
    console.log("selectedProductId", selectedProductId)
  };

  // ---------------------------
  // STATE
  // ---------------------------
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [orders, setOrders] = useState([]);




  const handleSubmitReview = async () => {

    try {

      await submitReview(
        selectedProductId,
        {
          customer_id:
            user?.customer_id ||
            user?.guestid,

          name:
            user?.name,

          rating:
            reviewData.rating,

          title:
            reviewData.title,

          comment:
            reviewData.comment
        }
      );

      setShowReviewModal(false);

    } catch (error) {

      console.error(error);
    }
  };

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

  
  useEffect(() => {
    if (user) {
      setOrders(user.order || []);
    }
  }, [user]);

  console.log(orders, selectedProductId)

 
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

      <div className="profile_state">

      <div className="profile-title">
          <h2 >👤 Mi Cuenta</h2>
      </div>

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

      </div >

      <div className="orders-title">
            <h3 >📦 Mis Ordenes</h3>
      </div>

            
      </div>

      {/* ORDERS */}
  
      <div className="orders">
        {user?.order.length === 0 ? (
          <p className="no-orders">No ordenes todavía</p>
        ) : (
          [...orders]?.reverse().map(order => (
             <div key={order.id} className="order-card">

              <div className="order-header">
                <span>Order #{order.id}</span>
                <span className={`status ${order.status_sell.includes("Pendiente") ? "new" : "pago"}`}>
                  {order.status_sell.includes("Pendiente") ? "Nueva Orden" : "Pagada"}
                  </span>
              </div>

              <div className="order-body">

                <p><strong>Fecha:</strong> {new Date(order.date).toLocaleString()}</p>
                <p><strong>Pago:</strong> {order.payment_option}</p>
                <p><strong>Metodo:</strong> {order.payment_format}</p>
                <p><strong>Monto:</strong> ${order.revenew_total}
                {order.payment_format === "Zelle" ? " USD" : " CUP"} </p>
                <p><strong>Estado:</strong> {order.status_sell}</p>

                {/* PRODUCTS */}
                 <div className="order-products">
                 {order.orders.map((item, i) => {

                    return (
                      <div key={i} className="product-row">

                        <div className="product-left">
                          <img src={item.img} alt={item.name} />
                        </div>

                        <div className="product-info">
                          <div >
                            <span>{item.name}</span>
                          </div>
                          <div >
                            <span>x{item.qty}</span>
                          </div>
                          <div >
                            <span>$ {item.price} cup</span>
                          </div>
                          {order.status_sell === "Pagada" && (
                            <button
                              className="review-btn"
                              onClick={() => {
                                //  openReviewModal(item.product_id);
                                 setSelectedProductId(item.product_id);
                                 setShowReviewModal(true);

                              }}
                            >
                              Leave Review
                            </button>
                          )}

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

                   {
                    showReviewModal && (
                        <div className="review-modal-overlay">
                        <div className="review-modal">

                            <h2>Escribe tu opinión</h2>

                            <label>Calificación</label>

                            <div className="rating-stars">
                              {[1,2,3,4,5].map(star => (
                                <span
                                  key={star}
                                  className={
                                    star <= reviewData.rating
                                      ? "active"
                                      : ""
                                  }
                                  onClick={() =>
                                    setReviewData({
                                      ...reviewData,
                                      rating: star
                                    })
                                  }
                                >
                                  ★
                                </span>
                              ))}
                            </div>

                            <input
                            type="text"
                            placeholder="Título de la reseña"
                            value={reviewData.title}
                            onChange={(e) =>
                                setReviewData({
                                ...reviewData,
                                title: e.target.value
                                })
                            }
                            />

                            <textarea
                            placeholder="Cuéntanos tu experiencia con el producto..."
                            value={reviewData.comment}
                            onChange={(e) =>
                                setReviewData({
                                ...reviewData,
                                comment: e.target.value
                                })
                            }
                            />

                            <div className="review-actions">
                            <button
                                onClick={() =>
                                setShowReviewModal(false)
                                }
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={handleSubmitReview}
                            >
                                Enviar reseña
                            </button>
                            </div>

                        </div>
                        </div>
                    )
                    }

    </div>
  );
};

export default CustomerProfile;