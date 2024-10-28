import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getMilitaryInfo(id) {
    // Fetch all related data in a single query
    const studentData = await prisma.Student.findFirst({
        where: { id },
        include: {
            Military_info: true,
            Address: true,
            father_mother_info: true,
            guardian_info: true,
        }
    });

    if (!studentData) return


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
            Military_address: null,
            Father_address: null,
            Mother_address: null
        },
        father_mother_info: {
            father: studentData.father_mother_info.find(info => info.relation === "father") || { id: id,
                title: "",
                fname: "",
                lname: "",
                working_place: "",
                phone_num: "",
                occupation: "",
             },
            mother: studentData.father_mother_info.find(info => info.relation === "mother") || { id: id,
                title: "",
                fname: "",
                lname: "",
                working_place: "",
                phone_num: "",
                occupation: "",
            }
        },
        guardian_info: studentData.guardian_info || { id: id,
            guardian_title: "",
            guardian_fname: "",
            guardian_lname: "",
            guardian_relation: "",
            guardian_occupation: "",
            guardian_age: "",
            guardian_address: "",
         },
        Military_info: studentData.Military_info || { id: id ,
                "military_id": "",
                "military_class": "",
                "register_type": null,
                "grade9_gpax": null,
                "grade9_school": "",
                "prev_military_class": "",
                "prev_school": "",
                "academic_grade1": "",
                "academic_class1": "",
                "academic_major1": "",
                "academic_school1": "",
                "academic_grade2": "",
                "academic_class2": "",
                "academic_major2": "",
                "academic_school2": null,
                "academic_grade3": null,
                "academic_class3": null,
                "academic_major3": null,
                "academic_school3": null,
                "academic_grade4": null,
                "academic_class4": null,
                "academic_major4": null,
                "academic_school4": null,
                "military_grade1": null,
                "military_year1": null,
                "military_school1": "",
                "military_province": "",
                "military_grade2": null,
                "military_year2": null,
                "military_school2": "",
                "military_province2": "",
                "military_grade3": null,
                "military_year3": null,
                "military_school3": "",
                "military_province3": "",
                "military_grade4": null,
                "military_year4": null,
                "military_school4": "",
                "military_province4": "",
                "reg_army": "",
                "reg_corp": "",
                "promo_title1": "",
                "promo_corp1": "",
                "promo_order1": "",
                "promo_date1": null,
                "promo_title2": "",
                "promo_corp2": "",
                "promo_order2": "",
                "promo_date2": null
        },
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
        } else if (address.address_type === "Father_address") {
            data.addresses.Father_address = {
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
        else if (address.address_type === "Mother_address") {
            data.addresses.Mother_address = {
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
        data.father_mother_info.father = {
            title: father.title || '',
            fname: father.fname || '',
            lname: father.lname || '',
            working_place: father.working_place || '',
            phone_num: father.phone_num || '',
            occupation: father.occupation || '',
        };
    }

    if (mother) {
        data.father_mother_info.mother = {
            title: mother.title || '',
            fname: mother.fname || '',
            lname: mother.lname || '',
            working_place: mother.working_place || '',
            phone_num: mother.phone_num || '',
            occupation: mother.occupation || '',
        };
    }

    return data;
}