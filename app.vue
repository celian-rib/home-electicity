<script lang="ts" setup>
import { Alert, Ping } from '@prisma/client';
import StatusIndicator from './components/StatusIndicator.vue';

const { data } = useAsyncData<{
  pings: Ping[];
  lastPing: string;
  alerts: Alert[];
}>(() => $fetch('/api/status'));
</script>

<template>
  <div class="w-screen flex flex-col items-center">
    <AlerteesModal />
    <div class="w-screen h-screen flex flex-col items-center justify-evenly sm:pt-20 pt-10 pb-[10%] sm:pb-0">
      <StatusIndicator
        :pings="data?.pings ?? []"
        :last-ping-date="data?.lastPing"
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
  background-color: theme('colors.page-background');
}
</style>
