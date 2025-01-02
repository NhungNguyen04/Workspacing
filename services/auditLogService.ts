import {auth, currentUser} from '@clerk/nextjs/server'
import {ACTION, ENTITY_TYPE, PrismaClient} from '@prisma/client'
import { prisma } from '@/lib/prisma'

interface Props {
    entityId: string;
    entityType: ENTITY_TYPE;
    entityTitle: string;
    action: ACTION;
}

export const createAuditLog = async (props: Props) => {
    if (!prisma) {
        throw new Error('Prisma client is not initialized');
    }

    try {
        const {orgId} = await auth();
        const user = await currentUser();

        if (!orgId || !user) {
            throw new Error('Unauthorized');
        }

        const {entityId, entityType, entityTitle, action} = props;

        return await prisma.auditLog.create({
            data: {
                entityId,
                entityType,
                entityTitle,
                action,
                userId: user.id,
                userImage: user.imageUrl || '',
                userName: user.fullName || '',
            },
        });
    } catch (error) {
        console.error('Failed to create audit log:', error);
        throw error;
    }
}

export const getLogByEntityId = async (entityId: string) => {
    if (!prisma) {
        throw new Error('Prisma client is not initialized');
    }

    try {
        return await prisma.auditLog.findMany({
            where: {
                entityId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    } catch (error) {
        console.error('Failed to fetch audit logs:', error);
        throw error;
    }
}