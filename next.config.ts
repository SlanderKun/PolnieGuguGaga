import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* конфиг минимальный: приложение полностью динамическое (состояние на клиенте),
     строгий пререндер (cacheComponents/partialPrefetching) тут не нужен. */
};

export default nextConfig;
