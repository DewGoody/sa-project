'use server'

import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { getID } from '../../../../lib/session'
// not implemented yet
import { uhc } from '../../../../document_build/uhc'
//import { militaryRD2 } from '@/document_build/militaryRD2'

const prisma = new PrismaClient()

export async function GET(req) {
  try {
    const id = await getID(req)
    if (!id) {
      return NextResponse.json({ error: 'Session is expired' }, { status: 401 })
    }
    let data = await fetch(`${process.env.WEB_URL}/api/UHC`, {
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
    return NextResponse.json({ error: 'An error occurred while fetching the profile' }, { status: 500 })
  }
}