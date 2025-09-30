import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/MyShop/",  // <- to musi być dokładnie nazwa repozytorium
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        admin: "public/admin.html",
      },
    },
  },
});
