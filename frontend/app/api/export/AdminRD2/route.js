'use server'


import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
// not implemented yet
import { militaryRD2 } from '../../../../document_build/militaryRD2'
import { getMilitaryInfo } from '../../../../lib/prisma/prisma'
import { getID } from '../../../../lib/session'


const prisma = new PrismaClient()


export default async function GET(req) {
  try {

    const cookie = req.headers.get('cookie') || '';
    let id = 0
    const formId = req.nextUrl.searchParams.get('id')
    if (formId == 0) {
      id = await getID(req) || getIDbyToken(cookie);
    } else {
      // console.log("in else");
      const idbefore = await prisma.rD_info.findFirst({
        where: { req_id: parseInt(formId) }
      })
      id = idbefore.student_id
    }
    // const data = await getMilitaryInfo(id);
    const RD_info = await prisma.rD_info.findFirst({
      where :{ req_id : formId}
    })
    const data = RD_info.json_history
    // console.log('test data export ',data);
    
    if (!data) {
      return NextResponse.json({ error: "Student data not found" }, { status: 404 });
    }
    // console.log("kdsnflksdmfksldmfkldsmfkdsmfkldsmfkldsmfkldslfksdkfjsdkflsdjf");
    
    const pdfBytes = await militaryRD2(data)
    console.log("test pdf export",pdfBytes);
    

    const response = new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=RD2.pdf',
      },
    })
    return response
    // const response = new NextResponse(data)
    // return response
  } catch (error) {
    console.error(error)
    return NextResponse.error(new Error('An error occurred while fetching the profile'))
  }
}