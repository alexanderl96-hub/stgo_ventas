// src/pages/Admin/UpdateProduct.jsx

import { useEffect, useState } from "react";

import API_URL from "../../api/api_images";

import "./update_product.css";

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

      setProducts(data.products);
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
        `${API_URL}/api/products/${selectedProduct.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (data.success) {
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

  return (
    <div className="update-product-page">
      <h1>Update Products</h1>

      <div className="update-layout">
        {/* PRODUCTS */}
        <div className="product-list">
          {products.map((product) => (
            <div
              key={product.id}
              className={`product-card ${
                selectedProduct?.id === product.id ? "active" : ""
              }`}
              onClick={() => handleSelectProduct(product)}
            >
              <img src={`${API_URL}${product.img?.[0]}`} alt={product.name} />

              <div>
                <h3>{product.name}</h3>

                <p>${product.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FORM */}
        <div className="update-form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
          />

          <input
            type="number"
            name="original_price"
            placeholder="Original Price"
            value={formData.original_price}
            onChange={handleChange}
          />

          <input
            type="number"
            name="discount"
            placeholder="Discount"
            value={formData.discount}
            onChange={handleChange}
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
          />

          <input
            type="text"
            name="sub_category"
            placeholder="Sub Category"
            value={formData.sub_category}
            onChange={handleChange}
          />

          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={formData.brand}
            onChange={handleChange}
          />

          <input
            type="text"
            name="gender"
            placeholder="Gender"
            value={formData.gender}
            onChange={handleChange}
          />

          <input
            type="text"
            name="age_group"
            placeholder="Age Group"
            value={formData.age_group}
            onChange={handleChange}
          />

          <input
            type="text"
            name="material"
            placeholder="Material"
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
    </div>
  );
}
