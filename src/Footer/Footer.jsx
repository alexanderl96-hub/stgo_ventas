import { Link } from "react-router-dom";
import { Home, ShoppingCart, User, Store } from "lucide-react";

export default function BottomNav({
  cart,
  activeTab,
  setActiveTab,
  user
}) {
  const isAdmin = user?.role === "admin";
  const isLogged = !user;

  

  return (
    <div className="main_Contianer_Portal">
      <nav className="bottom-nav">

        {/* 🏠 HOME */}
        <div
          className={`nav-item ${activeTab === "home" ? "active" : ""}`}
          onClick={() => setActiveTab("home")}
        >
          <Link to="/" className="cart-link">
            <Home size={20} />
          </Link>
          <span>Home</span>
        </div>

        {/* 🛒 CART */}
        <div
          className={`nav-item ${activeTab === "cart" ? "active" : ""}`}
          onClick={() => setActiveTab("cart")}
        >
          {cart.length > 0 && (
            <span className="nav-cartCount">{cart.length}</span>
          )}

          <Link to="/cart" className="cart-link">
            <ShoppingCart size={20} />
          </Link>

          <span>Cart</span>
        </div>

        {/* 👤 PROFILE */}
        <div
          className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          {isLogged ? (
            <Link to="/login" className="cart-link">
              <User size={20} />
            </Link>
          ) : (
            <Link to="/Customer" className="cart-link">
              <User size={20} />
            </Link>
          )}

          <span>Profile</span>
        </div>

        {/* 🛠 ADMIN (ONLY FOR ADMIN USERS) */}
        {isAdmin && (
          <div
            className={`nav-item ${activeTab === "admin" ? "active" : ""}`}
            onClick={() => setActiveTab("admin")}
          >
            <Link to="/Admin" className="cart-link">
              <Store size={20} />
            </Link>
            <span>Admin</span>
          </div>
        )}

      </nav>
    </div>
  );
}