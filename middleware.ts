import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const adminRoutes = createRouteMatcher(['/admin(.*)?']);
const userRoutes = createRouteMatcher([
  '/dashboard(.*)?',
  '/resume(.*)?',
  '/ai-cover-letter(.*)?',
  '/interview(.*)?',
  '/talk(.*)?',
  '/onboarding(.*)?',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Chưa login → redirect sign in
  if (!userId) {
    if (adminRoutes(req) || userRoutes(req)) {
      const { redirectToSignIn } = await auth();
      return redirectToSignIn();
    }
    return NextResponse.next();
  }

  // Không check role ở đây nữa → xử lý ở Server Component
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
