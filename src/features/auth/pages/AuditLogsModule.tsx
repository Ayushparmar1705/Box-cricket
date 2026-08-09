import React, { useState } from 'react';
import type { AuditLog } from '../../../types/schema.types';
import { MOCK_AUDIT_LOGS } from '../../../data/mockData';
import { ShieldCheck } from 'lucide-react';

export const AuditLogsModule: React.FC = () => {
  const [logs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-3">
          <ShieldCheck className="text-indigo-600 dark:text-indigo-400" size={28} />
          System Audit Logs
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Review administrative platform actions and mutation history (Table: <code className="text-indigo-600 dark:text-indigo-400 font-mono bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded text-xs">audit_logs</code>)
        </p>
      </div>

      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Log ID</th>
                <th className="px-6 py-4">Admin Actor</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Target Table</th>
                <th className="px-6 py-4">Record ID</th>
                <th className="px-6 py-4">Source IP</th>
                <th className="px-6 py-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50 text-sm">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">{l.id}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">{l.userName}</td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider border border-gray-200 dark:border-gray-700">
                      {l.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-mono text-xs">{l.tableName}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs">{l.recordId}</td>
                  <td className="px-6 py-4 text-gray-400 dark:text-gray-500 font-mono text-xs">{l.ipAddress}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs text-right">{l.createdAt.slice(0, 19).replace('T', ' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
