import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllUser(){
    const users = await prisma.user.findMany({
        where: {deleted_at: null}
    })
}

export async function createUser(data) {    
    const createdUser = await prisma.user.create({
        data: {
            username: data.username,
            password: data.password,
            email: data.email
        }
    })
    return createdUser
}

export async function updateUser(data) {    
    const updatedUser = await prisma.user.update({
        where: {id: data.id},
        data: {
            username: data.username,
            password: data.password,
            email: data.email
        }
    })
    return updatedUser
}

export async function deleteUser(data) {    
    const deletedUser = await prisma.user.update({
        where: {id: data.id},
        data: {
            deleted_at: new Date()
        }
    })
    return deletedUser
}