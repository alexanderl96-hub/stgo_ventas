import {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import './home.css';
import { ShoppingCart, Menu, X, Search, QrCode,
   XCircle, } from "lucide-react";
import useDataProducts from "../api/dataProducts";
import { calculateOrderPricing } from "../utils/pricing";
import API_URL from "../api/api_images";
import data from "../data_json"
import {
  updateWishlist
}
from "../api/productsApi.jsx";
import { filteringImgColor } from "../utils/filteringImgColor.jsx"


export default function Home({
  products, category, activeCategory, setActiveCategory,
  
  
  user, cart, setCart, activeTab, setActiveTab, 
  activeProduct, setActiveProduct, orderConfig, setOrderConfig,
   orderSuccess, setOrderSuccess
}) {
  // 🧠 GLOBAL PRODUCT DATA (FROM BACKEND)
  // const {
  //   // products,
  //   filtered,
  //   // search,
  //   setSearch,
  //   // category,
  //   setCategory
  // } = useDataProducts();

  const [open, setOpen] = useState(false);
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [openCategory, setOpenCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlist, setWishlist] = useState([]);
  
  // console.log("user", user)
  // console.log("activeCategory check", activeCategory)
  // console.log("categoryData", category)



  const fieldsToSearch = ["name", "category_key", "category", "sub_category"];

  const filteredProducts = products?.filter((p) => {
    const term = searchTerm.toLowerCase();

    return fieldsToSearch.some(field =>
      p[field]?.toLowerCase().includes(term)
    );
  });


  const filterSubCategory = (value) => {

    const totalCount = products
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



  const totalItems = filteredProducts?.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredProducts?.slice(startIndex, startIndex + itemsPerPage);

  // console.log("currentItems", currentItems)

  const getDiscount = (price, originalPrice) => {
    if (!originalPrice) return null;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const pricing = calculateOrderPricing({
      usdPrice: currentItems?.map(a => a.dollarPrice)[0],
      exchangeRate: currentItems?.map(a => a.currentDollarPrice)[0]
  });

  // console.log("currentItems", currentItems)


  useEffect(() => {
    setCurrentPage(1);
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

  // // console.log("openCategory", search)
  //   console.log("activeCategory",category, activeCategory)

      console.log("active product", cart)


  const filteringImgColor = (value, color) => {

   let stringChar =  value.map(a =>
      a.image_path.substring(
        a.image_path.lastIndexOf("-") + 1
      ).replaceAll("%20", " ")
       .slice(0, -5)
    ).filter(a => a === color);
    console.log("String", stringChar)

   let findIndex =  
   value.filter(a => `${a.public_id.substring(
    a.public_id.lastIndexOf("-") + 1)}` === 
    `${stringChar}`)

   return findIndex.map(a => a.image_path);
}

  return (
    <div className="main_Contianer_Portal">

      {/* 🔝 Header */}
      <header className="main_Header_Portal">
        <div className="main_subContainer_Portal">
          <div >
            <Menu onClick={() => setOpen(true)} size={20}  />
            <h4 className="text-l font-bold tracking-tight">STGO_Ventas</h4>
          </div>
          <Link to="/cart" className="cart-link">
          <div className="cart-container">
              <ShoppingCart size={18} />

              {cart.length > 0 && (
                <span className="cart-count">{cart.length}</span>
              )}
            </div>
          </Link>
        </div>
      </header>

      {/* 🔍 Search */}
      <div className="main_inputContainer_Portal">
        <Search size={14} />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Busqueda..."
        />
        <QrCode size={14} />
         {searchTerm && (
        <XCircle size={14} 
                onClick={() => {setSearchTerm(""); 
                                setOpenCategory(null);
                                setActiveCategory(category)}} />
         )}
      </div>

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
            />
          </div>

          {/* 🔽 Scrollable content */}
          <div className="sidenav-scroll">
          {category?.map((cat) => (
                <div key={cat.name}>

                {/* 🔥 CATEGORY */}
                <div
                  className="sidenav-item"
                  onClick={() =>{
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




     <div className="category-scroll">
        {category?.map((cat) => (
          <div
            key={cat.name}
            onClick={() => {
               setSearchTerm(cat.name)
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

                       await updateWishlist(

                          p.id,

                          p.likes + 1
                        );

                      }}
                    >
                      {wishlist.includes(p.id) ? "♥" : "♡"}
                    </div>

                    {/* 🔥 Badge */}
                    {discount > 0 && <div className="badge">-{discount}%</div>}

                    <img src={p.img[0].image_path} alt={p.name} className="product-img" />

                    <div className="product-info">
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
                        <span className="price">${p.price}</span>

                        {Number(p.price) !== Number(p.original_price)&& (
                          <span className="old-price">${p.original_price}</span>
                        )}
                      </div>

                      {/* 🛒 Button (optional navigation override) */}
                      <button
                        className="add-btn"
                        onClick={(e) => {
                          e.preventDefault(); 
                          console.log("Create Order", p);
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
                {activeProduct.colors.map((c) => (
                  <button
                    key={c}
                    className={orderConfig.color === c.split("_")[0] ? "active" : ""}
                    onClick={() =>{
                      const categoryActi = category.find(a => a.name === activeProduct.category);

                            setOrderConfig((prev) => ({
                                ...prev,
                                color: c.split("_")[0],
                                person_in_charge: categoryActi?.person_in_charge || "",
                                img: filteringImgColor(activeProduct.img, c.split("_")[0]) || []
                            }));
                             setOrderConfig((prev) => ({ ...prev, color: c.split("_")[0]  }));
                            
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
                  setOrderConfig({ color: "", size: "", gender: "", person_in_charge: "", img: [] });

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

       {/* 🔽 Pagination Container */}
        <div className="pagination-container">

          <div className="pagination-info">
            Page {currentPage} of {totalPages}
          </div>

          <div className="pagination-dots">
            {Array.from({ length: totalPages }).map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`dot ${currentPage === i + 1 ? "active" : ""}`}
              />
            ))}
          </div>

        </div>

    </div>
  );
}

