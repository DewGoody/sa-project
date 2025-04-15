import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getMilitaryInfo(id) {
    // Fetch all related data in a single query
    const studentData = await prisma.Student.findFirst({
        where: { id },
        include: {
            RD_info: true,
            father_mother_info: true,
            guardian_info: true,
        }
    });
    // console.log("studentData", studentData);
    
    if (!studentData) return
    // Build the response data
    let data = {
        student: {
            student_id: studentData.id || '',
            title: studentData.title || '',
            fnameTH: studentData.fnameTH || '',
            lnameTH: studentData.lnameTH || '',
            thai_id: studentData.thai_id || '',
            race: studentData.race || '',
            nationality: studentData.nationality || '',
            religion: studentData.religion || '',
            birthdate: studentData.bd || '',
            phone_num: studentData.phone_num || '',
            year: studentData.year || '',
            degree: studentData.degree || '',
        },

        father_mother_info: {
            father: studentData.father_mother_info.find(info => info.relation === "father") || {
                id: id,
                title: "",
                fname: "",
                lname: "",
                phone_num: "",
            },
            mother: studentData.father_mother_info.find(info => info.relation === "mother") || {
                id: id,
                title: "",
                fname: "",
                lname: "",
                phone_num: "",
            }
        },
        guardian_info: studentData.guardian_info || {
            id: id,
            guardian_title: "",
            guardian_fname: "",
            guardian_lname: "",
            guardian_relation: "",
            guardian_phone_num: "",
            consent1: "",
            consent2: "",
            consent21: "",
        },
        rD_info: studentData.RD_info 
    };

    const father = studentData.father_mother_info.find(info => info.relation === "father");
    const mother = studentData.father_mother_info.find(info => info.relation === "mother");

    if (father) {
        data.father_mother_info.father = {
            title: father.title || '',
            fname: father.fname || '',
            lname: father.lname || '',
            working_place: father.working_place || '',
            phone_num: father.phone_num || '',
            tel_num: father.tel_num || '',
            nationality: father.nationality || '',
            occupation: father.occupation || '',
            home_tel: father.home_tel || '',
        };
    }

    if (mother) {
        data.father_mother_info.mother = {
            title: mother.title || '',
            fname: mother.fname || '',
            lname: mother.lname || '',
            working_place: mother.working_place || '',
            phone_num: mother.phone_num || '',
            tel_num: mother.tel_num || '',
            nationality: mother.nationality || '',
            occupation: mother.occupation || '',
            home_tel: mother.home_tel || '',
        };
    }
    // console.log("data", data);
    
    return data;
}