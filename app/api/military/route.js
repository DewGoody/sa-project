'use server'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(req, res) {

    // Get token from request headers

    // Assume token is valid and get user ID from token

    // Assume user ID is 6512345678
    const id = 6512345678

    let data = {
        student: null,
        reserver_info: null,
        training_record: null,
        military_course: null,
        DOPA_address: null,
        military_address: null,
        parent_info: null,
        father_info: null,
        mother_info: null,
        mf_occupation: '',
    }

    const student = await prisma.Student.findFirst({
        where: {
            id: id
        }
    })
    if (student) {
        data.student = {
            title: student.title || '',
            fnameTH: student.fnameTH || '',
            lnameTH: student.lnameTH || '',
            thai_id: student.thai_id || '',
            race: student.race || '',
            nationality: student.nationality || '',
            religion: student.religion || '',
            bd: student.bd || '',
        }
    }

    const reserver_info = await prisma.reserve_info.findFirst({
        where: {
            id: id
        }
    })
    const training_record = await prisma.training_record.findFirst({
        where: {
            id: id
        }
    })
    const military_course = await prisma.military_course.findFirst({
        where: {
            id: id
        }
    })
    data.reserver_info = reserver_info
    data.training_record = training_record
    data.military_course = military_course

    const address = await prisma.Address.findMany({
        where: {
            id: id
        }
    })
    address.forEach(i => {
        if (i.address_type == "DOPA_address") {
            data.DOPA_address = i
        } else if (i.address_type == "Military_address") {
            data.military_address = i
        }
    }
    )
    // for (i in address) {
    //     if(i.address_type == "Current_address") {
    //         data.current_address = i
    //     } else if(i.address_type == "DOPA_address") {
    //         data.house_address = i
    //     }
    // }

    const father_mother_info = await prisma.father_mother_info.findMany({
        where: {
            id: id,
        }
    })
    data.father_info = father_mother_info.find(i => i.relation == "father")
    data.mother_info = father_mother_info.find(i => i.relation == "mother")

    data.mf_occupation = data.father_info.mf_occupation || data.mother_info.mf_occupation || ''

    const parent_info = await prisma.parent_info.findFirst({
        where: {
            id: id
        }
    })
    data.parent_info = parent_info



    return NextResponse.json(data)
}

export async function PUT(req, res) {
    const body = await req.json();
    console.log(body);

    try {
        const id = 6512345678;

        if (body.student) {
            const student = await prisma.Student.upsert({
                where: {
                    id: id,
                },
                update: {
                    ...body.student,
                },
                create: {
                    ...body.student,
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

        if (body.training_record) {
            const training_record = await prisma.training_record.upsert({
                where: {
                    id: id,
                },
                update: {
                    ...body.training_record,
                },
                create: {
                    ...body.training_record,
                },
            });
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
                    Student: {
                        connect: { id: id }
                    },
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
                    id: id,
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
            const parent_info = await prisma.parent_info.upsert({
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
        if (body.father_info) {
            const father_info = await prisma.father_mother_info.upsert({
                where: {
                    id_relation: {
                        id: id,
                        relation: "father",
                    },
                },
                update: {
                    ...body.father_info,
                },
                create: {
                    ...body.father_info,
                    Student: {
                        connect: { id: id }
                    }
                },
            });
        }

        if (body.mother_info) {
            console.log(body.mother_info);
            const mother_info = await prisma.father_mother_info.upsert({
                where: {
                    id_relation: {
                        id: id,
                        relation: "mother",
                    },
                },
                update: {
                    ...body.mother_info,
                },
                create: {
                    ...body.mother_info,
                    Student: {
                        connect: { id: id }
                    },
                },
            });
        }

        return NextResponse.json({ message: "Profile updated successfully" });

    } catch (error) {
        console.log(error);
        return NextResponse.error(new Error("An error occurred while updating the profile"));
    }
}
