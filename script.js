// ===== SIDEBAR NAVIGATION =====
const sidebar = document.getElementById('sidebar');
const openSidebarBtn = document.getElementById('openSidebar');
const closeSidebarBtn = document.getElementById('closeSidebar');

if (sidebar && openSidebarBtn && closeSidebarBtn) {
  openSidebarBtn.addEventListener('click', () => {
    sidebar.classList.add('open');
  });
  closeSidebarBtn.addEventListener('click', () => {
    sidebar.classList.remove('open');
  });
  // Закрытие по клику вне меню
  document.addEventListener('click', (e) => {
    if (
      sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      e.target !== openSidebarBtn
    ) {
      sidebar.classList.remove('open');
    }
  });
} 