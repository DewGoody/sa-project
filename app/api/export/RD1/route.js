'use server'

import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { militaryRD1 } from '@/document_build/militaryRD1'

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const data = await req.json()
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
