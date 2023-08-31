<script lang="ts" setup>
import { Alert } from '@prisma/client';

const { alerts } = defineProps<{
  alerts: Alert[];
}>();
</script>

<template>
  <div
    v-for="alert in alerts"
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
      <p class="ml-4 text-sm">
        {{ dateToString(alert.date) }}
      </p>
    </div>
    <div class="flex items-center">
      <p class="mr-3">
        {{ alert.alerteeCount }}
      </p>
      <Icon name="mdi:email-sent-outline" size="20" />
    </div>
  </div>
</template>
