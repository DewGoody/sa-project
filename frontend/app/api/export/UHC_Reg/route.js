
'use server'

import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { getID } from '../../../../lib/session'
// not implemented yet
import { uhc } from '../../../../document_build/uhc'
//import { militaryRD2 } from '@/document_build/militaryRD2'

const prisma = new PrismaClient()

export default async function GET(req) {
  try {
    let id = 0
    const formId = req.nextUrl.searchParams.get('id')
    // console.log("export pdf",formId);
    
    if (formId == 0) {
      id = await getID(req)
      console.log("in frist");
    } else {
      console.log("in else");
      const idbefore = await prisma.uHC_request.findFirst({
        where: { id: parseInt(formId) }
      })
      id = idbefore.student_id
    }
    if (!id) {
      return NextResponse.json({ error: 'Session is expired' }, { status: 401 })
    }
    const UHC_reg_info = await prisma.UHC_reg_info.findFirst({
      where: {
        id: id
      }
    })
    const DOPA_address = await prisma.address.findFirst({
      where: {
        id: id,
        address_type: "DOPA_address"
      }
    })
    const Student = await prisma.student.findFirst({
      where: {
        id: id
      }
    })
    const data = {
      Student: Student,
      UHC_reg_info: UHC_reg_info ? UHC_reg_info : {
        id: id,
        last_update: null,
        smart_card_issured: null,
        smart_card_expired: null,
        status_before_reg: null,
        status_info: null,
        frequence_uses: null,
        is_been: null,
        is_congenital_disease: null,
      },
      DOPA_address: DOPA_address ? DOPA_address : {
        id: id,
        address_type: "DOPA_address",
        created_at: null,
        house_num: null,
        house_moo: null,
        soi: null,
        street: null,
        subdistrict: null,
        district: null,
        province: null,
        postal_code: null,
        address_id: null
      },
    }
    console.log(data);
    
    const pdfBytes = await uhc(data)

    const response = new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=UHC_reg.pdf',
        'X-Student-ID': id,
      },
    })
 
    return response 
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'An error occurred while fetching the profile' }, { status: 500 })
  }
}
