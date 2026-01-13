import { Download, ChevronLeft, ChevronRight, Mail } from 'lucide-react';

interface DataRow {
  SchoolName: string;
  Number: string;
  Address: string;
  Website: string;
  Email: string | null;
  ResponseNotCustomerSupport: string | null;
  id: number;
  createdAt: string;
  updatedAt: string;
}

interface DataTableProps {
  data: DataRow[];
  currentPage: number;
  onPageChange: (page: number) => void;
  onSendEmail: () => void;
  isSendingEmail: boolean;
}

const RECORDS_PER_PAGE = 20;

export default function DataTable({ data, currentPage, onPageChange, onSendEmail, isSendingEmail }: DataTableProps) {
  const totalPages = Math.ceil(data.length / RECORDS_PER_PAGE);
  const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
  const endIndex = startIndex + RECORDS_PER_PAGE;
  const paginatedData = data.slice(startIndex, endIndex);

  const downloadCSV = () => {
    if (data.length === 0) return;

    const headers = ['School Name', 'Number', 'Address', 'Website', 'Email'];
    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        `"${row.SchoolName?.replace(/"/g, '""') || ''}"`,
        `"${row.Number?.replace(/"/g, '""') || ''}"`,
        `"${row.Address?.replace(/"/g, '""') || ''}"`,
        `"${row.Website?.replace(/"/g, '""') || ''}"`,
        `"${row.Email?.replace(/"/g, '""') || ''}"`,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `scraped_data_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center gap-4 flex-wrap">
        <h2 className="text-xl font-bold text-gray-800">
          Results ({data.length} records)
        </h2>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            <Download size={18} />
            Download CSV
          </button>
          <button
            onClick={onSendEmail}
            disabled={isSendingEmail}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            {isSendingEmail ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
                <Mail size={18} />
                Send Email
              </>
            )}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                School Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Website
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Email
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-900">{row.SchoolName}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{row.Number}</td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={row.Address}>
                  {row.Address}
                </td>
                <td className="px-6 py-4 text-sm">
                  {row.Website ? (
                    <a
                      href={row.Website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline truncate block max-w-xs"
                      title={row.Website}
                    >
                      Visit Site
                    </a>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {row.Email ? (
                    <a href={`mailto:${row.Email}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                      {row.Email}
                    </a>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} records
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => onPageChange(i + 1)}
                  className={`px-3 py-2 rounded-lg transition ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
