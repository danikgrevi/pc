// src/components/Header.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { cart } = useCart();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const cartItemsCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #e2e8f0',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link 
          to="/" 
          style={{ 
            textDecoration: 'none',
            fontSize: '1.8rem',
            fontWeight: '800',
          }}
          className="text-gradient"
        >
          🖥️ PC Store
        </Link>
        
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link 
            to="/" 
            style={{
              color: isActive('/') ? '#667eea' : '#64748b',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              fontWeight: '500',
              background: isActive('/') ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
              border: isActive('/') ? '1px solid rgba(102, 126, 234, 0.2)' : '1px solid transparent'
            }}
          >
            🏠 Главная
          </Link>
          
          <Link 
            to="/products" 
            style={{
              color: isActive('/products') ? '#667eea' : '#64748b',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              fontWeight: '500',
              background: isActive('/products') ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
              border: isActive('/products') ? '1px solid rgba(102, 126, 234, 0.2)' : '1px solid transparent'
            }}
          >
            🔧 Товары
          </Link>
          
          <Link 
            to="/cart" 
            style={{
              color: isActive('/cart') ? '#667eea' : '#64748b',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              fontWeight: '500',
              background: isActive('/cart') ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
              border: isActive('/cart') ? '1px solid rgba(102, 126, 234, 0.2)' : '1px solid transparent',
              position: 'relative'
            }}
          >
            🛒 Корзина
            {cartItemsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {cartItemsCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: '#374151', fontWeight: '500' }}>
                👋 {user?.name}
              </span>
              <button 
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  color: '#64748b',
                  border: '1px solid #d1d5db',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: '500'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#fee2e2';
                  e.target.style.color = '#dc2626';
                  e.target.style.borderColor = '#fecaca';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#64748b';
                  e.target.style.borderColor = '#d1d5db';
                }}
              >
                Выйти
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              style={{
                color: isActive('/login') ? '#667eea' : '#64748b',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                fontWeight: '500',
                background: isActive('/login') ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                border: isActive('/login') ? '1px solid rgba(102, 126, 234, 0.2)' : '1px solid transparent'
              }}
            >
              🔐 Войти
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;