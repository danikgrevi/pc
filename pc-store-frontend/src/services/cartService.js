// src/services/cartService.js
import api from './api';

class CartService {
  async getCart() {
    return await api.get('/cart');
  }

  async addToCart(productId, quantity = 1) {
    return await api.post('/cart/add', {
      product_id: productId,
      quantity: quantity
    });
  }

  async updateCartItem(cartItemId, quantity) {
    return await api.put(`/cart/items/${cartItemId}`, {
      quantity: quantity
    });
  }

  async removeFromCart(cartItemId) {
    return await api.delete(`/cart/items/${cartItemId}`);
  }

  async clearCart() {
    return await api.delete('/cart/clear');
  }

  async getCartCount() {
    return await api.get('/cart/count');
  }

  async getCartTotal() {
    return await api.get('/cart/total');
  }
}

export default new CartService();