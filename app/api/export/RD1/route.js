'use server'

import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { militaryRD1 } from '@/document_build/militaryRD1'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // get token from request headers
    //const token = req.headers.get('Authorization')

    // Assume token is valid and get user ID from token
    const id = 6512345678
    // assume token

    // fetch data from database using route
    let data = await fetch("http://localhost:3000/api/military", {
      method: "GET",
      headers: {
      "Content-Type": "application/json",
      },
    })
    data = await data.json()

  
    const pdfBytes = await militaryRD1(data)

    const response = new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=RD1.pdf',
      },
    })
    return response
  } catch (error) {
    console.error(error)
    return NextResponse.error(new Error('An error occurred while fetching the profile'))
  }
}
