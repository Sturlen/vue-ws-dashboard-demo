import { createApp } from "vue"
import "./style.css"
import App from "./App.vue"

import { VueQueryPlugin } from "@tanstack/vue-query"
import { QueryClient } from "@tanstack/vue-query"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
})

const app = createApp(App)

app.use(VueQueryPlugin, { queryClient })

app.mount("#app")
