const SERVICES = [
  import.meta.env.VITE_AUTH_SERVICE_URL,
  import.meta.env.VITE_ACADEMIC_SERVICE_URL,
  import.meta.env.VITE_PAYMENT_SERVICE_URL,
  import.meta.env.VITE_ANALYTICS_SERVICE_URL,
];

export function startKeepAlive() {
  const ping = async () => {
    for (const url of SERVICES) {
      try {
        await fetch(`${url?.replace("/api/v1", "")}/`, {
          method: "HEAD",
        });
      } catch {
        // Ignore errors — just keeping the service warm
      }
    }
  };

  // Ping immediately then every 10 minutes
  ping();
  setInterval(ping, 10 * 60 * 1000);
}
