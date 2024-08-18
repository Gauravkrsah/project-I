import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../components/Product";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  });

  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProductIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [products]);

  return (
    <div>
      <Helmet>
        <title>AgriProduct</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Raleway:wght@400;700&display=swap" rel="stylesheet" />
      </Helmet>
      <div className="categories-bar">
        {/* Implement a category bar like Blinkit here */}
      </div>
      <div className="banner relative w-full h-80 bg-gradient-to-r from-[#014907] to-[#101717] flex items-center justify-between text-white">
        <div className="banner-text z-10 p-10">
          {products.length > 0 && (
            <>
              <h2 className="banner-title text-4xl font-bold mb-2">{products[currentProductIndex].name}</h2>
              <h4 className="banner-subtitle text-xl mb-4">Buy now, you won't regret later</h4>
              <button className="banner-button px-6 py-3 bg-[#ff6f61] text-white font-bold rounded-md hover:bg-[#e65c50] transition duration-300">
                Shop Now
              </button>
            </>
          )}
        </div>
        <div className="image-slider absolute inset-y-0 right-0 flex items-center justify-end pr-10">
          {products.length > 0 && (
            <img
              src={products[currentProductIndex].image.replace(/\.\w+$/, '.png')}
              alt={products[currentProductIndex].name}
              className="slider-image w-1/4 h-auto object-cover opacity-0 transition-opacity duration-6000"
            />
          )}
        </div>
      </div>
      <h2 className="text-2xl font-bold my-8">Featured Products</h2>
      <div className="products-grid">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} xs={6} sm={4} md={3} lg={2} className="mb-3">
                <Product product={product} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;