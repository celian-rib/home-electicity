<script lang="ts" setup>

type Ping = {
  isUp: boolean;
  date: Date;
};

const { data } = useAsyncData<{ pings: Ping[], lastPing: string }>('pings', () =>
  $fetch('/api/status')
);

const lastPingText = computed(() => {
  const body = data.value;
  if (!body) {
    return;
  }

  const date = new Date(body.lastPing);
  const now = new Date();

  const diff = Math.round((now.getTime() - date.getTime()) / 1000);
  const diffMinutes = Math.round(diff / 60);
  const diffSeconds = diff % 60;

  if (diffMinutes > 0) {
    return `Mis à jour il y a ${diffMinutes} minutes`;
  } else if (diffSeconds > 0) {
    return `Mis à jour il y a ${diffSeconds} secondes`;
  }
});

const lastPingIsUp = computed(() => {
  const body = data.value;
  if (!body) {
    return;
  }

  return body.pings[body.pings.length - 1].isUp;
});

const limitedPings = computed(() => {
  const body = data.value;
  if (!body) {
    return;
  }

  if (body.pings.length < 28) {
    const addedPings = new Array(28 - body.pings.length).fill({
      isUp: false,
      date: new Date(),
    });
    return [...addedPings, ...body.pings];
  }

  return body.pings.slice(0, 28);
});

const statusText = computed(() => {
  const body = data.value;
  if (!body) {
    return;
  }

  const hasIssueLastDays = body.pings.some((ping) => !ping.isUp);

  if (hasIssueLastDays) {
    return 'Il y a eu des coupures d\'électricité dans la maison ces derniers jours.';
  }

  return 'Rien d\'anormal sur l\'electricite de la maison.';
});

function dateToString(data: string) {
  const date = new Date(data);
  const day = date.getDate();
  const month = date.toLocaleString('fr-FR', { month: 'long' });
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${day} ${month} ${hours}:${minutes}`;
}
</script>

<template>
  <div class="w-screen h-screen flex flex-col items-center justify-evenly">
    <div class="flex flex-col items-center">
      <div id="status" :class="`${lastPingIsUp ? 'bg-[rgb(102,212,172)]' : 'bg-orange'}`">
        <div :class="`${lastPingIsUp ? 'bg-[rgb(102,212,172)]' : 'bg-orange'}`"></div>
        <Icon name="material-symbols:bolt-rounded" size="70" color="white" />
      </div>
      <p class="mt-5 font-light text-[#fff] text-sm opacity-40">{{ lastPingText ?? 'Jamais mis à jour' }}</p>
    </div>
    <p class="text-[#fff] font-semibold">{{ statusText }}</p>
    <div class="w-[600px] h-[150px] bg-gray-dark rounded-xl flex flex-col items-center justify-between py-3 px-5">
      <div class="flex items-center w-full">
        <Icon name="material-symbols:history-toggle-off-rounded" size="20" color="white" />
        <p class="text-[#fff] ml-2">Historique</p>
      </div>
      <div class="flex items-center justify-between w-full h-full">
        <div class="pingItem" v-for="ping in limitedPings" :key="ping.date"
          :class="`relative w-2 rounded-lg h-[50%] ${ping.isUp ? 'bg-[rgb(102,212,172)]' : 'bg-orange'}`">
          <p class="absolute -top-10 bg-gray-light rounded-sm">{{ dateToString(ping.date) }}</p>
        </div>
      </div>
      <div class="flex items-center justify-between w-full text-gray-light opacity-60 text-sm">
        <p>Il y à 7 jours</p>
        <p>Aujourd'hui</p>
      </div>
    </div>
  </div>
</template>

<style>
body {
  background-color: #0f1727;
}

#status {
  position: relative;

  height: 170px;
  width: 170px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 100%;
}

#status p {
  text-align: center;
  color: white;

  font-weight: 500;
}

#status div {
  z-index: -10;
  position: absolute;
  width: 100%;
  height: 100%;

  border-radius: 100%;

  animation: radar 2s infinite;
}

.pingItem {
  transition: transform 0.2s ease-in-out;
}

.pingItem p {
  display: block;
  width: fit-content;
  padding: 5px 10px;
  transform: translateX(-40%);
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.pingItem:hover {
  transform: scale(1.2);
}

.pingItem:hover p {
  opacity: 1;
}

@keyframes radar {
  from {
    transform: scale(1);
    opacity: 0.4;
  }

  to {
    transform: scale(1.7);
    opacity: 0;
  }
}
</style>
