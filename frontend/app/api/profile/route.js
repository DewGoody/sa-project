'use server'

import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { cookies, headers } from "next/headers"
import { getID } from "../../../lib/session"

const prisma = new PrismaClient()

export async function GET(req) {
    try {
        const id = await getID(req);

        // If unauthorized, return error
        if (!id) {
            return NextResponse.json({ error: "ID is required or session is expired" }, { status: 401 });
        }

        // Fetch the profile using the ID
        const profile = await prisma.Student.findUnique({
            where: {
                id: id || ''
            }
        });

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while fetching the profile" }, { status: 500 });
    }
}


export async function POST(req, res) {
    
    
    try {
        const id = await getID(req)
        const body = await req.json()

        if (!body.id) {
            return NextResponse.json({ error: "ID is required" }, { status: 401 });
        }


        const profile = await prisma.Student.upsert({
            where: {
                id: id || body.id
            },
            update: {
                ...body
            },
            create: {
                ...body
            }
        })

        return NextResponse.json({ message: "Profile create successfully" })

    }
    catch (error) {
        console.log(error)
        return NextResponse.error(new Error("An error occurred while updating the profile"))
    }
}

export async function PUT(req) {



    try {
        const id = await getID(req); // Ensure this function returns an ID
        const body = await req.json();
        console.log('body',body.id);
        console.log('id', id)

        if (!id && !body.id) {
            return NextResponse.json({ error: "ID is required or session is expired" }, { status: 401 });
        }
        //const body = await req.json();
        const profile = await prisma.Student.upsert({
            where: {
                id: id || body.id // No need to await here
            },
            update: {
                ...body
            },
            create: {
                ...body,
                id: id || body.id // No need to await here
            }

        });

        return NextResponse.json({ message: "Profile edited successfully" });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: "An error occurred while updating the profile" }, { status: 500 });
    }
}
