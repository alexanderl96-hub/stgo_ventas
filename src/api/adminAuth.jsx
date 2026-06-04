import API_URL from "./api_images";

export const adminLogin = async (data) => {
  const res = await fetch(`${API_URL}/api/admin-auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
};