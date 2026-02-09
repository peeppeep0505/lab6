import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import {
  Box,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Alert,
  Button,
  Skeleton,
  CircularProgress,
} from '@mui/material';

const ProductExplorer = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async (query = '') => {
    setLoading(true);
    setError(null);

    try {
      const url = query
        ? `https://dummyjson.com/products/search?q=${query}`
        : `https://dummyjson.com/products`;

      const res = await axios.get(url);
      setProducts(res.data.products);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function (600ms)
  const debouncedSearch = useCallback(
    debounce((value) => {
      fetchProducts(value);
    }, 600),
    [],
  );

  // Effect เมื่อ searchTerm เปลี่ยน
  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      fetchProducts();
    }

    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  return (
    <Box maxWidth="lg" mx="auto" p={4}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
        Product Explorer
      </Typography>

      {/* Search Input */}
      <Box mb={4} position="relative">
        <TextField
          fullWidth
          label="Search products (e.g. iPhone, Samsung...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {loading && (
          <CircularProgress
            size={24}
            sx={{ position: 'absolute', top: '50%', right: 16, mt: '-12px' }}
          />
        )}
      </Box>

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Button
            size="small"
            onClick={() => fetchProducts(searchTerm)}
            sx={{ ml: 2 }}
          >
            Retry
          </Button>
        </Alert>
      )}

      {/* Product Grid */}
      <Grid container spacing={3}>
        {loading ? (
          // Skeleton Loading
          Array.from(new Array(8)).map((_, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Skeleton variant="rectangular" height={200} />
              <Skeleton />
              <Skeleton width="60%" />
            </Grid>
          ))
        ) : products.length > 0 ? (
          products.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="160"
                  image={item.thumbnail}
                  alt={item.title}
                />
                <CardContent>
                  <Chip label={item.category} size="small" sx={{ mb: 1 }} />
                  <Typography fontWeight="bold" noWrap>
                    {item.title}
                  </Typography>
                  <Typography color="primary" fontWeight="bold">
                    ${item.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          // Empty State
          <Grid item xs={12}>
            <Typography textAlign="center" color="text.secondary" mt={6}>
              No products found for "{searchTerm}"
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ProductExplorer;
