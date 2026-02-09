import React from 'react';
import { Alert, Box, Divider, Typography } from '@mui/material';

const SummaryStep = ({ data, serverResponse }) => {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        background:
          'linear-gradient(180deg, rgba(156,39,176,0.08), rgba(156,39,176,0) 45%)',
      }}
    >
      <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2 }}>
        Review
      </Typography>
      <Typography variant="h6" fontWeight={800} sx={{ mt: 0.5, mb: 1.5 }}>
        Step 3: Summary & Confirm
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'rgba(255,255,255,0.7)',
          border: '1px dashed',
          borderColor: 'divider',
        }}
      >
        <pre style={{ fontSize: 13, margin: 0, whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </Box>

      {serverResponse && (
        <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
          <Typography variant="subtitle2">Server Response</Typography>
          <pre style={{ fontSize: 12, margin: 0 }}>
            {JSON.stringify(serverResponse, null, 2)}
          </pre>
        </Alert>
      )}
    </Box>
  );
};

export default SummaryStep;
