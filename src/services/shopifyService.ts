import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { ADD_TO_CART_MUTATION, CREATE_CART_MUTATION, CUSTOMER_CREATE_MUTATION, PRODUCT_QUERY, PRODUCTS_QUERY, SHOPIFY_CONFIG } from '../config/shopify';
import type {
    CartCreateResponse,
    CartLinesAddResponse,
    ProductResponse,
    ProductsResponse,
    ShopifyCart,
    ShopifyProduct
} from '../types/shopify';

// Initialize Shopify Storefront API client
const client = createStorefrontApiClient({
  storeDomain: SHOPIFY_CONFIG.domain,
  apiVersion: SHOPIFY_CONFIG.apiVersion,
  publicAccessToken: SHOPIFY_CONFIG.storefrontAccessToken,
});

export class ShopifyService {
  /**
   * Fetch a product by handle
   */
  static async getProduct(handle: string): Promise<ShopifyProduct | null> {
    try {
      const response = await client.request(PRODUCT_QUERY, {
        variables: { handle },
      });

      const data = response.data as ProductResponse;
      return data.product || null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  /**
   * Create a new cart
   */
  static async createCart(): Promise<ShopifyCart | null> {
    try {
      const response = await client.request(CREATE_CART_MUTATION, {
        variables: {
          input: {}
        },
      });

      const data = response.data as CartCreateResponse;
      
      if (data.cartCreate.userErrors.length > 0) {
        console.error('Cart creation errors:', data.cartCreate.userErrors);
        return null;
      }

      return data.cartCreate.cart;
    } catch (error) {
      console.error('Error creating cart:', error);
      return null;
    }
  }

  /**
   * Add items to cart
   */
  static async addToCart(
    cartId: string, 
    variantId: string, 
    quantity: number
  ): Promise<ShopifyCart | null> {
    try {
      const response = await client.request(ADD_TO_CART_MUTATION, {
        variables: {
          cartId,
          lines: [
            {
              merchandiseId: variantId,
              quantity,
            },
          ],
        },
      });

      const data = response.data as CartLinesAddResponse;
      
      if (data.cartLinesAdd.userErrors.length > 0) {
        console.error('Add to cart errors:', data.cartLinesAdd.userErrors);
        return null;
      }

      return data.cartLinesAdd.cart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return null;
    }
  }

  /**
   * Fetch multiple products
   */
  static async getProducts(
    first: number = 20,
    sortKey?: string,
    reverse?: boolean
  ): Promise<ShopifyProduct[]> {
    try {
      // Map our sort keys to Shopify's enum values
      const shopifySortKey = this.mapSortKey(sortKey);
      
      const response = await client.request(PRODUCTS_QUERY, {
        variables: { 
          first,
          sortKey: shopifySortKey,
          reverse: reverse || false
        },
      });

      const data = response.data as ProductsResponse;
      return data.products.edges.map(edge => edge.node) || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  /**
   * Map our sort options to Shopify's ProductSortKeys
   */
  private static mapSortKey(sortKey?: string): string | undefined {
    const sortMapping: Record<string, string> = {
      'featured': 'RELEVANCE',
      'best-selling': 'BEST_SELLING',
      'title-asc': 'TITLE',
      'title-desc': 'TITLE',
      'price-asc': 'PRICE',
      'price-desc': 'PRICE',
      'created-asc': 'CREATED_AT',
      'created-desc': 'CREATED_AT'
    };
    
    return sortMapping[sortKey || 'featured'];
  }

  /**
   * Check if products should be sorted in reverse order
   */
  static shouldReverse(sortKey?: string): boolean {
    return ['title-desc', 'price-desc', 'created-desc'].includes(sortKey || '');
  }

  /**
   * Create a customer (for contact form submissions)
   */
  static async createCustomerFromContact(contactData: {
    firstName: string;
    email: string;
    lastName?: string;
    password: string;
  }): Promise<{ success: boolean; customerId?: string; errors?: string[] }> {
    try {
      const response = await client.request(CUSTOMER_CREATE_MUTATION, {
        variables: {
          input: {
            firstName: contactData.firstName,
            lastName: contactData.lastName || '',
            email: contactData.email,
            password: contactData.password
          }
        }
      });

      const data = response.data as any;
      
      if (data.customerCreate.customerUserErrors.length > 0) {
        const errors = data.customerCreate.customerUserErrors.map((error: any) => error.message);
        return { success: false, errors };
      }

      return { 
        success: true, 
        customerId: data.customerCreate.customer?.id 
      };
    } catch (error) {
      console.error('Error creating customer:', error);
      return { 
        success: false, 
        errors: ['Failed to submit contact form. Please try again.'] 
      };
    }
  }

  /**
   * Format price for display
   */
  static formatPrice(amount: string, currencyCode: string): string {
    const numericAmount = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(numericAmount);
  }

  /**
   * Get the main product image
   */
  static getMainImage(product: ShopifyProduct): string | null {
    if (product.images.edges.length > 0) {
      return product.images.edges[0].node.url;
    }
    return null;
  }

  /**
   * Get all product images
   */
  static getAllImages(product: ShopifyProduct): Array<{
    id: string;
    url: string;
    altText: string | null;
  }> {
    return product.images.edges.map(edge => ({
      id: edge.node.id,
      url: edge.node.url,
      altText: edge.node.altText,
    }));
  }

  /**
   * Get the default variant
   */
  static getDefaultVariant(product: ShopifyProduct) {
    if (product.variants.edges.length > 0) {
      return product.variants.edges[0].node;
    }
    return null;
  }

  /**
   * Check if product is available
   */
  static isProductAvailable(product: ShopifyProduct): boolean {
    return product.variants.edges.some(edge => 
      edge.node.availableForSale && edge.node.quantityAvailable > 0
    );
  }
}
