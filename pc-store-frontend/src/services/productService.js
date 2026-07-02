// src/services/productService.js
import api from './api';

class ProductService {
  async getProducts() {
    return await api.get('/products');
  }

  async getProduct(id) {
    return await api.get(`/products/${id}`);
  }

  async getCategories() {
    return await api.get('/categories');
  }

  async getProductsByCategory(categoryId) {
    return await api.get(`/categories/${categoryId}/products`);
  }
}

export default new ProductService();