<script lang="ts" setup>
import { Ping } from '@prisma/client';
import { dateToAgo } from '../utils/date';

const { pings, lastPingDate } = defineProps<{
  lastPingDate: string | undefined;
  pings: Ping[];
}>();

const colorClass = computed(() => {
  return lastPingIsUp ? 'bg-cyan' : 'bg-orange';
});

const statusText = computed(() => {
  const hasIssueLastDays = pings.some(ping => !ping.isUp);
  if (hasIssueLastDays) {
    return "Il y a eu des coupures d'électricité dans la maison ces derniers jours.";
  }
  return "Rien d'anormal sur l'electricite de la maison.";
});

const lastPingIsUp = computed(() => {
  return pings[pings.length - 1].isUp;
});
</script>

<template>
  <div class="flex flex-col items-center w-screen">
    <div id="status" :class="`${colorClass} sm:w-[170px] sm:h-[170px] w-28 h-28`">
      <div :class="colorClass" />
      <Icon name="material-symbols:bolt-rounded" size="40%" color="white" />
    </div>
    <p class="mt-5 font-light text-white text-sm opacity-40">
      {{ `Mis à jour ${dateToAgo(lastPingDate)}` ?? "Jamais mis à jour" }}
    </p>
    <p class="text-white font-semibold max-w-[80%] text-center sm:text-lg text-sm mt-10">
      {{ statusText }}
    </p>
  </div>
</template>

<style scoped>
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
