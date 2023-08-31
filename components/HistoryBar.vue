<script lang="ts" setup>
import { Ping } from '@prisma/client';

const { pings } = defineProps<{
  pings: Ping[];
}>();

const PINGS_COUNT = 28;

const limitedPings = computed(() => {
  if (pings.length < PINGS_COUNT) {
    const addedPings = new Array(PINGS_COUNT - pings.length).fill({
      isUp: null,
      date: null
    });
    return [...addedPings, ...pings];
  }

  return pings.slice(0, PINGS_COUNT);
});
</script>
<template>
  <div
    class="w-[90%] sm:w-[600px] h-[150px] bg-gray-dark rounded-xl flex flex-col items-center justify-between py-3 px-5"
  >
    <div class="flex items-center w-full">
      <Icon
        name="material-symbols:history-toggle-off-rounded"
        size="20"
        color="white"
      />
      <p class="text-[#fff] ml-2">
        Historique
      </p>
    </div>
    <div class="flex items-center justify-between w-full h-full">
      <div
        v-for="ping in limitedPings"
        :key="ping.id"
        class="pingItem"
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
          class="fixed -top-10 bg-gray-light rounded-sm"
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
</template>

<style scoped>
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
</style>
