<script lang="ts" setup>
import { Alert, Ping } from '@prisma/client';
import StatusIndicator from './components/StatusIndicator.vue';
import { dateToAgo } from './utils/date';

const { data } = useAsyncData<{
  pings: Ping[];
  lastPing: string;
  alerts: Alert[];
}>(() => $fetch('/api/status'));

const lastPingIsUp = computed(() => {
  const body = data.value;
  if (!body) {
    return false;
  }
  return body.pings[body.pings.length - 1].isUp;
});

const statusText = computed(() => {
  const body = data.value;
  if (!body) {
    return '';
  }

  const hasIssueLastDays = body.pings.some(ping => !ping.isUp);
  if (hasIssueLastDays) {
    return "Il y a eu des coupures d'électricité dans la maison ces derniers jours.";
  }
  return "Rien d'anormal sur l'electricite de la maison.";
});
</script>

<template>
  <div class="w-screen flex flex-col items-center">
    <AlerteesModal />
    <div class="w-screen h-screen flex flex-col items-center justify-evenly sm:pt-20 pt-10 pb-[10%] sm:pb-0">
      <StatusIndicator
        :last-ping-is-up="lastPingIsUp"
        :last-ping-text="dateToAgo(data?.lastPing)"
        :current-status="statusText"
      />
      <HistoryBar :pings="data?.pings ?? []" />
      <Icon name="icon-park-solid:down-one" size="30" color="white" class="opacity-40 mt-10" />
    </div>
    <div class="w-screen flex flex-col items-center pb-20">
      <AlertsList :alerts="data?.alerts ?? []" />
    </div>
  </div>
</template>

<style>
body {
  background-color: #0f1727;
}
</style>
