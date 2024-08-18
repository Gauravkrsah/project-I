import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';
import { AiOutlineHeart } from 'react-icons/ai'; // Import Heart icon
import Rating from './Rating';

function Product(props) {
  const { product } = props;
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
    userInfo,
  } = state;

  // Local state to track quantity
  const [quantity, setQuantity] = useState(0);

  // Check if the product is already in the cart
  useEffect(() => {
    const existItem = cartItems.find((x) => x._id === product._id);
    if (existItem) {
      setQuantity(existItem.quantity);
    }
  }, [cartItems, product._id]);

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const newQuantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < newQuantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity: newQuantity },
    });
    setQuantity(newQuantity);
  };

  const increaseQuantityHandler = async () => {
    const newQuantity = quantity + 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < newQuantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity: newQuantity },
    });
    setQuantity(newQuantity);
  };

  const decreaseQuantityHandler = () => {
    if (quantity === 1) {
      ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: product });
      setQuantity(0);
    } else {
      const newQuantity = quantity - 1;
      ctxDispatch({
        type: 'CART_ADD_ITEM',
        payload: { ...product, quantity: newQuantity },
      });
      setQuantity(newQuantity);
    }
  };

  const calculateDiscount = (originalPrice, currentPrice) => {
    const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
    return Math.round(discount);
  };

  return (
    <Card
      style={{
        width: '140px',
        margin: '5px',
        padding: '5px',
        border: '1px solid #eee',
        borderRadius: '8px',
        position: 'relative',
        fontSize: '0.7rem',
      }}
    >
      {product.discount && (
        <span
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            backgroundColor: 'orange',
            color: 'white',
            padding: '2px 4px',
            fontSize: '0.65rem',
            borderRadius: '3px',
          }}
        >
          {calculateDiscount(product.originalPrice, product.price)}% OFF
        </span>
      )}
      <AiOutlineHeart
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          color: 'gray',
          cursor: 'pointer',
        }}
      />

      <Link to={`/product/${product.slug}`}>
        <img
          src={product.image}
          alt={product.name}
          style={{ objectFit: 'contain', height: '80px', width: '100%', marginBottom: '5px' }}
        />
      </Link>
      <Card.Body style={{ padding: '5px' }}>
        <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none', color: 'black' }}>
          <Card.Title style={{ fontSize: '0.7rem', height: '30px', overflow: 'hidden' }}>
            {product.name}
          </Card.Title>
        </Link>
        <div style={{ fontSize: '0.65rem', color: '#6c757d', marginBottom: '3px' }}>{product.brand}</div>
        <Rating rating={product.rating} numReviews={product.numReviews} style={{ fontSize: '0.6rem' }} />
        <Card.Text style={{ fontSize: '0.7rem', margin: '5px 0', color: 'black' }}>
          <span style={{ textDecoration: 'line-through', color: 'gray', marginRight: '5px' }}>NPR {product.originalPrice}</span>
          <span>NPR {product.price}</span>
        </Card.Text>
        <Card.Text style={{ fontSize: '0.65rem', color: 'green' }}>
          Saved Price NPR {product.originalPrice - product.price}
        </Card.Text>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem' }}>
          <span>Size</span>
          <select style={{ padding: '2px', borderRadius: '3px', border: '1px solid #ddd', fontSize: '0.65rem' }}>
            <option value="250ml">250 ml</option>
            <option value="500ml">500 ml</option>
          </select>
        </div>
        {product.countInStock === 0 ? (
          <Button
            variant="light"
            disabled
            style={{ fontSize: '0.7rem', padding: '2px 5px', marginTop: '5px', width: '100%' }}
          >
            Out of stock
          </Button>
        ) : quantity === 0 ? (
          !userInfo?.isAdmin ? (
            <Button
              onClick={() => addToCartHandler(product)}
              style={{ fontSize: '0.7rem', padding: '2px 5px', backgroundColor: '#28a745', color: 'white', marginTop: '5px', width: '100%' }}
            >
              ADD
            </Button>
          ) : (
            <Button
              onClick={() => navigate(`/admin/product/${product._id}`)}
              style={{ fontSize: '0.7rem', padding: '2px 5px', marginTop: '5px', width: '100%' }}
            >
              Edit
            </Button>
          )
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
            <Button
              onClick={decreaseQuantityHandler}
              style={{ fontSize: '0.7rem', padding: '2px 5px', backgroundColor: '#dc3545', color: 'white' }}
            >
              -
            </Button>
            <span style={{ fontSize: '0.7rem', padding: '0 10px' }}>{quantity}</span>
            <Button
              onClick={increaseQuantityHandler}
              style={{ fontSize: '0.7rem', padding: '2px 5px', backgroundColor: '#28a745', color: 'white' }}
            >
              +
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default Product;
