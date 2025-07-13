import { useState, useEffect } from 'react';
import { Product } from '../types';
import { sampleProducts } from '../data/products';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Load products from localStorage or use sample data
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error('Error loading products from localStorage:', error);
        setProducts(sampleProducts);
      }
    } else {
      setProducts(sampleProducts);
    }
    setLoading(false);
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products, loading]);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id
          ? { ...product, ...updates, updatedAt: new Date().toISOString() }
          : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  const getFeaturedProducts = () => {
    return products.filter(product => product.featured && product.inStock);
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category && product.inStock);
  };

  const searchProducts = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product =>
      product.inStock && (
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery)
      )
    );
  };

  const getCategories = () => {
    const categories = [...new Set(products.map(product => product.category))];
    return categories.sort();
  };

  return {
    products: products.filter(p => p.inStock),
    allProducts: products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getFeaturedProducts,
    getProductsByCategory,
    searchProducts,
    getCategories,
  };
};