import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { LineChart } from '@mui/x-charts/LineChart';
import PagesList from '@/components/common/pagesList';
import { MousePointerClick, Eye, TrendingUp, ExternalLink } from 'lucide-react';

const Analytics = () => {
  const [linksData, setLinksData] = useState([]);
  const [graphData, setGraphData] = useState({ clicks: [], views: [], labels: [] });

  const username = useSelector(state => state.auth.user);

  const fetchLinksData = async () => {
    try {
      const response = await axios.get(`/api/user/socialLinks?username=${username}`);
      const data = response.data;
      setLinksData(data);

      const labels = data.map((_, index) => `Link ${index + 1}`);
      const clicks = data.map(link => link.clickCount || 0);
      const views = data.map(link => link.viewCount || 0);
      setGraphData({ labels, clicks, views });
    } catch (error) {
      console.error("Error fetching links data:", error);
    }
  };

  useEffect(() => {
    fetchLinksData();
  }, []);

  const totalClicks = linksData.reduce((sum, link) => sum + (link.clickCount || 0), 0);
  const totalViews = linksData.reduce((sum, link) => sum + (link.viewCount || 0), 0);
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";

  return (
    <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)' }}>
      <PagesList />

      <div className="flex-1 px-6 py-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-500 mt-1">Track your link performance and engagement</p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Total Clicks */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-bl-[80px]"></div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-4 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                <MousePointerClick size={22} className="text-white" />
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Clicks</p>
              <p className="text-3xl font-bold text-gray-900">{totalClicks.toLocaleString()}</p>
            </div>

            {/* Total Views */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-bl-[80px]"></div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-4 shadow-lg shadow-amber-200 group-hover:scale-110 transition-transform">
                <Eye size={22} className="text-white" />
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Views</p>
              <p className="text-3xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
            </div>

            {/* CTR */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-bl-[80px]"></div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mb-4 shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                <TrendingUp size={22} className="text-white" />
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">Click Rate</p>
              <p className="text-3xl font-bold text-gray-900">{ctr}%</p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Engagement Overview</h2>
            <div className="overflow-x-auto">
              <LineChart
                xAxis={[{ data: graphData.labels }]}
                series={[
                  { data: graphData.clicks, label: "Clicks", color: '#6366f1' },
                  { data: graphData.views, label: "Views", color: '#f59e0b' },
                ]}
                width={800}
                height={300}
              />
            </div>
          </div>

          {/* Links Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Links Breakdown</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {linksData.map((link, index) => (
                <div key={link._id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center shrink-0">
                        <ExternalLink size={16} className="text-indigo-500" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm">{link.title}</h3>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-500 hover:underline truncate block"
                        >
                          {link.url}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">{link.clickCount || 0}</p>
                        <p className="text-xs text-gray-400">clicks</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">{link.viewCount || 0}</p>
                        <p className="text-xs text-gray-400">views</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {linksData.length === 0 && (
                <div className="px-6 py-12 text-center text-gray-400">
                  <Eye size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No links yet</p>
                  <p className="text-sm">Add links to start tracking analytics</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
