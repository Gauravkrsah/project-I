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
    }, 5000);
    return () => clearInterval(interval);
  }, [products]);

  return (
    <div>
      <Helmet>
        <title>AgriProduct</title>
      </Helmet>
      <div className="categories-bar">
        {/* Implement a category bar like Blinkit here */}
      </div>
      <div
        style={{
          background: "linear-gradient(to right, #F3EBEB, #014907, #101717)",
          color: "#fff",
          padding: "2rem",
          textAlign: "left",
          marginBottom: "2rem",
          borderRadius: "15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "300px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div>
          {products.length > 0 && (
            <>
              <h2 style={{ fontSize: "32px" }}>{products[currentProductIndex].name}</h2>
              <h4>Buy now, you won't regret later</h4>
              <button className="bg-[#014907] text-[#F3EBEB] border-none hover:bg-[#F3EBEB] hover:text-[#014907] hover:border hover:border-[#014907] p-2 mt-2">
                Shop Now
              </button>
            </>
          )}
        </div>
        <div className="image-slider">
          {products.length > 0 && (
            <img
              src={products[currentProductIndex].image}
              alt={products[currentProductIndex].name}
              className="slider-image"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                borderRadius: "15px",
                animation: "slideIn 5s infinite",
              }}
            />
          )}
        </div>
      </div>
      <h2 style={{ marginBottom: '2rem' }}>Featured Products</h2>
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