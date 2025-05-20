import { PrismaClient } from '@prisma/client';
import {getTimeslotById, addStuToPeriod, delStuInPeriod} from './timeslotService.js'

const prisma = new PrismaClient();

export async function createQueue(studentId, reqId, timeslotId, period, uid) {
    const timeslot = await getTimeslotById(timeslotId)
    if (!timeslot) {
        throw {code: 404,error: new Error("Timeslot not found")}
    }    
    if(timeslot.is_full[period]){
        const createdQueue = await prisma.queue.create({
            data: {
                uid: uid,
                stu_id: studentId,
                req_id: reqId,
                timeslot_id: timeslotId,
                period: period,
                status: "คิวเต็ม"
            }
        });
        return createdQueue
    }
    await addStuToPeriod(period, timeslotId)
    const createdQueue = await prisma.queue.create({
        data: {
            uid: uid,
            stu_id: studentId,
            req_id: reqId,
            timeslot_id: timeslotId,
            period: period,
            status: "จองคิวสำเร็จ"
        }
    });
    const changeStatusReq = await prisma.request.update({
        where: {id: reqId},
        data: {status: "รอเข้ารับบริการ"}
    })
    return createdQueue
}

export async function getShowQueueByStuId(studentId) {
    const queue = await prisma.queue.findMany({
        where: {stu_id: studentId, deleted_at: null},
        include: {
            Timeslot: true,
            Request: true
        }
    })
    if(queue){
        return queue
    }
}

export async function getQueueByUid(uid) {
    if(uid){
        const queue = await prisma.queue.findUnique({
            where: {uid: uid},
        })
        if(queue){
            return queue
        }
        else{
            return 0
        }
    }
}

export async function getQueueById(id) {
    if(id){
        const queue = await prisma.queue.findUnique({
            where: {id: id},
        })
        if(queue){
            return queue
        }
        else{
            return 0
        }
    }
}

export async function cancleQueue(id) {
    if(id){
        const queue = await getQueueById(id)
        if(!queue){
            return "Dont have queue"
        }
        await delStuInPeriod(queue.period, queue.timeslot_id)
        await prisma.request.update({
            where: {id: queue.req_id},
            data: {status: "รอจองคิว"}
        })
        const changeStatusQueue = await prisma.queue.update({
            where: {id: id},
            data: {status: "คิวถูกยกเลิก", deleted_at: new Date()}
        })
        return changeStatusQueue
    }
}

export async function changeQueue(queueId,studentId, reqId, timeslotId, period, uid) {    
    const timeslot = await getTimeslotById(timeslotId)

    // const deleteCurrentQueue = await cancleQueue(queueId)
    if (!timeslot) {
        throw {code: 404,error: new Error("Timeslot not found")}
    }
    
    if(timeslot.is_full[period]){
        const createdQueue = await prisma.queue.create({
            data: {
                uid: uid,
                stu_id: studentId,
                req_id: reqId,
                timeslot_id: timeslotId,
                period: period,
                status: "คิวเต็ม"
            }
        });
        return createdQueue
    }
    await addStuToPeriod(period, timeslotId)
    const createdQueue = await prisma.queue.create({
        data: {
            uid: uid,
            stu_id: studentId,
            req_id: reqId,
            timeslot_id: timeslotId,
            period: period,
            status: "จองคิวสำเร็จ"
        }
    });
    const changeStatusReq = await prisma.request.update({
        where: {id: reqId},
        data: {status: "รอเข้ารับบริการ"}
    })
    return createdQueue
}

export async function getShowQueueInAdmin(year) {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);
    let queue
    if(year !== 0){
        queue = await prisma.queue.findMany({
            where: {
                status: {
                    in: ["จองคิวสำเร็จ"]
                }, 
                deleted_at: null,
                created_at: {
                    gte: startOfYear, // Greater than or equal to start of year
                    lt: endOfYear, // Less than start of the next year
                }
            },
            include: {
                Timeslot: true,
                Request: true,
                Student: true
            },
            orderBy: [
                {timeslot_id: 'asc'},
                {period: 'asc'}
            ]
        })
    }
    else{
        queue = await prisma.queue.findMany({
            where: {
                status: {
                    in: ["จองคิวสำเร็จ"]
                }, 
                deleted_at: null},
            include: {
                Timeslot: true,
                Request: true,
                Student: true
            },
            orderBy: [
                {timeslot_id: 'asc'},
                {period: 'asc'}
            ]
        })
    }
    if(queue){
        return queue
    }
}

export async function changeStatusToLate(id) {
    if(id){
        const queue = await getQueueById(id)        
        if(queue.status !== "จองคิวสำเร็จ"){
            throw {code: 400,error: new Error("Bad Request")}
        }
        const changeStatusQueue = await prisma.queue.update({
            where: {id: id},
            data: {status: "ไม่มาเข้ารับบริการ" }
        })
        await prisma.request.update({
            where: {id: queue.req_id},
            data: {status: "รอจองคิว"}
        })
        return changeStatusQueue
    }
    else{
        throw {code: 400,error: new Error("Bad Request")}
    }
}

export async function changeStatusToReceiveService(id) {
    if(id){
        const queue = await getQueueById(id)        
        if(queue.status !== "จองคิวสำเร็จ"){
            throw {code: 400,error: new Error("Bad Request")}
        }
        const changeStatusQueue = await prisma.queue.update({
            where: {id: id},
            data: {status: "เข้ารับบริการแล้ว" }
        })
        await prisma.request.update({
            where: {id: queue.req_id},
            data: {status: "รอเจ้าหน้าที่ดำเนินการ"}
        })
        return changeStatusQueue
    }
    else{
        throw {code: 400,error: new Error("Bad Request")}
    }
}

export async function getCountDashboard(year) {
    const studentCount =  await prisma.student.count()
    let finishQueueCount = 0
    let notFinishQueueCount = 0
    let cancleQueueCount = 0
    if(year === 0){
        finishQueueCount = await prisma.queue.count({
            where: {
                status: "เข้ารับบริการแล้ว" 
            }
        });
        notFinishQueueCount = await prisma.queue.count({
            where: {
                status: "ไม่มาเข้ารับบริการ" 
            }
        });
        cancleQueueCount = await prisma.queue.count({
            where: {
                status: "คิวถูกยกเลิก" 
            }
        });
    }
    else{
        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year + 1, 0, 1);
        finishQueueCount = await prisma.queue.count({
            where: {
                status: "เข้ารับบริการแล้ว",
                created_at: {
                    gte: startOfYear,
                    lt: endOfYear
                }
            }
        });
        notFinishQueueCount = await prisma.queue.count({
            where: {
                status: "ไม่มาเข้ารับบริการ",
                created_at: {
                    gte: startOfYear,
                    lt: endOfYear
                }
            }
        });
        cancleQueueCount = await prisma.queue.count({
            where: {
                status: "คิวถูกยกเลิก",
                created_at: {
                    gte: startOfYear,
                    lt: endOfYear
                }
            }
        });
    }
    return {
        studentCount: studentCount,
        finishQueueCount: finishQueueCount,
        notFinishQueueCount: notFinishQueueCount,
        cancleQueueCount: cancleQueueCount
    }
}

export async function getAllQueueInAdmin(year) {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);
    let queue
    if(year !== 0){
        queue = await prisma.queue.findMany({
            where: {
                created_at: {
                    gte: startOfYear, // Greater than or equal to start of year
                    lt: endOfYear, // Less than start of the next year
                }
            },
            include: {
                Timeslot: true,
                Request: true,
                Student: true
            },
            orderBy: [
                {timeslot_id: 'asc'},
                {period: 'asc'}
            ]
        })
    }
    else{
        queue = await prisma.queue.findMany({
            include: {
                Timeslot: true,
                Request: true,
                Student: true
            },
            orderBy: [
                {timeslot_id: 'asc'},
                {period: 'asc'}
            ]
        })
    }
    if(queue){
        return queue
    }
}