import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getDayoff() {
    const dayoff = await prisma.dayoff.findMany({
        where: {
            date: {
                gte: new Date(new Date().getFullYear(), 0, 1),
                lt: new Date(new Date().getFullYear() + 1, 0, 1)}
        },
        orderBy: {
            date: 'asc'
        }
    })
    return dayoff;
}

export async function createDayoff(data) {
    const dayoff = await prisma.dayoff.create({
        data: {
            date: data.date,
            period: data.period,
            name: data.name,
        }
    })
    return dayoff;
}

export async function editDayoff(data) {
    const dayoff = await prisma.dayoff.update({
        where:{
            id: data.id
        },
        data: {
            date: data.date,
            period: data.period,
            name: data.name,
        }
    })
    return dayoff;
}

export async function deleteDayoff(data) {
    const dayoff = await prisma.dayoff.delete({
        where:{
            id: data.id
        }
    })
    return dayoff;
}