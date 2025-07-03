import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShopifyService } from '../services/shopifyService';
import './Header.css';

const Header: React.FC = () => {
  const { cart } = useCart();
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartRef = useRef<HTMLLIElement>(null);

  const totalItems = cart?.totalQuantity || 0;
  const totalAmount = cart?.estimatedCost?.totalAmount;

  // Handle click outside cart dropdown and ESC key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setShowCartDropdown(false);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowCartDropdown(false);
      }
    };

    if (showCartDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showCartDropdown]);

  const handleCartClick = () => {
    if (cart && cart.checkoutUrl && totalItems > 0) {
      // If cart has items and checkout URL, go to checkout
      window.open(cart.checkoutUrl, '_blank');
    } else {
      // Otherwise, toggle the dropdown to show cart contents (or empty state)
      setShowCartDropdown(!showCartDropdown);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-container">
          <div className="logo">
            <Link to="/">
              <h2>QuestNest</h2>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className={`mobile-menu-button ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Desktop navigation */}
          <ul className={`nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <li><Link to="/products" className="nav-cta" onClick={closeMobileMenu}>Products</Link></li>
            <li><Link to="/about" onClick={closeMobileMenu}>About</Link></li>
            <li><Link to="/contact" onClick={closeMobileMenu}>Contact</Link></li>
            <li className="cart-item" ref={cartRef}>
              <button className="cart-button" onClick={handleCartClick}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"/>
                  <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"/>
                  <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"/>
                </svg>
                {totalItems > 0 && (
                  <span className="cart-badge">{totalItems}</span>
                )}
              </button>
              
              {showCartDropdown && (
                <div className="cart-dropdown">
                  {totalItems > 0 ? (
                    <div className="cart-content">
                      <h3>Shopping Cart</h3>
                      {cart?.lines.edges.map(({ node: line }) => (
                        <div key={line.id} className="cart-item-details">
                          <div className="cart-item-info">
                            <div className="cart-item-name">
                              {line.merchandise.product.title}
                            </div>
                            <div className="cart-item-meta">
                              Qty: {line.quantity} × {ShopifyService.formatPrice(line.merchandise.price.amount, line.merchandise.price.currencyCode)}
                            </div>
                          </div>
                        </div>
                      ))}
                      {totalAmount && (
                        <div className="cart-total">
                          Total: {ShopifyService.formatPrice(totalAmount.amount, totalAmount.currencyCode)}
                        </div>
                      )}
                      <button 
                        className="checkout-button"
                        onClick={() => cart?.checkoutUrl && window.open(cart.checkoutUrl, '_blank')}
                      >
                        Checkout
                      </button>
                    </div>
                  ) : (
                    <div className="cart-empty">
                      <p>Your cart is empty</p>
                    </div>
                  )}
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
