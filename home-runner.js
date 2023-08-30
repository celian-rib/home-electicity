const SERVER_URL = 'https://electricite.celian.cloud';
const STATUS_URL = `${SERVER_URL}/api/status`;

async function sendPing () {
  console.log('Sending ping');
  const response = await fetch(STATUS_URL, {
    method: 'POST'
  });

  const result = await response.json();

  console.log('Received response', result);

  const { expectedNextPingMinutes } = result;
  return expectedNextPingMinutes;
}

function minutesToMilliseconds (minutes) {
  return minutes * 60 * 1000;
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main () {
  let nextPingMinutes = 5;
  try {
    nextPingMinutes = await sendPing();
  } catch (error) {
    console.log('Failed to send first ping');
    console.error(error);
  }

  while (true) {
    try {
      console.log(`Sending next ping in ${nextPingMinutes} minutes...`);
      const nextPingMilliseconds = minutesToMilliseconds(nextPingMinutes);
      await new Promise(resolve => setTimeout(resolve, nextPingMilliseconds));
      nextPingMinutes = await sendPing();
    } catch (error) {
      console.error(error);
      console.log('Sleeping for 10 seconds');
      await sleep(1000 * 10);
    }
  }
}

main();
