export const getAppUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: dùng window.location
    return window.location.origin;
  }
  
  // Server-side: check env
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};