import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* приложение полностью динамическое (состояние на клиенте) — строгий пререндер не нужен.
     allowedDevOrigins: разрешаем dev-запросы и HMR-вебсокет с этого адреса,
     иначе Next 16 блокирует кросс-ориджин и сокет не подключается. */
  allowedDevOrigins: ["172.18.0.1"],
};

export default nextConfig;
