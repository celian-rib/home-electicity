<script lang="ts" setup>
type Ping = {
  id: number;
  isUp: boolean | null;
  date: string | null;
};

type Alert = {
  id: number;
  date: string;
  isUp: boolean;
};

const { data } = useAsyncData<{
  pings: Ping[];
  lastPing: string;
  alerts: Alert[];
}>("pings", () => $fetch("/api/status"));

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
      isUp: null,
      date: null,
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
    return "Il y a eu des coupures d'électricité dans la maison ces derniers jours.";
  }

  return "Rien d'anormal sur l'electricite de la maison.";
});

function dateToString(data: string) {
  const date = new Date(data);
  const day = date.getDate();
  const month = date.toLocaleString("fr-FR", { month: "long" });
  const hours = date.getHours();
  const minutes = date.getMinutes();

  if (new Date().getDate() === day) {
    return `Aujourd'hui ${hours}:${minutes}`;
  }

  if (new Date().getDate() - 1 === day) {
    return `Hier ${hours}:${minutes}`;
  }

  return `${day} ${month} ${hours}:${minutes}`;
}
</script>

<template>
  <div class="w-screen flex flex-col items-center">
    <button class="absolute top-5 right-5 opacity-50 hover:opacity-100">
      <Icon name="ci:settings" size="30" color="white" />
    </button>
    <div
      class="w-screen h-[calc(100dvh)] flex flex-col items-center justify-evenly sm:pt-20 pt-10"
    >
      <div class="flex flex-col items-center">
        <div
          id="status"
          :class="`${
            lastPingIsUp ? 'bg-[rgb(102,212,172)]' : 'bg-orange'
          } sm:w-[170px] sm:h-[170px] w-32 h-32`"
        >
          <div
            :class="`${lastPingIsUp ? 'bg-[rgb(102,212,172)]' : 'bg-orange'}`"
          ></div>
          <Icon name="material-symbols:bolt-rounded" size="40%" color="white" />
        </div>
        <p class="mt-5 font-light text-[#fff] text-sm opacity-40">
          {{ lastPingText ?? "Jamais mis à jour" }}
        </p>
      </div>
      <p class="text-[#fff] font-semibold max-w-[80%] text-center">
        {{ statusText }}
      </p>
      <div class="flex flex-col items-center w-screen">
        <div
          class="w-[90%] sm:w-[600px] h-[150px] bg-gray-dark rounded-xl flex flex-col items-center justify-between py-3 px-5"
        >
          <div class="flex items-center w-full">
            <Icon
              name="material-symbols:history-toggle-off-rounded"
              size="20"
              color="white"
            />
            <p class="text-[#fff] ml-2">Historique</p>
          </div>
          <div class="flex items-center justify-between w-full h-full">
            <div
              class="pingItem"
              v-for="ping in limitedPings"
              :key="ping.id"
              :class="`relative w-1 sm:w-2 rounded-lg h-[50%] ${
                ping.isUp != null
                  ? ping.isUp
                    ? 'bg-[rgb(102,212,172)]'
                    : 'bg-orange'
                  : 'bg-gray'
              }`"
            >
              <p
                v-if="ping.isUp != null"
                class="absolute -top-10 bg-gray-light rounded-sm"
              >
                {{ dateToString(ping.date) }}
              </p>
            </div>
          </div>
          <div
            class="flex items-center justify-between w-full text-gray-light opacity-60 text-sm"
          >
            <p>Il y a 7 jours</p>
            <p>Aujourd'hui</p>
          </div>
        </div>
        <Icon
          name="icon-park-solid:down-one"
          size="30"
          color="white"
          class="opacity-40 mt-10"
        />
      </div>
    </div>
    <div class="w-screen flex flex-col items-center pb-20">
      <div
        v-for="alert in data?.alerts ?? []"
        :key="alert.id"
        class="w-[90%] sm:w-[600px] h-[50px] bg-gray-dark rounded-xl flex py-3 px-5 items-center text-white justify-between mt-2"
      >
        <div class="flex items-center">
          <Icon
            v-if="alert.isUp == false"
            name="tabler:bolt-off"
            size="20"
            color="white"
            class="mr-3"
          />
          <Icon
            v-else
            name="tabler:bolt"
            size="20"
            color="white"
            class="mr-3"
          />
          <p
            :class="`${
              alert.isUp ? 'text-[rgb(102,212,172)]' : 'text-orange'
            } sm:w-20`"
          >
            {{ alert.isUp ? "Reprise" : "Coupure" }}
          </p>
          <p class="ml-4 text-sm">{{ dateToString(alert.date) }}</p>
        </div>
        <div class="flex items-center">
          <p class="mr-3">0</p>
          <Icon name="mdi:email-sent-outline" size="20" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
body {
  background-color: #0f1727;
  width: 100vw;
  overflow: hidden;
}

#status {
  position: relative;

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
