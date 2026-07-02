// src/pages/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import productService from '../services/productService';
import { formatPrice } from '../utils/priceUtils';
import { getProductImage, getFallbackImage, preloadImage } from '../utils/imageUtils';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [imageErrors, setImageErrors] = useState({});
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts();
      console.log('📦 Products loaded:', response);
      
      const productsData = response.data || response;
      setProducts(productsData);

      // Предзагрузка изображений
      preloadProductImages(productsData);
    } catch (error) {
      console.error('❌ Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const preloadProductImages = async (products) => {
    const errors = {};
    
    for (const product of products) {
      const imageUrl = getProductImage(product);
      const result = await preloadImage(imageUrl);
      
      if (!result.success) {
        errors[product.id] = true;
        console.log(`❌ Image failed to load for product ${product.id} : ${imageUrl}`);
      }
    }
    
    setImageErrors(errors);
  };

  const loadCategories = async () => {
    try {
      const response = await productService.getCategories();
      setCategories(response.data || response);
    } catch (error) {
      console.error('❌ Error loading categories:', error);
    }
  };

  // Фильтрация и сортировка
  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category?.name === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stock':
          return b.stock - a.stock;
        default:
          return 0;
      }
    });

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      alert('🔐 Пожалуйста, войдите в систему чтобы добавлять товары в корзину');
      return;
    }

    try {
      await addToCart(product.id, 1);
      alert(`✅ Товар "${product.name}" добавлен в корзину!`);
    } catch (error) {
      alert(`❌ ${error?.error?.message || 'Ошибка при добавлении в корзину'}`);
    }
  };

  const handleImageError = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  const handleImageLoad = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: false }));
  };

  const getDisplayImage = (product) => {
    if (imageErrors[product.id]) {
      return getFallbackImage(product);
    }
    return getProductImage(product);
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1rem', textAlign: 'center' }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid #e2e8f0',
          borderTop: '4px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 2rem auto'
        }}></div>
        <p style={{ color: '#64748b', fontSize: '1.2rem' }}>Загружаем товары...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Заголовок */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          marginBottom: '1rem',
          fontWeight: '800'
        }} className="text-gradient">
          🔧 Комплектующие для ПК
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.2rem' }}>
          Найдите идеальные компоненты для вашей сборки
        </p>
      </div>

      {/* Панель управления */}
      <div className="glass-card" style={{ 
        padding: '1.5rem', 
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Поиск */}
        <div style={{ flex: '1', minWidth: '250px' }}>
          <input
            type="text"
            placeholder="🔍 Поиск товаров..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem',
              transition: 'all 0.3s ease'
            }}
          />
        </div>

        {/* Сортировка */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ color: '#64748b', fontWeight: '500' }}>Сортировка:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="name">По названию</option>
            <option value="price-low">Цена (сначала дешевые)</option>
            <option value="price-high">Цена (сначала дорогие)</option>
            <option value="stock">По наличию</option>
          </select>
        </div>
      </div>

      {/* Фильтры по категориям */}
      <div style={{ 
        display: 'flex', 
        gap: '0.75rem', 
        justifyContent: 'center', 
        marginBottom: '3rem',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setSelectedCategory('all')}
          style={getCategoryButtonStyle('all', selectedCategory)}
        >
          🌟 Все товары
        </button>
        
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.name)}
            style={getCategoryButtonStyle(category.name, selectedCategory)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Информация о результатах */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '2rem',
        color: '#64748b'
      }}>
        Найдено товаров: <strong>{filteredAndSortedProducts.length}</strong>
        {selectedCategory !== 'all' &&  `в категории "${selectedCategory}"`}
        {searchTerm &&  `по запросу "${searchTerm}"`}
      </div>

      {/* Сетка товаров */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '2rem'
        }}>
        {filteredAndSortedProducts.map((product, index) => (
          <ProductCard 
            key={product.id}
            product={product}
            index={index}
            imageErrors={imageErrors}
            onAddToCart={handleAddToCart}
            onImageError={handleImageError}
            onImageLoad={handleImageLoad}
            getDisplayImage={getDisplayImage}
          />
        ))}
      </div>

      {/* Сообщение если товаров нет */}
      {filteredAndSortedProducts.length === 0 && !loading && (
        <NoProductsMessage 
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onResetFilters={() => {
            setSearchTerm('');
            setSelectedCategory('all');
          }}
        />
      )}
    </div>
  );
};

// Компонент карточки товара
const ProductCard = ({ product, index, imageErrors, onAddToCart, onImageError, onImageLoad, getDisplayImage }) => (
  <div 
    className="glass-card card-hover fade-in"
    style={{ 
      borderRadius: '16px',
      overflow: 'hidden',
      animationDelay: `${index * 0.1}s`,
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}
  >
    {/* Изображение товара */}
    <div style={{
      height: '220px',
      position: 'relative',
      overflow: 'hidden',
      background: '#f8fafc'
    }}>
      <img
        src={getDisplayImage(product)}
        alt={product.name}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.3s ease'
        }}
        onError={() => onImageError(product.id)}
        onLoad={() => onImageLoad(product.id)}
        onMouseOver={(e) => {
          if (!imageErrors[product.id]) {
            e.target.style.transform = 'scale(1.05)';
          }
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
      />
      
      {/* Бейдж категории */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        background: 'rgba(255, 255, 255, 0.95)',
        color: '#1e293b',
        padding: '0.4rem 1rem',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '600',
        backdropFilter: 'blur(10px)',
        zIndex: 2
      }}>
        {product.category?.name || 'Другое'}
      </div>

      {/* Бейдж акции/новинки */}
      {product.stock > 0 && product.stock <= 5 && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          padding: '0.3rem 0.8rem',
          borderRadius: '12px',
          fontSize: '0.7rem',
          fontWeight: '600',
          zIndex: 2
        }}>
          🏃‍♂️ Заканчивается
        </div>
      )}
    </div>

    {/* Информация о товаре */}
    <div style={{ 
      padding: '1.5rem', 
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h3 style={{ 
        color: '#1e293b', 
        marginBottom: '0.75rem',
        fontSize: '1.25rem',
        fontWeight: '700',
        lineHeight: '1.4',
        flex: 1
      }}>
        {product.name}
      </h3>
      
      <p style={{ 
        color: '#64748b', 
        marginBottom: '1.5rem',
        lineHeight: '1.5',
        fontSize: '0.95rem',
        flex: 2
      }}>
        {product.description}
      </p>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem',
        marginTop: 'auto'
      }}>
        <span style={{ 
          fontSize: '1.75rem', 
          fontWeight: '800', 
          color: '#1e293b'
        }}>
          {formatPrice(product.price)}
          </span>
        <span style={{ 
          color: product.stock > 0 ? '#059669' : '#dc2626',
          fontWeight: '600',
          fontSize: '0.9rem',
          background: product.stock > 0 ? '#d1fae5' : '#fee2e2',
          padding: '0.25rem 0.75rem',
          borderRadius: '20px'
        }}>
          {product.stock > 0 ? `✅ ${product.stock} в наличии` : '❌ Нет в наличии'}
        </span>
      </div>

      <button 
        onClick={() => onAddToCart(product)}
        disabled={product.stock === 0}
        style={{
          width: '100%',
          padding: '0.875rem',
          background: product.stock > 0 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
            : '#9ca3af',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
          fontWeight: '600',
          fontSize: '1rem',
          transition: 'all 0.3s ease',
          opacity: product.stock > 0 ? 1 : 0.6
        }}
      >
        {product.stock > 0 ? '🛒 В корзину' : 'Нет в наличии'}
      </button>
    </div>
  </div>
);

// Компонент сообщения когда товаров нет
const NoProductsMessage = ({ searchTerm, selectedCategory, onResetFilters }) => (
  <div className="glass-card" style={{ 
    textAlign: 'center', 
    padding: '4rem 2rem',
    color: '#64748b'
  }}>
    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🔍</div>
    <h3 style={{ marginBottom: '1rem', color: '#374151' }}>Товары не найдены</h3>
    <p style={{ marginBottom: '2rem' }}>
      {searchTerm 
        ? `По запросу "${searchTerm}" ничего не найдено`
        : `В категории "${selectedCategory}" пока нет товаров`
      }
    </p>
    <button 
      onClick={onResetFilters}
      className="btn-primary"
    >
      📋 Показать все товары
    </button>
  </div>
);

// Стиль для кнопок категорий
const getCategoryButtonStyle = (category, selectedCategory) => ({
  padding: '0.75rem 1.5rem',
  background: selectedCategory === category 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : 'white',
  color: selectedCategory === category ? 'white' : '#374151',
  border: selectedCategory === category ? 'none' : '1px solid #d1d5db',
  borderRadius: '50px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontWeight: '500',
  boxShadow: selectedCategory === category 
    ? '0 4px 6px -1px rgba(102, 126, 234, 0.3)' 
    : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
});

export default ProductsPage;