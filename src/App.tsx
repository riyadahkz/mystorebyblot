import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from './hooks/useCart';
import { useProducts } from './hooks/useProducts';
import { Product } from './types';

// Components
import SEO from './components/SEO';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import CategoryFilter from './components/CategoryFilter';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import ProductModal from './components/ProductModal';
import AdminPanel from './components/admin/AdminPanel';
import Footer from './components/Footer';

function App() {
  // Hooks
  const cart = useCart();
  const productHooks = useProducts();

  // State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showHero, setShowHero] = useState(true);

  // Derived state
  const filteredProducts = useMemo(() => {
    let products = productHooks.products;

    // Apply search filter
    if (searchQuery.trim()) {
      products = productHooks.searchProducts(searchQuery);
    }

    // Apply category filter
    if (selectedCategory) {
      products = products.filter(product => product.category === selectedCategory);
    }

    return products;
  }, [productHooks.products, searchQuery, selectedCategory, productHooks.searchProducts]);

  const featuredProducts = productHooks.getFeaturedProducts();
  const categories = productHooks.getCategories();

  // Event handlers
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    cart.addToCart(product, quantity);
  };

  const handleShopNow = () => {
    setShowHero(false);
    // Scroll to products section
    setTimeout(() => {
      const productsSection = document.getElementById('products-section');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleCheckout = () => {
    // In a real app, this would redirect to a payment processor
    alert('Checkout functionality would be implemented with a payment processor like Stripe');
    setIsCartOpen(false);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setShowHero(false);
    }
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    if (category) {
      setShowHero(false);
    }
  };

  // Hide hero when products are filtered or searched
  useEffect(() => {
    if (searchQuery.trim() || selectedCategory) {
      setShowHero(false);
    }
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO />
      
      <Header
        cartItemsCount={cart.getCartItemsCount()}
        onCartClick={() => setIsCartOpen(true)}
        onSearchChange={handleSearchChange}
        onAdminClick={() => setIsAdminOpen(true)}
        searchQuery={searchQuery}
      />

      <main>
        {showHero && (
          <Hero onShopNow={handleShopNow} />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {showHero && featuredProducts.length > 0 && (
            <FeaturedProducts
              products={featuredProducts}
              onAddToCart={handleAddToCart}
              onViewDetails={setSelectedProduct}
            />
          )}

          <div id="products-section">
            {!showHero && (
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {searchQuery ? `Search Results for "${searchQuery}"` : 
                   selectedCategory ? `${selectedCategory} Products` : 
                   'All Products'}
                </h2>
                <p className="text-gray-600">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                </p>
              </div>
            )}

            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />

            <ProductGrid
              products={filteredProducts}
              onAddToCart={handleAddToCart}
              onViewDetails={setSelectedProduct}
              loading={productHooks.loading}
            />
          </div>
        </div>
      </main>

      <Footer />

      {/* Modals */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart.cartItems}
        onUpdateQuantity={cart.updateQuantity}
        onRemoveItem={cart.removeFromCart}
        cartTotal={cart.getCartTotal()}
        onCheckout={handleCheckout}
      />

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={productHooks.allProducts}
        onAddProduct={productHooks.addProduct}
        onUpdateProduct={productHooks.updateProduct}
        onDeleteProduct={productHooks.deleteProduct}
      />
    </div>
  );
}

export default App;