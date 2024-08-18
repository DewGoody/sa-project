import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './lib/session';
import { setCookie, removeCookie } from 'cookies-next';

const protectedRoutes = ['/home', '/profile', '/rordor', '/api'];
const publicRoutes = []; // Define your public routes if needed

export default async function middleware(req) {
    const path = req.nextUrl.pathname;
    console.log(`Request path: ${path}`);

    if (path === '/callback') {
        console.log('Bypassing middleware for /callback');
        return NextResponse.next();
    }

    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    console.log(`Is Protected Route: ${isProtectedRoute}`);

    const { session, newToken } = await getSession(req);
    const id = session?.id;

    console.log(`Session ID: ${id}`);
    console.log(`New Token: ${newToken}`);

    if (newToken) {
        const response = NextResponse.next();
        response.cookies.set('token', newToken, {
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
        });
        console.log('New token set in cookie.');
        return response;
    }

    if (!session) {
        console.log('No session found, redirecting to login...');
        return NextResponse.redirect('https://cunex-auth-uat.azurewebsites.net/?partnerid=cuserv');
    }

    if (isProtectedRoute && !id) {
        console.log('No session ID found for protected route, redirecting...');
        removeCookie('token');
        return NextResponse.redirect('https://cunex-auth-uat.azurewebsites.net/?partnerid=cuserv');
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
