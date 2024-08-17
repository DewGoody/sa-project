import { NextRequest, NextResponse } from 'next/server'
import { getSession } from './lib/session'

// Specify protected and public routes
const protectedRoutes = ['/home','/profile', '/rordor'];
const publicRoutes = ['/login', '/signup', '/'];

export default async function middleware(req) {
    const path = req.nextUrl.pathname;
    console.log(path);

    // Bypass middleware for /callback route
    if (path === '/callback') {
        return NextResponse.next();
    }
    
    console.log('Protected:', protectedRoutes.includes(path));


    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    // Pass the req object to getSession

    const { session, newToken } = await getSession(req);
    const id = session?.id;
  

    if (!session) {
        return NextResponse.redirect(new URL('https://cunex-auth-uat.azurewebsites.net/?partnerid=cuserv', req.nextUrl));
    }


    


    if (isProtectedRoute && !id) {
        return NextResponse.redirect(new URL('/', req.nextUrl));
    }

    if (isPublicRoute && id && !req.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    }

    return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
