import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";

export default function Login({ onAuth }) {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🔐 1. TRY USER LOGIN
      let res = await fetch("http://localhost:5001/api/auth/login", {
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
      res = await fetch("http://localhost:5001/api/admin/login", {
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
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button type="submit">Login</button>

        <div className="auth-switch">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")}>
            Register
          </span>
        </div>
      </form>
    </div>
  );
}