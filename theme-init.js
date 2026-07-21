(() => {
  try {
    const preferences = JSON.parse(localStorage.getItem('domusUiPreferences') || '{}');
    const requestedTheme = ['dark', 'light', 'system'].includes(preferences.theme) ? preferences.theme : 'dark';
    const resolvedTheme = requestedTheme === 'system'
      ? (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
      : requestedTheme;
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.dataset.density = preferences.density === 'compact' ? 'compact' : 'comfortable';
    document.documentElement.dataset.reduceMotion = preferences.reduceMotion ? 'true' : 'false';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolvedTheme === 'light' ? '#f7f9fa' : '#0d151b');
  } catch {
    document.documentElement.dataset.theme = 'dark';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#0d151b');
  }
})();
