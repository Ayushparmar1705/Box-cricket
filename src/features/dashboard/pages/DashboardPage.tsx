import React, { useState } from 'react';
import { AdminHeader, AdminSidebar } from '../../../components/layout/AdminSidebar';
import { MetricsOverview } from '../components/MetricsOverview';
import { OwnerApprovalModule } from '../components/OwnerApprovalModule';
import { VenuesModule } from '../components/VenuesModule';
import { CourtsModule } from '../components/CourtsModule';
import { BookingsModule } from '../components/BookingsModule';
import { PaymentsModule } from '../components/PaymentsModule';
import { MasterDataModule } from '../components/MasterDataModule';
import { UsersStaffModule } from '../components/UsersStaffModule';
import { AuditLogsModule } from '../components/AuditLogsModule';

import { MOCK_OWNER_REQUESTS } from '../../../data/mockData';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'error';
}

const TAB_LABELS: Record<string, string> = {
  overview: 'myApplications',
  owner_verification: 'Owner Approvals & KYC',
  venues: 'Venues & Photo Gallery',
  courts: 'Courts & Dynamic Rates',
  slots_bookings: 'Slots & Live Bookings',
  payments: 'Payments & Coupons',
  master_data: 'Master Reference Data',
  users_staff: 'Users & Staff Roles',
  audit_logs: 'Security Audit Trail',
};

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [ownerRequests, setOwnerRequests] = useState(MOCK_OWNER_REQUESTS);

  const addToast = (text: string, type: ToastMessage['type'] = 'success') => {
    const newToast: ToastMessage = { id: String(Date.now()), text, type };
    setToasts((prev) => [newToast, ...prev]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4000);
  };

  const handleApproveOwner = (id: string, remark: string) => {
    setOwnerRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: 'APPROVED' as const, adminRemark: remark, approvedAt: new Date().toISOString() }
          : r
      )
    );
    addToast(`Owner Request ${id} approved successfully!`, 'success');
  };

  const handleRejectOwner = (id: string, remark: string) => {
    setOwnerRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: 'REJECTED' as const, adminRemark: remark, approvedAt: new Date().toISOString() }
          : r
      )
    );
    addToast(`Owner Request ${id} rejected`, 'error');
  };

  const handleLogout = () => {
    if (window.confirm('Sign out of Super Admin Console?')) {
      localStorage.removeItem('bc_admin_session');
      window.location.href = '/login';
    }
  };

  const pendingOwnerCount = ownerRequests.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex">
      {/* Floating Toast Notification Stack */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-2.5 px-4 py-3 bg-white border rounded-xl shadow-2xl text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200 ${
              toast.type === 'success'
                ? 'border-emerald-500/60 text-emerald-700'
                : toast.type === 'info'
                ? 'border-blue-500/60 text-blue-700'
                : 'border-red-500/60 text-red-700'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 size={16} className="text-emerald-600" />}
            {toast.type === 'info' && <Info size={16} className="text-blue-600" />}
            {toast.type === 'error' && <AlertTriangle size={16} className="text-red-600" />}
            <span>{toast.text}</span>
            <button
              type="button"
              className="text-slate-400 hover:text-slate-600 ml-2 cursor-pointer"
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Left Navigation Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingOwnerCount={pendingOwnerCount}
      />

      {/* Right Main Content Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          activeTabLabel={TAB_LABELS[activeTab] || 'myApplications'}
          onLogout={handleLogout}
        />

        <main className="p-6 sm:p-8 flex-1 overflow-y-auto max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && <MetricsOverview />}

          {activeTab === 'owner_verification' && (
            <OwnerApprovalModule
              requests={ownerRequests}
              onApprove={handleApproveOwner}
              onReject={handleRejectOwner}
            />
          )}

          {activeTab === 'venues' && <VenuesModule />}

          {activeTab === 'courts' && <CourtsModule />}

          {activeTab === 'slots_bookings' && <BookingsModule onNotify={addToast} />}

          {activeTab === 'payments' && <PaymentsModule />}

          {activeTab === 'master_data' && <MasterDataModule />}

          {activeTab === 'users_staff' && <UsersStaffModule />}

          {activeTab === 'audit_logs' && <AuditLogsModule />}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
