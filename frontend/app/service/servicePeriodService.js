import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getServicePeriod() {
    const period = await prisma.service_period.findMany()
    return period;
}

export async function editServicePeriod(data) {
    const period = await prisma.service_period.update({
        where:{
            id: data.id
        },
        data: {
            active: data.active,
        }
    })
    return period;
}