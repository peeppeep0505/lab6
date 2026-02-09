// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from 'react';

// const STORAGE_KEY = 'lab63_registration_state_v1';

// const FormContext = createContext(null);

// export const useLab63 = () => {
//   const ctx = useContext(FormContext);
//   if (!ctx)
//     throw new Error('useLab63 must be used inside MultiStepFormProvider');
//   return ctx;
// };

// export const MultiStepFormProvider = ({ children }) => {
//   const [step, setStep] = useState(1); // 1..3
//   const [formData, setFormData] = useState({});

//   // Load persisted state
//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem(STORAGE_KEY);
//       if (!raw) return;
//       const parsed = JSON.parse(raw);
//       if (parsed?.step) setStep(parsed.step);
//       if (parsed?.formData) setFormData(parsed.formData);
//     } catch {
//       // ignore
//     }
//   }, []);

//   // Persist state on change (real-time)
//   useEffect(() => {
//     try {
//       localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, formData }));
//     } catch {
//       // ignore
//     }
//   }, [step, formData]);

//   const clearAll = () => {
//     setStep(1);
//     setFormData({});
//     try {
//       localStorage.removeItem(STORAGE_KEY);
//     } catch {
//       // ignore
//     }
//   };

//   const value = useMemo(
//     () => ({ step, setStep, formData, setFormData, clearAll }),
//     [step, formData],
//   );

//   return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
// };

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const STORAGE_KEY = 'lab63_registration_state_v1';

const FormContext = createContext(null);

export const useLab63 = () => {
  const ctx = useContext(FormContext);
  if (!ctx)
    throw new Error('useLab63 must be used inside MultiStepFormProvider');
  return ctx;
};

const loadInitialState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { step: 1, formData: {} };
    const parsed = JSON.parse(raw);
    return {
      step: parsed?.step ?? 1,
      formData: parsed?.formData ?? {},
    };
  } catch {
    return { step: 1, formData: {} };
  }
};

export const MultiStepFormProvider = ({ children }) => {
  // ✅ โหลดจาก localStorage ตั้งแต่ initial render (กัน watch ทับค่าเดิม)
  const initial = loadInitialState();

  const [step, setStep] = useState(initial.step);
  const [formData, setFormData] = useState(initial.formData);

  // Persist state on change (real-time)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, formData }));
    } catch {
      // ignore
    }
  }, [step, formData]);

  const clearAll = () => {
    setStep(1);
    setFormData({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const value = useMemo(
    () => ({ step, setStep, formData, setFormData, clearAll }),
    [step, formData],
  );

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};
