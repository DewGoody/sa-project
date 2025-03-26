'use server'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from "next/server"
import { getID, getIDbyToken } from "../../../lib/session"

const prisma = new PrismaClient()

export async function GET(req, res) {
    const cookie = req.headers.get('cookie') || '';
    try {
        // read cookie header
        
        const id =  await getID(req) || getIDbyToken(cookie)
        if (!id) {
            return NextResponse.json({ error: "ID is required or session is expired" }, { status: 401 });
        }

        // Fetch all related data in a single query
        const studentData = await prisma.Student.findFirst({
            where: { id },
            include: {
                reserve_info: true,
                training_record: true,
                military_course: true,
                Address: true,
                father_mother_info: true,
                parent_info: true,
            }
        });

        if (!studentData) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        const data = {
            student: {
                title: studentData.title || '',
                fnameTH: studentData.fnameTH || '',
                lnameTH: studentData.lnameTH || '',
                thai_id: studentData.thai_id || '',
                race: studentData.race || '',
                nationality: studentData.nationality || '',
                religion: studentData.religion || '',
                bd: studentData.bd || '',
            },
            reserver_info: studentData.reserve_info || null,
            training_record: studentData.training_record || null,
            military_course: studentData.military_course || null,
            DOPA_address: null,
            military_address: null,
            parent_info: studentData.parent_info || null,
            father_info: null,
            mother_info: null,
            mf_occupation: '',
        };

        // Handle addresses
        studentData.Address.forEach(i => {
            if (i.address_type == "DOPA_address") {
                data.DOPA_address = i
            } else if (i.address_type == "Military_address") {
                data.military_address = i
            }
        });

        // Handle father and mother info
        data.father_info = studentData.father_mother_info.find(i => i.relation == "father") || null;
        data.mother_info = studentData.father_mother_info.find(i => i.relation == "mother") || null;

        data.mf_occupation = data.father_info?.mf_occupation || data.mother_info?.mf_occupation || '';

        console.log("RD", data);
        const createRequest = await prisma.request.create({
            data: {
                type: "การสมัครนศท.รายใหม่และรายงานตัวนักศึกษาวิชาทหาร",
                status: "รอจองคิว",
                stu_id: id,
            }
        })    
        await prisma.military_info.update({
            where: {id: create.id},
            data: {req_id: createRequest.id}
        })
        return NextResponse.json(data);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "An error occurred while fetching the profile" }, { status: 500 });
    }
}
