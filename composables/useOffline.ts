export function useOffline() {
  const isOnline = useState<boolean>('stratbaker-online', () => true)
  const lastSyncedAt = useState<string>('stratbaker-sync', () => '')

  function init() {
    if (!import.meta.client) return

    isOnline.value = navigator.onLine

    window.addEventListener('online', () => {
      isOnline.value = true
      lastSyncedAt.value = new Date().toLocaleTimeString()
    })

    window.addEventListener('offline', () => {
      isOnline.value = false
    })

    lastSyncedAt.value = new Date().toLocaleTimeString()
  }

  init()

  return {
    isOnline,
    lastSyncedAt,
  }
}
