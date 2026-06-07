// src/pages/Admin/UpdateProduct.jsx

import { useEffect, useState } from "react";

import API_URL from "../api/api_images";

import "./updateProduct.css";

export default function UpdateProduct() {
  const [products, setProducts] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  // FORM STATE
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    original_price: "",
    discount: "",
    stock: "",
    category: "",
    sub_category: "",
    brand: "",
    gender: "",
    age_group: "",
    material: "",
    featured: false,
  });

  // GET PRODUCTS
  const getProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);

      const data = await response.json();

      console.log(data[0])
      // setProducts(data?.products);
       setProducts([data[0]]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // SELECT PRODUCT
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      original_price: product.original_price || "",
      discount: product.discount || "",
      stock: product.stock || "",
      category: product.category || "",
      sub_category: product.sub_category || "",
      brand: product.brand || "",
      gender: product.gender || "",
      age_group: product.age_group || "",
      material: product.material || "",
      featured: product.featured || false,
    });
  };

  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // UPDATE PRODUCT
  const handleUpdate = async () => {
    if (!selectedProduct) return;

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/products/${selectedProduct?.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (data?.success) {
        setMessage("Product updated successfully");

        getProducts();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.log(error);

      setMessage("Error updating product");
    } finally {
      setLoading(false);
    }
  };

  console.log(products)

  return (
    <div className="update-product-page">
      <h1>Update Products</h1>

        {/* FORM Update*/}
        <div className="update-form">
          <input
            type="text"
            name="name"
            placeholder={`Nombre: ${products.map(a => a.name)}`}
            value={formData.name}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder={`Description: ${products.map(a => a.description)}`}
            value={formData.description}
            onChange={handleChange}
          />

          <input
            type="number"
            name="price"
            placeholder={`Precio: ${products.map(a => a.price)}`}
            value={formData.price}
            onChange={handleChange}
          />

          <input
            type="number"
            name="original_price"
            placeholder={`Precio Original: ${products.map(a => a.original_price)}`}
            value={formData.original_price}
            onChange={handleChange}
          />

          <input
            type="number"
            name="discount"
            placeholder={`Descuento: ${products.map(a => a.discount)}`}
            value={formData.discount}
            onChange={handleChange}
          />

          <input
            type="number"
            name="stock"
            placeholder={`Almacen: ${products.map(a => a.stock)}`}
            value={formData.stock}
            onChange={handleChange}
          />

          <input
            type="text"
            name="category"
            placeholder={`Categoria: ${products.map(a => a.category)}`}
            value={formData.category}
            onChange={handleChange}
          />

          <input
            type="text"
            name="sub_category"
            placeholder={`Sub Categoria: ${products.map(a => a.sub_category)}`}
            value={formData.sub_category}
            onChange={handleChange}
          />

          <input
            type="text"
            name="brand"
            placeholder={`Marca: ${products.map(a => a.brand)}`}
            value={formData.brand}
            onChange={handleChange}
          />

          <input
            type="text"
            name="gender"
            placeholder={`Genero: ${products.map(a => a.gender)}`}
            value={formData.gender}
            onChange={handleChange}
          />

          <input
            type="text"
            name="age_group"
            placeholder={`Edad de grupo: ${products.map(a => a.age_group)}`}
            value={formData.age_group}
            onChange={handleChange}
          />

          <input
            type="text"
            name="material"
            placeholder={`Materiales: ${products.map(a => a.material)}`}
            value={formData.material}
            onChange={handleChange}
          />

          <label className="featured-check">
            Featured
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
            />
          </label>

          <button onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update Product"}
          </button>

          {message && <p className="message">{message}</p>}
        </div>
    </div>
  );
}
