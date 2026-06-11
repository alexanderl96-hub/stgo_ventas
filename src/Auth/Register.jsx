import { useState, useEffect } from "react";
import { registerUser } from "../api/auth";
import "./auth.css";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import BirthdayPicker from "../BirthdayPicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import API_URL from "../api/api_images";

export default function Register({ onAuth }) {
  const[passwordVerification, setPasswordVerification] = useState("")
  const [emailError, setEmailError] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [showSuccess, setShowSuccess] = useState(false);
const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    birthday: "", 
    imagen: "", 
    address: "", 
    role: "customer"
  });


  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await registerUser(form);

    console.log("data", data)
    onAuth(data);
    console.log("onAuth", data.token)

     if (data.success) {
        setMessage("Product created successfully");

        setForm({
            name: "",
            email: "",
            password: "",
            phone: "",
            birthday: "", 
            imagen: "", 
            address: "", 
            role: "customer"
        });

        navigate("/login");

        // setImages([]);
      } else {
        setMessage(data.message || data.error);
      }

    if (data.token) {
      console.log("data token for if", )
      navigate("/");
    }
  };

  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 8);

    const part1 = cleaned.slice(0, 2);
    const part2 = cleaned.slice(2, 5);
    const part3 = cleaned.slice(5, 8);

    if (cleaned.length < 3) return `(${part1}`;
    if (cleaned.length < 6) return `(${part1}) ${part2}`;
    return `(${part1}) ${part2}-${part3}`;
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const passwordsMatch =
  passwordVerification !== "" &&
  passwordVerification === form.password;

  const formatBirthday = (value) => {
    const digits = value.replace(/\D/g, "");

    if (digits.length <= 2) return digits;

    if (digits.length <= 4) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }

    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  };

  useEffect(() => {
  if (
    passwordVerification !== "" &&
    passwordVerification === form.password
  ) {
    setShowSuccess(true);

    const timer = setTimeout(() => {
      setShowSuccess(false);
      setShowConfirmPassword(false);
      setShowPassword(false)
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }
}, [passwordVerification, form.password]);

//  const formatDate = (value) => {

//   const numbers = value.replace(/\D/g, "");

//   if (numbers.length <= 2) {
//     return numbers;
//   }

//   if (numbers.length <= 4) {
//     return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
//   }

//   return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
// };

const formatDate = (value) => {

  let numbers = value.replace(/\D/g, "");

  let month = numbers.slice(0, 2);
  let day = numbers.slice(2, 4);
  let year = numbers.slice(4, 8);

  if (month.length === 2) {
    month = Math.min(
      Math.max(Number(month), 1),
      12
    )
      .toString()
      .padStart(2, "0");
  }

  if (day.length === 2) {
    day = Math.min(
      Math.max(Number(day), 1),
      31
    )
      .toString()
      .padStart(2, "0");
  }

  let result = month;

  if (numbers.length > 2) {
    result += `/${day}`;
  }

  if (numbers.length > 4) {
    result += `/${year}`;
  }

  return result;
};

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>Register</h2>

        <input
          type="text"
          placeholder="Nombre y Apellidos"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

       <input
          type="email"
          placeholder="Correo"
          value={form.email}
          style={{
            borderColor:
              form.email !== "" && !isValidEmail(form.email)
                ? "red"
                : ""
          }}
          onChange={(e) => {
            const email = e.target.value;

            setForm({
              ...form,
              email
            });

            setEmailError(
              email !== "" && !isValidEmail(email)
            );
          }}
        />


       <div className="input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
             style={{
                  borderColor: showSuccess
                    ? "#3dde2bff"
                    : "#ddd",

                  boxShadow: showSuccess
                    ? "0 0 8px rgba(61, 222, 43, 0.4)"
                    : "none",

                  transition: "all .3s ease"
                }}
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

        {form.password.length > 8 && (
            <div className="input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repetir Contraseña"
                value={passwordVerification}
                onChange={(e) =>
                  setPasswordVerification(e.target.value)
                }
                 style={{
                    borderColor:
                      passwordVerification === ""
                        ? "#ddd"
                        : showSuccess
                        ? "#3dde2bff"
                        : passwordVerification !== form.password
                        ? "red"
                        : "#ddd",

                    boxShadow:
                      passwordVerification === ""
                        ? "none"
                        : showSuccess
                        ? "0 0 8px rgba(61, 222, 43, 0.4)"
                        : passwordVerification !== form.password
                        ? "0 0 8px rgba(255, 0, 0, 0.3)"
                        : "none",

                    transition: "all .3s ease"
                  }}
              />

              {showConfirmPassword ? (
                <EyeOff
                  size={18}
                  className="password-eye"
                  onClick={() => setShowConfirmPassword(false)}
                />
              ) : (
                <Eye
                  size={18}
                  className="password-eye"
                  onClick={() => setShowConfirmPassword(true)}
                />
              )}
            </div>
          )}

        {passwordVerification === form.password &&
          form.password !== "" && (
            <input
              type="text"
              placeholder="Numero de Telefono"
              value={form.phone ? `+53 ${formatPhone(form.phone)}` : ""}
              onChange={(e) => {
                let value = e.target.value;

                value = value.replace("+53", "").trim();
                value = value.replace(/\D/g, "");

                if (value.length <= 8) {
                  setForm({
                    ...form,
                    phone: value
                  });
                }
              }}
            />
        )}

        
    
        {form.phone.length === 8 && (
          <input
            type="text"
            placeholder="Fecha de Nacimiento (Mes/Dia/Año)"
            onChange={(e) => {
              const formatted = formatDate(e.target.value);

              setForm({
                ...form,
                birthday: formatted
              });
            }}
          />
        )}
        {/* {form.phone.length === 8 && (
  <BirthdayPicker
    form={form}
    setForm={setForm}
  />
)} */}

        {/* {form.phone.length === 8 && (
            <DatePicker
              selected={
                form.birthday
                  ? new Date(form.birthday)
                  : null
              }
              onChange={(date) =>
                setForm({
                  ...form,
                  birthday: date
                })
              }
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              yearDropdownItemNumber={100}
              placeholderText="Fecha de Nacimiento"
              dateFormat="MM/dd/yyyy"
            />
            )} */}
 
          {form.birthday.length === 10 && (
            <input
              type="text"
              placeholder="Direccion"
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />
          )}

         <input
          type="text"
          placeholder="Posicion"
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
          style={{display: "none"}}
        />

        Imagen

        <button type="submit">Register</button>

        <div className="auth-switch">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </div>
      </form>
    </div>
  );
}