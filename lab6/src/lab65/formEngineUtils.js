import { z } from 'zod';

export function buildDefaultValues(fields) {
  const out = {};
  (fields || []).forEach((f) => {
    if (f.type === 'group' || f.type === 'section') {
      out[f.name] = buildDefaultValues(f.fields || []);
      return;
    }
    if (f.type === 'checkbox') {
      out[f.name] = false;
      return;
    }
    out[f.name] = '';
  });
  return out;
}

function baseSchemaForField(field) {
  if (field.type === 'checkbox') return z.boolean();
  return z.string();
}

function applyRules(field, schema) {
  const r = field.rules || {};

  if (r.required) {
    if (field.type === 'checkbox') {
      schema = schema.refine((v) => v === true, { message: 'Required' });
    } else {
      schema = schema.min(1, 'Required');
    }
  }

  // min/max: สำหรับ text/select คือความยาว string
  if (typeof r.min === 'number' && field.type !== 'checkbox') {
    schema = schema.min(r.min, `Min ${r.min}`);
  }
  if (typeof r.max === 'number' && field.type !== 'checkbox') {
    schema = schema.max(r.max, `Max ${r.max}`);
  }

  return schema;
}

export function generateZodSchema(fields) {
  const shape = {};

  (fields || []).forEach((field) => {
    if (field.type === 'group' || field.type === 'section') {
      shape[field.name] = generateZodSchema(field.fields || []);
      return;
    }

    let s = baseSchemaForField(field);
    s = applyRules(field, s);
    shape[field.name] = s;
  });

  // show_if: ถ้าถูกซ่อน -> ไม่ต้อง validate/required
  return z.object(shape).superRefine((data, ctx) => {
    (fields || []).forEach((field) => {
      if (field.type === 'group' || field.type === 'section') return;

      const showIf = field.show_if;
      if (!showIf) return;

      const actual = data?.[showIf.field];
      const shouldShow = actual === showIf.value;

      if (!shouldShow) return;

      if (field.rules?.required) {
        const v = data?.[field.name];
        const empty =
          field.type === 'checkbox'
            ? v !== true
            : (v ?? '').toString().trim().length === 0;

        if (empty) {
          ctx.addIssue({
            code: 'custom',
            path: [field.name],
            message: 'Required',
          });
        }
      }
    });
  });
}
