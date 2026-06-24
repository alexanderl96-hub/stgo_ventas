// src/pages/Admin/UpdateProduct.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api/api_images";
import { ArrowLeft } from "lucide-react";

import "./updateProduct.css";

export default function UpdateProduct({productsDB, dataUpdateDB}) {
  const navigate = useNavigate();

  const [productID, setProductID] = useState(null);

  const [products, setProducts] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  // FORM STATE
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    dollar_price: 0,
    current_dollar_price: 0,
    original_price: 0,
    discount: 0,
    stock: 0,
    featured: false,

    colors: "",
    colors_match: {},
    sizes: "",
  });


  const getProducts = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/products/${productID}`
        );

        const data = await response.json();

        setProducts([data]);

        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price || 0,
          dollar_price: data.dollar_price || 0,
          current_dollar_price: data.current_dollar_price || 0,
          original_price: data.original_price || 0,
          discount: data.discount || 0,
          stock: data.stock || 0,
          featured: data.featured || false,
          colors: data.colors || "",
          colors_match: data.colors_match || {},
          sizes: data.sizes || "",
        });

      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {

    if (!productID) return;

    getProducts();

  }, [productID]);

  // SELECT PRODUCT
  const handleSelectProduct = (product) => {

    setSelectedProduct(product);
    setProductID(product.id);

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || 0,
      dollar_price: product.dollar_price || 0,
      current_dollar_price: product.current_dollar_price || 0,
      original_price: product.original_price || 0,
      discount: product.discount || 0,
      stock: product.stock || 0,
      featured: product.featured || false,
      // colors: product.colors || "",
      // colors_match: product.colors_match || {},
      // sizes: product.sizes || "",
      colors: Array.isArray(product.colors)
        ? product.colors.join(", ")
        : "",

      colors_match: product.colors_match || {},

      sizes: Array.isArray(product.sizes)
        ? product.sizes.join(", ")
        : ""
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
        `${API_URL}/api/products/${productID}`,
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
        setMessage("Producto actualizado con éxito");

        getProducts();
      } else {
        setMessage(data.message);
      }

        setProducts([])
        setProductID(null)
        setSelectedProduct(null);
        
    } catch (error) {
      console.log(error);

      setMessage("Error updating product");
    } finally {
      setLoading(false);
    }
  };

    const calculateSalePrice = (dollar_price, current_dollar_price) => {
    const feeTotal = 0.55;

    const totalVenta = dollar_price * current_dollar_price * (1 + feeTotal);

    return dollar_price > 1 ? 
         Math.round(totalVenta / 500) * 500 : totalVenta.toFixed(2);
    // return dollar_price > 1 ? 
    //      Math.round(totalVenta / 500) * 500 : Math.round(totalVenta);
  };

   useEffect(() => {
    if (formData.dollar_price && formData.current_dollar_price) {
      setFormData((prev) => ({
        ...prev,

        price: calculateSalePrice(
          Number(prev.dollar_price),

          Number(prev.current_dollar_price),
        ),
        original_price: calculateSalePrice(
          Number(prev.dollar_price),

          Number(prev.current_dollar_price),
        ),
      }));
    }
  }, [formData.dollar_price, formData.current_dollar_price]);


    const addSize = (color) => {

      setFormData(prev => ({

        ...prev,

        colors_match: {

          ...prev.colors_match,

          [color]: {

            ...prev.colors_match[color],

            matching_sizes: [

              ...(prev.colors_match[color]
                ?.matching_sizes || []),

              ["", 0]
            ]
          }
        }
      }));
    };

  const updateSizeRow = (
    color,
    index,
    position,
    value
  ) => {

    setFormData(prev => {

      const rows = [
        ...(prev.colors_match[color]
          ?.matching_sizes || [])
      ];

      // position 0 = size
      // position 1 = qty

      rows[index][position] =
        position === 0
          ? value
          : Number(value);

      const totalQty =
        rows.reduce(
          (sum, [_, qty]) =>
            sum + Number(qty || 0),
          0
        );

      return {

        ...prev,

        colors_match: {

          ...prev.colors_match,

          [color]: {

            qty: totalQty,

            matching_sizes: rows
          }
        }
      };

    });

  };

  const removeSize = (
      color,
      index
    ) => {

      setFormData(prev => {

        const rows =
          prev.colors_match[color]
            .matching_sizes.filter(
              (_, i) => i !== index
            );

        const totalQty =
          rows.reduce(
            (sum, [_, qty]) =>
              sum + Number(qty || 0),
            0
          );

        return {

          ...prev,

          colors_match: {

            ...prev.colors_match,

            [color]: {

              qty: totalQty,

              matching_sizes: rows
            }
          }
        };

      });

    };

    useEffect(() => {

    const totalStock =
      Object.values(formData.colors_match || {})
        .reduce(
          (sum, color) =>
            sum + (color.qty || 0),
          0
        );
      const allSizes = [
        ...new Set(
          Object.values(formData.colors_match || {})
            .flatMap(color =>
              (color.matching_sizes || [])
                .map(([size]) => size)
            )
        )
      ].sort((a, b) => a - b).join(", ");

    setFormData(prev => ({
      ...prev,
      stock: totalStock,
      total_items: totalStock,
      sizes: allSizes
    }));

  }, [formData.colors_match]);

    useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [])


  console.log("products", products)
    console.log("products form", formData)

  return (
    <div className="update-product-page">
       <button
            className="back-btn-icon"
            onClick={() => {
              navigate("/Admin");
              setProducts([])
            }}
        >
            <ArrowLeft size={20} />
            <span>Volver al Panel</span>
        </button>
      

      <h2>Actualizar producto</h2>
         {productID === null && ( <>
          <h3>Selecciona el producto</h3>
          <div className="up-products-grid">

              {dataUpdateDB.map((prod) => (

                <div
                  key={prod.id}
                  className="up-product-card-admin"
                >

                  <img
                    src={
                      prod.img?.[0]?.image_path ||
                      prod.img?.[0] ||
                      ""
                    }
                    alt={prod.name}
                    className="up-product-admin-img"
                  />

                  <div className="up-product-info">

                  <h4>{prod.name}</h4>

                  <p>
                    <strong>Precio:</strong> $
                    {prod.price}
                  </p>

                  <p>
                    <strong>Stock:</strong> {
                      prod.stock
                    }
                  </p>

                  </div>

                  <button
                    className="up-edit-product-btn"
                    onClick={() => {
                      setProductID(prod.id);
                      handleSelectProduct(prod)

                    }}
                  >
                    Editar
                  </button>

                </div>

              ))}

            </div>
         </>)}


        {productID !== null && ( <>
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
              name="dollar_price"
              min="0"
              step="0.1"
              placeholder={`Pricio del Dollar: ${products.map(a => a.dollar_price)}`}
              value={formData.dollar_price}
              onChange={handleChange}
            />

            <input
              type="number"
              name="current_dollar_price"
              min="0"
              placeholder={`Precio del Dollar en el Toque: ${products.map(a => a.current_dollar_price)}`}
              value={formData.current_dollar_price}
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
              name="colors"
              placeholder="Colores (separado por coma)"
              value={formData.colors}
              onChange={(e) => {

                const value = e.target.value;

                const colors = value
                  .split(",")
                  .map(c => c.trim())
                  .filter(Boolean);

                const colorsMatch = {};

                colors.forEach(color => {

                  colorsMatch[color] =
                    formData.colors_match?.[color] || {
                      qty: 0,
                      matching_sizes: []
                    };

                });

                setFormData(prev => ({
                  ...prev,
                  colors: value,
                  colors_match: colorsMatch
                }));
              }}
            />


            {Object.entries(formData.colors_match || {}).map(([color, data]) => (

              <div
                key={color}
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  marginBottom: "10px"
                }}
              >

                <h4>{color}</h4>

                {(data.matching_sizes || []).map(([size, qty], index) => (

                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "5px"
                    }}
                  >

                    <input
                      type="text"
                      placeholder="Talla / Medida"
                      value={size}
                      onChange={(e) =>
                        updateSizeRow(
                          color,
                          index,
                          0,
                          e.target.value
                        )
                      }
                    />

                    <input
                      type="number"
                      placeholder="Cantidad"
                      value={qty}
                      onChange={(e) =>
                        updateSizeRow(
                          color,
                          index,
                          1,
                          e.target.value
                        )
                      }
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeSize(color, index)
                      }
                    >
                      X
                    </button>

                  </div>

                ))}

                <button
                  type="button"
                  onClick={() => addSize(color)}
                >
                  + Añadir talla
                </button>

                <p>
                  Total: {data.qty || 0}
                </p>

              </div>

            ))}

            <input
              type="text"
              style={{ display: "none" }}
              name="sizes"
              placeholder="Dimensiones (separado por coma)"
              value={formData.sizes}
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
            {loading ? "Actualizando..." : "Actualizar Producto"}
          </button>

          {message && <p className="message">{message}</p>}
        </div>
        </>
        )}
    </div>
  );
}
