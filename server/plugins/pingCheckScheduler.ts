import { useScheduler } from '#scheduler';
import prisma from '../db';
import { sendAllAlertEmails } from '../utils/mailer';

const FIVE_MINUTES = 1000 * 60 * 5;

export default defineNitroPlugin(() => {
  startScheduler();
});

function getTimerInterval() {
  const timerIntervalStr = process.env.CHECK_INTERVAL_MINUTES;
  
  if (!timerIntervalStr)
    throw new Error('Missing timer interval');
  
  const timerInterval = parseInt(timerIntervalStr, 30);
  return timerInterval;
}

function startScheduler() {
  console.log('Starting scheduler');
  

  const scheduler = useScheduler();

  checkPings();
  scheduler.run(() => {
    checkPings();
  }).everyMinutes(getTimerInterval());
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

  if (lastUpPing == null) {
    console.log('No up pings found');
    await prisma.ping.create({
      data: {
        isUp: false
      }
    });
    return;
  };

  const lastPingDate = new Date(lastUpPing.date);
  const now = new Date();

  const checkInterval = getTimerInterval() * 60 * 1000 + FIVE_MINUTES;
  if (now.getTime() - lastPingDate.getTime() > checkInterval) {
    console.log(`Last up ping was more than ${checkInterval / 60 / 1000} minutes ago`);

    const lastPing = await prisma.ping.findFirst({
      orderBy: {
        date: 'desc'
      },
      take: 1
    });

    if (lastPing?.isUp) {
      await prisma.alert.create({
        data: {
          isUp: false,
        }
      });

      sendAllAlertEmails('Panne électrique', 'Une panne électrique a été détectée.')
    }

    await prisma.ping.create({
      data: {
        isUp: false
      }
    });
  }
}

