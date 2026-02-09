import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Grid,
  Snackbar,
  Typography,
} from '@mui/material';
import api from './api/axiosClient';

const InventoryManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ open: false, severity: 'info', msg: '' });
  const itemsRef = useRef([]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const showToast = (severity, msg) => {
    setToast({ open: true, severity, msg });
  };

  const fetchItems = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get('/products?limit=8');
      const mapped = res.data.products.map((product) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        stock: product.stock,
        inStock: product.stock > 0,
      }));
      setItems(mapped);
    } catch {
      setError('Failed to load inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const deleteItem = async (itemId) => {
    const previousItems = itemsRef.current;

    showToast('info', 'Syncing delete...');
    setItems((prev) => prev.filter((item) => item.id !== itemId));

    try {
      await api.delete(`/products/${itemId}`, { retry: 3 });
    } catch {
      setItems(previousItems);
      showToast('error', 'Sync failed. Restored item.');
    }
  };

  const toggleStock = async (itemId) => {
    const previousItems = itemsRef.current;
    const targetItem = previousItems.find((item) => item.id === itemId);

    if (!targetItem) {
      return;
    }

    const newInStock = !targetItem.inStock;
    const newStockValue = newInStock ? 10 : 0;

    showToast('info', 'Syncing stock update...');
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, inStock: newInStock, stock: newStockValue }
          : item,
      ),
    );

    try {
      await api.patch(
        `/products/${itemId}`,
        { stock: newStockValue },
        { retry: 3 },
      );
    } catch {
      setItems(previousItems);
      showToast('error', 'Sync failed. Restored item.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth="lg" mx="auto" p={4}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
        Optimistic Inventory Manager
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Button size="small" onClick={fetchItems} sx={{ ml: 2 }}>
            Retry
          </Button>
        </Alert>
      )}

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.id}>
            <Card>
              <CardMedia
                component="img"
                height="160"
                image={item.thumbnail}
                alt={item.title}
              />
              <CardContent>
                <Typography fontWeight="bold" noWrap>
                  {item.title}
                </Typography>
                <Typography color="primary" fontWeight="bold">
                  ${item.price}
                </Typography>
                <Chip
                  label={item.inStock ? 'In Stock' : 'Out of Stock'}
                  color={item.inStock ? 'success' : 'default'}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => toggleStock(item.id)}
                >
                  Toggle Stock
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => deleteItem(item.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={toast.severity} variant="filled">
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InventoryManager;
