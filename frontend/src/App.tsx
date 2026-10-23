import React, { useState } from 'react';
import { Sidebar, Page } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { BuildingsPage } from './pages/BuildingsPage';
import { EnergyPage } from './pages/EnergyPage';
import { OccupancyPage } from './pages/OccupancyPage';
import { InfrastructurePage } from './pages/InfrastructurePage';
import { TransportationPage } from './pages/TransportationPage';
import { AlertsPage } from './pages/AlertsPage';

const pages: Record<Page, React.FC> = {
  dashboard: DashboardPage,
  buildings: BuildingsPage,
  energy: EnergyPage,
  occupancy: OccupancyPage,
  infrastructure: InfrastructurePage,
  transportation: TransportationPage,
  alerts: AlertsPage,
};

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const PageComponent = pages[currentPage];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="lg:pl-60">
        <div className="mx-auto max-w-7xl px-4 py-6 pt-16 lg:pt-6">
          <PageComponent />
        </div>
      </main>
    </div>
  );
}

export default App;
