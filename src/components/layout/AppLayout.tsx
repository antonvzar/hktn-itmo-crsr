import { useEffect, useState } from 'react';
import { Grid } from 'antd';
import { Outlet } from 'react-router-dom';
import clsx from 'classnames';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import styles from './AppLayout.module.css';

const AppLayout = () => {
  const screens = Grid.useBreakpoint();
  const isDesktop = screens.lg ?? false;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isDesktop) {
      setSidebarOpen(false);
    }
  }, [isDesktop]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={styles.appShell}>
      <aside
        className={clsx(
          styles.sidebar,
          !isDesktop && styles.sidebarMobile,
          !isDesktop && sidebarOpen && styles.sidebarOpen,
        )}
        aria-hidden={!isDesktop && !sidebarOpen}
      >
        <AppSidebar onNavigate={!isDesktop ? closeSidebar : undefined} />
      </aside>
      {!isDesktop && sidebarOpen && <div className={styles.sidebarBackdrop} onClick={closeSidebar} role="presentation" />}
      <div className={styles.mainArea}>
        <AppHeader showMenuTrigger={!isDesktop} onToggleSidebar={toggleSidebar} />
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
