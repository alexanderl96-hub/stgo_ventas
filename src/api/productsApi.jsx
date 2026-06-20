import API_URL from "./api_images";


export const updateWishlist = async (
  productId,
  customerId = null
) => {

  try {

    const response =
      await fetch(
        `${API_URL}/api/products/${productId}/wishlist`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            customer_id:
              customerId
          })
        }
      );

    return await response.json();

  } catch (error) {

    console.log(error);

    throw error;
  }
};