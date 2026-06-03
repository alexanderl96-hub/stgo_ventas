import { useEffect, useState } from "react";

export default function useDataProducts() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState([]);
  const [admin , setAdmin] = useState([])

  console.log("search", search)

  // 🔥 FETCH FROM BACKEND PRODUCTS
  useEffect(() => {
    fetch("https://stgo-express-backend.onrender.com/api/products")
      .then(res => res.json())
      .then(data => {

        console.log("filtered is false", data.filter( a => a.featured === true))
        setProducts(data);
        setFiltered(data);

      });
  }, []);

    // 🔥 FETCH FROM BACKEND CATEGORY
  useEffect(() => {
    fetch("https://stgo-express-backend.onrender.com/api/categories")
      .then(res => res.json())
      .then(data => {

        // console.log(data)
        setCategory(data.categories)
      });
  }, []);

      // 🔥 FETCH FROM BACKEND ADMIN
  useEffect(() => {
    fetch("https://stgo-express-backend.onrender.com/api/admin")
      .then(res => res.json())
      .then(data => {
           console.log("data", data)
           setAdmin(data)
      });
  }, []);

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

    console.log("serach", result)

    setFiltered(result);
  }, [search, category, products, admin]);

  return {
    products,
    admin,
    filtered,
    search,
    setSearch,
    category
    // setCategory
  };
}