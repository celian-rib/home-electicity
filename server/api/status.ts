import { Ping } from "@prisma/client";
import prisma from "../db";
import { sendAllAlertEmails } from "../utils/mailer";

async function addUpStatusPing() {
  const lastPing = await prisma.ping.findFirst({
    orderBy: {
      date: 'desc'
    },
    take: 1
  });

  if (lastPing?.isUp === false) {
    await prisma.alert.create({
      data: { isUp: true, alerteeCount: (await prisma.alertee.count()) }
    });

    sendAllAlertEmails('Retour à la normale', 'Le courant est revenu !')
  }

  return await prisma.ping.create({
    data: { isUp: true }
  })
}

function filterPingsByDays(pings: Ping[]) {
  const pingsByDay = new Map<string, Ping[]>()

  for (const ping of pings) {
    const date = new Date(ping.date)
    const day = date.toDateString()

    const pingsForDay = pingsByDay.get(day) ?? []
    pingsForDay.push(ping)

    pingsByDay.set(day, pingsForDay)
  }

  const finalPings: Ping[] = [];

  for (const pingsForDay of pingsByDay.values()) {

    const pingsByQuarter = new Map<number, Ping[]>()
    for (const ping of pingsForDay) {
      const date = new Date(ping.date)
      const quarter = Math.floor(date.getHours() / 6)

      const pingsForQuarter = pingsByQuarter.get(quarter) ?? []
      pingsForQuarter.push(ping)

      pingsByQuarter.set(quarter, pingsForQuarter)
    }

    for (const pingsForQuarter of pingsByQuarter.values()) {
      const isUp = pingsForQuarter.every(ping => ping.isUp)

      const pingForQuarter = pingsForQuarter[0]
      pingForQuarter.isUp = isUp

      finalPings.push(pingForQuarter)
    }
  }

  return finalPings;
}

async function listStatusPings() {
  const pings = await prisma.ping.findMany({
    where: {
      date: {
        gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
      }
    }
  })

  const filteredPings = filterPingsByDays(pings);
  const lastPing = pings[pings.length - 1];
  if (lastPing)
    return [...filteredPings, lastPing];
  return filteredPings;
}

async function listAlerts() {
  const alerts = await prisma.alert.findMany({
    orderBy: {
      date: 'desc'
    },
  });
  return alerts;
}

export default defineEventHandler(async (event) => {
  if (event.method === 'POST') {
    await addUpStatusPing();
    const config = useRuntimeConfig();
    return {
      message: 'Ping added',
      expectedNextPingMinutes: config.checkIntervalMinutes,
    };
  }

  const pings = await listStatusPings()
  return {
    pings,
    lastPing: pings.length > 0 ? pings[pings.length - 1].date : null,
    alerts: await listAlerts()
  };
})
