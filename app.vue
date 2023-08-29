<template>
  <div class="w-screen h-screen flex flex-col items-center justify-evenly">
    <div class="flex flex-col items-center">
      <div id="status">
        <div></div>
        <Icon name="material-symbols:bolt-rounded" size="70" color="white" />
      </div>
      <p class="mt-5 font-light text-[#fff] text-sm opacity-40">Maj: il y a 10 secondes</p>
    </div>
    <p class="text-[#fff] font-semibold">Rien d'anormal sur l'electricite de la maison.</p>
    <div class="w-[600px] h-[150px] bg-gray-dark rounded-xl flex flex-col items-center justify-between py-3 px-5">
      <div class="flex items-center w-full">
        <Icon name="material-symbols:history-toggle-off-rounded" size="20" color="white" />
        <p class="text-[#fff] ml-2">Historique</p>
      </div>
      <div class="flex items-center justify-between w-full h-full">
        <div class="w-2 rounded-lg h-[50%] bg-[rgb(102,212,172)]" v-for="i in new Array(30)">
        </div>
      </div>
      <div class="flex items-center justify-between w-full text-gray-light opacity-60 text-sm">
        <p>Il y a 7 jours</p>
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

  background-color: rgb(102, 212, 172);

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

  background-color: rgb(102, 212, 172);

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
