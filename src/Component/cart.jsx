import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./cart.css"
import "./second.css"
import { QrCode } from "lucide-react";
import QRCode from "react-qr-code";

function Cart({token, user, cart, setCart, activeProduct, setActiveProduct, 
  orderConfig, setOrderConfig, 
  activeCategory, setActiveCategory, 
  setAmountOrder, amountOrder
 }) {

  const navigate = useNavigate();
  const [activeQR, setActiveQR] = useState(null);
  const [cartWarning, setCartWarning] = useState(false);

  // console.log("user", user)
  console.log("cart", cart)
  console.log("amountOrder", amountOrder)

  // 🔥 GROUP ITEMS BY NAME
  const groupedCart = useMemo(() => {
    const map = new Map();

    cart.forEach(item => {
      const key = `${item.name}-${item.gender}-${item.sizes}-${item.colors}`;

      if (map.has(key)) {
        map.get(key).qty += 1;
      } else {
        map.set(key, { ...item, qty: 1 });
      }
    });

    return Array.from(map.values()).reverse();
  }, [cart]);
  // ➕ INCREASE QTY
  const increaseQty = (name) => {
    const found = cart.find(item => item.name === name);
    if (found) {
      setCart(prev => [...prev, found]);
    }
  };
  // ➖ DECREASE QTY
  const decreaseQty = (name) => {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
      const updated = [...cart];
      updated.splice(index, 1);
      setCart(updated);
    }
  };
  // 💰 TOTAL (WITH QTY)
  const total = groupedCart.reduce(
  (acc, item) => acc + Number(item.price) * item.qty,
  0
);

const totalQty = groupedCart.reduce(
  (acc, item) => acc + item.qty,
  0
);


const getColorStyle = (colors) => {

  if (!colors) return "#ccc";

  const colorMap = {
    golden: "gold"
  };

  // CLEAN + SPLIT
  const colorArray =
    colors
      .toLowerCase()
      .replace(/and/g, "")
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(
        color =>
          colorMap[color] || color
      );

  // ONE COLOR
  if (colorArray.length === 1) {
    return colorArray[0];
  }

  // MULTIPLE COLORS
  return `linear-gradient(
    45deg,
    ${colorArray.join(", ")}
  )`;
};

useEffect(() => {
  // window.scrollTo(0, 0);
   window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
}, []);

useEffect(()=>{
    setAmountOrder(groupedCart) 
}, [groupedCart, setAmountOrder])

// console.log("User", user);
// console.log("token", token)


  return (
    <div className="cart-page">

      {/* 🔥 SUMMARY ON TOP */}
      <div className="cart-top-summary">
        <h3>Resumen de Orden</h3>

        <div className="summary-line">
          <span>Productos</span>
          <span>{groupedCart.length}</span>
          <span>Cantidad</span>
          <span>{totalQty}</span>
        </div>

        <div className="summary-line total">
          <span>Total</span>
          <span>${total} </span>
        </div>

        <button
            className="checkout-btn"
            onClick={() => {
              if (cart.length === 0) {
                setCartWarning(true);

                // optional: auto reset after 3s
                setTimeout(() => setCartWarning(false), 3000);

                return;
              }


              // if cart has items → go to checkout
              if(token && user.role === "users"){
                navigate("/checkout");
              }else{
                 navigate("/checkout-guess");
              }
             
            }}
          >
            Enviar Solicitud
          </button>

      </div>
      {cartWarning && (
        <p className="cart-warning">
          ⚠️ El carrito está vacío
        </p>
      )}

      {/* ITEMS */}
      {cart.length > 0 && 
      <div className="cart-left">
        <h2>Ordenes del Carrito </h2>

        {groupedCart.map(item => (
          <div key={item.name} className="cart-row">

            {/* LEFT SIDE */}
            <div className="cart-left-block">
              <img src={item.img[0]} alt={item.name} />
              
    
              <p className="brand">
                {item.brand} · {item.store}
              </p>

              <div className="image-meta">
                ⭐ {item.rating} ({item.reviews})
                <span className="likes">❤️ {item.likes}</span>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="cart-info">

              <h4>{item.name}</h4>

              <p className="desc">
                <strong>Description: </strong>{item.description}
              </p>

              {/* SIZE */}
              {item.sizes && (
                <p className="meta">
                  <strong>Talla: </strong>{item.sizes}
                </p>
              )}

              <p className="meta">
                <strong>Genero: </strong>{item.gender}
              </p>

              <p className="meta">
               <strong>Tienda: </strong> {item.total_items}
              </p>

              {/* COLORS */}
              <div className="colors">
                <strong>Color:</strong> 
                {item.colors}
                 <span className="color-dot"
                       style={{
      background: getColorStyle(item.colors)
    }}
                      //  style={{ background: item.colors.split(" ")[0] }} 
                       >

                  </span>
              </div>

              {/* PRICE */}
              <p className="price">
                ${item.price}
              </p>

              {/* QR */}
              {item.qrcode === "" && (
                <p className="qr">
                  QR: {item.qrcode}
                </p>
              )}

              {/* ACTIONS */}
              <div className="actions">

                          <div className="qty">
                            <button onClick={() => decreaseQty(item.name)}>-</button>
                            <span>{item.qty}</span>
                           {item.total_items > item.qty && <button onClick={() => increaseQty(item.name)}>+</button>}
                           {item.total_items <= item.qty && <button ></button>}
                          </div>
                          <div>

                          {/* QR ICON */}
                          {item.qrcode  && (
                            <div
                              className="qr-icon"
                              onClick={() => setActiveQR(item.qrcode)}
                            >
                              <QrCode   size={56} />
                            </div>
                          )}
                          </div>

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

            </div>
          </div>
        ))}

      </div>
      }

    </div>
  );
}

export default Cart;
