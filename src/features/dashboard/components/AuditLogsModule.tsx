import React, { useState } from 'react';
import type { AuditLog } from '../../../types/schema.types';
import { MOCK_AUDIT_LOGS } from '../../../data/mockData';
import { ShieldCheck } from 'lucide-react';

export const AuditLogsModule: React.FC = () => {
  const [logs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="text-emerald-600" size={22} />
          System Audit Logs
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Review administrative platform actions and mutation history (Table: <code className="text-emerald-600 font-mono">audit_logs</code>)
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th className="px-5 py-3.5">Log ID</th>
              <th className="px-5 py-3.5">Admin Actor</th>
              <th className="px-5 py-3.5">Action</th>
              <th className="px-5 py-3.5">Target Table</th>
              <th className="px-5 py-3.5">Record ID</th>
              <th className="px-5 py-3.5">Source IP</th>
              <th className="px-5 py-3.5">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {logs.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3.5 font-mono text-slate-550">{l.id}</td>
                <td className="px-5 py-3.5 font-bold text-slate-900">{l.userName}</td>
                <td className="px-5 py-3.5 font-mono text-emerald-700 font-bold">{l.action}</td>
                <td className="px-5 py-3.5 text-slate-700 font-mono">{l.tableName}</td>
                <td className="px-5 py-3.5 text-slate-500 font-mono">{l.recordId}</td>
                <td className="px-5 py-3.5 text-slate-400 font-mono">{l.ipAddress}</td>
                <td className="px-5 py-3.5 text-slate-400 text-xs">{l.createdAt.slice(0, 19).replace('T', ' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
