import { useState } from "react";
import { adminLogin } from "../api/adminAuth";
import "./adminLogin.css"

export default function AdminLogin({ onAuth }) {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await adminLogin(form);
    onAuth(data);
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>

        <input
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

        <button type="submit">Login as Admin</button>
      </form>
    </div>
  );
}


// ,
    // {
    //   "src": "logo192.png",
    //   "type": "image/png",
    //   "sizes": "192x192"
    // },
    // {
    //   "src": "logo512.png",
    //   "type": "image/png",
    //   "sizes": "512x512"
    // }