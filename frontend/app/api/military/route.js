'use server'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from "next/server"
import { getID, getIDbyToken } from "../../../lib/session"
import { getMilitaryInfo } from "../../../lib/prisma/prisma"

const prisma = new PrismaClient()

export async function GET(req, res) {
    try {
        // Read cookie header
        const cookie = req.headers.get('cookie') || '';
        const id = await getID(req) || getIDbyToken(cookie);
        if (!id) {
            return NextResponse.json({ error: "ID is required or session is expired" }, { status: 401 });
        }

        const data = await getMilitaryInfo(id);

        // Fetch all related data in a single query
        const studentData = await prisma.Student.findFirst({
            where: { id },
            include: {
                Military_info: true,
                Address: true,
                father_mother_info: true,
                parent_info: true,
            }
        });

        if (!studentData) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        // Build the response data
        const data = {
            student: {
                title: studentData.title || '',
                fnameTH: studentData.fnameTH || '',
                lnameTH: studentData.lnameTH || '',
                thai_id: studentData.thai_id || '',
                race: studentData.race || '',
                nationality: studentData.nationality || '',
                religion: studentData.religion || '',
                birthdate: studentData.bd || '',
            },
            addresses: {
                DOPA_address: null,
                Military_address: null
            },
            parent_info: {
                father: null,
                mother: null
            },
            Military_info: studentData.Military_info || { id: id },
        };

        // Handle addresses
        studentData.Address.forEach(address => {
            if (address.address_type === "DOPA_address") {
                data.addresses.DOPA_address = {
                    house_num: address.house_num || '',
                    house_moo: address.house_moo || '',
                    soi: address.soi || '',
                    street: address.street || '',
                    subdistrict: address.subdistrict || '',
                    district: address.district || '',
                    province: address.province || '',
                    postal_code: address.postal_code || '',
                };
            } else if (address.address_type === "Military_address") {
                data.addresses.Military_address = {
                    house_num: address.house_num || '',
                    house_moo: address.house_moo || '',
                    soi: address.soi || '',
                    street: address.street || '',
                    subdistrict: address.subdistrict || '',
                    district: address.district || '',
                    province: address.province || '',
                    postal_code: address.postal_code || '',
                };
            }
        });

        // Handle father and mother info
        const father = studentData.father_mother_info.find(info => info.relation === "father");
        const mother = studentData.father_mother_info.find(info => info.relation === "mother");

        if (father) {
            data.parent_info.father = {
                title: father.title || '',
                fname: father.fname || '',
                lname: father.lname || '',
                working_place: father.working_place || '',
                phone_num: father.phone_num || '',
                occupation: father.occupation || '',
            };
        }

        if (mother) {
            data.parent_info.mother = {
                title: mother.title || '',
                fname: mother.fname || '',
                lname: mother.lname || '',
                working_place: mother.working_place || '',
                phone_num: mother.phone_num || '',
                occupation: mother.occupation || '',
            };
        }
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while fetching the profile" }, { status: 500 });
    }
}

export async function PUT(req, res) {
    try {
        // Read cookie header
        const cookie = req.headers.get('cookie') || '';
        const id = await getID(req) || getIDbyToken(cookie);
        if (!id) {
            return NextResponse.json({ error: "ID is required or session is expired" }, { status: 401 });
        }

        // Parse the incoming JSON body
        const {
            addresses,
            guardian_info,
            Military_info,
            father_mother_info,
            student
        } = await req.json();

        let {year, thai_id, phone_num, tel_num, personal_email, race, religion, nationality} = await student;

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

        await prisma.Military_info.upsert({
            where: { id },
            update: { ...Military_info },
            create: { id, ...Military_info }
        });

        // Upsert addresses (DOPA and Military)
        if (addresses?.DOPA_address) {
            await prisma.Address.upsert({
                where: { id_address_type: { id: id, address_type: "DOPA_address" } },
                update: { ...addresses.DOPA_address },
                create: { id: id, address_type: "DOPA_address", ...addresses.DOPA_address }
            });
        }

        if (addresses?.Military_address) {
            await prisma.Address.upsert({
                where: { id_address_type: { id: id, address_type: "Military_address" } },
                update: { ...addresses.Military_address },
                create: { id: id, address_type: "Military_address", ...addresses.Military_address }
            });
        }
        if (addresses?.Father_address) {
            await prisma.Address.upsert({
                where: { id_address_type: { id: id, address_type: "Father_address" } },
                update: { ...addresses.Father_address },
                create: { id: id, address_type: "Father_address", ...addresses.Father_address }
            });
        }

        if (addresses?.Mother_address) {
            await prisma.Address.upsert({
                where: { id_address_type: { id: id, address_type: "Mother_address" } },
                update: { ...addresses.Mother_address },
                create: { id: id, address_type: "Mother_address", ...addresses.Mother_address }
            });
        }

        if (addresses?.Follower_address1) {
            await prisma.Address.upsert({
                where: { id_address_type: { id: id, address_type: "Follower_address1" } },
                update: { ...addresses.Follower_address1 },
                create: { id: id, address_type: "Follower_address1", ...addresses.Follower_address1 }
            });
        }

        if (addresses?.Follower_address2) {
            await prisma.Address.upsert({
                where: { id_address_type: { id: id, address_type: "Follower_address2" } },
                update: { ...addresses.Follower_address2 },
                create: { id: id, address_type: "Follower_address2", ...addresses.Follower_address2 }
            });
        }

        if (addresses?.Contactable_address) {
            await prisma.Address.upsert({
                where: { id_address_type: { id: id, address_type: "Contactable_address" } },
                update: { ...addresses.Contactable_address },
                create: { id: id, address_type: "Contactable_address", ...addresses.Contactable_address }
            });
        }

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


        return NextResponse.json({ message: "Data updated successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while updating the profile" }, { status: 500 });
    }
}
