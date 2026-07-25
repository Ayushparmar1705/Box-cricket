import OwnerRequest from '../../auth/hooks/OwnerRequest';
import DataTable from '../../../components/common/Table';

export function OwnerApprovalModule() {
  const columns = [
    {
      id: "businessName",
      title: "Business Name",
    },
    {
      id: "businessType",
      title: "Business Type",
    },
    {
      id: "gstNumber",
      title: "GST Number",
    },

    {
      id: "status",
      title: "Status",
    },
    {
      id: "actions",
      title: "Actions",
      render: (_row: any) => (
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
            Approve
          </button>
          <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
            Reject
          </button>
        </div>
      ),
    },
  ];

  const { loading, result } = OwnerRequest();

  return (
    <div>
      <DataTable
        columns={columns}
        values={result}
        loading={loading}
        emptyMessage="No Owner Approval found"
      />
    </div>
  );
}

export default OwnerApprovalModule;
