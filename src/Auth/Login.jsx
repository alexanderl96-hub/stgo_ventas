import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import API_URL from "../api/api_images";
import "./auth.css";

export default function Login({ onAuth }) {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🔐 1. TRY USER LOGIN
      let res = await fetch(`${API_URL}/api/customers/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      let data = await res.json();

      // ✅ USER LOGIN SUCCESS
      if (res.ok && data.token) {
        onAuth(data);

        if (data.user?.role === "admin") {
          navigate("/Admin");
        } else {
          navigate("/Customer");
        }

        return;
      }

      // 🛠️ 2. TRY ADMIN LOGIN
      res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      data = await res.json();

      // ✅ ADMIN LOGIN SUCCESS
      if (res.ok && data.token) {
        onAuth(data);
        navigate("/Admin");
        return;
      }

      // ❌ BOTH FAILED
      alert("Invalid credentials");

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>

        <input
          type="email"
          placeholder="Correo"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />

         <div className="input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />

            {showPassword ? (
                <EyeOff
                  size={18}
                  className="password-eye"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <Eye
                  size={18}
                  className="password-eye"
                  onClick={() => setShowPassword(true)}
                />
              )}
          </div>

        <button type="submit">Iniciar sesión</button>

        <div className="auth-switch">
          No tienes una cuenta?{" "}
          <span onClick={() => navigate("/register")}>
            Regístrate
          </span>
        </div>
      </form>
    </div>
  );
}