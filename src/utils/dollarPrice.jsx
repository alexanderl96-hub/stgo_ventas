export const getDollarPrice =
  async () => {

    try {

      const response =
        await fetch(
          "https://tasas.eltoque.com/v1/trmi"
        );

      const data =
        await response.json();

      return data.usd.value;

    } catch (error) {

      console.log(error);

      return 0;
    }
  };