import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createPonpanData(data) {
    const createRequest = await prisma.request.create({
        data: {
            type: "การผ่อนผันเข้ารับราชการทหาร",
            status: "รอจองคิว",
            stu_id: data.stu_id,
        }
    })    
    const createdPonpan = await prisma.ponpan.create({
        data: {
            sdnine_id: data.sdnine_id,
            stu_id: data.stu_id,
            req_id: createRequest.id,
            degree: data.degree,
            phone_num: data.phone_num,
            father_name: data.father_name,
            mother_name: data.mother_name,
            house_num: data.house_num,
            house_moo: data.house_moo,
            district: data.district,
            sub_district: data.sub_district,
            province: data.province,
            house_num_sd: data.house_num_sd,
            house_moo_sd: data.house_moo_sd,
            district_sd: data.district_sd,
            subdistrict_sd: data.subdistrict_sd,
            province_sd: data.province_sd,
            email: data.email,
            year: data.year,
        }

        
    })
    await prisma.student.update({
        where: {id: data.stu_id},
        data: {
            thai_id: data.thai_id
        }
    })
    return createdPonpan
}

export async function updatePonpan(data){
    const updatedPonpan = await prisma.ponpan.update({
        where: {id: data.id},
        data: {
            sdnine_id: data.sdnine_id,
            stu_id: data.stu_id,
            degree: data.degree,
            phone_num: data.phone_num,
            father_name: data.father_name,
            mother_name: data.mother_name,
            house_num: data.house_num,
            house_moo: data.house_moo,
            district: data.district,
            sub_district: data.sub_district,
            province: data.province,
            house_num_sd: data.house_num_sd,
            house_moo_sd: data.house_moo_sd,
            district_sd: data.district_sd,
            subdistrict_sd: data.subdistrict_sd,
            province_sd: data.province_sd,
            email: data.email,
            year: data.year
        }
    })
    return updatedPonpan
}

export async function getPonpanDataById(id) {
    const ponpan = await prisma.ponpan.findUnique({
        where: {id: id},
        include: {
            Student: true
        }
    })
    if(ponpan){           
        return ponpan
    }
    else{
        return "Not found"
    }
}