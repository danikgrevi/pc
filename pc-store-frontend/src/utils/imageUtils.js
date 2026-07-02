// src/utils/imageUtils.js
const IMAGE_BASE_URL = 'http://localhost:8020/storage/';

export const getProductImage = (product) => {
  if (!product) return getFallbackImage();
  
  console.log('🖼️ Product image data:', {
    hasImageUrl: !!product.image_url,
    imageUrl: product.image_url,
    fullUrl: product.image_url ? `${IMAGE_BASE_URL}/${product.image_url}` : null
  });
  
  // Если в API уже приходит полный URL
  if (product.image_url && product.image_url.startsWith('http')) {
    return product.image_url;
  }
  
  // Если есть относительный путь
  if (product.image_url) {
    // Убираем начальный слеш если есть
    const cleanPath = product.image_url.startsWith('/') ? product.image_url.substring(1) : product.image_url;
    return `${IMAGE_BASE_URL}/${cleanPath}`;
  }
  
  // Fallback на заглушку
  return getFallbackImage(product);
};

export const getFallbackImage = (product = null) => {
  // Красивые эмодзи для разных категорий
  const categoryEmojis = {
    1: '💻', // Процессоры
    2: '🎮', // Видеокарты  
    3: '🔌', // Материнские платы
    4: '🧠', // Память
    5: '💾', // SSD
    6: '⚡', // Блоки питания
    7: '🏠', // Корпуса
    8: '❄️', // Охлаждение
    9: '🖥️', // Мониторы
  };
  
  const emoji = categoryEmojis[product?.category_id] || '🔧';
  const categoryName = product?.category?.name || 'Товар';
  
  // Создаем красивую заглушку с градиентом
  const width = 400;
  const height = 300;
  const gradient = '667eea,764ba2'; // Фиолетовый градиент
  
  return `https://via.placeholder.com/${width}x${height}/${gradient}/ffffff?text=${encodeURIComponent(emoji + ' ' + categoryName)}`;
};

// Функция для проверки изображения
export const preloadImage = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ success: true, url });
    img.onerror = () => resolve({ success: false, url });
    img.src = url;
  });
};