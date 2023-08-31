import { Ping } from '@prisma/client';
import prisma from '../db';
import { sendAllAlertEmails } from '../utils/mailer';
import { useScheduler } from '#scheduler';

const FIVE_MINUTES = 1000 * 60 * 5;

export default defineNitroPlugin(() => {
  startScheduler();
});

function startScheduler () {
  console.log('Starting scheduler');

  const config = useRuntimeConfig();
  const scheduler = useScheduler();

  scheduler.run(() => {
    checkPings();
  }).everyMinutes(config.checkIntervalMinutes);
}

async function checkPings () {
  console.log('Checking pings');
  const lastUpPing = await getLastUpPing();

  if (lastUpPing == null) {
    console.log('No up pings found');
    await createDownPing();
    return;
  };

  if (pingIsOutdated(lastUpPing)) {
    console.log('Last up ping is outdated');

    if (await lastPingIsUp()) {
      await createDownAlert();
    }

    await createDownPing();
  }
}

async function getLastPing () {
  return await prisma.ping.findFirst({
    orderBy: {
      date: 'desc'
    },
    take: 1
  });
}

async function getLastUpPing () {
  return await prisma.ping.findFirst({
    orderBy: {
      date: 'desc'
    },
    where: {
      isUp: true
    },
    take: 1
  });
}

async function createDownPing () {
  await prisma.ping.create({
    data: {
      isUp: false
    }
  });
}

function pingIsOutdated (ping: Ping) {
  const lastPingDate = new Date(ping.date);
  const now = new Date();

  const config = useRuntimeConfig();
  const checkInterval = config.checkIntervalMinutes * 60 * 1000 + FIVE_MINUTES;
  return now.getTime() - lastPingDate.getTime() > checkInterval;
}

async function lastPingIsUp () {
  const lastPing = await getLastPing();
  return lastPing?.isUp;
}

async function createDownAlert () {
  await prisma.alert.create({
    data: {
      isUp: false,
      alerteeCount: (await prisma.alertee.count())
    }
  });

  sendAllAlertEmails(
    'Panne électrique',
    'Une panne électrique a été détectée. (https://electricite.celian.cloud)'
  );
}
