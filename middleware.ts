import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, request) => {
  // Only block API routes accessed directly from browser
  if (request.nextUrl.pathname.startsWith('/api')) {
    const referer = request.headers.get('referer');
    const isDirectAccess = !referer || !referer.includes(request.headers.get('host') || '');
    
    if (isDirectAccess) {
      return NextResponse.json({ error: 'Direct API access not allowed' }, { status: 403 });
    }
  }

  if (!isPublicRoute(request)) {
    await auth.protect()
  }

  (auth:any, req: any) => {
    if (auth.userId && auth.isPublicRoute) {
      let path = "/select-org"

      if (auth.orgId) {
        path = `/organizations/${auth.orgId}`
      }

      const orgSelection = new URL(path, req.url);
      return NextResponse.redirect(orgSelection);
    }

    if (!auth.userId) {
      return NextResponse.redirect("/sign-in");
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/api/:path*',  // Explicitly match all API routes
  ],
  publicRoutes: [
    "/",
    "/sign-in",
    "/sign-up",
  ],
}
