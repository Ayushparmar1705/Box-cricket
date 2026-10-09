import React, { useEffect, useState } from 'react';
import {
  FileText,
  Building2,
  Mail,
  Phone,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  FileCheck,
  AlertTriangle,
  X,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getOwnerRequestsApi, approveOwnerRequestApi, rejectOwnerRequestApi } from '../services/ProfileService';

export interface OwnerDocument {
  id?: number;
  user_id?: number;
  owner_request_id?: number;
  document_type: string; // e.g. "ADHAR_CARD", "PAN_CARD"
  document_url: string;
  uploaded_at?: string | null;
}

export interface OwnerRequestItem {
  id?: number | string;
  _id?: number | string;
  userId?: number | string;
  user_id?: number | string;
  business_name: string;
  business_type: string;
  gstn_number?: string;
  contact_email: string;
  contact_number: string;
  pan_file?: string;
  adhar_file?: string;
  pan_card?: string;
  adhar_card?: string;
  status?: string;
  documents?: OwnerDocument[];
  createdAt?: string;
  created_at?: string;
  [key: string]: any;
}

const OwnerRequestManager: React.FC = () => {
  const [requests, setRequests] = useState<OwnerRequestItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedRequest, setSelectedRequest] = useState<OwnerRequestItem | null>(null);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<number | string | null>(null);

  const handleApprove = async (id: number | string) => {
    try {
      setApprovingId(id);
      const res = await approveOwnerRequestApi(id);
      if (res.success || res.status === 200 || res.status === '200') {
        toast.success(res.message || 'Owner request approved successfully!');
        setRequests(prev => prev.map(r => (String(r.id || r._id) === String(id) ? { ...r, status: 'APPROVED' } : r)));
      } else {
        toast.error(res.message || 'Failed to approve request');
      }
    } catch (err: any) {
      console.error('Error approving owner request:', err);
      toast.error('Failed to approve request');
    } finally {
      setApprovingId(null);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await getOwnerRequestsApi();
      console.log('Owner requests API response:', response);

      let dataList: OwnerRequestItem[] = [];
      if (Array.isArray(response)) {
        dataList = response;
      } else if (response && Array.isArray(response.data)) {
        dataList = response.data;
      } else if (response && Array.isArray(response.result)) {
        dataList = response.result;
      } else if (response && Array.isArray(response.requests)) {
        dataList = response.requests;
      } else if (response && response.success && response.data) {
        dataList = Array.isArray(response.data) ? response.data : [response.data];
      }

      setRequests(dataList);
    } catch (err: any) {
      console.error('Failed to load owner requests:', err);
      setApiError(err?.message || 'Failed to fetch owner requests');
      toast.error('Failed to load turf owner requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      (req.business_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.contact_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.contact_number || '').includes(searchTerm) ||
      (req.gstn_number || '').toLowerCase().includes(searchTerm.toLowerCase());

    const status = (req.status || 'PENDING').toUpperCase();
    const matchesStatus = statusFilter === 'ALL' || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (statusStr?: string) => {
    const status = (statusStr || 'PENDING').toUpperCase();
    if (status === 'APPROVED' || status === 'ACCEPT') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 size={13} />
          Approved
        </span>
      );
    }
    if (status === 'REJECTED' || status === 'DECLINED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
          <XCircle size={13} />
          Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
        <Clock size={13} className="animate-pulse" />
        Pending
      </span>
    );
  };

  const getFileUrl = (filePath?: string) => {
    return filePath;
  };

  const getDocUrl = (req: OwnerRequestItem, docType: 'PAN_CARD' | 'ADHAR_CARD'): string | null => {
    if (Array.isArray(req.documents) && req.documents.length > 0) {
      const found = req.documents.find((d) => d.document_type?.toUpperCase() === docType);
      if (found?.document_url) return found.document_url;
    }
    if (docType === 'PAN_CARD') return req.pan_file || req.pan_card || null;
    if (docType === 'ADHAR_CARD') return req.adhar_file || req.adhar_card || null;
    return null;
  };

  return (
    <div className="w-full text-slate-100 space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl bg-[#0d1322] border border-slate-800 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide uppercase">
              <FileCheck size={14} />
              Turf Owner Applications
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Turf Owner Requests
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed">
              Review and manage incoming registrations from prospective turf owners, verify tax and KYC document images.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchRequests}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl border border-slate-700/80 text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {apiError && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs sm:text-sm font-medium flex items-center gap-3 shadow-lg">
          <AlertTriangle size={18} className="shrink-0" />
          <span>API Error: {apiError}</span>
        </div>
      )}

      {/* Analytics Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Total Requests</span>
            <FileText size={18} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{requests.length}</div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Pending Approvals</span>
            <Clock size={18} className="text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400">
            {requests.filter(r => !r.status || r.status.toUpperCase() === 'PENDING').length}
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Approved Owners</span>
            <CheckCircle2 size={18} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">
            {requests.filter(r => r.status && ['APPROVED', 'ACCEPT'].includes(r.status.toUpperCase())).length}
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Rejected Requests</span>
            <XCircle size={18} className="text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400">
            {requests.filter(r => r.status && ['REJECTED', 'DECLINED'].includes(r.status.toUpperCase())).length}
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-5 border-b border-slate-800 bg-[#090e1a] flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, email, GST..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${statusFilter === st
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-slate-400 text-xs font-semibold flex flex-col items-center justify-center gap-3">
              <RefreshCw size={24} className="animate-spin text-emerald-400" />
              <span>Fetching turf owner applications...</span>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs space-y-2">
              <Building2 size={32} className="mx-auto text-slate-600 mb-1" />
              <p className="text-slate-300 font-bold text-sm">No Owner Requests Found</p>
              <p className="text-slate-500 max-w-sm mx-auto">
                {searchTerm || statusFilter !== 'ALL'
                  ? 'No applications match your current search or filter criteria.'
                  : 'There are currently no owner applications submitted.'}
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090e1a] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-4"># ID</th>
                  <th className="px-5 py-4">Business & Type</th>
                  <th className="px-5 py-4">Contact Info</th>
                  <th className="px-5 py-4">GST Number</th>
                  <th className="px-5 py-4">KYC Document Images</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {filteredRequests.map((req, idx) => {
                  const reqId = req.id || req._id || idx + 1;
                  const panUrl = getDocUrl(req, 'PAN_CARD');
                  const adharUrl = getDocUrl(req, 'ADHAR_CARD');

                  return (
                    <tr key={reqId} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-slate-400">
                        #{reqId}
                      </td>
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-bold text-white text-sm flex items-center gap-1.5">
                            <Building2 size={14} className="text-emerald-400" />
                            {req.business_name}
                          </p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400 uppercase">
                            {req.business_type || 'SOLO'}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 space-y-1">
                        <p className="text-slate-300 font-medium flex items-center gap-1.5">
                          <Mail size={12} className="text-slate-500" />
                          {req.contact_email}
                        </p>
                        <p className="text-slate-400 flex items-center gap-1.5">
                          <Phone size={12} className="text-slate-500" />
                          {req.contact_number}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                          {req.gstn_number || 'N/A'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Aadhaar Badge / Image thumbnail button */}
                          {adharUrl ? (
                            <button
                              type="button"
                              onClick={() => setPreviewImage({ url: getFileUrl(adharUrl), title: `${req.business_name} - Aadhaar Card` })}
                              className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[11px] font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <ImageIcon size={12} />
                              Aadhaar Card
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-500">No Aadhaar</span>
                          )}

                          {/* PAN Badge / Image thumbnail button */}
                          {panUrl ? (
                            <button
                              type="button"
                              onClick={() => setPreviewImage({ url: getFileUrl(panUrl), title: `${req.business_name} - PAN Card` })}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <ImageIcon size={12} />
                              PAN Card
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-500">No PAN</span>
                          )}

                          {/* Any extra custom documents returned in array */}
                          {Array.isArray(req.documents) &&
                            req.documents
                              .filter((d) => !['PAN_CARD', 'ADHAR_CARD'].includes(d.document_type?.toUpperCase()))
                              .map((doc, dIdx) => (
                                <a
                                  key={dIdx}
                                  href={getFileUrl(doc.document_url)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                                >
                                  <FileText size={11} />
                                  {doc.document_type || 'Document'}
                                </a>
                              ))}
                        </div>
                      </td>
                      <td className="px-5 py-4">{getStatusBadge(req.status)}</td>
                      <td className="px-5 py-4 text-right">
                        {req.status?.toUpperCase() === 'APPROVED' ? (
                          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl inline-flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            Approved
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={approvingId === reqId}
                            onClick={() => handleApprove(reqId)}
                            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                          >
                            {approvingId === reqId ? (
                              <>
                                <RefreshCw size={13} className="animate-spin" />
                                <span>Approving...</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 size={13} />
                                <span>Approve</span>
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Details View Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0d1322] border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl relative overflow-hidden text-white animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />

            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-[#090e1a]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    {selectedRequest.business_name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Turf Owner Application Details
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Business Type
                  </span>
                  <span className="text-xs font-bold text-white uppercase">
                    {selectedRequest.business_type || 'SOLO'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                    GST Number
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    {selectedRequest.gstn_number || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block">Email Address</span>
                    <span className="text-xs font-semibold text-white break-all">
                      {selectedRequest.contact_email}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block">Contact Phone</span>
                    <span className="text-xs font-semibold text-white">
                      {selectedRequest.contact_number}
                    </span>
                  </div>
                </div>
              </div>

              {/* Uploaded Document Images */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Uploaded Document Images
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Aadhaar Card Preview */}
                  {(() => {
                    const adharUrl = getDocUrl(selectedRequest, 'ADHAR_CARD');
                    return (
                      <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                            <ImageIcon size={14} />
                            Aadhaar Card
                          </span>
                          {adharUrl && (
                            <a
                              href={getFileUrl(adharUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                            >
                              Open <ExternalLink size={11} />
                            </a>
                          )}
                        </div>

                        {adharUrl ? (
                          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-2 flex items-center justify-center min-h-[160px]">
                            <img
                              src={getFileUrl(adharUrl)}
                              alt="Aadhaar Card Document"
                              className="max-h-48 object-contain w-full rounded-lg cursor-pointer hover:scale-105 transition-transform"
                              onClick={() => setPreviewImage({ url: getFileUrl(adharUrl), title: `${selectedRequest.business_name} - Aadhaar Card` })}
                            />
                          </div>
                        ) : (
                          <div className="p-8 text-center text-slate-500 text-xs bg-slate-950/40 rounded-xl border border-slate-800">
                            No Aadhaar card image uploaded
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* PAN Card Preview */}
                  {(() => {
                    const panUrl = getDocUrl(selectedRequest, 'PAN_CARD');
                    return (
                      <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                            <ImageIcon size={14} />
                            PAN Card
                          </span>
                          {panUrl && (
                            <a
                              href={getFileUrl(panUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                            >
                              Open <ExternalLink size={11} />
                            </a>
                          )}
                        </div>

                        {panUrl ? (
                          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-2 flex items-center justify-center min-h-[160px]">
                            <img
                              src={getFileUrl(panUrl)}
                              alt="PAN Card Document"
                              className="max-h-48 object-contain w-full rounded-lg cursor-pointer hover:scale-105 transition-transform"
                              onClick={() => setPreviewImage({ url: getFileUrl(panUrl), title: `${selectedRequest.business_name} - PAN Card` })}
                            />
                          </div>
                        ) : (
                          <div className="p-8 text-center text-slate-500 text-xs bg-slate-950/40 rounded-xl border border-slate-800">
                            No PAN card image uploaded
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-800 bg-[#090e1a] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* High Resolution Image Lightbox Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-in fade-in duration-200">
          <div className="bg-[#0d1322] border border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl relative overflow-hidden text-white p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <ImageIcon size={16} className="text-emerald-400" />
                {previewImage.title}
              </h3>
              <div className="flex items-center gap-2">
                <a
                  href={previewImage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg flex items-center gap-1 transition-colors"
                >
                  <ExternalLink size={13} />
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden bg-slate-950 p-3 flex items-center justify-center max-h-[70vh]">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="max-h-[65vh] object-contain rounded-xl shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerRequestManager;
