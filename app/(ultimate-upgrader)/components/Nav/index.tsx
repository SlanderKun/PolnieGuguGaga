'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './styles.module.css';

const LINKS = [
  { href: '/cases', label: 'Кейсы' },
  { href: '/upgrader', label: 'Апгрейдер' },
  { href: '/withdraw', label: 'Вывод' },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav className={styles.nav}>
      {LINKS.map((l) => {
        const active = l.href === '/cases' ? path.startsWith('/cases') : path === l.href;
        return (
          <Link key={l.href} href={l.href} className={`${styles.link}${active ? ` ${styles.active}` : ''}`}>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
