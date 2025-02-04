'use server'

import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { militaryRD1 } from '../../../../document_build/militaryRD1'
import { getMilitaryInfo } from '../../../../lib/prisma/prisma'
import { getID } from '../../../../lib/session'

export async function GET(req) {
  const prisma = new PrismaClient()
  // const cookie = req.headers.get('cookie') || '';
  try {
    let id = 0
    const formId = req.nextUrl.searchParams.get('id')
    if (formId == 0) {
      id = await getID(req)
      console.log("in frist");
    } else {
      console.log("in else");
      const idbefore = await prisma.rD_info.findFirst({
        where: { id: parseInt(formId) }
      })
      id = idbefore.student_id
    }
    const RD_info = await prisma.rD_info.findFirst({
      where :{ req_id : formId}
    })
    const data = RD_info.json_history
    // console.log('test data export ',data);
    

    if (!data) {
      return NextResponse.json({ error: "Student data not found" }, { status: 404 });
    }
    const pdfBytes = await militaryRD1(data);

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