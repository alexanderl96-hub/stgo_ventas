// SplashScreen.jsx

import "./SplashScreen.css";
import logo from "./ventas_express.png"

export default function SplashScreen() {
  return (
    <div className="splash-screen">
      <img src={logo} alt="Ventas Express"  className="splash-logo"/>
    </div>
  );
}