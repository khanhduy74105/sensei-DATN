export const getAppUrl = () => {
  // Server-side: check env
  if (process.env.VERCEL_URL) {
    return `https://sensei-datn-lmae.vercel.app`;
  }
  
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};