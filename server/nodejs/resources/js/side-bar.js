// Sidebar toggle

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);

    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        sidebar.classList.toggle('hidden');
        mainContent.classList.toggle('full-width');
    }
});
