// ปรับ JSON ตรงนี้ได้เลย (No Code Change Test)
export const sampleSchema = {
  formTitle: 'User Configuration',
  fields: [
    {
      name: 'username',
      type: 'text',
      label: 'Username',
      rules: { required: true, min: 15 },
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      options: ['guest', 'admin'],
      rules: { required: true },
    },
    {
      name: 'admin_code',
      type: 'text',
      label: 'Admin Secret Code',
      show_if: { field: 'role', value: 'admin' },
      rules: { required: true, min: 3 },
    },

    {
      name: 'profile',
      type: 'group',
      label: 'Profile',
      fields: [
        {
          name: 'age',
          type: 'text',
          label: 'Age',
          rules: { required: true, min: 1 },
        },
        {
          name: 'contact',
          type: 'group',
          label: 'Contact',
          fields: [
            {
              name: 'email',
              type: 'text',
              label: 'Email',
              rules: { required: true },
            },
            { name: 'phone', type: 'text', label: 'Phone', rules: { min: 10 } },
            { name: 'line', type: 'text', label: 'Line', rules: { min: 10 } },
          ],
        },
      ],
    },

    {
      name: 'accept',
      type: 'checkbox',
      label: 'Accept Terms',
      rules: { required: true },
    },
  ],
};
