'use server'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from "next/server"
import { getID, getIDbyToken } from "../../../lib/session"

const prisma = new PrismaClient()

export async function GET(req, res) {
    try{
    // read cookie header
    const cookie = req.headers.get('cookie') || '';
    const id =  await getID(req) || getIDbyToken(cookie)
    if (!id) {
        return NextResponse.json({ error: "ID is required or session is expired" }, { status: 401 });
    }

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
            thai_id: student.thai_id || '',
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
    const father_mother_info = await prisma.father_mother_info.findMany({
        where: {
            id: id,
        }
    })
    console.log(father_mother_info);
    data.father_info = father_mother_info.find(i => i.relation == "father")
    data.mother_info = father_mother_info.find(i => i.relation == "mother")

    data.mf_occupation = data.father_info?.mf_occupation || data.mother_info?.mf_occupation || ''

    const parent_info = await prisma.parent_info.findFirst({
        where: {
            id: id
        }
    })
    data.parent_info = parent_info
    console.log("RD",data)
    return NextResponse.json(data)
    }
    catch (error) {
        console.log(error)
        return NextResponse.message({ error: "An error occurred while fetching the profile" }, { status: 500 })
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

        if (body.partial_info) {
            // fillter Id out
            let partial_info = body.partial_info;
            delete partial_info.id;
            const partial_info_1 = await prisma.partial_info.upsert({
            where: {
                id: id,
            },
            update: {
                ...body.partial_info,
            },
            create: {
                ...body.partial_info,
                id: id,
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
        if (body.father_info) {
            let father_info = body.father_info;
            delete father_info.id;
            const _father_info = await prisma.father_mother_info.upsert({
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
            let mother_info = body.mother_info;
            delete mother_info.id;
            const _mother_info = await prisma.father_mother_info.upsert({
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
        return NextResponse.json({ error: "An error occurred while updating the profile" }, { status: 500 });
    }
}
