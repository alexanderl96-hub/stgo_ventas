import API_URL from "./api_images";

export const registerUser = async (data) => {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
};

export const getProfile = async (token) => {
  const res = await fetch(`${API_URL}api/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
};