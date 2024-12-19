'use server'

import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
// not implemented yet
import { militaryRD2 } from '../../../../document_build/militaryRD2'
import { getMilitaryInfo } from '../../../../lib/prisma/prisma'
import { getID } from '../../../../lib/session'


const prisma = new PrismaClient()

export async function GET(req) {
  try {

    const cookie = req.headers.get('cookie') || '';
    const id = await getID(req) || getIDbyToken(cookie);
    if (!id) {
      return NextResponse.json({ error: "ID is required or session is expired" }, { status: 401 });
    }
    const data = await getMilitaryInfo(id);
    if (!data) {
      return NextResponse.json({ error: "Student data not found" }, { status: 404 });
    }

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