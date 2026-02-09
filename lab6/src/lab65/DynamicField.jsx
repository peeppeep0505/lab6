import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  Box,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

const joinPath = (parent, name) => (parent ? `${parent}.${name}` : name);

const getNestedErrorMessage = (errors, path) => {
  const parts = path.split('.');
  let cur = errors;
  for (const p of parts) {
    cur = cur?.[p];
  }
  return cur?.message;
};

const DynamicField = ({ field, parentPath = '' }) => {
  const { register, control, formState } = useFormContext();
  const { errors } = formState;

  const fullName = joinPath(parentPath, field.name);

  // show_if support
  const showIf = field.show_if;
  const watchName = showIf ? joinPath(parentPath, showIf.field) : null;
  const watched = useWatch({ control, name: watchName });
  const shouldShow = showIf ? watched === showIf.value : true;

  if (!shouldShow) return null;

  // group/section (recursive)
  if (field.type === 'group' || field.type === 'section') {
    return (
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography fontWeight="bold" mb={1}>
          {field.label || field.name}
        </Typography>

        {(field.fields || []).map((child) => (
          <DynamicField key={child.name} field={child} parentPath={fullName} />
        ))}
      </Paper>
    );
  }

  const errMsg = getNestedErrorMessage(errors, fullName);

  if (field.type === 'checkbox') {
    return (
      <Box mb={2}>
        <FormControlLabel
          control={<Checkbox {...register(fullName)} />}
          label={field.label || field.name}
        />
        {errMsg && (
          <Typography variant="caption" color="error" display="block">
            {errMsg}
          </Typography>
        )}
      </Box>
    );
  }

  if (field.type === 'select') {
    return (
      <Box mb={2}>
        <TextField
          select
          fullWidth
          label={field.label || field.name}
          defaultValue=""
          {...register(fullName)}
          error={!!errMsg}
          helperText={errMsg || ' '}
        >
          <MenuItem value="">Select...</MenuItem>
          {(field.options || []).map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    );
  }

  // default: text
  return (
    <Box mb={2}>
      <TextField
        fullWidth
        label={field.label || field.name}
        {...register(fullName)}
        error={!!errMsg}
        helperText={errMsg || ' '}
      />
    </Box>
  );
};

export default DynamicField;
