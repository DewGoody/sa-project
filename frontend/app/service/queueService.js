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
        data: {status: "จองคิวแล้ว"}
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
        await delStuInPeriod(queue.period, queue.timeslot_id)
        const changeStatusQueue = await prisma.queue.update({
            where: {id: id},
            data: {status: "คิวถูกยกเลิก", deleted_at: new Date()}
        })
        return changeStatusQueue
    }
}

export async function changeQueue(queueId,studentId, reqId, timeslotId, period, uid) {    
    const timeslot = await getTimeslotById(timeslotId)

    const deleteCurrentQueue = await cancleQueue(queueId)
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
        data: {status: "จองคิวแล้ว"}
    })
    return createdQueue
}