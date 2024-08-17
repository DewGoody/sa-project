'use server'

import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { cookies, headers } from "next/headers"
import { getID } from "../../../lib/session"

const prisma = new PrismaClient()

export async function GET(req, res) { // in sameple code, it

    try {

        // Get token from cookie with Next.js API
        const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};

        // Example: Get a specific cookie named "token"
        const token = cookies.token || null;

        const profiles = await prisma.Student.findUnique({
            where: {
                id:id
            }
        })

        return NextResponse.json(profiles)
    }
    catch (error) {
        console.log(error)
        return NextResponse.error(new Error("An error occurred while fetching the profile"))
    }
}


export async function POST(req, res) {
    const body = await req.json()
    try {
        const id =  await getID(req)


        const profile = await prisma.Student.upsert({
            where: {
                id: id
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
    const id = await getID(req); // Ensure this function returns an ID
    const body = await req.json();

    console.log('PUT Request Body:', body);
    console.log('Extracted ID:', id);

    try {
        const profile = await prisma.Student.update({
            where: {
                id: id || body.id // No need to await here
            },
            data: {
                ...body
            }
        });

        return NextResponse.json({ message: "Profile edited successfully" });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.error(new Error("An error occurred while updating the profile"));
    }
}
