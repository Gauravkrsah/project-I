import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import { Container, Nav, Navbar, Form, FormControl, Button } from 'react-bootstrap';
import { useState, useEffect, useRef, useContext } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import SignupScreen from './screens/SignupScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import { Store } from './Store';
import { gsap } from 'gsap';
import './App.css';

function App() {
  const { state } = useContext(Store);
  const { cart } = state;

  const suggestions = ['Apple', 'Banana', 'Orange', 'Mango', 'Pineapple'];
  const [inputValue, setInputValue] = useState('');
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const [displayedText, setDisplayedText] = useState(suggestions[0]);
  const textRef = useRef(null);

  useEffect(() => {
    if (inputValue === '') {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });

      tl.fromTo(textRef.current,
        { y: '100%', opacity: 0 }, 
        { y: '0%', opacity: 1, duration: 0.7, ease: 'power1.inOut' }
      )
      .to(textRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: 'none'
      }, '+=0.5')
      .to(textRef.current, {
        y: '-100%',
        opacity: 0,
        duration: 0.5,
        ease: 'power1.inOut'
      })
      .call(() => {
        setCurrentSuggestion((prev) => (prev + 1) % suggestions.length);
        setDisplayedText(suggestions[currentSuggestion]);
      });

      return () => tl.kill();
    }
  }, [inputValue, currentSuggestion]);

  useEffect(() => {
    if (inputValue === '') {
      setDisplayedText(suggestions[currentSuggestion]);
    }
  }, [currentSuggestion, inputValue]);

  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <header>
          <Navbar bg="dark-green" variant="dark" expand="lg" sticky="top">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand className="text-gray-white">Cropsay</Navbar.Brand>
              </LinkContainer>
              <div className="location-detection text-gray-white">
                <i className="fas fa-map-marker-alt"></i> Detect Location
              </div>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto w-100 justify-content-center">
                  <div className="relative w-3/5">
                    <FormControl
                      type="search"
                      placeholder="Search"
                      className="me-2 px-4 py-2 border border-gray-300 bg-slate-50 rounded-md"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                    {inputValue === '' && (
                      <div
                        className="absolute inset-0 h-full flex items-center px-4 text-gray-500 pointer-events-none overflow-hidden bg-slate-50 rounded-md"
                        style={{ top: '50%', transform: 'translateY(-50%)' }}
                      >
                        <span ref={textRef} className="w-full text-left bg-slate-50">
                          Search "{displayedText}"
                        </span>
                      </div>
                    )}
                  </div>
                </Nav>
                <Nav className="ml-auto">
                  <LinkContainer to="/cart">
                    <Nav.Link className="text-gray-white">
                      <i className="fas fa-shopping-cart"></i>
                      {cart.cartItems.length > 0 && (
                        <span className="badge">{cart.cartItems.length}</span>
                      )}
                    </Nav.Link>
                  </LinkContainer>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/orderhistory" element={<OrderHistoryScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;