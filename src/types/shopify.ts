// Shopify API types
export interface ShopifyImage {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyPriceRange {
  minVariantPrice: ShopifyMoney;
  maxVariantPrice: ShopifyMoney;
}

export interface ShopifySelectedOption {
  name: string;
  value: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number;
  price: ShopifyMoney;
  compareAtPrice?: ShopifyMoney;
  selectedOptions: ShopifySelectedOption[];
}

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  vendor: string;
  productType: string;
  tags: string[];
  priceRange: ShopifyPriceRange;
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  variants: {
    edges: Array<{
      node: ShopifyProductVariant;
    }>;
  };
  seo: {
    title: string;
    description: string;
  };
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  estimatedCost: {
    totalAmount: ShopifyMoney;
  };
  merchandise: {
    id: string;
    title: string;
    product: {
      title: string;
      handle: string;
      images: {
        edges: Array<{
          node: {
            url: string;
            altText: string | null;
          };
        }>;
      };
    };
    price: ShopifyMoney;
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  estimatedCost: {
    totalAmount: ShopifyMoney;
    subtotalAmount: ShopifyMoney;
  };
  lines: {
    edges: Array<{
      node: ShopifyCartLine;
    }>;
  };
}

export interface CartCreateResponse {
  cartCreate: {
    cart: ShopifyCart;
    userErrors: Array<{
      field: string[];
      message: string;
    }>;
  };
}

export interface CartLinesAddResponse {
  cartLinesAdd: {
    cart: ShopifyCart;
    userErrors: Array<{
      field: string[];
      message: string;
    }>;
  };
}

export interface ProductResponse {
  product: ShopifyProduct;
}

export interface ProductsResponse {
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export type ProductSortKeys = 
  | 'BEST_SELLING'
  | 'CREATED_AT'
  | 'ID'
  | 'PRICE'
  | 'PRODUCT_TYPE'
  | 'RELEVANCE'
  | 'TITLE'
  | 'UPDATED_AT'
  | 'VENDOR';
