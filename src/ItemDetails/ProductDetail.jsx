import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./productDetails.css"
import { filteringImgColor } from "../utils/filteringImgColor.jsx"
import { ShoppingCart, Menu, X, Search, QrCode,
   XCircle, ArrowLeft } from "lucide-react";

import useDataProducts from "../api/dataProducts";
import API_URL from "../api/api_images";

export default function ProductDetail({
    productsDB, categoryDB, 
    searchTerm, setSearchTerm,
    // openCategory,
     setOpenCategory,
    
    activeProduct, setActiveProduct, 
    orderConfig, setOrderConfig, cart, setCart, activeTab, setActiveTab, 
    activeCategory, setActiveCategory, orderSuccess, setOrderSuccess}) {

    const navigate = useNavigate();
    const [showTabs, setShowTabs] = useState(false);
    const [activeSection, setActiveSection] = useState("generales");

    const overviewRef = useRef(null);
    const featuresRef = useRef(null);
    


  const [currentImg, setCurrentImg] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImgIndex, setModalImgIndex] = useState(0);
  const { id } = useParams();

  const nextModalImage = () => {

    setModalImgIndex(prev =>

            prev ===
            product.img.length - 1

            ? 0

            : prev + 1
        );
    };

    const prevModalImage = () => {

    setModalImgIndex(prev =>

        prev === 0

        ? product.img.length - 1

        : prev - 1
    );
    };

    useEffect(() => {
  const handleScroll = () => {

    // show tabs after 10px scroll
    setShowTabs(window.scrollY > 10);

    const featuresTop =
      featuresRef.current?.getBoundingClientRect().top || 9999;

    if (featuresTop <= 120) {
      setActiveSection("features");
    } else {
      setActiveSection("generales");
    }
  };

  window.addEventListener("scroll", handleScroll);

  return () =>
    window.removeEventListener("scroll", handleScroll);
}, []);

 useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // 🔥 Replace with real data later
  const product = productsDB?.find(p => p.id === id);

  console.log("product", product)

  if (!product) return <div>Product not found</div>;
 
  return (
    <div className="detail-page">
        <header  className={`product-header ${
                showTabs ? "product-header-active" : ""
            }`}>

            <div className="header-top">
            <div onClick={() => navigate("/")} >
               <ArrowLeft
                    size={18}
                    className="back-arrow"
                />
            </div>


            <div className="main_inputContainer_PortalDetails">
                <Search size={14} />

                <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Busqueda..."
                />

                <QrCode size={14} />

                {searchTerm && (
                <XCircle
                    size={14}
                    onClick={() => {
                    setSearchTerm("");
                    setOpenCategory(null);
                    setActiveCategory(categoryDB);
                    }}
                />
                )}
            </div>

            </div>

            <div className={`header-tabs ${showTabs ? "visible" : ""}`}>

                <div
                className={
                    activeSection === "generales"
                    ? "tab active"
                    : "tab"
                }
                onClick={() =>
                    overviewRef.current?.scrollIntoView({
                    behavior: "smooth"
                    })
                }
                >
                Generales
                </div>

                <div
                className={
                    activeSection === "features"
                    ? "tab active"
                    : "tab"
                }
                onClick={() =>
                    featuresRef.current?.scrollIntoView({
                    behavior: "smooth"
                    })
                }
                >
                Características
                </div>

            </div>

            </header>

        <div className="image-slider">

        {/* ⬅️ LEFT ARROW */}
        {product.img.length > 1 &&
        <div
            className="arrow left"
            onClick={() =>
            setCurrentImg((prev) =>
                prev === 0 ? product.img.length - 1 : prev - 1
            )
            }
        >
            ‹
        </div>}

        {/* 📸 IMAGE */}
        <img
            src={product.img[currentImg].image_path}
            // src={`${API_URL}${product.img[currentImg]}`}
            className="detail-img"
            alt={product.name}

               onClick={() => {

                setModalImgIndex(currentImg);

                setShowImageModal(true);

            }}

        />

        {
            showImageModal && (

                <div
                className="image-modal-overlay"

                onClick={() =>
                    setShowImageModal(false)
                }
                >

                <div
                    className="image-modal-content"

                    onClick={(e) =>
                    e.stopPropagation()
                    }
                >

                    {/* CLOSE */}
                    <button
                    className="close-modal"

                    onClick={() =>
                        setShowImageModal(false)
                    }
                    >
                    ✕
                    </button>



                    {/* LEFT */}
                    {
                    product.img.length > 1 && (

                        <button
                        className="modal-arrow left"

                        onClick={prevModalImage}
                        >
                        ❮
                        </button>
                    )
                    }



                    {/* IMAGE */}
                    <img
                    src={
                        product.img[modalImgIndex]
                        .image_path
                    }

                    className="modal-image"

                    alt={product.name}
                    />



                    {/* RIGHT */}
                    {
                    product.img.length > 1 && (

                        <button
                        className="modal-arrow right"

                        onClick={nextModalImage}
                        >
                        ❯
                        </button>
                    )
                    }

                </div>

                </div>
            )
            }

        {/* ➡️ RIGHT ARROW */}
        {product.img.length > 1 &&
        <div
            className="arrow right"
            onClick={() =>
            setCurrentImg((prev) =>
                prev === product.img.length - 1 ? 0 : prev + 1
            )
            }
        >
            ›
        </div>}
        <div className="dots">
            {product.img.map((_, i) => (
                <span
                key={i}
                className={`dot ${i === currentImg ? "active" : ""}`}
                />
            ))}
            </div>

        </div>

         {activeProduct && (
            <div className="modal-overlay">

                <div className="modal-box">

                <h2>{activeProduct.name}</h2>

                {/* COLOR */}
                <div className="section">
                    <p>Color</p>
                    <div className="options">
                    {activeProduct.colors.map((c) => (
                        <button
                        key={c}
                        className={orderConfig.color === c.split("_")[0] ? "active" : ""}
                        onClick={() => {
                             const normalize = str =>
                              str
                                ?.normalize("NFD")
                                .replace(/[\u0300-\u036f]/g, "")
                                .trim()
                                .toLowerCase();
                            const categoryActi = categoryDB.find(
                              a => normalize(a.name) === normalize(product.category)
                            );
                            setOrderConfig((prev) => ({
                                ...prev,
                                color: c.split("_")[0],
                                person_in_charge: categoryActi?.person_in_charge || "",
                                img: filteringImgColor(activeProduct.img, c.split("_")[0]) || []
                            }));
                        }}
                        >
                        {c.split("_")[0]}
                        </button>
                    ))}
                    </div>
                </div>

                {/* SIZE */}
                {activeProduct.sizes.length > 0 &&
                <div className="section">
                    <p>Talla</p>
                    <div className="options">
                    {activeProduct.sizes.map((s) => (
                        <button
                        key={s}
                        className={orderConfig.size === s ? "active" : ""}
                        onClick={() =>
                            setOrderConfig((prev) => ({ ...prev, size: s }))
                        }
                        >
                        {s}
                        </button>
                    ))}
                    </div>
                </div>
                    }

                {/* GENERO */}
                <div className="section">
                    <p>Genero</p>
                    <div className="options">
                    {activeProduct.gender.split(" ").map((g) => (
                        <button
                        key={g}
                        className={orderConfig.gender === g ? "active" : ""}
                        onClick={() =>
                            setOrderConfig((prev) => ({ ...prev, gender: g }))
                        }
                        >
                        {g}
                        </button>
                    ))}
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="modal-actions">

                    <button
                    className="confirm"
                    disabled={
                        !orderConfig.color ||
                        !orderConfig.size ||
                        !orderConfig.gender ||
                        !orderConfig.img.length
                        // !orderConfig.personInCharge
                    }
                    onClick={() => {
                        const newOrder = {
                        id: Date.now(),
                        ...activeProduct,

                        colors: orderConfig.color,
                        sizes: orderConfig.size,
                        gender: orderConfig.gender,
                        person_in_charge: orderConfig.person_in_charge,
                        img: orderConfig.img,

                        status: "create",
                        date: new Date().toLocaleDateString()
                        };

                        setCart((prev) => [...prev, newOrder]);

                        setActiveProduct(null);
                        setOrderConfig({ color: "", size: "", genero: "", person_in_charge: "", img: [] });

                        // ✅ show success message
                        setOrderSuccess(true);

                        // auto hide after 3 seconds
                        setTimeout(() => setOrderSuccess(false), 3000);
                    }}
                    >
                    Confirmar
                    </button>

                    <button
                    className="cancel"
                    onClick={() => {
                        setActiveProduct(null);
                        setOrderConfig({ color: "", size: "", gender: "", person_in_charge: "", img: [] });
                    }}
                    >
                    Cancelar
                    </button>

                </div>

                </div>
            </div>
                    )}
        {orderSuccess && (
            <div className="success-toast">
                ✅ Orden Creada
            </div>
            )}


        <div ref={overviewRef} className="detail-info">
            <h2>{product.name}</h2>

            <div className="stars">
            {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>
                {i < Math.floor(product.rating) ? "★" : "☆"}
                </span>
            ))}
            <span className="product" >{product.rating}</span>
            <span className="product2">Reviews ({product.reviews})</span>
            </div>

            <div className="price-container">
            <span className="price">${product.price}</span>
            {Number(product.price) !== Number(product.original_price) && (
                <span className="old-price">${product.original_price}</span>
            )}
            </div>

            <p className="description">
             {product.description}
            </p>

        </div>

        {/* Generales */}

        <div
                className="features-section"
                >
                <div className="feature-row">
                    <span>Marca</span>
                    <strong>{product.brand}</strong>
                </div>

                <div className="feature-row">
                    <span>Categoría</span>
                    <strong>{product.category}</strong>
                </div>

                <div className="feature-row">
                    <span>Sub Categoría</span>
                    <strong>{product.sub_category}</strong>
                </div>

                <div className="feature-row">
                    <span>Modelo</span>
                    <strong>{product.modelo}</strong>
                </div>

                <div className="feature-row">
                    <span>Disponibles</span>
                    <strong>{product.stock}</strong>
                </div>

                <div className="feature-row">
                    <span>Dimenciones</span>
                    <strong>{product.sizes.map(a => `${a}, `)}</strong>
                </div>

                <div className="feature-row">
                    <span>Colores</span>
                    <strong>{product.colors.map(a => `${a}, `)}</strong>
                </div>

                 <div className="feature-row">
                    <span>Edades</span>
                    <strong>{product.age_group}</strong>
                </div>
            </div>

        {/* Características */}
         <div
                ref={featuresRef}
                className="features-section"
                >
                <h3>Características</h3>

                <div className="feature-row-20">
                        {product.
                    caracteristics.map( a => `${a}, `)
                    }
                </div>

            </div>

             <div
                ref={featuresRef}
                className="features-section"
                >
                <h3>Materiales</h3>

                <div className="feature-row-20">
                        {product.
                    material
                    }
                </div>

            </div>

        {/* Recomendaciones de uso */}
         <div
                // ref={recommendationsRef}
                className="features-section"
                >
                <h3>Recomendacion de uso</h3>

                <div className="feature-row-20">
                    {product.
                    recommended.map( a => `${a}. `)}
                </div>

            </div>

            {(product.category === "Equipos" 
            || product.category === "Electrodomésticos" 
            || product.category === "Electrónicos" ) && (<>

        {/* Detailes del equipo */}
         {/* Recomendaciones de uso */}

         <div
                // ref={featuresRef}
                className="features-section"
                >
                <h3>Detalles del Equipo</h3>

                <div className="feature-row">
                    <span>Tipo de Bateria</span>
                    <strong>{product.battery_details.battery_type}</strong>
                </div>

                <div className="feature-row">
                    <span>Capacidad</span>
                    <strong>{product.battery_details.capacity}</strong>
                </div>

                <div className="feature-row">
                    <span>Carga Rapida</span>
                    <strong>{product.battery_details.fast_charge}</strong>
                </div>

                <div className="feature-row">
                    <span>Potencia de Salida</span>
                    <strong>{product.battery_details.ac_output}</strong>
                </div>

                <div className="feature-row">
                    <span>Conexion a Panel Solar</span>
                    <strong>{product.battery_details.solar_compatible ? "Si" : "No"}</strong>
                </div>

            </div>

             <div  className="features-section">
                    <h4>Dispositivos Compatibles que Puede Alimentar</h4>

                        {product.battery_details.recommended_devices.map((a, i) => (
                        <div key={i} className="feature-item">
                            ✥ {a}
                        </div>
                        ))}
            </div>
              

                </>)  }

            <div
                // ref={featuresRef}
                className="features-section"
                >
                                 <button className="buy-btn"
                    style={{marginBottom: "50px"}}
                    onClick={(e) => {
                            e.preventDefault();  //🔥 prevents link navigation
                            setActiveProduct(product); 
                            }}>
                                Crear Orden
                </button>
                </div>



    </div> 
  );
}