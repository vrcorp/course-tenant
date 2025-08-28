import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AffiliatorDashboard from '../pages/affiliatr/Dashboard';
import AffiliatorLinks from '../pages/affiliatr/Links';
import AffiliatorCommissions from '../pages/affiliatr/Commissions';
import AffiliatorPayouts from '../pages/affiliatr/Payouts';
import AffiliatorAssets from '../pages/affiliatr/Assets';
import AffiliatorReports from '../pages/affiliatr/Reports';
import AffiliatorAnalytics from '../pages/affiliatr/Analytics';

const AffiliatorRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<AffiliatorDashboard />} />
      <Route path="dashboard" element={<AffiliatorDashboard />} />
      <Route path="links" element={<AffiliatorLinks />} />
      <Route path="commissions" element={<AffiliatorCommissions />} />
      <Route path="payouts" element={<AffiliatorPayouts />} />
      <Route path="assets" element={<AffiliatorAssets />} />
      <Route path="reports" element={<AffiliatorReports />} />
      <Route path="analytics" element={<AffiliatorAnalytics />} />
    </Routes>
  );
};

export default AffiliatorRoutes;
