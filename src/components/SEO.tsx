import React from 'react';
import { Product } from '../types';

interface SEOProps {
  title?: string;
  description?: string;
  product?: Product;
  canonical?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title = "Premium Online Store - Quality Products", 
  description = "Discover our curated collection of premium products. Fast shipping, secure checkout, and exceptional customer service.",
  product,
  canonical 
}) => {
  React.useEffect(() => {
    // Update document title
    document.title = product?.seoTitle || title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', product?.seoDescription || description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = product?.seoDescription || description;
      document.head.appendChild(meta);
    }

    // Update canonical URL
    let canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.rel = 'canonical';
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.href = canonical || window.location.href;

    // Add Open Graph meta tags
    const ogTags = [
      { property: 'og:title', content: product?.seoTitle || title },
      { property: 'og:description', content: product?.seoDescription || description },
      { property: 'og:type', content: product ? 'product' : 'website' },
      { property: 'og:url', content: canonical || window.location.href },
      { property: 'og:site_name', content: 'Premium Store' },
    ];

    if (product?.images?.[0]) {
      ogTags.push({ property: 'og:image', content: product.images[0] });
    }

    ogTags.forEach(({ property, content }) => {
      let ogElement = document.querySelector(`meta[property="${property}"]`);
      if (!ogElement) {
        ogElement = document.createElement('meta');
        ogElement.setAttribute('property', property);
        document.head.appendChild(ogElement);
      }
      ogElement.setAttribute('content', content);
    });

    // Add structured data for products
    if (product) {
      const structuredData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "image": product.images,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "USD",
          "price": product.price.toString(),
          "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "url": window.location.href
        }
      };

      let scriptElement = document.querySelector('script[type="application/ld+json"]');
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.type = 'application/ld+json';
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(structuredData);
    }
  }, [title, description, product, canonical]);

  return null;
};

export default SEO;