import { useScheduler } from '#scheduler';
import prisma from '../db';
import config from '../../config.json';

const FIVE_MINUTES = 1000 * 60 * 5;

export default defineNitroPlugin(() => {
  startScheduler();
});

function startScheduler() {
  console.log('Starting scheduler');
  const scheduler = useScheduler();

  scheduler.run(() => {
    checkPings();
  }).everyMinutes(config.checkIntervalMinutes);
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

  if (now.getTime() - lastPingDate.getTime() > config.checkIntervalMinutes + FIVE_MINUTES) {
    console.log(`Last up ping was more than ${config.checkIntervalMinutes + FIVE_MINUTES} minutes ago`);

    await prisma.ping.create({
      data: {
        isUp: false
      }
    });
  }
}