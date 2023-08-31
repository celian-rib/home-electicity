<script lang="ts" setup>
const { lastPingIsUp, lastPingText } = defineProps<{
  lastPingText: string | undefined;
  lastPingIsUp: boolean;
  currentStatus: string;
}>();
</script>

<template>
  <div class="flex flex-col items-center w-screen">
    <div
      id="status"
      :class="`${
        lastPingIsUp ? 'bg-[rgb(102,212,172)]' : 'bg-orange'
      } sm:w-[170px] sm:h-[170px] w-28 h-28`"
    >
      <div :class="`${lastPingIsUp ? 'bg-[rgb(102,212,172)]' : 'bg-orange'}`" />
      <Icon name="material-symbols:bolt-rounded" size="40%" color="white" />
    </div>
    <p class="mt-5 font-light text-[#fff] text-sm opacity-40">
      {{ lastPingText ?? "Jamais mis à jour" }}
    </p>
    <p
      class="text-[#fff] font-semibold max-w-[80%] text-center sm:text-lg text-sm mt-10"
    >
      {{ currentStatus }}
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
