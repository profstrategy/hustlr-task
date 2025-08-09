import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  
  const componentMounted = useRef(true);

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const response = await fetch("https://fakestoreapi.com/products/");
      if (componentMounted.current) {
        const data = await response.clone().json();
        setData(data);
        setFilter(await response.json());
        setLoading(false);
      }
    };

    getProducts();

    return () => {
      componentMounted.current = false;
    };
  }, []);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      </>
    );
  };

  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
  };

  const toggleDropdown = (productId) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const ShowProducts = () => {
    return (
      <>
        <div className="buttons text-center py-5">
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => setFilter(data)}
          >
            All
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("men's clothing")}
          >
            Men's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("women's clothing")}
          >
            Women's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("jewelery")}
          >
            Jewelery
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("electronics")}
          >
            Electronics
          </button>
        </div>

        {filter.map((product) => {
          const isUnavailable = product.rating.count === 0;
          const isDropdownOpen = openDropdowns[product.id] || false;
          
          return (
            <div
              id={product.id}
              key={product.id}
              className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4"
            >
              <div className="card h-100 shadow-sm border-0 position-relative overflow-hidden">
                
                {/* Product Image */}
                <div className="position-relative overflow-hidden">
                  <img
                    className="card-img-top p-3 transition-transform"
                    src={product.image}
                    alt={product.title}
                    height={280}
                    style={{
                      objectFit: 'contain',
                      transition: 'transform 0.3s ease',
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  />
                </div>

                {/* Card Body */}
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="card-title fw-bold text-truncate flex-grow-1 me-2" 
                        style={{fontSize: '0.95rem', lineHeight: '1.3'}}>
                      {product.title.length > 50 ? product.title.substring(0, 50) + '...' : product.title}
                    </h6>
                  </div>

                  {/* Price */}
                  <div className="mb-3 mt-auto d-flex justify-content-between">
                    <h5 className="text-primary fw-bold mb-0">${product.price}</h5>
                     {/* Dropdown Toggle */}
                    <button 
                      className="btn btn-link p-0 text-muted"
                      onClick={() => toggleDropdown(product.id)}
                      style={{fontSize: '1.2rem', lineHeight: 1}}
                    >
                      ⋯
                    </button>
                  </div>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="dropdown-menu show position-absolute shadow-sm border-0" 
                         style={{
                           top: '45px', 
                           right: '10px', 
                           zIndex: 1000,
                           minWidth: '150px',
                           borderRadius: '8px',
                           backgroundColor: '#fff',
                           border: '1px solid #e9ecef'
                         }}>
                      <button className="dropdown-item py-2" >
                         Add to Wishlist
                      </button>
                      <button className="dropdown-item py-2" >
                        Share Product
                      </button>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="d-flex gap-2">
                    <Link
                      to={"/product/" + product.id}
                      className="btn btn-outline-dark flex-fill btn-sm"
                      style={{borderRadius: '20px'}}
                    >
                      View Details
                    </Link>
                    <button
                      className={`btn flex-fill btn-sm ${isUnavailable ? 'btn-secondary' : 'btn-light'}`}
                      onClick={() => {
                        if (!isUnavailable) {
                          toast.success("Added to cart");
                          addProduct(product);
                        } else {
                          toast.error("Product is out of stock");
                        }
                      }}
                      disabled={isUnavailable}
                      style={{borderRadius: '20px'}}
                    >
                      {isUnavailable ? ' Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center">Latest Products</h2>
            <hr />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>

      <style jsx>{`
        .card:hover {
          transform: translateY(-5px);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        
        .transition-transform {
          transition: transform 0.3s ease;
        }
        
        .dropdown-menu.show {
          animation: fadeIn 0.2s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .btn {
          transition: all 0.3s ease;
        }
      `}</style>
    </>
  );
};

export default Products;