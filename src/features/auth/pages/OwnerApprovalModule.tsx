import { useEffect, useState } from 'react';
import { X, FileText, Building2, User, CreditCard, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import DataTable from '../../../components/common/Table/DataTable';
import OwnerRequest from '../../auth/hooks/OwnerRequest';

/* ── Document Viewer Modal ─────────────────────────────────── */
function DocumentModal({ row, onClose }: { row: any; onClose: () => void }) {
  const fields = [
    { icon: Building2, label: 'Business Name', value: row.businessName },
    { icon: Building2, label: 'Business Type', value: row.businessType },
    { icon: CreditCard, label: 'GST Number', value: row.gstNumber },
    { icon: User, label: 'Owner Name', value: row.ownerName || row.name },
    { icon: Mail, label: 'Email', value: row.email },
    { icon: Phone, label: 'Phone', value: row.phone || row.phoneNumber },
    { icon: MapPin, label: 'Address', value: row.address || row.city },
    { icon: FileText, label: 'Status', value: row.status },
  ].filter((f) => f.value);

  // Collect document URLs from common field names
  const docFields = [
    { label: 'PAN Card', value: row.panCard || row.panCardUrl },
    { label: 'Aadhaar Card', value: row.aadhaarCard || row.aadhaarUrl },
    { label: 'GST Certificate', value: row.gstCertificate || row.gstUrl },
    { label: 'Bank Passbook', value: row.bankPassbook || row.bankUrl },
    { label: 'Venue Photo', value: row.venuePhoto || row.photoUrl },
    { label: 'Electricity Bill', value: row.electricityBill },
    { label: 'Rent Agreement', value: row.rentAgreement },
  ].filter((d) => d.value);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-[#111827] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20">
              <FileText size={20} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Owner Documents</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{row.businessName || 'KYC Verification'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Business Info Grid */}
          {fields.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                Business Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800/60">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0 shadow-sm">
                      <Icon size={14} className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate mt-0.5">{String(value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Status Badge */}
          <section className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">KYC Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${String(row.status).toLowerCase() === 'approved'
                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                : String(row.status).toLowerCase() === 'rejected'
                  ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'
                  : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                }`}
            >
              {row.status || 'Pending'}
            </span>
          </section>

          {/* Documents Section */}
          {docFields.length > 0 ? (
            <section>
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                Uploaded Documents
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {docFields.map(({ label, value }) => (
                  <a
                    key={label}
                    href={String(value)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-indigo-50/50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center shrink-0">
                      <FileText size={15} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="text-sm font-medium text-indigo-900 dark:text-indigo-100 group-hover:underline truncate flex-1">{label}</span>
                    <ExternalLink size={14} className="text-indigo-400 dark:text-indigo-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </section>
          ) : (
            <div className="flex flex-col items-center gap-3 py-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-gray-400 dark:text-gray-500 bg-gray-50/50 dark:bg-gray-800/20">
              <FileText size={32} className="opacity-50" />
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No documents uploaded yet</p>
                <p className="text-xs mt-1">Documents will appear here once the owner uploads them</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 rounded-b-2xl flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
          >
            Close
          </button>
          <button className="px-5 py-2.5 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 cursor-pointer transition-colors shadow-sm">
            Reject
          </button>
          <button className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 cursor-pointer transition-colors shadow-sm">
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Owner Approval Module ─────────────────────────────────── */
export function OwnerApprovalModule() {
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  const columns = [
    { id: 'businessName', title: 'Business Name' },
    { id: 'businessType', title: 'Business Type' },
    { id: 'gstNumber', title: 'GST Number' },
    {
      id: 'status',
      title: 'Status',
      render: (row: any) => (
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${String(row.status).toLowerCase() === 'approved'
            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
            : String(row.status).toLowerCase() === 'rejected'
              ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'
              : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
            }`}
        >
          {row.status || 'Pending'}
        </span>
      ),
    },
    {
      id: 'actions',
      title: 'Actions',
      render: (row: any) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setSelectedRow(row)}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold rounded-lg cursor-pointer transition-colors flex items-center gap-1.5"
          >
            <FileText size={14} />
            Review
          </button>
          <button className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-lg cursor-pointer transition-colors border border-emerald-200 dark:border-emerald-500/30">
            Approve
          </button>
          <button className="px-3 py-1.5 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-lg cursor-pointer transition-colors border border-rose-200 dark:border-rose-500/30">
            Reject
          </button>
        </div>
      ),
    },
  ];

  const { loading, result } = OwnerRequest();
  useEffect(() => {
    console.log(result);
  })

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Owner Approvals & KYC</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review and approve new venue owner registrations</p>
        </div>
      </div>
      <DataTable
        columns={columns}
        values={result}
        loading={loading}
        emptyMessage="No owner approval requests found"
      />

      {/* Document Viewer Modal */}
      {selectedRow && (
        <DocumentModal row={selectedRow} onClose={() => setSelectedRow(null)} />
      )}
    </div>
  );
}

export default OwnerApprovalModule;
