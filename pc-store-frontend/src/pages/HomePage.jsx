// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1rem' }}>
      {/* Hero Section */}
      <div className="glass-card fade-in" style={{
        textAlign: 'center',
        padding: '5rem 2rem',
        marginBottom: '4rem',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
      }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          marginBottom: '1.5rem',
          fontWeight: '800'
        }} className="text-gradient">
          Соберите ПК вашей мечты
        </h1>
        <p style={{ 
          fontSize: '1.3rem', 
          marginBottom: '3rem', 
          color: '#64748b',
          maxWidth: '600px',
          margin: '0 auto 3rem auto',
          lineHeight: '1.7'
        }}>
          Откройте для себя лучшие компоненты для вашей идеальной игровой и производительной системы.
Качественные детали, конкурентоспособные цены, экспертная поддержка.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/products" className="btn-primary">
            🚀 Начать покупки
          </Link>
          <Link to="/products" className="btn-secondary">
            🔍 Просмотреть компоненты
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem', 
        marginBottom: '4rem' 
      }}>
        {[
          { 
            icon: '⚡', 
            title: 'Новейшие компоненты', 
            desc: 'Всегда в курсе новейших технологий и инноваций',
            color: '#667eea'
          },
          { 
            icon: '🚚', 
            title: 'Быстрая доставка', 
            desc: 'Бесплатная доставка при заказе от 150 рублей. Быстрая и надежная доставка.',
            color: '#10b981'
          },
          { 
            icon: '🔒', 
            title: 'Безопасная оплата', 
            desc: 'Ваши транзакции безопасны и зашифрованы с использованием безопасности банковского уровня.',
            color: '#f59e0b'
          },
          { 
            icon: '💬', 
            title: 'Поддержка 24/7', 
            desc: 'Наша команда экспертов готова помочь вам в любое время дня и ночи.',
            color: '#ef4444'
          },
          { 
            icon: '↩️', 
            title: 'Простой возврат', 
            desc: '30-дневная политика беспроблемного возврата всех товаров',
            color: '#8b5cf6'
          },
          { 
            icon: '🏆', 
            title: 'Проверенные бренды', 
            desc: 'Только оригинальная продукция от официальных партнеров и производителей',
            color: '#06b6d4'
          }
        ].map((feature, index) => (
          <div 
            key={index}
            className="glass-card card-hover fade-in"
            style={{ 
              padding: '2.5rem 2rem',
              textAlign: 'center',
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1.5rem',
              filter: `drop-shadow(0 4px 6px ${feature.color}40)`
            }}>
              {feature.icon}
            </div>
            <h3 style={{ 
              color: '#1e293b', 
              marginBottom: '1rem',
              fontSize: '1.4rem',
              fontWeight: '700'
            }}>
              {feature.title}
            </h3>
            <p style={{ 
              color: '#64748b',
              lineHeight: '1.6'
            }}>
              {feature.desc}
            </p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="glass-card fade-in" style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)'
      }}>
        <h2 style={{ 
          color: '#1e293b', 
          marginBottom: '1rem',
          fontSize: '2.5rem',
          fontWeight: '800'
        }}>
          Готовы к сборке?
        </h2>
        <p style={{ 
          color: '#64748b', 
          marginBottom: '2.5rem',
          fontSize: '1.2rem',
          maxWidth: '500px',
          margin: '0 auto 2.5rem auto'
        }}>
          Присоединяйтесь к тысячам довольных клиентов, собирающих вместе с нами ПК своей мечты
        </p>
        <Link 
          to="/products" 
          className="btn-primary"
          style={{
            padding: '1rem 2.5rem',
            fontSize: '1.1rem'
          }}
        >
          🛒 Исследуйте все продукты
        </Link>
      </div>
    </div>
  );
};

export default HomePage;