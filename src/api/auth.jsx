import API_URL from "./api_images";

export const registerUser = async (data) => {
  const res = await fetch(`${API_URL}/api/customers/register`, {
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

export const createNewOrderUser = async (data) => {
  const res = await fetch(`${API_URL}/api/orders/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  return result;
};

export const createNewOrderGuest = async (data) => {
  const res = await fetch(`${API_URL}/api/guest-orders/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  return result;
};


export const updateCustomerOrder = async (customerId, newOrders) => {

  const res = await fetch(
    `${API_URL}/api/customers/${customerId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        order: newOrders
      })
    }
  );

  const result = await res.json();

  return result;
};

export const addCustomerOrder = async (customerId, newOrder) => {

  const res = await fetch(
    `${API_URL}/api/customers/${customerId}/orders`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        order: newOrder
      })
    }
  );

  return await res.json();
};


export const getCustomer = async (id) => {
  const res = await fetch(
    `${API_URL}/api/customers/${id}`
  );

  return await res.json();
};
