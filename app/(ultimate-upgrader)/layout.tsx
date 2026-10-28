import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import './styles/global.css';
import Providers from './components/Providers';
import { GameProvider } from './lib/game-context';

export const metadata: Metadata = {
  title: 'UpgraderOchkaOsla',
  description: 'Самый честный апгрейдер (нет)',
};

export default function UltimateUpgraderLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <GameProvider>{children}</GameProvider>
    </Providers>
  );
}
