'use server'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from "next/server"
import { getID, getIDbyToken } from "../../../lib/session"
import { getMilitaryInfo } from "../../../lib/prisma/prisma"
import { convertBigIntToString } from '../../../utills/convertBigInt'

const prisma = new PrismaClient()

export async function GET(req, res) {
    const formId = req.nextUrl.searchParams.get('id')
    try {
        let id = 0
        
        if (formId == 0) {
            id = await getID(req)
            console.log("in frist");
        } else if(formId !== NaN){
            console.log("in else");
            const idbefore = await prisma.rD_info.findFirst({
                where: { req_id: parseInt(formId) }
            })
            id = idbefore.student_id
        }
        if (!id) {
            return NextResponse.json({ error: "ID is required or session is expired" }, { status: 401 });
        }

        const data = await getMilitaryInfo(id);

        const serializedData = JSON.parse(
            JSON.stringify(data, (key, value) =>
                typeof value === "bigint" ? value.toString() : value
            )
        );

        return NextResponse.json(serializedData);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while fetching the profile" }, { status: 500 });
    }
}

export async function PUT(req, res) {
    console.log();

    try {
        let id = 0
        const formId = req.nextUrl.searchParams.get('id')
        if (formId == 0) {
            id = await getID(req)
            console.log("in frist");
        } else if(formId !== NaN){
            console.log("in else");
            const idbefore = await prisma.rD_info.findFirst({
                where: { req_id: parseInt(formId) }
            })
            id = idbefore.student_id
        }
        if (!id) {
            return NextResponse.json({ error: "ID is required or session is expired" }, { status: 401 });
        }

        const {
            guardian_info,
            rD_info,
            father_mother_info,
            student
        } = await req.json();
        console.log("fdljsgjkhbfsdalkfghhjsdfghjklkjhgfdsasdfdsasdfghjkjhgfdsasdfghjkjhgfdsdfghj" , student);
        

        let { year, thai_id, phone_num, tel_num, personal_email, race, religion, nationality } = await student;

        // Upsert military information
        if (student) {
            await prisma.Student.update({
                where: { id },
                data: {
                    year,
                    thai_id,
                    phone_num,
                    tel_num,
                    personal_email,
                    race,
                    religion,
                    nationality
                }
            });
        }

        //console.log(addresses.Military_address);

        const RD_info = await prisma.rD_info.upsert({
            where: {student_id: id },
            update: { ...rD_info },
            create: { ...rD_info }
        });


        

        if (father_mother_info?.father) {
            let father = { ...father_mother_info.father };
            delete father.id; // Ensure you are not passing an id field if it's not part of the schema
            await prisma.father_mother_info.upsert({
                where: { id_relation: { id: id, relation: "father" } },
                update: { ...father },
                create: { relation: "father", ...father, Student: { connect: { id: id } } }
            });
        }

        if (father_mother_info?.mother) {
            let mother = { ...father_mother_info.mother };
            delete mother.id; // Ensure you are not passing an id field if it's not part of the schema
            await prisma.father_mother_info.upsert({
                where: { id_relation: { id: id, relation: "mother" } },
                update: { ...mother },
                create: { relation: "mother", ...mother, Student: { connect: { id: id } } }
            });
        }

        if (guardian_info) {
            let guardian = { ...guardian_info };
            delete guardian.id; // Ensure you are not passing an id field if it's not part of the schema
            await prisma.guardian_info.upsert({
                where: { id },
                update: { ...guardian },
                create: { id, ...guardian }
            });
        }

        return NextResponse.json({ id : convertBigIntToString(RD_info.id), status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while updating the profile" }, { status: 500 });
    }
}
