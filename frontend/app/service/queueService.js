import { PrismaClient } from '@prisma/client';
import {getTimeslotById, addStuToPeriod} from './timeslotService'

const prisma = new PrismaClient();

export async function createQueue(studentId, reqId, timeslotId, period) {
    const timeslot = await getTimeslotById(timeslotId)
    if(timeslot.is_full[period]){
        throw {code: 409,error: new Error("Timeslot full")}
    }
    if(timeslot.period[period] == timeslot.max_stu){
        throw {code: 409,error: new Error("This period full")}
    }
    await addStuToPeriod(period, timeslotId)
    const createdQueue = await prisma.queue.create({
        data: {
            stu_id: studentId,
            req_id: reqId,
            timeslot_id: timeslotId,
            period: period
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
        where: {stu_id: studentId},
        include: {
            Timeslot: true,
            Request: true
        }
    })
    if(queue){
        return queue
    }
}