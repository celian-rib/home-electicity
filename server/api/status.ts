import prisma from "../db";

async function addUpStatusPing() {
  return prisma.ping.create({
    data: { isUp: true }
  })
}

async function listStatusPings() {
  return await prisma.ping.findMany({
    select: {
      isUp: true,
      date: true
    }
  })
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
