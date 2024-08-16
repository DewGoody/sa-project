'use server'

import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
// not implemented yet
import { militaryRD2 } from '@/document_build/militaryRD1'
//import { militaryRD2 } from '@/document_build/militaryRD2'

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const data = await req.json()
    const pdfBytes = await militaryRD2(data)

    const response = new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=RD2.pdf',
      },
    })
    return response
  } catch (error) {
    console.error(error)
    return NextResponse.error(new Error('An error occurred while fetching the profile'))
  }
}
