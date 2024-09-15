'use server'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from "next/server"
import { getID, getIDbyToken } from "../../../lib/session"

const prisma = new PrismaClient()

export async function GET(req, res) {
    try {
        // read cookie header
        const cookie = req.headers.get('cookie') || '';
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

        console.log("STUDENT", studentData);

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
        return NextResponse.json(data);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "An error occurred while fetching the profile" }, { status: 500 });
    }
}


export async function PUT(req, res) {
    
    try {

        const id =  await getID(req)
        const body = await req.json();

        if (!id) {
            return NextResponse.json({ error: "ID is required or session is expired" }, { status: 401 });
        }

        if (body.student) {
            console.log(body.student);
            const student = await prisma.Student.update({
            where: {
                id: id,
            },
            data: {
                id: id,
                ...body.student
            },
            });
        }


        if (body.reserve_info) {
            const reserve_info = await prisma.reserve_info.upsert({
                where: {
                    id: id,
                },
                update: {
                    ...body.reserve_info,
                },
                create: {
                    ...body.reserve_info,
                },
            });
        }

        if (body.training_record && body.training_record.length > 0) {
            for (const record of body.training_record) {
                await prisma.training_record.upsert({
                    where: {
                        id_year: { // Use compound unique constraint
                            id: id,
                            year: record.year, // Assuming `year` is part of the unique key
                        },
                    },
                    update: {
                        ...record, // Update fields in `training_record`
                    },
                    create: {
                        ...record, // Create new `training_record`
                        id: id,
                    },
                });
            }
        }
        

        if (body.military_course) {
            const military_course = await prisma.military_course.upsert({
                where: {
                    id: id,
                },
                update: {
                    ...body.military_course,
                },
                create: {
                    ...body.military_course,
                },
            });
        }

        console.log(body.DOPA_address);
        if (body.DOPA_address) {

            await prisma.Address.upsert({
                where: {
                    id_address_type: {
                        id: id,
                        address_type: body.DOPA_address.address_type,
                    },
                },
                update: {
                    ...body.DOPA_address,
                },
                create: {
                    address_type: body.DOPA_address.address_type,
                    ...body.DOPA_address,
                },
            })
        }

        if (body.military_address) {
            await prisma.Address.upsert({
              where: {
                id_address_type: {
                  id: id,
                  address_type: "Military_address",
                },
              },
              update: {
                ...body.military_address,
              },
              create: {
                id: id,
                ...body.military_address,
                address_type: body.military_address.address_type,
              },
            })
          }

        if (body.parent_info) {
            let parent_info = body.parent_info;
            delete parent_info.id;
            const _parent_info = await prisma.parent_info.upsert({
                where: {
                    id: id,
                },
                update: {
                    ...body.parent_info,
                },
                create: {
                    ...body.parent_info,
                    Student: {
                        connect: { id: id }
                    },
                },
            });
        }
        // BUG:
        console.log(body.father_info);
        if (body.father_info) {
            let father_info = body.father_info;
            delete father_info.id;
        
            await prisma.father_mother_info.upsert({
                where: {
                    id_relation: {
                        id: id,  // Student ID
                        relation: "father",  // Parent relation
                    },
                },
                update: {
                    ...father_info,  // Update with new data
                },
                create: {
                    relation: "father",  // Parent relation
                    ...father_info,  // Create if it doesn't exist
                    
                    
                    Student: {
                        connect: { id: id }
                    }
                },
            });
        }
        
        
        if (body.mother_info) {
            let mother_info = body.mother_info;
            delete mother_info.id;
        
            const _mother_info = await prisma.father_mother_info.upsert({
                where: {
                    id_relation: {
                        id: id, // Unique student ID
                        relation: "mother", // The relation to the student
                    },
                },
                update: {
                    ...mother_info, // Update with new data
                },
                create: {
                    ...mother_info, // Create if it doesn't exist
                    relation: "mother", // Parent relation
                    Student: {
                        connect: { id: id }
                    }
                },
            });
        }
        
        

        return NextResponse.json({ message: "Profile updated successfully" });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "An error occurred while updating the profile" }, { status: 500 });
    }
}