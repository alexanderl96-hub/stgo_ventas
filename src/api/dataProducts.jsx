import { useEffect, useState } from "react";
import API_URL from "./api_images";

export default function useDataProducts() {
  const [productsDB, setProductsDB] = useState([]);
  const [filteredDB, setFilteredDB] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryDB, setCategoryDB] = useState();
  const [administratorDB , setAdministratorDB] = useState([])
  const [dataColorsDB, setDataColorsDB] = useState([])
  const [refreshProducts, setRefreshProducts] = useState(false);

  const triggerProductsRefresh = () => {
    setRefreshProducts(prev => !prev);
  };

  // console.log("search", search)
  // console.log("path to back end", API_URL)

  // 🔥 FETCH FROM BACKEND PRODUCTS
useEffect(() => {

  fetch(`${API_URL}/api/products`)
    .then(res => res.json())
    .then(data => {
      setProductsDB(data);
      setFilteredDB(data);
    })
    .catch(console.error);

}, [refreshProducts]);

  useEffect(() => {

    const fetchProducts = () => {
      fetch(`${API_URL}/api/products`)
        .then(res => res.json())
        .then(data => {
          setProductsDB(data);
          setFilteredDB(data);
        })
        .catch(err =>
          console.error(err)
        );
    };

    // Initial load
    fetchProducts();

    // Refresh every 30 seconds
    const interval = setInterval(
      fetchProducts,
      5000
    );

    return () => clearInterval(interval);

  }, []);

    // 🔥 FETCH FROM BACKEND CATEGORY
  useEffect(() => {
    fetch(`${API_URL}/api/categories`)
      .then(res => res.json())
      .then(data => {
        setCategoryDB(data.categories)
      });
  }, []);

  //  useEffect(() => {

  //   const fetchProducts = () => {
  //     fetch(`${API_URL}/api/categories`)
  //       .then(res => res.json())
  //       .then(data => {
  //            setCategoryDB(data.categories)
  //       })
  //       .catch(err =>
  //         console.error(err)
  //       );
  //   };

  //   // Initial load
  //   fetchProducts();

  //   // Refresh every 30 seconds
  //   const interval = setInterval(
  //     fetchProducts,
  //     30000
  //   );

  //   return () => clearInterval(interval);

  // }, []);

      // 🔥 FETCH FROM BACKEND ADMIN
  useEffect(() => {
    fetch(`${API_URL}/api/admin`)
      .then(res => res.json())
      .then(data => {
           setAdministratorDB(data)
      });
  }, []);

  // useEffect(() => {

  //   const fetchProducts = () => {
  //     fetch(`${API_URL}/api/admin`)
  //       .then(res => res.json())
  //       .then(data => {
  //            setAdministratorDB(data)
  //       })
  //       .catch(err =>
  //         console.error(err)
  //       );
  //   };

  //   // Initial load
  //   fetchProducts();

  //   // Refresh every 30 seconds
  //   const interval = setInterval(
  //     fetchProducts,
  //     30000
  //   );

  //   return () => clearInterval(interval);

  // }, []);

  // 🔍 SEARCH + CATEGORY FILTER
  useEffect(() => {
    // let result = [...products];
    let result = [];

    if (search) {
      result = result?.filter(p =>
        ["name", "category_key", "category", "sub_category"].some(field =>
          p[field]?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }


    // if (category !== "all") {
    //   result = result.filter(p => p.type === category);
    // }

    setFilteredDB(result);
  }, [search, categoryDB, productsDB, administratorDB ]);

      // 🔥 FETCH FROM BACKEND PRODUCTS
  useEffect(() => {
    fetch(`${API_URL}/api/colors`)
      .then(res => res.json())
      .then(data => {
          setDataColorsDB(data)

      });
  }, []);

  //  useEffect(() => {

  //   const fetchProducts = () => {
  //     fetch(`${API_URL}/api/colors`)
  //       .then(res => res.json())
  //       .then(data => {
  //            setDataColorsDB(data)
  //       })
  //       .catch(err =>
  //         console.error(err)
  //       );
  //   };

  //   // Initial load
  //   fetchProducts();

  //   // Refresh every 30 seconds
  //   const interval = setInterval(
  //     fetchProducts,
  //     30000
  //   );

  //   return () => clearInterval(interval);

  // }, []);

  return {
    productsDB,
    administratorDB,
    filteredDB,
    search,
    setSearch,
    categoryDB,
    dataColorsDB,
    triggerProductsRefresh
    // setCategoryDB
  };
}
