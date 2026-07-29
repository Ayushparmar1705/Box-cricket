import { useState } from 'react';
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#003365] flex items-center justify-center">
              <FileText size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Owner Documents</h2>
              <p className="text-xs text-slate-500">{row.businessName || 'KYC Verification'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-red-50 hover:text-red-600 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Business Info Grid */}
          {fields.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                Business Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {fields.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                      <Icon size={14} className="text-slate-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
                      <p className="text-sm font-semibold text-slate-800 truncate mt-0.5">{String(value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Status Badge */}
          <section className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">KYC Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold border ${String(row.status).toLowerCase() === 'approved'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : String(row.status).toLowerCase() === 'rejected'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
            >
              {row.status || 'Pending'}
            </span>
          </section>

          {/* Documents Section */}
          {docFields.length > 0 ? (
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                Uploaded Documents
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {docFields.map(({ label, value }) => (
                  <a
                    key={label}
                    href={String(value)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white border border-blue-200 flex items-center justify-center shrink-0">
                      <FileText size={15} className="text-[#003365]" />
                    </div>
                    <span className="text-sm font-semibold text-[#003365] group-hover:underline truncate flex-1">{label}</span>
                    <ExternalLink size={12} className="text-blue-400 shrink-0" />
                  </a>
                ))}
              </div>
            </section>
          ) : (
            <div className="flex flex-col items-center gap-2 py-6 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
              <FileText size={28} className="opacity-40" />
              <p className="text-sm font-medium">No documents uploaded yet</p>
              <p className="text-xs">Documents will appear here once the owner uploads them</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 cursor-pointer transition-colors">
            Approve
          </button>
          <button className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 cursor-pointer transition-colors">
            Reject
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
          className={`px-2 py-0.5 rounded-full text-xs font-bold border ${String(row.status).toLowerCase() === 'approved'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : String(row.status).toLowerCase() === 'rejected'
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
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
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setSelectedRow(row)}
            className="px-3 py-1.5 bg-[#003365] text-white text-xs font-semibold rounded-lg hover:bg-[#004a8f] cursor-pointer transition-colors flex items-center gap-1"
          >
            <FileText size={12} />
            View
          </button>
          <button className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 cursor-pointer transition-colors">
            Approve
          </button>
          <button className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 cursor-pointer transition-colors">
            Reject
          </button>
        </div>
      ),
    },
  ];

  const { loading, result } = OwnerRequest();

  return (
    <>
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
    </>
  );
}

export default OwnerApprovalModule;
