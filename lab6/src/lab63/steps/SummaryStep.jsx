import React from 'react';
import { Alert, Box, Divider, Typography } from '@mui/material';

const SummaryStep = ({ data, serverResponse }) => {
  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Step 3: Summary & Confirm
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <pre style={{ fontSize: 13, margin: 0, whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(data, null, 2)}
      </pre>

      {serverResponse && (
        <Alert severity="success" sx={{ mt: 2 }}>
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
