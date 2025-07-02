# QuestNest Website

A modern, mystical-themed website for QuestNest built with React, Vite, TypeScript, and Shopify integration.

## 🚀 Getting Started

### Prerequisites
- Node.js (v20.19.0+ or v22.12.0+)
- npm or yarn
- Shopify store (optional for demo mode)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd questnest-website
```

2. Install dependencies:
```bash
npm install
```

3. Configure Shopify (optional):
```bash
cp .env.example .env
# Edit .env with your Shopify credentials
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and visit `http://localhost:5173`

## � Shopify Integration

This website includes full Shopify Storefront API integration for real e-commerce functionality.

### Setting up Shopify

1. **Create Environment Variables:**
   ```bash
   cp .env.example .env
   ```

2. **Configure your `.env` file:**
   ```env
   VITE_SHOPIFY_DOMAIN=your-shop-name.myshopify.com
   VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
   ```

3. **Create Storefront API Access Token:**
   - Go to your Shopify Admin
   - Navigate to Apps > Manage private apps
   - Create a new private app
   - Enable Storefront API access
   - Copy the Storefront access token

4. **Create Product:**
   - Create a product with handle: `book-1-hells-prison-escape`
   - Add images, description, and pricing
   - Make sure the product is available

### Features

- ✅ Real-time product data fetching
- ✅ Shopping cart functionality
- ✅ Add to cart with quantity selection
- ✅ Cart persistence and management
- ✅ Shopify Checkout integration
- ✅ Price formatting and currency support
- ✅ Product image gallery
- ✅ Inventory management
- ✅ Responsive cart dropdown in header

### Demo Mode

Without Shopify configuration, the site runs in demo mode with:
- Placeholder product data
- Mock pricing and descriptions
- Setup instructions for Shopify integration
- Full UI/UX preview

## �📁 Project Structure

```
questnest-website/
├── public/            # Static assets
├── src/               # Source code
│   ├── components/    # React components
│   │   ├── Header.tsx     # Navigation with cart
│   │   ├── Hero.tsx       # Homepage hero section
│   │   ├── Home.tsx       # Homepage component
│   │   ├── About.tsx      # About page
│   │   └── Product.tsx    # Product page with Shopify
│   ├── config/        # Configuration files
│   │   └── shopify.ts     # Shopify API config
│   ├── context/       # React contexts
│   │   └── CartContext.tsx # Cart state management
│   ├── services/      # API services
│   │   └── shopifyService.ts # Shopify integration
│   ├── types/         # TypeScript types
│   │   └── shopify.ts     # Shopify data types
│   ├── App.tsx        # Main application
│   └── main.tsx       # Entry point
├── .env.example       # Environment template
└── package.json       # Dependencies
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Tech Stack

- **React** - UI framework with hooks
- **TypeScript** - Type safety and developer experience
- **Vite** - Fast build tool and dev server
- **Shopify Storefront API** - E-commerce functionality
- **React Router** - Multi-page navigation
- **ESLint** - Code quality and linting

## 🌟 Features

### Core Features
- Fast development with HMR (Hot Module Replacement)
- TypeScript for enhanced developer experience
- Modern React with hooks and context
- ESLint for code quality
- Optimized production builds

### Design Features
- Dark mystical theme with magical particle effects
- Fantasy typography using Cinzel and Spectral fonts
- Glowing animations and hover effects
- Golden color scheme with blue/purple accents
- Fully responsive design for all devices

### E-commerce Features
- Shopify Storefront API integration
- Real-time product data and pricing
- Shopping cart with persistence
- Quantity selection and management
- Secure Shopify checkout flow
- Multi-currency support
- Inventory tracking

## 📄 Pages

- **Home** (`/`) - Hero section with mystical design and call-to-action
- **About** (`/about`) - Founder's story and QuestNest origin
- **Product** (`/product`) - "Book 1: Hells Prison Escape" with full e-commerce

## 🛒 Cart Functionality

The shopping cart includes:
- Add/remove items with quantity control
- Real-time price calculations
- Cart persistence across sessions
- Dropdown cart preview in header
- Direct checkout via Shopify
- Error handling and loading states

## 🚀 Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist/` folder to your hosting provider

3. Set environment variables in your hosting environment:
   - `VITE_SHOPIFY_DOMAIN`
   - `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN`

## 📝 Development Notes

- The site works in demo mode without Shopify
- Cart state is managed via React Context
- All API calls include error handling
- TypeScript ensures type safety for Shopify data
- Responsive design tested across devices
