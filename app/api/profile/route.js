'use server'

import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { headers } from "next/headers"

const prisma = new PrismaClient()

export async function GET(req, res) { // in sameple code, it

    try {

        // Get token from request headers

        // Assume token is valid and get user ID from token

        // Assume user ID is 6512345678
        const id = 6512345678
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
        // Get token from request headers


        // Assume token is valid and get user ID from token


        // Assume user ID is 6512345678
        const id = 6512345678


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

export async function PUT(req, res) {
    const body = await req.json()
    try {
        // Get token from request headers

        // Assume token is valid and get user ID from token

        // Assume user ID is 6512345678
        const id = 6512345678

        const profile = await prisma.Student.update({
            where: {
                id: id
            },
            data: {
                ...body
            }
        })

        return NextResponse.json({ message: "Profile edited successfully" })

    }
    catch (error) {
        console.log(error)
        return NextResponse.error(new Error("An error occurred while creating the profile"))
    }
}