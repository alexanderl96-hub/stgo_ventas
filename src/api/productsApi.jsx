const API_URL =
  "https://stgo-express-backend.onrender.com";


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

    console.log(
      "update data",
      data
    );



    return data;

  } catch (error) {

    console.log(error);

    throw error;
  }
};