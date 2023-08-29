import { Ping } from "@prisma/client";
import prisma from "../db";

type StatusPing = Omit<Ping, 'id'>;

async function addUpStatusPing() {
  return prisma.ping.create({
    data: { isUp: true }
  })
}

function filterPingsByDays(pings: StatusPing[]) {
  const pingsByDay = new Map<string, StatusPing[]>()

  for (const ping of pings) {
    const date = new Date(ping.date)
    const day = date.toDateString()

    const pingsForDay = pingsByDay.get(day) ?? []
    pingsForDay.push(ping)

    pingsByDay.set(day, pingsForDay)
  }

  const finalPings: StatusPing[] = [];

  for (const pingsForDay of pingsByDay.values()) {

    const pingsByQuarter = new Map<number, StatusPing[]>()
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
    select: {
      isUp: true,
      date: true
    },
    where: {
      date: {
        gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
      }
    }
  })

  return filterPingsByDays(pings);
}

export default defineEventHandler(async (event) => {
  if (event.method === 'POST') {
    await addUpStatusPing();
    return {
      statusCode: 200,
      body: {
        message: 'Ping added'
      }
    };
  }

  console.log('GET /api/status');
  const pings = await listStatusPings()
  return {
    pings,
    lastPing: pings.length > 0 ? pings[pings.length - 1].date : null
  };
})
