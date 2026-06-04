import API_URL from "./api_images";

export const updateWishlist =
async (id, likes) => {

  try {

    const response =
      await fetch(

        `${API_URL}/api/products/${id}`,

        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            likes
          })
        }
      );



    const data =
      await response.json();



    return data;

  } catch (error) {

    console.log(error);

    throw error;
  }
};