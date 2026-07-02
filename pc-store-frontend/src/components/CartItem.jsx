// src/components/CartItem.jsx (расширенная версия)
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  TextField,
  Divider,
  Grid,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 0 && newQuantity <= 10) {
      onUpdateQuantity(newQuantity);
    }
  };

  const handleIncrement = () => {
    handleQuantityChange(item.quantity + 1);
  };

  const handleDecrement = () => {
    handleQuantityChange(item.quantity - 1);
  };

  const totalPrice = item.product.price * item.quantity;

  // Функция для получения изображения товара
  const getProductImage = () => {
    if (item.product.images && item.product.images.length > 0) {
      return item.product.images[0].url;
    }
    return '/api/placeholder/80/80'; // Заглушка
  };

  return (
    <Card sx={{ mb: 2, boxShadow: 2, borderRadius: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Изображение товара */}
          <Grid item xs={2} md={1}>
            <Avatar
              src={getProductImage()}
              alt={item.product.name}
              sx={{ width: 60, height: 60, borderRadius: 1 }}
              variant="rounded"
            />
          </Grid>

          {/* Информация о товаре */}
          <Grid item xs={10} md={5}>
            <Typography variant="h6" component="h3" gutterBottom noWrap>
              {item.product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {item.product.category?.name || 'Uncategorized'}
            </Typography>
            <Typography variant="body1" color="primary" fontWeight="bold">
              ${item.product.price}
            </Typography>
          </Grid>

          {/* Управление количеством */}
          <Grid item xs={6} md={3}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <IconButton 
                onClick={handleDecrement}
                disabled={item.quantity <= 1}
                size="small"
                color="primary"
                sx={{ border: 1, borderColor: 'grey.300' }}
              >
                <RemoveIcon />
              </IconButton>
              
              <TextField
                value={item.quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  handleQuantityChange(value);
                }}
                inputProps={{
                  min: 1,
                  max: 10,
                  style: { 
                    textAlign: 'center', 
                    width: 60,
                    padding: '8px'
                  }
                }}
                variant="outlined"
                size="small"
                sx={{ mx: 1 }}
              />
              
              <IconButton 
                onClick={handleIncrement}
                disabled={item.quantity >= 10 || item.quantity >= item.product.stock_quantity}
                size="small"
                color="primary"
                sx={{ border: 1, borderColor: 'grey.300' }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Общая цена и удаление */}
          <Grid item xs={6} md={3}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box textAlign="right">
                <Typography variant="h6" color="primary" fontWeight="bold">
                  ${totalPrice.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total
                </Typography>
              </Box>
              
              <IconButton 
                onClick={onRemove}
                color="error"
                aria-label="Remove from cart"
                sx={{ ml: 2 }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Информация о наличии */}
        <Box mt={1}>
          {item.product.stock_quantity > 0 ? (
            <Typography 
              variant="body2" 
              color={item.quantity > item.product.stock_quantity ? "error" : "success.main"}
            >
              {item.quantity > item.product.stock_quantity 
                ? `Only ${item.product.stock_quantity} available in stock`
                : `${item.product.stock_quantity} available in stock`
              }
            </Typography>
          ) : (
            <Typography variant="body2" color="error">
              Out of stock
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CartItem;