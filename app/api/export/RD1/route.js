'use server'

import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { militaryRD1 } from '@/document_build/militaryRD1'
import { getID } from '@/lib/session'
const prisma = new PrismaClient()

export async function GET(req) {
  try {
    const id = await getID(req)
    if (!id) {
      return NextResponse.json({ error: 'Session is expired' }, { status: 401 })
    }



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
    return NextResponse.json({ error: 'An error occurred while fetching the profile' }, { status: 500 })
  }
}
