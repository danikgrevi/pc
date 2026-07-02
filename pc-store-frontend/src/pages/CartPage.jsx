 // src/pages/CartPage.jsx - ОБНОВЛЕННАЯ ВЕРСИЯ CartItem
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, calculateTotal } from '../utils/priceUtils';
import { getProductImage, getFallbackImage } from '../utils/imageUtils';

// Компонент элемента корзины
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const product = item.product || {};
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Получаем URL изображения
  const productImage = product.image_url 
    ? getProductImage(product) 
    : null;

  console.log('🛒 Cart Item Debug:', {
    productName: product.name,
    hasImageUrl: !!product.image_url,
    imageUrl: product.image_url,
    fullImageUrl: productImage,
    imageLoaded,
    imageError
  });

  const handleImageLoad = () => {
    console.log('✅ Image loaded successfully');
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    console.log('❌ Image failed to load');
    setImageLoaded(false);
    setImageError(true);
  };

  // Цвета для разных категорий (fallback)
  const categoryColors = {
    1: '#667eea', // Процессоры
    2: '#ed64a6', // Видеокарты
    3: '#9f7aea', // Материнские платы
    4: '#38b2ac', // Память
    5: '#ed8936', // SSD
    6: '#48bb78', // Блоки питания
    7: '#ecc94b', // Корпуса
    8: '#4299e1', // Охлаждение
    9: '#a0aec0', // Мониторы
  };

  const categoryColor = categoryColors[product.category?.id] || '#667eea';

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1.5rem 0',
      borderBottom: '1px solid #e2e8f0',
      gap: '1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
        {/* Контейнер для изображения */}
        <div style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '8px',
          overflow: 'hidden',
          flexShrink: 0,
          position: 'relative',
          background: '#f8fafc'
        }}>
          {/* Показываем изображение если оно есть и загрузилось */}
          {product.image_url && !imageError && (
            <img
              src={productImage}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: imageLoaded ? 'block' : 'none'
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
          
          {/* Fallback - показываем когда изображение загружается или произошла ошибка */}
          {(!product.image_url || imageError || !imageLoaded) && (
            <div style={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}99 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              {product.name?.charAt(0) || '?'}
            </div>
          )}
          
          {/* Индикатор загрузки */}
          {product.image_url && !imageLoaded && !imageError && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '20px',
              height: '20px',
              border: '2px solid #e2e8f0',
              borderTop: '2px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          )}
        </div>
        
        {/* Информация о товаре */}
        <div style={{ flex: 1 }}>
          <h4 style={{ 
            color: '#1e293b', 
            marginBottom: '0.25rem', 
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>
            {product.name || 'Товар'}
          </h4>
          <p style={{ 
            color: '#64748b', 
            fontSize: '0.9rem',
            marginBottom: '0.25rem'
          }}>
            {formatPrice(item.price || product.price || 0)}
          </p>
          <p style={{ 
            color: '#94a3b8', 
            fontSize: '0.8rem'
          }}>
            {product.category?.name || ''}
          </p>
        </div>
      </div>

      {/* Управление количеством и цена */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            style={{ 
              width: '32px', 
              height: '32px', 
              background: '#f1f5f9', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}
          >
            -
          </button>
          <span style={{ 
            minWidth: '40px', 
            textAlign: 'center', 
            fontWeight: '600',
            fontSize: '1.1rem'
          }}>
            {item.quantity}
          </span>
          <button 
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            style={{ 
              width: '32px', 
              height: '32px', 
              background: '#f1f5f9', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}
          >
            +
          </button>
        </div>
        
        <span style={{ 
          fontWeight: '600', 
          color: '#1e293b',
          minWidth: '100px',
          textAlign: 'right',
          fontSize: '1.1rem'
        }}>
          {formatPrice((item.price || product.price || 0) * item.quantity)}
        </span>

        <button 
          onClick={() => onRemove(item.id)}
          style={{ 
            padding: '0.5rem', 
            background: '#fee2e2', 
            color: '#dc2626', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            marginLeft: '1rem'
          }}
          title="Удалить из корзины"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

// Основной компонент CartPage
const CartPage = () => {
  const { cart, loading, error, fetchCart, updateCartItem, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  // Добавим отладку данных корзины
  useEffect(() => {
    if (cart) {
      console.log('🛒 Full Cart Data:', cart);
      console.log('🛒 Cart Items:', cart.items);
    }
  }, [cart]);

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            marginBottom: '1rem',
            fontWeight: '800'
          }} className="text-gradient">
            Корзина
          </h1>
        </div>
        <div className="glass-card" style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🔐</div>
          <h2 style={{ 
            color: '#1e293b', 
            marginBottom: '1rem',
            fontSize: '1.75rem',
            fontWeight: '700'
          }}>
            Требуется авторизация
          </h2>
          <p style={{ 
            color: '#64748b', 
            marginBottom: '2.5rem',
            lineHeight: '1.6'
          }}>
            Войдите в систему, чтобы просмотреть корзину и добавлять товары
          </p>
          <Link to="/login" className="btn-primary">
            🔐 Войти в систему
          </Link>
        </div>
      </div>
    );
  }

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
        <p style={{ color: '#64748b', fontSize: '1.2rem' }}>Загружаем корзину...</p>
      </div>
    );
  }

  const cartItems = cart?.items || [];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          marginBottom: '1rem',
          fontWeight: '800'
        }} className="text-gradient">
          🛒 Корзина
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.2rem' }}>
          {cartItems.length > 0 
            ? `Товаров в корзине: ${cartItems.reduce((total, item) => total + item.quantity, 0)}` 
            : 'Просмотрите ваши товары'
          }
        </p>
      </div>

      {error && (
        <div className="glass-card" style={{
          background: '#fee2e2',
          border: '1px solid #fecaca',
          padding: '1.5rem',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#dc2626', margin: 0 }}>
            {error.error?.message || 'Ошибка при загрузке корзины'}
          </p>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="glass-card fade-in" style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🛒</div>
          <h2 style={{ 
            color: '#1e293b', 
            marginBottom: '1rem',
            fontSize: '1.75rem',
            fontWeight: '700'
          }}>
            Ваша корзина пуста
          </h2>
          <p style={{ 
            color: '#64748b', 
            marginBottom: '2.5rem',
            lineHeight: '1.6'
          }}>
            Найдите отличные комплектующие для вашего ПК и добавьте их в корзину!
          </p>
          <Link to="/products" className="btn-primary">
            🚀 Перейти к товарам
          </Link>
        </div>
      ) : (
        <div className="fade-in">
          <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            {cartItems.map((item) => (
              <CartItem 
                key={item.id}
                item={item}
                onUpdateQuantity={updateCartItem}
                onRemove={removeFromCart}
              />
            ))}
          </div>
          
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>Итого:</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>
                {formatPrice(calculateTotal(cartItems))}
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                onClick={clearCart}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                🗑️ Очистить корзину
              </button>
              <button 
                className="btn-primary"
                style={{ flex: 2 }}
                onClick={() => alert('Функционал оформления заказа будет добавлен позже')}
              >
                🛍️ Оформить заказ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage; 