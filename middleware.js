import { NextRequest, NextResponse } from 'next/server'
import { getSession } from './lib/session'
import { cookie } from 'request';

// Specify protected and public routes
const protectedRoutes = ['/home','/profile', '/rordor', '/api'];

export default async function middleware(req) {
    
    const path = req.nextUrl.pathname;
    console.log(path);

    // Bypass middleware for /callback route
    if (path === '/callback') {
        return NextResponse.next();
    }
    
    console.log('Protected:', protectedRoutes.includes(path));

    const isProtectedRoute = protectedRoutes.includes(path);
    console.log('Protected:', isProtectedRoute);
    const isPublicRoute = publicRoutes.includes(path);

    // Pass the req object to getSession

    const { session, newToken } = await getSession(req);
    const id = session?.id;

    if (newToken) {
        // Set the new token as a cookie
        cookie.set('token', newToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',});
        }
    

    if (!session) {
        return NextResponse.redirect('https://cunex-auth-uat.azurewebsites.net/?partnerid=cuserv');
    }


    


    if (isProtectedRoute && !id) {
        // remove token cookie
        cookie.remove('token');
        return NextResponse.redirect('https://cunex-auth-uat.azurewebsites.net/?partnerid=cuserv');
    }

    return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
