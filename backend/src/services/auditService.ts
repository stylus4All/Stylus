import  { prisma } from '../prisma';

export const auditService = {
  create: async (data: { actorId?: number; actorName?: string; action: string; details?: string; ip?: string }) => {
    try {
      const record = await (prisma as any).adminAudit.create({ data });
      return record;
    } catch (err) {
      console.error('Failed to write audit log', err);
      // don't throw — audit failures shouldn't break main flow
      return null;
    }
  }
};
