<script setup lang="ts">
import { Alertee } from '@prisma/client';

const emailInput = ref('');
const alerteesModalOpen = ref(false);
const alertees = ref<Alertee[]>([]);

function fetchAlertees () {
  $fetch<{ alertees: Alertee[] }>('/api/alertees').then((data) => {
    alertees.value = data.alertees;
  });
}

watch(alerteesModalOpen, (value) => {
  if (value) {
    fetchAlertees();
  }
});

async function addAlertee () {
  if (!emailInput.value) {
    return;
  }

  const response = await $fetch(`/api/alertees?email=${emailInput.value}`, {
    method: 'PUT'
  });

  console.log(response);

  emailInput.value = '';

  fetchAlertees();
}

async function deleteAlertee (id: number) {
  if (!confirm("Supprimer l'alerte ?")) {
    return;
  }

  await $fetch(`/api/alertees?id=${id}`, {
    method: 'DELETE'
  });

  fetchAlertees();
}
</script>
<template>
  <div>
    <Teleport v-if="alerteesModalOpen" to="body">
      <div
        class="h-screen w-screen bg-white bg-opacity-20 flex items-center justify-center fixed top-0 left-0"
      >
        <div
          class="relative w-[95%] sm:w-[800px] min-h-[400px] bg-gray-dark flex flex-col items-center justify-between text-white rounded-2xl shadow-lg py-10"
        >
          <button
            class="absolute top-5 right-5"
            @click="alerteesModalOpen = false"
          >
            <Icon name="mingcute:close-fill" size="25" color="white" />
          </button>
          <p class="text-lg">
            Notifications
          </p>
          <div class="flex flex-col items-center w-full">
            <p
              v-if="alertees == null || alertees?.length == 0"
              class="opacity-40"
            >
              Aucun email
            </p>
            <template v-else>
              <div
                v-for="alertee in alertees"
                :key="alertee.id"
                class="w-[90%] text-sm sm:text-md sm:w-[600px] bg-gray rounded-xl flex sm:py-3 sm:px-5 py-2 px-3 items-center text-white justify-between mt-2"
              >
                <div class="flex items-center">
                  <Icon
                    name="fluent:mail-12-filled"
                    size="25"
                    color="white"
                    class="mr-3"
                  />
                  <p
                    class="max-w-[150px] sm:max-w-none text-ellipsis overflow-hidden"
                  >
                    {{ alertee.email }}
                  </p>
                </div>
                <button
                  class="flex items-center"
                  @click="deleteAlertee(alertee.id)"
                >
                  <Icon name="ic:round-delete" size="20" color="white" />
                </button>
              </div>
            </template>
          </div>
          <form
            class="w-full flex items-center justify-center mt-4 flex-col sm:flex-row"
            @submit.prevent="addAlertee"
          >
            <input
              v-model="emailInput"
              type="email"
              class="bg-gray rounded-xl px-5 py-2 bg-opacity-60 outline-none sm:mr-5 w-[80%] sm:w-[40%]"
              placeholder="email"
            >
            <input
              type="submit"
              class="bg-gray text-black rounded-xl px-5 py-2 bg-opacity-60 mt-2 sm:mt-0 w-[80%] sm:w-auto"
            >
          </form>
        </div>
      </div>
    </Teleport>
    <button
      class="fixed top-5 right-5 opacity-50 hover:opacity-100"
      @click="alerteesModalOpen = true"
    >
      <Icon name="fluent:mail-12-filled" size="30" color="white" />
    </button>
  </div>
</template>
