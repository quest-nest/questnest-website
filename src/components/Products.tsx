import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShopifyService } from '../services/shopifyService';
import type { ShopifyProduct } from '../types/shopify';
import './Products.css';

const Products: React.FC = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        console.log('Fetching products from Shopify...');
        const shopifyProducts = await ShopifyService.getProducts(
          20, // Number of products to fetch
          sortBy,
          ShopifyService.shouldReverse(sortBy)
        );
        
        console.log('Shopify products fetched:', shopifyProducts);
        
        if (shopifyProducts.length > 0) {
          setProducts(shopifyProducts);
        } else {
          console.log('No Shopify products found');
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [sortBy]);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortBy = event.target.value;
    setSortBy(newSortBy);
    console.log('Sort changed to:', newSortBy);
  };

  const getProductPrice = (product: ShopifyProduct) => {
    return ShopifyService.formatPrice(
      product.priceRange.minVariantPrice.amount,
      product.priceRange.minVariantPrice.currencyCode
    );
  };

  const getProductImage = (product: ShopifyProduct) => {
    return product.images.edges[0]?.node.url || null;
  };

  const filteredProducts = products; // TODO: Add filtering logic

  return (
    <div className="products-page">
      {/* Hero Section */}
      <div className="products-hero">
        <div className="products-hero-content">
          <h1 className="products-title">Our Products</h1>
          <p className="products-subtitle">
            Discover our collection of D&D adventures, supplements, and player resources
          </p>
        </div>
      </div>

      <div className="products-container">
        {/* Filters and Sorting */}
        <div className="products-controls">
          <div className="products-count">
            <span>{loading ? 'Loading...' : `${filteredProducts.length} products`}</span>
          </div>
          
          <div className="products-sort">
            <label htmlFor="sort-select">Sort by:</label>
            <select 
              id="sort-select" 
              value={sortBy} 
              onChange={handleSortChange}
              className="sort-select"
            >
              <option value="featured">Featured</option>
              <option value="best-selling">Best Selling</option>
              <option value="title-asc">Alphabetically, A-Z</option>
              <option value="title-desc">Alphabetically, Z-A</option>
              <option value="price-asc">Price, Low to High</option>
              <option value="price-desc">Price, High to Low</option>
              <option value="created-asc">Date, Old to New</option>
              <option value="created-desc">Date, New to Old</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="products-loading">
            <div className="loading-spinner"></div>
            <p>Loading our magical collection...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <Link to={`/product/${product.handle}`} className="product-card-link">
                  <div className="product-card-image">
                    {getProductImage(product) && (
                      <img 
                        src={getProductImage(product)!}
                        alt={product.title}
                        loading="lazy"
                      />
                    )}
                    <div className="product-card-overlay">
                      <span className="view-product">View Product</span>
                    </div>
                  </div>
                  
                  <div className="product-card-content">
                    <div className="product-card-vendor">{product.vendor}</div>
                    <h3 className="product-card-title">{product.title}</h3>
                    <p className="product-card-description">
                      {product.description.length > 100 
                        ? `${product.description.substring(0, 100)}...` 
                        : product.description}
                    </p>
                    <div className="product-card-price">
                      <span className="price">{getProductPrice(product)}</span>
                    </div>
                    
                    {product.tags.length > 0 && (
                      <div className="product-card-tags">
                        {product.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="product-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="products-empty">
            <h2>No products found</h2>
            <p>Try adjusting your filters or check back later for new releases.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
