import { PrismaClient } from '@prisma/client';
import { prakan } from '../../document_build/prakan'

const prisma = new PrismaClient();

export async function getRequestById(id) {
    if(id){
        const request = await prisma.request.findUnique({
            where: {id: id, deleted_at: null},
            include: {
                accident_info: true,
            }
        })
        if(request){
            let result
            if(request.type == "การเบิกจ่ายประกันอุบัติเหตุ"){
                result = {
                    ...request,
                    form: request.accident_info[0].id,
                    path: "prakan"
                }
                return result
            }
            // return request
        }
        else{
            return "Not found"
        }
    }
}

export async function getShowRequestNotQueue(data) {
    const requests = await prisma.request.findMany({
        where: {status: "รอจองคิว", stu_id: data,deleted_at: null},
        include: {
            accident_info: true,
        }
    })
    if(requests){            
        return requests
    }
    else{
        return "Not found"
    }
}

export async function cancleRequest(id) {
    if(id){
        const request = await getRequestById(id)
        const changeStatusRequest = await prisma.request.update({
            where: {id: request.id},
            data: {status: "คำขอถูกยกเลิก", deleted_at: new Date()}
        })
        return changeStatusRequest
    }
}

export async function getRequestByIdFast(data) {
    if(data.id){
        const request = await prisma.request.findUnique({
            where: {id: Number(data.id), deleted_at: null},
        })
        if(request){
            return request
        }
        else{
            return "Not found"
        }
    }
}

export async function getRequestPrakanInAdmin(year){
    const startOfYear = new Date(year, 0, 1); // January 1st of the specified year
    const endOfYear = new Date(year + 1, 0, 1);
    let requests = null
    if(year !== 0){
        requests = await prisma.request.findMany({
            where: {
                status: {
                    not: "คำขอถูกยกเลิก",
                },
                type: "การเบิกจ่ายประกันอุบัติเหตุ",
                deleted_at: null,
                created_at: {
                    gte: startOfYear, // Greater than or equal to start of year
                    lt: endOfYear, // Less than start of the next year
                },
            },
            orderBy: {
                created_at: 'desc', // or 'asc' for ascending order
            },
            include: {
                Student: {
                    select: {
                        id: true,
                        fnameTH: true,
                        lnameTH: true
                    },
                },
                accident_info: true
            }
        })
    }
    else{
        requests = await prisma.request.findMany({
            where: {
                status: {
                    not: "คำขอถูกยกเลิก",
                },
                type: "การเบิกจ่ายประกันอุบัติเหตุ",
                deleted_at: null
            },
            orderBy: {
                created_at: 'desc', // or 'asc' for ascending order
            },
            include: {
                Student: {
                    select: {
                        id: true,
                        fnameTH: true,
                        lnameTH: true
                    },
                },
                accident_info: true
            }
        })
    }
    if(requests){
        return requests
    }
    else{
        return "Not found"
    }
}

export async function changeStatusPrakanToProcess(id) {
    if(id){
        const request = await getRequestById(id)
        if(request.status !== "รอเข้ารับบริการ"){
            throw {code: 400,error: new Error("Bad Request")}
        }
        const changeStatusRequest = await prisma.request.update({
            where: {id: request.id},
            data: {status: "รอดำเนินงานเอกสาร" }
        })
        return changeStatusRequest
    }
    else{
        throw {code: 400,error: new Error("Bad Request")}
    }
}

export async function changeStatusPrakanToFinish(id) {
    if(id){
        const request = await getRequestById(id)
        if(request.status !== "รอดำเนินงานเอกสาร"){
            throw {code: 400,error: new Error("Bad Request")}
        }
        const changeStatusRequest = await prisma.request.update({
            where: {id: request.id},
            data: {status: "ดำเนินการเสร็จสิ้น" }
        })
        return changeStatusRequest
    }
    else{
        throw {code: 400,error: new Error("Bad Request")}
    }
}

export async function downloadPrakanAdmin(id) {
    if(id){
        const thisPrakan = await prisma.accident_info.findUnique({
            where: {id: id},
            include: {
                Student:true
            }
        })
        const mergedData = {
            ...thisPrakan,
            ...thisPrakan.Student, // Spread the `Student` object into the main object
          };
        const filePath = await prakan(mergedData)
        console.log('fileeee',filePath);
        
        return filePath
    }
    else{
        throw {code: 400,error: new Error("Bad Request")}
    }
}

export async function getUniqueYearPrakan() {
    const requests = await prisma.request.findMany({
        select: {
            created_at: true,
        },
    });

    // Extract unique years
    const uniqueYears = Array.from(
        new Set(requests.map((request) => request.created_at.getFullYear()))
    );

    return uniqueYears;
}