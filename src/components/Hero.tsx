import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShopifyService } from '../services/shopifyService';
import type { ShopifyProduct } from '../types/shopify';
import './Hero.css';

const Hero: React.FC = () => {
  const [featuredProduct, setFeaturedProduct] = useState<ShopifyProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProduct = async () => {
      try {
        // Fetch all products and use the first one as featured
        const products = await ShopifyService.getProducts(1); // Get just 1 product
        if (products && products.length > 0) {
          setFeaturedProduct(products[0]);
        }
      } catch (error) {
        console.error('Error fetching featured product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProduct();
  }, []);

  const getProductImage = () => {
    if (featuredProduct) {
      return ShopifyService.getMainImage(featuredProduct);
    }
    return null;
  };

  const getProductPrice = () => {
    if (featuredProduct) {
      const variant = ShopifyService.getDefaultVariant(featuredProduct);
      if (variant) {
        return ShopifyService.formatPrice(variant.price.amount, variant.price.currencyCode);
      }
    }
    return '$49.99'; // Fallback price
  };
  // Generate magical particles with unified wave animation
  const generateParticles = () => {
    const particles = [];
    const particleCount = 200; // Large number of particles for magical effect
    
    for (let i = 0; i < particleCount; i++) {
      // Add multiple layers of noise to break up the sine wave pattern
      const baseProgress = i / particleCount;
      const wavePhase = baseProgress * Math.PI * 8; // Base wave cycles
      
      // Layer 1: Base sine wave with noise
      const baseWave = Math.sin(wavePhase) * 50;
      
      // Layer 2: Secondary wave with different frequency
      const secondaryWave = Math.sin(wavePhase * 3.7 + Math.PI * 0.3) * 25;
      
      // Layer 3: Tertiary wave for more complexity
      const tertiaryWave = Math.sin(wavePhase * 1.8 + Math.PI * 0.7) * 15;
      
      // Layer 4: Random noise
      const randomNoise = (Math.random() - 0.5) * 40; // ±20px random variation
      
      // Layer 5: Perlin-like noise using multiple random factors
      const seed1 = Math.sin(i * 0.1) * Math.cos(i * 0.07);
      const seed2 = Math.sin(i * 0.13) * Math.cos(i * 0.11);
      const perlinNoise = (seed1 + seed2) * 20;
      
      // Combine all layers for horizontal offset
      const waveOffset = baseWave + secondaryWave + tertiaryWave + randomNoise + perlinNoise;
      
      // Add similar noise to horizontal positioning
      const baseX = baseProgress * 110 - 5; // Base horizontal spread
      const horizontalNoise = (Math.random() - 0.5) * 30; // ±15px horizontal randomness
      const finalX = baseX + horizontalNoise;
      
      // Add complex vertical variation with multiple noise layers
      const baseVertical = Math.sin(wavePhase * 2) * 30;
      const verticalNoise1 = Math.sin(wavePhase * 4.3 + Math.PI * 0.6) * 20;
      const verticalNoise2 = (Math.random() - 0.5) * 50; // ±25px random
      const verticalOffset = baseVertical + verticalNoise1 + verticalNoise2;
      
      // Vary particle properties for visual interest - larger sizes
      const size = 3 + Math.random() * 8; // 3-11px particles (much larger)
      const opacity = 0.3 + Math.random() * 0.7; // 0.3-1.0 opacity
      const hue = Math.floor(Math.random() * 3); // 0=blue, 1=purple, 2=gold
      
      const colors = [
        `rgba(59, 130, 246, ${opacity})`, // Blue
        `rgba(139, 92, 246, ${opacity})`, // Purple  
        `rgba(251, 191, 36, ${opacity})`  // Gold
      ];
      
      // Add extra animation delay staggering for more complex wave patterns
      const delayVariation = Math.random() * 3; // 0-3 second variation (increased)
      const baseDelay = baseProgress * 10; // 10 second spread (increased)
      const delayNoise = Math.sin(i * 0.05) * 2; // Sine-based delay variation
      
      particles.push(
        <div 
          key={i}
          className="magical-particle"
          style={{
            '--particle-index': i,
            '--wave-phase': wavePhase,
            '--base-x': `${finalX}%`, // Use the noisy horizontal position
            '--wave-offset': `${waveOffset}px`,
            '--vertical-offset': `${verticalOffset}px`,
            '--size': `${size}px`,
            '--color': colors[hue],
            '--delay': `${baseDelay + delayVariation + delayNoise}s` // Complex staggering with noise
          } as React.CSSProperties}
        />
      );
    }
    return particles;
  };

  return (
    <section className="hero">
      {/* Generate 200+ magical particles with unified wave animation */}
      {generateParticles()}
      
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Where Legends
            <span className="hero-title-accent"> Awaken</span>
          </h1>
          <p className="hero-subtitle">
            Venture forth into realms unknown with our mystical collection of 
            enchanted tomes, cursed dice forged in dragon fire, and ancient 
            campaign scrolls. Every artifact tells a story, every quest begins here.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn-primary">Enter the Realm</Link>
          </div>
        </div>
        <div className="hero-visual">
          {(isLoading || featuredProduct) && (
            <div className="hero-card">
              {isLoading ? (
                <div className="card-loading">
                  <div className="loading-placeholder">
                    <div className="loading-avatar"></div>
                    <div className="loading-text">
                      <div className="loading-line"></div>
                      <div className="loading-line short"></div>
                    </div>
                  </div>
                  <div className="loading-price"></div>
                </div>
              ) : featuredProduct && (
                <>
                  <div className="card-header">
                    <div className="card-avatar">
                      {getProductImage() && (
                        <img 
                          src={getProductImage()!} 
                          alt={featuredProduct.title}
                          className="product-image"
                        />
                      )}
                    </div>
                    <div className="card-info">
                      <h3>{featuredProduct.title}</h3>
                      <p>{featuredProduct.vendor} • {featuredProduct.productType || 'Enchanted'}</p>
                    </div>
                  </div>
                  <div className="card-progress">
                    <div className="price-tag">
                      <span className="price">{getProductPrice()}</span>
                      {ShopifyService.isProductAvailable(featuredProduct) ? (
                        <span className="badge">Available</span>
                      ) : (
                        <span className="badge sold-out">Out of Stock</span>
                      )}
                    </div>
                    <Link 
                      to={`/product/${featuredProduct.handle}`}
                      className="card-link"
                    >
                      View Details
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
