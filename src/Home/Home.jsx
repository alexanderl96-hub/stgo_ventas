import {useEffect, useState, useRef} from "react";
import { Link } from "react-router-dom";
import './home.css';
import { ShoppingCart, Menu, X, Search, QrCode,
   XCircle, } from "lucide-react";

import { calculateOrderPricing } from "../utils/pricing";
import { getColorStyle } from "../utils/filterColorSet.jsx";
import logo from "../source/logo.png"
import SplashScreen from "../SplashScreen.jsx";
import API_URL from "../api/api_images";

import {
  updateWishlist
}
from "../api/productsApi.jsx";
import { filteringImgColor } from "../utils/filteringImgColor.jsx"


export default function Home({
  productsDB, categoryDB, commingSoon,
  activeCategory, setActiveCategory,
  loading, setLoading, 
  searchTerm, setSearchTerm, 
  openCategory, setOpenCategory,
  
  
  user, cart, setCart, activeTab, setActiveTab, 
  activeProduct, setActiveProduct, orderConfig, setOrderConfig,
   orderSuccess, setOrderSuccess
}) {

  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);


  const productsRef = useRef(null);

  const [open, setOpen] = useState(false);
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  

  const fieldsToSearch = ["name", "category_key", "category", "sub_category"];

  const filteredProducts = productsDB?.filter((p) => {
    const term = searchTerm.toLowerCase();

    return fieldsToSearch.some(field =>
      p[field]?.toLowerCase().includes(term)
    );
  });

  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    // show after splash disappears
    const showTimer = setTimeout(() => {
      setShowComingSoon(true);
    }, 1000);

    // hide after 20 seconds
    const hideTimer = setTimeout(() => {
      setShowComingSoon(false);
    }, 60000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);


  const filterSubCategory = (value) => {

    const totalCount = productsDB
          .filter((v) => v.category === activeCategory)
          .filter((t) => t.sub_category === value)
          .reduce((sum, item) => sum + (item.total_items || 0), 0)

    return totalCount
  } 

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id) // remove
        : [...prev, id] // add
    );
  };

 const currentItems = filteredProducts?.slice(0, visibleCount);

  const getDiscount = (price, originalPrice) => {
    if (!originalPrice) return null;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const pricing = calculateOrderPricing({
      usdPrice: currentItems?.map(a => a.dollarPrice)[0],
      exchangeRate: currentItems?.map(a => a.currentDollarPrice)[0]
  });

useEffect(() => {
  if (categoryDB?.length > 0 && productsDB?.length > 0) {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }
}, [categoryDB, productsDB]);


useEffect(() => {

  setVisibleCount(20);
}, [searchTerm]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);
  useEffect(() => {
  document.body.style.overflow = open ? "hidden" : "auto";
}, [open]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wishlist"));
    if (saved) setWishlist(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);
  useEffect(() => {
    if (!open) {
      setOpenCategory(null);
    }
  }, [open]);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  console.log("cart", cart)
  console.log("visibleCount", visibleCount);
  console.log("filteredProducts", filteredProducts?.length);


  const availableSizes = !orderConfig.color
  ? activeProduct?.sizes || []
  : (
      activeProduct?.colors_match?.[
        orderConfig.color
      ]?.matching_sizes || []
    )
      .filter(([size, qty]) => qty > 0)
      .map(([size]) => size);

const availableColors = !orderConfig.size
  ? activeProduct?.colors || []
  : Object.entries(
      activeProduct?.colors_match || {}
    )
      .filter(([color, data]) =>
        data.matching_sizes.some(
          ([size, qty]) =>
            size === orderConfig.size &&
            qty > 0
        )
      )
      .map(([color]) => color);


console.log(commingSoon)


  return (
    <div className="main_Contianer_Portal">

         <div className={`portal-top ${isScrolled ? "header-blur" : ""}`}>

          {/* 🔝 Header */}
          <header   className="main_Header_Portal">
            <div className="main_subContainer_Portal">
              <div >
                <Menu onClick={() => setOpen(true)} 
                      size={20} 
                      className="menu_icon"  />

                <div className="logo-container">
                    <img
                      src={logo}
                      alt="Ventas"
                      className="logo-cart"
                    />

                    <span className="logo-speed">
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>

                    <span className="logo-express">
                      Express
                    </span>
                  </div>
              </div>
              <Link to="/cart" className="cart-link">
              <div className="cart-container">
                  <ShoppingCart size={18} className="shoppiCart-rezise" />

                  {cart.length > 0 && (
                    <span className="cart-count">{cart.length}</span>
                  )}
                </div>
              </Link>
            </div>
          </header>
              {/* 🔍 Search */}
          <div className="main_inputContainer_Portal">
              <Search size={14} className="search-icon" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Busqueda..."
              />
              <QrCode size={14} className="qrcode-icon" />
              {searchTerm && (
              <XCircle size={14} className="qrcode-icon" 
                      onClick={() => {setSearchTerm(""); 
                                      setOpenCategory(null);
                                      setActiveCategory(categoryDB)}} />
              )}
            </div>
        
        </div>


       {/* {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
           <div className="portal-content"> */}

      {/* 🏷 Categories */}

      {open && (
          <div
            className="overlay"
            onClick={() => {
              setOpen(false);
              setOpenCategory(null);
            }}
          />
        )}

        <div className={open ? "open_sideNav" : "close_sideNav"}>

          {/* 🔝 Header */}
          <div className="sidenav-header">
            <h3>Menu</h3>
            <X
              onClick={() => {
                setOpen(false);
                setOpenCategory(null);

              }}
              className="X-icon" 
            />
          </div>
   
          {/* 🔽 Scrollable content */}
          <div    className="sidenav-scroll">
          {categoryDB?.map((cat) => (
                <div key={cat.name} >

                {/* 🔥 CATEGORY */}
                <div
                  className="sidenav-item"
                  onClick={(e) =>{
                    setOpenCategory(openCategory === cat.name ? null : cat.name);
                    setActiveCategory(cat.name)
                    setSearchTerm(cat.name)
                    
                  }}
                >
                  <span>{cat.name}</span>
                  <span className="plus">
                    {openCategory === cat.name ? "−" : "+"}
                   
                  </span>
                </div>

                {/* 🔽 EXPANDED SECTION */}
                {openCategory === cat.name && (
                  <div className="sub-section">

                    {/* 📂 SUBCATEGORIES */}
                    <div className="sub-group">
                      <p className="sub-title">Categories</p>
                   
                      {cat.sub_category.some(
                          (item) => filterSubCategory(item) > 0
                        ) ? (
                          cat.sub_category
                            ?.filter((item) => filterSubCategory(item) > 0)
                            ?.map((item) => (
                              <span key={item} className="sub-item">
                                <div
                                  
                                  onClick={() => {
                                    setOpen(false);
                                    setOpenCategory(null);
                                    setSearchTerm(item);
                                  }}
                                >
                                  <div className="sub-item-div">✥ {item}</div>

                                  <div className="sub-item-div">{filterSubCategory(item)}</div>
                                </div>
                              </span>
                            ))
                        ) : (
                          <span> ✥ No disponible en estos momentos</span>
                        )}
                    </div>

                    {/* 🎯 FILTERS */}
                    <div className="sub-group">

                    </div>

                  </div>
                )}

              </div> 
            ))}  
          </div>

        </div>


      {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
        <div className="portal-content">
         {showComingSoon && (
          <div className="coming-soon">
            <h2 className="coming-title">
              🚀 Próximamente
            </h2>
 
           <div className="coming-scroll">
            {commingSoon?.slice(0, 40).map((item, index)=> {
              return(
                  <div className="coming-card" key={index}>
                    <img src={item.img.map(a => a.image_path)[0]} alt="" />
                    <span>{item.name}</span>
                  </div>
              )
            })}
            </div>
          </div> )}

          <div className="category-scroll">
            {categoryDB?.map((cat) => (
              <div
                key={cat.name}
                onClick={() => {
                    setSearchTerm(cat.name)
                    setActiveCategory(cat.name)
                } }
                className={`category-pill ${
                  activeCategory === cat.name ? "active" : ""
                }`}
              >
                {cat.name} 
              </div>
            ))} 
          </div>

          {/* 🛍 Products */}
            <div className="product-grid">
                {currentItems?.map((p) => {
                  const discount = getDiscount(p.price, p.original_price);

                  return (
                    <Link
                      key={p.id}
                      to={`/details/${p.id}`}
                      className="product-link"
                    >
                      <div className="product-card">
                        {/* ❤️ Wishlist (prevent navigation) */}
                        <div
                          className={`wishlist ${wishlist.includes(p.id) ? "active" : ""}`}

                            onClick={async (e) => {

                            e.preventDefault();

                            toggleWishlist(p.id);

                            // await updateWishlist(

                            //   p.id,

                            //   p.likes + 1
                            // );

                            await updateWishlist(
                              p.id,
                              user?.customer_id
                            );

                          }}
                        >
                          {wishlist.includes(p.id) ? "♥" : "♡"}
                        </div>

                        {/* 🔥 Badge */}
                        {discount > 0 && <div className="badge">-{discount}%</div>}
                        {/* <div className="badge">-{discount}%</div> */}

                        <img src={p.img[0].image_path} alt={p.name} className="product-img" />

                        <div className="product-info-home">
                          <h2>{p.name}</h2>

                          <div className="stars">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i}>
                                {i < Math.floor(p.rating) ? "★" : "☆"}
                              </span>
                            ))}
                            <span className="reviews">({p.reviews})</span>
                          </div>

                          <div className="price-container">
                            {/* <span className="home-price">${p.price}</span> */}
                            <div className="home-price">
                                <span className="currency">$</span>
                                <span className="whole">{Number(p.price).toFixed(2).split(".")[0]}</span>
                                <span className="home-dot">.</span>
                                <span className="cents">{Number(p.price).toFixed(2).split(".")[1]}</span>
                            </div>

                            {Number(p.price) !== Number(p.original_price)&& (
                              <span className="old-price">${p.original_price}</span>
                            )}
                          </div>

                          {/* 🛒 Button (optional navigation override) */}
                          <button
                            className="add-btn"
                            onClick={(e) => {
                              e.preventDefault(); 
                                setActiveProduct(p); 
                            }}
                          >
                            Crear Orden
                          </button>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

            

            {activeProduct && (
            <div className="modal-overlay">

              <div className="modal-box">

                <h2>{activeProduct.name}</h2>

                {/* COLOR */}
                <div className="section">
                  <p>Color</p>

                  <div className="options">

                    {activeProduct.colors.map((c) => {

                      const colorName = c.split("_")[0];

                      const disabled =
                        orderConfig.size &&
                        !availableColors.includes(colorName);

                      return (
                        <button
                          key={c}
                          disabled={disabled}
                          className={`
                            ${orderConfig.color === colorName ? "active" : ""}
                            ${disabled ? "disabled-option" : ""}
                          `}
                          onClick={() => {

                            if (disabled) return;

                            const normalize = str =>
                              str
                                ?.normalize("NFD")
                                .replace(/[\u0300-\u036f]/g, "")
                                .trim()
                                .toLowerCase();

                            const categoryActi =
                              categoryDB.find(
                                a =>
                                  normalize(a.name) ===
                                  normalize(activeProduct.category)
                              );

                            setOrderConfig(prev => ({
                              ...prev,
                              productId: activeProduct.id,
                              color: colorName,
                              person_in_charge:
                                categoryActi?.person_in_charge || "",
                              img:
                                filteringImgColor(
                                  activeProduct.img,
                                  colorName
                                ) || []
                            }));
                          }}
                        >
                          <div className="color-details">
                            <span
                              className="color-dot-details"
                              style={{
                                background:
                                  getColorStyle(colorName)
                              }}
                            />
                          </div>
                         
                        </button>
                      );
                    })}

                  </div>
                </div>


                {/* SIZE */}
                {activeProduct.sizes.length > 0 && (
                  <div className="section">

                    <p>Talla</p>

                    <div className="options">

                      {activeProduct.sizes.map((s) => {

                        const disabled =
                          orderConfig.color &&
                          !availableSizes.includes(s);

                        return (
                          <button
                            key={s}
                            disabled={disabled}
                            className={`
                              ${orderConfig.size === s ? "active" : ""}
                              ${disabled ? "disabled-option" : ""}
                            `}
                            onClick={() => {

                              if (disabled) return;

                              setOrderConfig(prev => ({
                                ...prev,
                                size: s
                              }));
                            }}
                          >
                            {s}
                          </button>
                        );
                      })}

                    </div>

                  </div>
                )}

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
                        productId: orderConfig.productId,

                        status: "create",
                        date: new Date().toLocaleDateString()
                      };

                      setCart((prev) => [...prev, newOrder]);

                      setActiveProduct(null);
                      setOrderConfig({ color: "", size: "", gender: "", person_in_charge: "", img: [], productId: "" });

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
                      setOrderConfig({ color: "", size: "", gender: "", person_in_charge: "", img: [], productId: "" });
                    }}
                  >
                    Cancelar
                  </button>

                </div>

              </div>
            </div>
                  )}

            {orderSuccess && (
                <div className="success-toast-home">
                  ✅ Orden Creada
                </div>
              )}

              {visibleCount < filteredProducts?.length && (
                  <div className="load-more-container">
                    <button
                      className="load-more-btn"
                      onClick={() => setVisibleCount(prev => prev + 20)}
                    >
                      Cargar Más
                    </button>
                  </div>
                )}

        </div>
        )}
    </div>
  );
}

