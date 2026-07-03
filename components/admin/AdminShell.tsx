'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './AdminShell.module.css';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Inquiries', href: '/admin/inquiries' },
  { label: 'Services', href: '/admin/services' },
  { label: 'Testimonials', href: '/admin/testimonials' },
  { label: 'Credit Cards', href: '/admin/credit-cards' },
  { label: 'Applications', href: '/admin/applications' },
  { label: 'Content', href: '/admin/content' },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner} />
        <p>Authenticating...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className={styles.shell}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarInner}>
          <div className={styles.brand}>
            <div className={styles.logoMark}>G</div>
            <div>
              <p className={styles.brandName}>GrowNsure</p>
              <p className={styles.brandSub}>Admin Panel</p>
            </div>
          </div>

          <nav className={styles.nav}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.sidebarBottom}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>{session.user?.name?.charAt(0).toUpperCase()}</div>
              <div>
                <p className={styles.userName}>{session.user?.name}</p>
                <p className={styles.userRole}>Administrator</p>
              </div>
            </div>
            <button className={styles.signoutBtn} onClick={() => signOut({ callbackUrl: '/admin' })} id="admin-signout">
              Sign Out
            </button>
            <Link href="/" className={styles.viewSiteLink} target="_blank" rel="noopener noreferrer">
              View Website
            </Link>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      <div className={styles.main}>
        <header className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">
            <span /><span /><span />
          </button>
          <h1 className={styles.pageTitle}>
            {navItems.find((n) => n.href === pathname)?.label ?? 'Admin Panel'}
          </h1>
        </header>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
