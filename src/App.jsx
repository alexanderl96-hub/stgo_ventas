import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import useDataProducts from "./api/dataProducts.jsx";
import data from "./data_json";

import Home from "./Home/Home";
import Cart from "./Component/cart";
import Footer from "./Footer/Footer";
import ProductDetail from "./ItemDetails/ProductDetail";
import Checkout from "./Checkout/PaymentSelector";
import CustomerProfile from "./UserProfile/CustomerProfile";
import AdminStore from "./AdminStore/AdminStore";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import AdminLogin from "./Admin/AdminLogin";
import QrOrderPage from "./QRCodeOrder/QrOrderPage";
import CheckoutGuess from "./CheckoutGuess/PyamentSelectorGuess";

import UpdateProduct from "./updateDB/Update/updateDBProduct.jsx";
import CreateProduct from "./updateDB/Create/createProduct.jsx";

function App() {
  // 🧠 GLOBAL PRODUCT DATA (FROM BACKEND)
  const { products, filtered, search, 
    setSearch, category } =
    useDataProducts();

  console.log("filtered", filtered);
  console.log("category", category);

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [orders, setOrders] = useState([]);
  // const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  // const [products ] = useState(data?.products);
  const [activeCategory, setActiveCategory] = useState(category);
  const [activeProduct, setActiveProduct] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [amountOrder, setAmountOrder] = useState([]);
  const [customers, setCustomers] = useState([]);

  const navigate = useNavigate();

  const [orderConfig, setOrderConfig] = useState({
    color: "",
    size: "",
    gender: "",
    person_in_charge: "",
    img: [],
    statusVenta: "",
  });

  // 🔐 HANDLE LOGIN / REGISTER
  // const handleAuth = (data) => {
  //   if (data.token) {
  //     localStorage.setItem("token", data.token);
  //     localStorage.setItem("user", JSON.stringify(data.user));

  //     setToken(data.token);
  //     setUser(data.user);
  //   }
  // };

  const handleAuth = (data) => {
    if (!data?.token) return;

    // 💾 SAVE
    localStorage.setItem("token", data?.token);
    localStorage.setItem("user", JSON.stringify(data?.user));

    setToken(data?.token);
    setUser(data?.user);

    // 🧭 ROUTING
    if (data.user?.role === "admin") {
      navigate("/Admin");
    } else {
      navigate("/Customer");
    }
  };

  // 🔓 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  // 🔄 RESTORE SESSION ON REFRESH
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken) {
      setToken(savedToken);
    }
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  // useEffect(() => {
  //   const savedToken = localStorage.getItem("token");
  //   const savedUser = localStorage.getItem("user");

  //   if (!savedToken) return;

  //   // 🧠 restore instantly from localStorage (no flicker)
  //   if (savedUser) {
  //     setUser(JSON.parse(savedUser));
  //     setToken(savedToken);
  //   }

  //   // 🔍 optional backend validation (safe)
  //   fetch("http://localhost:5001/api/auth/profile", {
  //     headers: {
  //       Authorization: `Bearer ${savedToken}`
  //     }
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       if (!data.user) {
  //         // only clear if truly invalid
  //         localStorage.removeItem("token");
  //         localStorage.removeItem("user");
  //         setUser(null);
  //         setToken(null);
  //       }
  //     })
  //     .catch(() => {
  //       // DO NOTHING (IMPORTANT)
  //     });
  // }, []);

  // 🔄 VALIDATE TOKEN WITH BACKEND (optional but recommended)
  // useEffect(() => {
  //   const savedToken = localStorage.getItem("token");

  //   if (savedToken) {
  //     fetch("http://localhost:5001/api/auth/profile", {
  //       headers: {
  //         Authorization: `Bearer ${savedToken}`
  //       }
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         if (data.user) {
  //           setUser(data.user);
  //           setToken(savedToken);
  //          }  else {
  //           localStorage.clear();
  //         }
  //       })
  //       .catch(() => localStorage.clear());
  //   }
  // }, []);

  // console.log("user", user)
  console.log("token", activeCategory)
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              products={products}
              category={category}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              cart={cart}
              setCart={setCart}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              activeProduct={activeProduct}
              setActiveProduct={setActiveProduct}
              orderConfig={orderConfig}
              setOrderConfig={setOrderConfig}
              //  activeCategory={activeCategory}
              //  setActiveCategory={setActiveCategory}
              orderSuccess={orderSuccess}
              setOrderSuccess={setOrderSuccess}
              user={user}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              setCart={setCart}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              activeProduct={activeProduct}
              setActiveProduct={setActiveProduct}
              orderConfig={orderConfig}
              setOrderConfig={setOrderConfig}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              setAmountOrder={setAmountOrder}
              amountOrder={amountOrder}
              user={user}
              token={token}
            />
          }
        />
        <Route
          path="/details/:id"
          element={
            <ProductDetail
              products={products}
              category={category}

              cart={cart}
              setCart={setCart}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              activeProduct={activeProduct}
              setActiveProduct={setActiveProduct}
              orderConfig={orderConfig}
              setOrderConfig={setOrderConfig}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              orderSuccess={orderSuccess}
              setOrderSuccess={setOrderSuccess}
              user={user}
            />
          }
        />

        {/* 💳 CHECKOUT (PROTECTED) */}
        <Route
          path="/checkout"
          element={
            token && user?.role === "users" ? (
              <Checkout
                cart={cart}
                setCart={setCart}
                amountOrder={amountOrder}
                setAmountOrder={setAmountOrder}
                orderConfig={orderConfig}
                setOrderConfig={setOrderConfig}
                customers={customers}
                setCustomers={setCustomers}
                user={user}
                token={token}
                logout={logout}
              />
            ) : (
              <Login onAuth={handleAuth} />
            )
          }
        />

        {/* 👤 CUSTOMER PROFILE */}
        <Route
          path="/Customer"
          element={
            token && user?.role !== "admin" ? (
              <CustomerProfile
                cart={cart}
                setCart={setCart}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                activeProduct={activeProduct}
                setActiveProduct={setActiveProduct}
                orderConfig={orderConfig}
                setOrderConfig={setOrderConfig}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                orderSuccess={orderSuccess}
                setOrderSuccess={setOrderSuccess}
                customers={customers}
                setCustomers={setCustomers}
                user={user}
                logout={logout}
              />
            ) : (
              <Login onAuth={handleAuth} />
            )
          }
        />

        {/* 🛠 ADMIN */}
        <Route
          path="/Admin"
          element={
            token && user?.role === "admin" ? (
              <AdminStore
                cart={cart}
                setCart={setCart}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                activeProduct={activeProduct}
                setActiveProduct={setActiveProduct}
                orderConfig={orderConfig}
                setOrderConfig={setOrderConfig}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                orderSuccess={orderSuccess}
                setOrderSuccess={setOrderSuccess}
                customers={customers}
                setCustomers={setCustomers}
                user={user}
                logout={logout}
                orders={orders}
              />
            ) : (
              <AdminLogin onAuth={handleAuth} />
            )
          }
        />

        <Route
          path="/checkout-guess"
          element={
            <CheckoutGuess
              cart={cart}
              setCart={setCart}
              amountOrder={amountOrder}
              setAmountOrder={setAmountOrder}
              orderConfig={orderConfig}
              setOrderConfig={setOrderConfig}
              customers={customers}
              setCustomers={setCustomers}
              user={user}
              token={token}
            />
          }
        />

        <Route path="/login" element={<Login onAuth={handleAuth} />} />
        <Route path="/register" element={<Register onAuth={handleAuth} />} />
        <Route
          path="/admin-login"
          element={<AdminLogin onAuth={handleAuth} />}
        />

        <Route path="/qr/order/:orderId" element={<QrOrderPage />} />
        <Route path="/qr/products/:orderId" element={<QrOrderPage />} />
        <Route path="/admin/update-products" element={<UpdateProduct />} />
        <Route path="/admin/create-product" element={<CreateProduct />} />
      </Routes>
      <Footer
        cart={cart}
        setCart={setCart}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        token={token}
      />
    </div>
  );
}

export default App;
