import { useState, useEffect } from "react";

import API_URL from "../api/api_images";
// import { getDollarPrice } from "../../utils/dollarPrice";

import "./newProduct.css";


export default function NewProduct() {

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [images, setImages] = useState([]);

//   const [formData, setFormData] = useState({
//   name: "",
//   description: "",

//   price: 0,
//   dollar_price: 0,
//   current_dollar_price: 0,
//   original_price: 0,

//   discount: 0,
//   stock: 0,
//   rating: 0,
//   reviews: 0,

//   category: "",
//   sub_category: "",
//   brand: "",

//   gender: "",
//   age_group: "",

//   colors: "",
//   sizes: "",

//   material: "",

//   total_items: 0,
//   sold: 0,

//   featured: false,

//   store: "",

//   likes: 0,

//   qrcode: "",

//   caracteristics: [],
//   recommended: [],
//   battery_details: {
//   battery_type: "",
//   capacity: "",
//   ac_output: "",
//   fast_charge: "",
//   solar_compatible: false,
//   recommended_devices: []
// }
// });

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
  }
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
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     setLoading(true);

  //     setMessage("");

  //     // VALIDATE IMAGES
  //     if (images.length === 0) {
  //       setMessage("Please select at least one image");

  //       setLoading(false);

  //       return;
  //     }

  //     const form = new FormData();

  //     // NORMAL FIELDS
  //     Object.entries(formData).forEach(([key, value]) => {
  //       if (key !== "colors" && key !== "sizes") {
  //         form.append(key, value);
  //       }
  //     });

  //     // COLORS
  //     form.append(
  //       "colors",

  //       JSON.stringify(formData.colors.split(",").map((c) => c.trim())),
  //     );

  //     // SIZES
  //     form.append(
  //       "sizes",

  //       JSON.stringify(formData.sizes.split(",").map((s) => s.trim())),
  //     );
  //     form.append(
  //      "caracteristics",
  //       JSON.stringify(formData.caracteristics)
  //     );

  //     form.append(
  //       "recommended",
  //       JSON.stringify(formData.recommended)
  //     );

  //     form.append(
  //       "battery_details",
  //       JSON.stringify(formData.battery_details)
  //     );

  //     // IMAGES
  //     images.forEach((image) => {
  //       form.append("images", image);
  //     });

  //     // DEBUG
  //     for (let pair of form.entries()) {
  //     }

  //     const response = await fetch(
  //       `${API_URL}/api/products/create`,
  //       //  `http://localhost:5001/api/products/create`
  //       {
  //         method: "POST",

  //         body: form,
  //       },
  //     );

  //     const data = await response.json();

  //     if (data.success) {
  //       setMessage("Product created successfully");

  //       // RESET FORM
  //       setFormData({
  //         name: "",

  //         description: "",

  //         price: 0,

  //         dollar_price: 0,

  //         current_dollar_price: 0,

  //         original_price: 0,

  //         discount: 0,

  //         stock: 0,

  //         rating: 0,

  //         reviews: 0,

  //         category: "",

  //         sub_category: "",

  //         brand: "",

  //         gender: "",

  //         age_group: "",

  //         colors: "",

  //         sizes: "",

  //         material: "",

  //         total_items: 0,

  //         sold: 0,

  //         featured: false,

  //         store: "",

  //         likes: 0,

  //         qrcode: "",

  //         caracteristics: "",

  //         recommended: "",

  //         battery_details: ""

  //       });

  //       setImages([]);
  //     } else {
  //       setMessage(data.message || data.error);
  //     }
  //   } catch (error) {

  //     setMessage("Error creating product");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
    // form.append(
    //   "battery_details",
    //   JSON.stringify(
    //     formData.battery_details
    //       ? JSON.parse(formData.battery_details)
    //       : {}
    //   )
    // );
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
          }
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


  const calculateSalePrice = (dollar_price, current_dollar_price) => {
    const feeTotal = 0.55;

    const totalVenta = dollar_price * current_dollar_price * (1 + feeTotal);

    return Math.round(totalVenta / 500) * 500;
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

  return (
    <div className="create-product-page">
      <h1>Create Product</h1>

      <form className="create-product-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
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
          name="dollar_price"
          placeholder="Dollar Price"
          value={
            formData.dollar_price > 0 ? formData.dollar_price : "Dollar Price"
          }
          onChange={handleChange}
        />

        <input
          type="number"
          name="current_dollar_price"
          placeholder="Current Dollar Price"
          value={
            formData.current_dollar_price > 0
              ? formData.current_dollar_price
              : "Current Dollar Price"
          }
          onChange={handleChange}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price > 0 ? formData.price : "Price"}
          onChange={handleChange}
        />

        <input
          type="number"
          name="original_price"
          placeholder="Original Price"
          value={
            formData.original_price > 0
              ? formData.original_price
              : "Original Price"
          }
          onChange={handleChange}
        />

        <input
          type="number"
          name="discount"
          placeholder="Discount"
          value={formData.discount > 0 ? formData.discount : "Discount"}
          onChange={handleChange}
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock > 0 ? formData.stock : "Stock"}
          onChange={handleChange}
        />

        <input
          type="number"
          step="0.1"
          name="rating"
          placeholder="Rating"
          value={formData.rating > 0 ? formData.rating : "Rating"}
          onChange={handleChange}
        />

        <input
          type="number"
          name="reviews"
          placeholder="Reviews"
          value={formData.reviews > 0 ? formData.reviews : "Reviews"}
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
          name="colors"
          placeholder="Colors (comma separated)"
          value={formData.colors}
          onChange={handleChange}
        />

        <input
          type="text"
          name="sizes"
          placeholder="Sizes (comma separated)"
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
          name="total_items"
          placeholder="Total Items"
          value={
            formData.total_items > 0 ? formData.total_items : "Total Items"
          }
          onChange={handleChange}
        />

        <input
          type="number"
          name="sold"
          placeholder="Sold"
          value={formData.sold > 0 ? formData.sold : "Sold"}
          onChange={handleChange}
        />

        <input
          type="text"
          name="store"
          placeholder="Store"
          value={formData.store}
          onChange={handleChange}
        />

        <textarea
          name="caracteristics"
          placeholder="Caracteristicas (comma separated)"
          value={formData.caracteristics}
          onChange={handleChange}
        />

        <textarea
          name="recommended"
          placeholder="Recommended Uses (comma separated)"
          value={formData.recommended}
          onChange={handleChange}
        />

        <textarea
          name="battery_details"
          placeholder='{"battery_type":"Lithium","capacity":"266Wh","ac_output":"300W","fast_charge":"1 Hour","solar_compatible":true,"recommended_devices":["Phone","Laptop"]}'
          value={formData.battery_details}
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="Battery Type"
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
  placeholder="Capacity"
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
  placeholder="Fast Charge"
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
  Solar Compatible

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
  placeholder="Recommended Devices (comma separated)"
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
