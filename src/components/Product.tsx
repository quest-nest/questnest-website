import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShopifyService } from '../services/shopifyService';
import type { ShopifyProduct } from '../types/shopify';
import './Product.css';

const Product: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  
  const { addToCart, isLoading: cartLoading, error: cartError, clearError } = useCart();

  // Product handle - use from route params or default to book-1-hells-prison-escape
  const productHandle = handle || 'book-1-hells-prison-escape';

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const productData = await ShopifyService.getProduct(productHandle);
        if (productData) {
          setProduct(productData);
          // Set default variant
          const defaultVariant = ShopifyService.getDefaultVariant(productData);
          if (defaultVariant) {
            setSelectedVariantId(defaultVariant.id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productHandle]);

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleAddToCart = async () => {
    if (!product || !selectedVariantId) return;
    
    clearError();
    const success = await addToCart(selectedVariantId, quantity);
    
    if (success) {
      alert(`Added ${quantity} copy(ies) of "${product.title}" to cart!`);
    }
  };

  if (loading) {
    return (
      <div className="product-page">
        <div className="product-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  // If Shopify product isn't available, show not found
  if (!product) {
    return (
      <div className="product-page">
        <div className="product-container">
          <div className="product-not-found">
            <h1>Product Not Found</h1>
            <p>The requested product could not be found.</p>
            <Link to="/products" className="back-to-products">
              ← Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Shopify product data is available
  const images = ShopifyService.getAllImages(product);
  const defaultVariant = ShopifyService.getDefaultVariant(product);
  const isAvailable = ShopifyService.isProductAvailable(product);
  const displayImages = images.length > 0 ? images : [];

  return (
    <div className="product-page">
      <div className="product-container">
        {/* Image Gallery */}
        <div className="product-gallery">
          <div className="main-image">
            {displayImages[selectedImage] && (
              <img 
                src={displayImages[selectedImage].url} 
                alt={displayImages[selectedImage].altText || product.title}
              />
            )}
            <div className="image-overlay">
              <div className="zoom-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11 8V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 11H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="thumbnail-gallery">
            {displayImages.map((image, index) => (
              <button
                key={image.id}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img 
                  src={image.url} 
                  alt={image.altText || `Product view ${index + 1}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <div className="product-brand">{product.vendor || 'Quest Nest'}</div>
          
          <h1 className="product-title">{product.title}</h1>
          
          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="star">★</span>
              ))}
            </div>
            <span className="rating-count">(1 review)</span>
          </div>

          <div className="product-price">
            {defaultVariant && (
              <>
                <span className="current-price">
                  {ShopifyService.formatPrice(defaultVariant.price.amount, defaultVariant.price.currencyCode)}
                </span>
                {defaultVariant.compareAtPrice && (
                  <span className="original-price">
                    {ShopifyService.formatPrice(defaultVariant.compareAtPrice.amount, defaultVariant.compareAtPrice.currencyCode)}
                  </span>
                )}
                {defaultVariant.compareAtPrice && (
                  <span className="badge sale-badge">Sale</span>
                )}
              </>
            )}
          </div>

          <div className="product-tax">
            Tax included. <a href="#shipping">Shipping</a> calculated at checkout.
          </div>

          {cartError && (
            <div className="error-message">
              ⚠️ {cartError}
            </div>
          )}

          <div className="product-description">
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>

          <div className="product-actions">
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity</label>
              <div className="quantity-controls">
                <button 
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 8H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                <input 
                  type="number" 
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                />
                <button 
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  aria-label="Increase quantity"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 4V12M4 8H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <button 
              className="add-to-cart-btn" 
              onClick={handleAddToCart}
              disabled={!isAvailable || cartLoading || !selectedVariantId}
            >
              <span>
                {cartLoading ? 'Adding to Cart...' : 
                 !isAvailable ? 'Out of Stock' : 
                 'Add to Cart'}
              </span>
              <div className="btn-glow"></div>
            </button>

            <div className="payment-options">
              <div className="secure-checkout">
                <span>Secure and trusted checkout with</span>
                <div className="payment-badges">
                  <div className="payment-badge">💳</div>
                  <div className="payment-badge">🅿️</div>
                  <div className="payment-badge">✓</div>
                </div>
              </div>
            </div>
          </div>

          <div className="product-features">
            <div className="feature">
              <span className="feature-icon">📚</span>
              <span>Complete 4-Act Adventure</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🎲</span>
              <span>Level 3-6 Characters</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🗺️</span>
              <span>Maps & NPC Stats Included</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📄</span>
              <span>PDF Format</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
