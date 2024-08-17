'use server'

import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
// not implemented yet
import { uhc } from '@/document_build/uhc.js'
//import { militaryRD2 } from '@/document_build/militaryRD2'

const prisma = new PrismaClient()

export async function GET() {
  try {
    let data = await fetch("http://localhost:3000/api/UHC", {
      method: "GET",
      headers: {
      "Content-Type": "application/json",
      },
    })
    data = await data.json()
    const pdfBytes = await uhc(data)

    const response = new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=UHC_reg.pdf',
      },
    })
    return response
  } catch (error) {
    console.error(error)
    return NextResponse.error(new Error('An error occurred while fetching the profile'))
  }
}