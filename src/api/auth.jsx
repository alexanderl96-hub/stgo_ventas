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


export const updateProduct = async (
  id,
  productData
) => {

  const payload = {
    ...productData,

    colors_match:
      productData.colors_match
        ? JSON.stringify(
            productData.colors_match
          )
        : null
  };

  const response = await fetch(
    `${API_URL}/api/products/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.log(data);
    throw new Error(
      data.error || "Failed to update product"
    );
  }

  return data;
};

export const updateOrder = async (
  orderId,
  orderData
) => {

  const response = await fetch(
    `${API_URL}/api/orders/${orderId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update order"
    );
  }

  return data;
};


export const createGuestCustomer = async (
  guestData
) => {

  const response = await fetch(
    `${API_URL}/api/customers/create-guest`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(guestData)
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to create guest"
    );
  }

  return data;
};


export const updateOrderStatus = async (
  customerId,
  orderId,
  status_sell
) => {
  const response = await fetch(
    `${API_URL}/api/customers/${customerId}/orders/${orderId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status_sell
      })
    }
  );

  return response.json();
};

export const deleteOrderAndUpdateUser = async (
  customerId,
  orderId
) => {

  const response = await fetch(
    `${API_URL}/api/orders/${customerId}/orders/${orderId}`,
    {
      method: "DELETE"
    }
  );

  return response.json();
};

export const restoreProductsInventory =
  async (data) => {

    const response =
      await fetch(
        `${API_URL}/api/products/restore-inventory`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify(data)
        }
      );

    return response.json();
  };

export const submitReview = async (
  productId,
  review
) => {

  const response =
    await fetch(
      `${API_URL}/api/products/${productId}/review`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify(review)
      }
    );

  return response.json();
};