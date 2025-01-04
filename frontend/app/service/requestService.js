import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getRequestById(id) {
    if(id){
        const request = await prisma.request.findUnique({
            where: {id: id},
            include: {
                accident_info: true,
                Ponpan: true,
                Student: true
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
           else if(request.type == "การผ่อนผันเข้ารับราชการทหาร"){
                result = {
                    ...request,
                    form: request.Ponpan[0].id,
                    path: "ponpan"
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
        where: {status: "รอจองคิว", stu_id: data},
        include: {
            accident_info: true,
            Ponpan: true,
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
            where: {id: Number(data.id)},
        })
        if(request){
            return request
        }
        else{
            return "Not found"
        }
    }
}

export async function changeStatusToWaitService(id) {
    const changed = await prisma.request.update({
        where: {id: id},
        data: {
            status: "รอเข้ารับบริการ"
        }
    })
    return changed
}