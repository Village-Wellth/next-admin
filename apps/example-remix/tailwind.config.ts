import type { Config } from "tailwindcss";
import nextAdminPreset from "@village-wellth/next-admin/preset";

export default {
  content: [
    "./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@village-wellth/next-admin/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/examples-common/dist/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [nextAdminPreset],
} satisfies Config;
