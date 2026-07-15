import { prisma } from '../prisma';

export interface WaitlistEntryData {
  name: string;
  email: string;
  location?: string;
  audience?: string;
}

export class WaitlistService {
  async joinWaitlist(data: WaitlistEntryData) {
    const { name, email, location, audience } = data;

    const existingEntry = await prisma.waitlistEntry.findUnique({
      where: { email }
    });

    if (existingEntry) {
      const updatedEntry = await prisma.waitlistEntry.update({
        where: { email },
        data: {
          name,
          location,
          audience
        }
      });

      return {
        entry: updatedEntry,
        created: false
      };
    }

    const entry = await prisma.waitlistEntry.create({
      data: {
        name,
        email,
        location,
        audience
      }
    });

    return {
      entry,
      created: true
    };
  }

  async getAllEntries() {
    return prisma.waitlistEntry.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}

export const waitlistService = new WaitlistService();