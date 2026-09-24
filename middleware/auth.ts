export default defineNuxtRouteMiddleware(async (to) => {
  if (!import.meta.client) return

  await useAuth().init()

  const token = localStorage.getItem('stratbaker_token')

  const publicRoutes = ['/login', '/']
  const isPublic = publicRoutes.includes(to.path)

  if (!token && !isPublic) {
    return navigateTo('/login')
  }

  if (token && to.path === '/login') {
    return navigateTo('/dashboard')
  }
})
