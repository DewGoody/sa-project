import { jwtVerify, SignJWT } from 'jose';
import { NextResponse } from 'next/server';

const key = new TextEncoder().encode(process.env.JWT_SECRET);

async function decrypt(input) {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ["HS256"],
        });
        
        let newToken;
        console.log(`Time left: ${(payload.exp * 1000 - Date.now()) / 1000}s`);
        
        // If the token is about to expire in less than 5 minutes, re-sign a new token
        if (payload.exp * 1000 - Date.now() < 300000) {
            console.log('Token is about to expire');
            newToken = await new SignJWT({ ...payload })
                .setProtectedHeader({ alg: 'HS256' })
                .setExpirationTime('15m') // Set new expiration time
                .sign(key);
        }

        return { payload, newToken };
    } catch (e) {
        console.error(e);
        return { payload: null, newToken: null };
    }
}

export async function getSession(req) {
    const session = req.cookies.get("token")?.value;
    if (!session) return { session: null, newToken: null };
    
    const { payload, newToken } = await decrypt(session);
    return { session: payload, newToken };
}

export async function getID(req) {
    const session = req.cookies.get("token")?.value;
    console.log('Session',session);
    if (!session) return null;
    
    const { payload } = await decrypt(session);
    console.log('Payload',payload.id);
    return payload.id;
}
