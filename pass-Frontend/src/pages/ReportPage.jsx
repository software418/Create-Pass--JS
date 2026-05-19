
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import {
  queryGet,
} from "@/shared/services/api";
import { Button } from '@/shared/ui/atoms/Button';
import { Calendar, Filter, Download, Search, FileText } from 'lucide-react';

const ReportsPage = () => {
  const [passes, setPasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('All');

  useEffect(() => {
    // Set default date range to current month
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    setError('');

    try {
      let queryParams = [];
      if (startDate) queryParams.push(`startDate=${startDate}`);
      if (endDate) queryParams.push(`endDate=${endDate}`);
      if (status !== 'All') queryParams.push(`status=${status}`);

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

      const response = await queryGet(`/capture${queryString}`, {}, { cache: true, ttlMs: 60000 });

      if (response.data && response.data.data) {
        setPasses(response.data.data);
      } else {
        setPasses([]);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (passes.length === 0) return;

    const headers = ['ID', 'Visitor Name', 'Company', 'Purpose', 'Status', 'Date', 'Host'];
    const csvContent = [
      headers.join(','),
      ...passes.map(p => [
        p.id,
        `"${p.name}"`,
        `"${p.companyName}"`,
        `"${p.purpose}"`,
        p.status,
        new Date(p.passDate).toLocaleDateString(),
        `"${p.toMeetWith}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `gate_passes_report_${startDate}_to_${endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-full font-sans">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="text-blue-600" size={28} />
            Visitor Reports
          </h1>
          <p className="text-slate-500 mt-2">Generate and export historical gate pass data.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleExportCSV}
            disabled={passes.length === 0 || isLoading}
            className="flex items-center gap-2"
          >
            <Download size={18} /> Export CSV
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg pl-3 pr-10 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
              />
              <Calendar className="absolute right-3 top-2.5 text-slate-400" size={18} pointerEvents="none" />
            </div>
          </div>

          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg pl-3 pr-10 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
              />
              <Calendar className="absolute right-3 top-2.5 text-slate-400" size={18} pointerEvents="none" />
            </div>
          </div>

          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-slate-300 rounded-lg pl-3 pr-10 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow appearance-none"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Checked-In">Checked-In</option>
                <option value="Checked-Out">Checked-Out</option>
                <option value="Rejected">Rejected</option>
              </select>
              <Filter className="absolute right-3 top-2.5 text-slate-400" size={18} pointerEvents="none" />
            </div>
          </div>

          <Button
            onClick={fetchReports}
            className="w-full md:w-auto flex items-center justify-center gap-2"
          >
            <Search size={18} /> Generate Report
          </Button>
        </div>
      </div>

      {/* Results Section */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full min-w-200 text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Visitor Info</th>
                <th className="py-4 px-6">Company / Purpose</th>
                <th className="py-4 px-6">Host</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <p>Loading reports data...</p>
                    </div>
                  </td>
                </tr>
              ) : passes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={32} className="text-slate-300" />
                      <p className="text-lg font-medium text-slate-600">No records found</p>
                      <p>Try adjusting your date range or filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                passes.map((pass) => (
                  <tr key={pass.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="font-medium">{new Date(pass.passDate).toLocaleDateString()}</div>
                      <div className="text-xs text-slate-500">{new Date(pass.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-900">{pass.name}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{pass.mobileNo}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-800">{pass.companyName}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{pass.purpose}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium">{pass.toMeetWith}</div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium 
                        ${pass.status === 'Approved' ? 'bg-green-100 text-green-700' :
                          pass.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                            pass.status === 'Checked-In' ? 'bg-blue-100 text-blue-700' :
                              pass.status === 'Checked-Out' ? 'bg-slate-100 text-slate-700' :
                                'bg-red-100 text-red-700'}`}>
                        {pass.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && passes.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 text-sm text-slate-600 flex justify-between items-center">
            <span>Total Records: <strong className="text-slate-900">{passes.length}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
