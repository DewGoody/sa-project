import { jwtVerify, SignJWT } from 'jose';
import { NextResponse } from 'next/server';

const key = new TextEncoder().encode(process.env.JWT_SECRET);
const JWT_TIMEOUT = process.env.JWT_TIMEOUT;


async function decrypt(input) {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ["HS256"],
        });
        
        let newToken;
        // remaining time in seconds
        if (payload.exp * 1000 - Date.now() < process.env.JWT_REFRESH) {
            newToken = await new SignJWT({ id: payload.id })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setIssuer(`${process.env.WEB_URL}`)
                .setExpirationTime(JWT_TIMEOUT) // Set new expiration time to 15 minutes
                .sign(key);
        }
        console.log('New Token:', newToken);

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
