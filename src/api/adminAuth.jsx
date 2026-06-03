// import API_URL from "../api/api_images";
const API = "http://localhost:5001/api/admin-auth";

export const adminLogin = async (data) => {
  const res = await fetch(`${API}/api/admin-auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
};