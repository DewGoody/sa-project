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
    //fetch data from database using route use another method such as axios
    // let data = await fetch(`${process.env.WEB_URL}/api/military`,{
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })
    // Forward the cookies from the request to the API
    const cookie = req.headers.get('token') || '';
    console.log("COOKIE:", cookie)
  
    let data = await fetch(`${process.env.WEB_URL}/api/military`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie // Forward cookies
      }
    })

    // convert data to json
    data = await data.json()
    console.log("DATA:", data)



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
