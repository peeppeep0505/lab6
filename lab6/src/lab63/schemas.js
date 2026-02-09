import { z } from 'zod';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const RESERVED = ['admin', 'root', 'superuser'];

export const step1Schema = z.object({
  email: z.string().email('อีเมลไม่ถูกต้อง'),
  password: z.string().min(8, 'รหัสผ่านต้องอย่างน้อย 8 ตัวอักษร'),
  username: z
    .string()
    .min(3, 'Username ต้องอย่างน้อย 3 ตัวอักษร')
    .refine(
      async (val) => {
        // Async validation จำลองหน่วงเวลาเหมือนยิงไป DB
        await sleep(500);
        return !RESERVED.includes(String(val).trim().toLowerCase());
      },
      { message: 'Username นี้ถูกใช้ไปแล้ว' },
    ),
});

export const step2Schema = z
  .object({
    occupation: z.string().min(1, 'กรุณาเลือกอาชีพ'),
    company: z.string().min(1, 'กรุณากรอกบริษัท'),
    githubUrl: z.string().optional().or(z.literal('')),
  })
  .superRefine((val, ctx) => {
    const url = (val.githubUrl ?? '').trim();

    const isValidUrl = (s) => {
      try {
        new URL(s);
        return true;
      } catch {
        return false;
      }
    };

    // Conditional Validation: ถ้าเป็น Developer ต้องกรอก GitHub URL และต้องเป็น URL
    if (val.occupation === 'Developer') {
      if (!url) {
        ctx.addIssue({
          code: 'custom',
          path: ['githubUrl'],
          message: 'กรุณากรอก GitHub URL',
        });
        return;
      }
      if (!isValidUrl(url)) {
        ctx.addIssue({
          code: 'custom',
          path: ['githubUrl'],
          message: 'รูปแบบ URL ไม่ถูกต้อง',
        });
      }
      return;
    }

    // อาชีพอื่น: ไม่บังคับ แต่ถ้ากรอกมาแล้วต้องเป็น URL
    if (url && !isValidUrl(url)) {
      ctx.addIssue({
        code: 'custom',
        path: ['githubUrl'],
        message: 'รูปแบบ URL ไม่ถูกต้อง',
      });
    }
  });

export const stepSchemas = [step1Schema, step2Schema];

// default values รวม (ไว้ให้ reset/auto-fill)
export const defaultValues = {
  email: '',
  password: '',
  username: '',
  occupation: '',
  company: '',
  githubUrl: '',
};
