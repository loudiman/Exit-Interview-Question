function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');

  sidebar.classList.toggle('hidden');
  mainContent.classList.toggle('full-width');

  // Update CSS variable based on sidebar visibility
  if (sidebar.classList.contains('hidden')) {
      document.documentElement.style.setProperty('--sidebar-width', '0px');
  } else {
      document.documentElement.style.setProperty('--sidebar-width', '200px'); // Match this to your sidebar width
  }

}
