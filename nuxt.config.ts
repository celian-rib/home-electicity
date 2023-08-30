// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
    'nuxt-scheduler',
  ],
  runtimeConfig: {
    checkIntervalMinutes: Number(process.env.NUXT_CHECK_INTERVAL_MINUTES || 30),
    homeName: process.env.NUXT_HOME_NAME || 'Maison',
    mailAddress: process.env.NUXT_MAIL_ADDRESS,
    mailPassword: process.env.NUXT_MAIL_PASSWORD,
    mailSmtp: process.env.NUXT_MAIL_SMTP_HOST,
  }
})
