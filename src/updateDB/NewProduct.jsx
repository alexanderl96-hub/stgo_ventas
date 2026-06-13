import { useState, useEffect } from "react";

import API_URL from "../api/api_images";

import "./newProduct.css";


export default function NewProduct({categoryDB}) {
  
  const [categorias, setCategorias] = useState([])

  const [sub_categorias, setSub_Categorias] = useState([])

  const [showCategories, setShowCategories] = useState(false);

  const [showSubCategories, setShowSubCategories] = useState(false);

  const [generos, setGeneros] = useState(["Unixes", "Mujer", "Hombre"])

  const [showGeneros, setShowGeneros] = useState(false)

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [images, setImages] = useState([]);

  const [storeName, setStoresName] = useState(["Temu", "Alibaba", "Zhein", "Amazon", "Walmart", "Google", "Harusaki"])
  const [showStore, setShowStore] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",

    price: 0,
    dollar_price: 0,
    current_dollar_price: 0,
    original_price: 0,

    discount: 0,
    stock: 0,
    rating: 0,
    reviews: 0,

    category: "",
    sub_category: "",
    brand: "",

    gender: "",
    age_group: "",

    colors: "",
    colors_match: {},
    sizes: "",

    material: "",

    total_items: 0,
    sold: 0,

    featured: false,

    store: "",

    likes: 0,

    qrcode: "",

    caracteristics: "",
    recommended: "",

    battery_details: {
      battery_type: "",
      capacity: "",
      ac_output: "",
      fast_charge: "",
      solar_compatible: false,
      recommended_devices: []
    },

    modelo: "",
    original_store_price: 0

  });

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // HANDLE IMAGES
  const handleImages = (e) => {
    setImages(Array.from(e.target.files));
  };

  // CREATE PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      if (images.length === 0) {
        setMessage("Please select at least one image");
        setLoading(false);
        return;
      }

      const form = new FormData();

      // NORMAL FIELDS
      Object.entries(formData).forEach(([key, value]) => {
        if (
          key !== "colors" &&
          key !== "colors_match" &&
          key !== "sizes" &&
          key !== "caracteristics" &&
          key !== "recommended" &&
          key !== "battery_details"
        ) {
          form.append(key, value);
        }
      });

      // COLORS
      form.append(
        "colors",
        JSON.stringify(
          formData.colors
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        )
      );

      // COLORS MATCH
      form.append(
        "colors_match",
         JSON.stringify(formData.colors_match)
      );

      // SIZES
      form.append(
        "sizes",
        JSON.stringify(
          formData.sizes
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        )
      );

      // CARACTERISTICS
      form.append(
        "caracteristics",
        JSON.stringify(
          formData.caracteristics
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        )
      );

      // RECOMMENDED
      form.append(
        "recommended",
        JSON.stringify(
          formData.recommended
            .split(",")
            .map((r) => r.trim())
            .filter(Boolean)
        )
      );


      // BATTERY DETAILS
      form.append(
        "battery_details",
        JSON.stringify(formData.battery_details)
      );

      // IMAGES
      images.forEach((image) => {
        form.append("images", image);
      });

      const response = await fetch(
        `${API_URL}/api/products/create`,
        {
          method: "POST",
          body: form,
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("Product created successfully");

        setFormData({
          name: "",
          description: "",
          price: 0,
          dollar_price: 0,
          current_dollar_price: 0,
          original_price: 0,
          discount: 0,
          stock: 0,
          rating: 0,
          reviews: 0,
          category: "",
          sub_category: "",
          brand: "",
          gender: "",
          age_group: "",
          colors: "",
          colors_match: {},
          sizes: "",
          material: "",
          total_items: 0,
          sold: 0,
          featured: false,
          store: "",
          likes: 0,
          qrcode: "",
          caracteristics: "",
          recommended: "",
            battery_details: {
              battery_type: "",
              capacity: "",
              ac_output: "",
              fast_charge: "",
              solar_compatible: false,
              recommended_devices: []
            },
              modelo: "",
              original_store_price: 0
        });

        setImages([]);
      } else {
        setMessage(data.message || data.error);
      }
    } catch (error) {
      console.error(error);
      setMessage("Error creating product");
    } finally {
      setLoading(false);
    }
  };

  // COLORS MATCH FUNCTION
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

  const calculateSalePrice = (dollar_price, current_dollar_price) => {
    const feeTotal = 0.55;

    const totalVenta = dollar_price * current_dollar_price * (1 + feeTotal);

    return dollar_price > 1 ? 
         Math.round(totalVenta / 500) * 500 : Math.round(totalVenta);
  };

  const arrayToString = (text) => {
  return text
    .split(",")
    .map(item =>
      item.replace(/"/g, "").trim()
    )
    .filter(Boolean)
    .join(", ");
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

  useEffect(() => {
    if (categoryDB?.length > 0) {
      setCategorias(categoryDB.map(a => a.name))
      
    }
  }, [categoryDB]);

  useEffect(() => {
    if (formData.category !== "") {
      setSub_Categorias(categoryDB.filter(a => a.name === formData.category)
                            .map(a => a.sub_category)[0])
    }
  }, [formData.category]);


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
    // console.log("categorias", categorias )
    // console.log("categoryDB", categoryDB )

    console.log("fomr", formData)

  return (
    <div className="create-product-page">
      <h1>Create Product</h1>

      <form className="create-product-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nombre del Producto"
          value={formData.name}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Descripcion del Producto"
          value={formData.description}
          onChange={handleChange}
        />

        <input
          type="number"
          name="dollar_price"
          min="0"
          step="0.1"
          placeholder="Price del Dollar"
          value={
            formData.dollar_price > 0 ? formData.dollar_price : "Precio del Dollar"
          }
          onChange={handleChange}
        />

        <input
          type="number"
          name="current_dollar_price"
          min="0"
          placeholder="Precio del Dollar en el Toque"
          value={
            formData.current_dollar_price > 0
              ? formData.current_dollar_price
              : "Precio del Dollar en el Toque"
          }
          onChange={handleChange}
        />

        <input
          type="number"
          name="price"
          min="0"
          placeholder="Precio"
          value={formData.price > 0 
            ? formData.price 
            : "Precio"}
          onChange={handleChange}
        />

        <input
          type="number"
           style={{ display: "none" }}
          name="original_price"
          placeholder="Precio Original"
          value={
            formData.original_price > 0
              ? formData.original_price
              : "Precio Original"
          }
          onChange={handleChange}
        />

         <input
          type="number"
          min="0"
          step="0.01"
          name="original_store_price"
          placeholder="Precio original de tienda"
          value={formData.original_store_price > 0 
            ? formData.original_store_price 
            : "Precio original de tienda"}
          onChange={handleChange}
        />

        <input
          type="number"
          style={{ display: "none" }}
          name="discount"
          placeholder="Descuento"
          value={formData.discount > 0 
            ? formData.discount 
            : "Descuento"}
          onChange={handleChange}
        />

        <input
          type="number"
           style={{ display: "none" }}
          name="stock"
          placeholder="Almacen"
          value={formData.stock > 0 
            ? formData.stock 
            : "Almacen"}
          onChange={handleChange}
        />

        <input
          type="number"
          style={{ display: "none" }}
          step="0.1"
          name="rating"
          placeholder="Rating"
          value={formData.rating > 0 
            ? formData.rating 
            : "Rating"}
          onChange={handleChange}
        />

        <input
          type="number"
          style={{ display: "none" }}
          name="reviews"
          placeholder="Reviews"
          value={formData.reviews > 0 
            ? formData.reviews 
            : "Reviews"}
          onChange={handleChange}
        />


        <div className="custom-dropdown">

            <div
              className="dropdown-selected"
              onClick={() => setShowCategories(!showCategories)}
            >
              {formData.category || "Seleccione una categoría"}

              <span className="dropdown-arrow">
                {showCategories ? "▲" : "▼"}
              </span>
            </div>

            {showCategories && (
              <div className="dropdown-options">

                {categorias.map((categoria, index) => (
                  <div
                    key={index}
                    className="dropdown-option"
                    onClick={() => {

                      setFormData(prev => ({
                        ...prev,
                        category: categoria
                      }));

                      setShowCategories(false);
                    }}
                  >
                    {categoria}
                  </div>
                ))}

              </div>
            )}

          </div>

        {formData.category !== "" && (

        <div className="custom-dropdown">

            <div
              className="dropdown-selected"
              onClick={() => setShowSubCategories(!showSubCategories)}
            >
              {formData.sub_category || "Seleccione una sub_categoría"}

              <span className="dropdown-arrow">
                {showSubCategories ? "▲" : "▼"}
              </span>
            </div>

            {showSubCategories && (
              <div className="dropdown-options">

                {sub_categorias.map((subcategoria, index) => (
                  <div
                    key={index}
                    className="dropdown-option"
                    onClick={() => {

                      setFormData(prev => ({
                        ...prev,
                        sub_category: subcategoria
                      }));

                      setShowSubCategories(false);
                    }}
                  >
                    {subcategoria}
                  </div>
                ))}

              </div>
            )}

          </div>

          )}

        <input
          type="text"
          name="brand"
          placeholder="Marca"
          value={formData.brand}
          onChange={handleChange}
        />

          <input
          type="text"
          name="modelo"
          placeholder="Modelo"
          value={formData.modelo}
          onChange={handleChange}
        />
       
        <div className="custom-dropdown">

            <div
              className="dropdown-selected"
              onClick={() => setShowGeneros(!showGeneros)}
            >
              {formData.gender || "Genero"}

              <span className="dropdown-arrow">
                {showGeneros ? "▲" : "▼"}
              </span>
            </div>

            {showGeneros && (
              <div className="dropdown-options">

                {generos.map((genero, index) => (
                  <div
                    key={index}
                    className="dropdown-option"
                    onClick={() => {

                      setFormData(prev => ({
                        ...prev,
                        gender: genero
                      }));

                      setShowGeneros(false);
                    }}
                  >
                    {genero}
                  </div>
                ))}

              </div>
            )}

          </div>

        <input
          type="text"
          name="age_group"
          placeholder="Edad de grupo"
          value={formData.age_group}
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

        <input
          type="text"
          name="material"
          placeholder="Material"
          value={formData.material}
          onChange={handleChange}
        />

        {/* IMAGE UPLOAD */}
        <input
          type="file"
          multiple
          accept="image/*"
          name="images"
          onChange={handleImages}
        />

        <div className="preview-images-create">
          {images.map((image, index) => (
            <img
              key={index}
              src={URL.createObjectURL(image)}
              alt="preview"
              width="100"
            />
          ))}
        </div>

        <input
          type="number"
           style={{ display: "none" }}
          name="total_items"
          placeholder="Cantida de productos"
          value={
            formData.total_items > 0 
            ? formData.total_items 
            : "Cantida de productos"
          }
          onChange={handleChange}
        />

        <input
          type="number"
          style={{ display: "none" }}
          name="sold"
          placeholder="Ventas"
          value={formData.sold > 0 
            ? formData.sold 
            : "Ventas"}
          onChange={handleChange}
        />

        {/* <input
          type="text"
          name="store"
          placeholder="Tienda"
          value={formData.store}
          onChange={handleChange}
        /> */}

        <div className="custom-dropdown">

            <div
              className="dropdown-selected"
              onClick={() => setShowStore(!showStore)}
            >
              {formData.store || "Tienda"}

              <span className="dropdown-arrow">
                {showStore ? "▲" : "▼"}
              </span>
            </div>

            {showStore && (
              <div className="dropdown-options">

                {storeName.map((storeN, index) => (
                  <div
                    key={index}
                    className="dropdown-option"
                    onClick={() => {

                      setFormData(prev => ({
                        ...prev,
                        store: storeN
                      }));

                      setShowStore(false);
                    }}
                  >
                    {storeN}
                  </div>
                ))}

              </div>
            )}

          </div>

        <textarea
          name="caracteristics"
          placeholder="Caracteristicas (separado por coma)"
          value={arrayToString(formData.caracteristics)}
          onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  caracteristics: e.target.value.replace(/"/g, "")
                }));
              }}
        />

        <textarea
          name="recommended"
          placeholder="Recomendaciones  de uso (separado por coma)"
          value={arrayToString(formData.recommended)}
          onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                recommended: e.target.value.replace(/"/g, "")
              }));
            }}
        />

        {(formData.category === "Equipos" || 
          formData.category === "Electrónicos"
        )
          // formData.sub_category === "EcoFlow"
           && (<>
            <textarea
              style={{ display: "none" }}
              name="battery_details"
              value={formData.battery_details}
              onChange={handleChange}
            />


        <input
          type="text"
          placeholder="Tipo de Bateria"
          value={formData.battery_details.battery_type}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              battery_details: {
                ...prev.battery_details,
                battery_type: e.target.value
              }
            }))
          }
        />

        <input
          type="text"
          placeholder="Capacidad"
          value={formData.battery_details.capacity}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              battery_details: {
                ...prev.battery_details,
                capacity: e.target.value
              }
            }))
          }
        />

        <input
          type="text"
          placeholder="AC Output"
          value={formData.battery_details.ac_output}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              battery_details: {
                ...prev.battery_details,
                ac_output: e.target.value
              }
            }))
          }
        />

        <input
          type="text"
          placeholder="Carga rapida"
          value={formData.battery_details.fast_charge}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              battery_details: {
                ...prev.battery_details,
                fast_charge: e.target.value
              }
            }))
          }
        />

        <label>
          Compatible con Paneles Solares

          <input
            type="checkbox"
            checked={formData.battery_details.solar_compatible}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                battery_details: {
                  ...prev.battery_details,
                  solar_compatible: e.target.checked
                }
              }))
            }
          />
        </label>

        <input
          type="text"

          placeholder="Recomendaciones del Equipo (separado por coma)"
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              battery_details: {
                ...prev.battery_details,
                recommended_devices: e.target.value
                  .split(",")
                  .map(v => v.trim())
                  .filter(Boolean)
              }
            }))
          }
        />

        <pre>
          {JSON.stringify(formData.battery_details, null, 2)}
        </pre>

          </>)}

        <label className="featured-check">
          Featured
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Product"}
        </button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}
