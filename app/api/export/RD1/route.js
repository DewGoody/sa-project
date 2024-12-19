'use server'

import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { militaryRD1 } from '../../../../document_build/militaryRD1'
import { getMilitaryInfo } from '../../../../lib/prisma/prisma'
import { getID } from '../../../../lib/session'

export async function GET(req) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const id = await getID(req) || getIDbyToken(cookie);
    if (!id) {
      return NextResponse.json({ error: "ID is required or session is expired" }, { status: 401 });
    }
    const studentData = await getMilitaryInfo(id);
    if (!studentData) {
      return NextResponse.json({ error: "Student data not found" }, { status: 404 });
    }
    const pdfBytes = await militaryRD1(studentData);

    const response = new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=RD1.pdf',
      },
    })
    return response
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred while updating the profile" }, { status: 500 });
  }
}