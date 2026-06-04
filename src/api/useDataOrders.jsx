import { useEffect, useState } from "react";
import API_URL from "./api_images";

export default function useDataOrders() {
  const [ordersQR, setOrdersQR] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState([]);
//   const [admin , setAdmin] = useState([])

  // 🔥 FETCH FROM BACKEND
  // useEffect(() => {
  //   fetch(`${API_URL}/api/orders/ordersQR`)
  //     .then(res => res.json())
  //     .then(data => {
  //       // setProducts(data.products);
  //       // setCategory(data.categoryData)
  //       // setAdmin(data.administrador)
  //       // setFiltered(data.products);

  //       setOrdersQR(data || [])

  //     });
  // }, []);

  // 🔍 SEARCH + CATEGORY FILTER
//   useEffect(() => {
//     let result = [...products];

//     if (search) {
//       result = result.filter(p =>
//         ["name", "type", "category", "subCategory"].some(field =>
//           p[field]?.toLowerCase().includes(search.toLowerCase())
//         )
//       );
//     }

//     // if (category !== "all") {
//     //   result = result.filter(p => p.type === category);
//     // }

//     setFiltered(result);
//   }, [search, category, products, admin]);

  return {
    // ordersQR
  };
}