import { Route, Routes } from 'react-router-dom'
import { ProtectedLayout } from '@/components/layout/protected-layout'
import { CustomerProfilePage } from '@/pages/customer-profile'
import { CustomersPage } from '@/pages/customers'
import { DashboardPage } from '@/pages/dashboard'
import { MetricDetailPage } from '@/pages/metric-detail'
import { SalesPage } from '@/pages/sales'
import { SignInPage } from '@/pages/sign-in'

export default function App() {
  return (
    <Routes>
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/metrics/:widgetId" element={<MetricDetailPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/customers/:customerId" element={<CustomerProfilePage />} />
      </Route>
    </Routes>
  )
}
