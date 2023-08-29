import { useScheduler } from '#scheduler';
import prisma from '../db';

const FIVE_MINUTES = 1000 * 60 * 5;
const ONE_HOUR = 1000 * 60 * 60;

export default defineNitroPlugin(() => {
  startScheduler();
});

function startScheduler() {
  console.log('Starting scheduler');
  const scheduler = useScheduler();

  scheduler.run(() => {
    checkPings();
  }).everyHours(1);
}

async function checkPings() {
  console.log('Checking pings');

  const lastUpPing = await prisma.ping.findFirst({
    orderBy: {
      date: 'desc'
    },
    where: {
      isUp: true
    },
    take: 1
  });

  if (lastUpPing == null) return;

  const lastPingDate = new Date(lastUpPing.date);
  const now = new Date();

  if (now.getTime() - lastPingDate.getTime() > ONE_HOUR + FIVE_MINUTES) {
    console.log('Last up ping was more than 65 minutes ago');

    await prisma.ping.create({
      data: {
        isUp: false
      }
    });
  }
}