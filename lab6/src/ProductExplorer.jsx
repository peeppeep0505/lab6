import React, { useEffect, useState, useCallback } from 'react';
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

const ProductCardSkeleton = () => {
  return (
    <Card sx={{ borderRadius: 2 }}>
      <Skeleton variant="rectangular" height={160} />
      <CardContent sx={{ pt: 1.5 }}>
        <Skeleton variant="rounded" height={24} width={90} sx={{ mb: 1 }} />
        <Skeleton height={22} sx={{ mb: 0.5 }} />
        <Skeleton height={20} width="45%" />
      </CardContent>
    </Card>
  );
};

const ProductExplorer = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRetry = () => {
    fetchProducts(searchTerm.trim());
  };

  const fetchProducts = async (query = '') => {
    setLoading(true);
    setError(null);

    try {
      const url = query
        ? `https://dummyjson.com/products/search?q=${query}`
        : `https://dummyjson.com/products`;

      const res = await axios.get(url);
      setProducts(res.data.products);
    } catch {
      setError('Failed to fetch products. Please try again.');
      setProducts([]);
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

      {/* C4: Error State + Retry */}
      {/* C4: Error State + Retry */}
  {error && (
    <Alert
      severity="error"
      sx={{ mb: 3, alignItems: 'center' }}
      action={
        <Button
          size="small"
          variant="outlined"
          onClick={handleRetry}
          disabled={loading}
          sx={{ textTransform: 'none' }}
        >
          Retry
        </Button>
      }
    >
      {error}
    </Alert>
  )}

      {/* Product Grid */}
      <Grid container spacing={3}>
        {loading ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <Grid item xs={12} sm={6} md={3} key={`sk-${idx}`}>
              <ProductCardSkeleton />
            </Grid>
          ))
        ) : products.length > 0 ? (
          products.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.id}>
              <Card sx={{ borderRadius: 2, height: '100%' }}>
                <CardMedia
                  component="img"
                  height="160"
                  image={item.thumbnail}
                  alt={item.title}
                  loading="lazy"
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Chip label={item.category} size="small" sx={{ mb: 1 }} />
                  <Typography fontWeight="bold" noWrap title={item.title}>
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
          <Grid item xs={12}>
            <Box mt={6} textAlign="center">
              <Typography color="text.secondary">
                No products found for "{searchTerm}"
              </Typography>
              {searchTerm.trim() && (
                <Button sx={{ mt: 2 }} variant="outlined" onClick={() => setSearchTerm('')}>
                  Clear Search
                </Button>
              )}
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ProductExplorer;
