import React, { useState } from 'react';
import type { OwnerRequest, OwnerDocument } from '../../../types/schema.types';
import { MOCK_OWNER_DOCUMENTS } from '../../../data/mockData';
import { FileText, Building, ShieldCheck, Clock, Eye, ExternalLink, X, Check } from 'lucide-react';

interface Props {
  requests: OwnerRequest[];
  onApprove: (id: string, remark: string) => void;
  onReject: (id: string, remark: string) => void;
}

export const OwnerApprovalModule: React.FC<Props> = ({ requests, onApprove, onReject }) => {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [selectedReq, setSelectedReq] = useState<OwnerRequest | null>(null);
  const [remark, setRemark] = useState('');
  const [documents] = useState<OwnerDocument[]>(MOCK_OWNER_DOCUMENTS);

  const filtered = requests.filter((r) => filter === 'ALL' || r.status === filter);

  const handleAction = (status: 'APPROVED' | 'REJECTED') => {
    if (!selectedReq) return;
    if (status === 'APPROVED') {
      onApprove(selectedReq.id, remark || 'GST & KYC verified successfully');
    } else {
      onReject(selectedReq.id, remark || 'KYC documents not matching corporate registry');
    }
    setSelectedReq(null);
    setRemark('');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Owner Verification & Approvals</h2>
          <p className="text-xs text-slate-500 mt-1">Review owner registration applications and verify GST details</p>
        </div>
        <div className="flex bg-slate-100 border border-slate-200 p-1 rounded-xl w-fit">
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === f ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th className="px-5 py-3.5">Req ID</th>
              <th className="px-5 py-3.5">Applicant</th>
              <th className="px-5 py-3.5">Business & GST</th>
              <th className="px-5 py-3.5">KYC Documents</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                  No requests found matching status "{filter}".
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-slate-500">{r.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900">{r.userName}</div>
                    <div className="text-xs text-slate-400">{r.userEmail}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-slate-800 flex items-center gap-1"><Building size={14} className="text-emerald-600" />{r.businessName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">GST: {r.gstNumber} ({r.businessType})</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 text-xs bg-slate-100 px-2 py-1 rounded-lg text-slate-700">
                      <FileText size={13} className="text-slate-500" /> {r.documentsCount} Files
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      r.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      r.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {r.status === 'PENDING' && <Clock size={12} />}
                      {r.status === 'APPROVED' && <ShieldCheck size={12} />}
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {r.status === 'PENDING' ? (
                      <button
                        type="button"
                        onClick={() => setSelectedReq(r)}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1"
                      >
                        <Eye size={13} /> Review
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 italic">{r.adminRemark || 'Done'}</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedReq && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Verify Owner Request</h3>
              <button type="button" className="text-slate-400 hover:text-slate-600 text-xl" onClick={() => setSelectedReq(null)}>&times;</button>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col gap-1.5">
              <div><strong>Applicant:</strong> {selectedReq.userName} ({selectedReq.userEmail})</div>
              <div><strong>Business Name:</strong> {selectedReq.businessName}</div>
              <div><strong>GST Registration:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-emerald-700">{selectedReq.gstNumber}</code></div>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="text-xs font-bold text-slate-700">Uploaded documents:</div>
              <div className="grid grid-cols-2 gap-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                      <span>{doc.documentType}</span>
                      <span className="text-emerald-600">{doc.verificationStatus}</span>
                    </div>
                    <img src={doc.documentUrl} alt={doc.documentType} className="h-20 w-full object-cover rounded border border-slate-200" />
                    <a href={doc.documentUrl} target="_blank" rel="noreferrer" className="text-[10px] text-emerald-600 flex items-center gap-0.5"><ExternalLink size={10} /> View File</a>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Admin Remark</label>
              <input
                type="text"
                placeholder="Remarks e.g. Validated with government portal"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleAction('REJECTED')}
                className="flex items-center gap-1 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-bold hover:bg-red-100 cursor-pointer"
              >
                <X size={14} /> Reject
              </button>
              <button
                type="button"
                onClick={() => handleAction('APPROVED')}
                className="flex items-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                <Check size={14} /> Approve Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
