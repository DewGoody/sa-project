import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createPonpanData(data) {
    const createRequest = await prisma.request.create({
        data: {
            type: "การผ่อนผันเข้ารับราชการทหาร",
            status: "รอจองคิว",
            stu_id: data.stuId,
        }
    })    
    const createdPonpan = await prisma.ponpan.create({
        data: {
            sdnine_id: data.sdnine_id,
            stu_id: data.stuId,
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
            email: data.email
        }
    })
    return createdPonpan
}

