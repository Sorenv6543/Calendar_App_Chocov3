export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore();
  const { isAuthenticated, isPropertyOwner, isCleaningCompany } = userStore;

  // Initialize auth state if not already done
  if (!userStore.user) {
    await userStore.initialize();
  }

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register", "/"];
  if (publicRoutes.includes(to.path)) {
    return;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return navigateTo("/login");
  }

  // Check role-based access
  if (to.path.startsWith("/property-owner") && !isPropertyOwner) {
    return navigateTo("/");
  }

  if (to.path.startsWith("/cleaning-company") && !isCleaningCompany) {
    return navigateTo("/");
  }
});
