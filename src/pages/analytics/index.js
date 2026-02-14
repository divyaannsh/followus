import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { LineChart } from '@mui/x-charts/LineChart';
import Header from '@/components/home/header';
import PagesList from '@/components/common/pagesList';
import Footer from '@/components/common/footer';

const Analytics = () => {
  const [linksData, setLinksData] = useState([]);
  const [graphData, setGraphData] = useState({ clicks: [], views: [], labels: [] });

  const username = useSelector(state => state.auth.user);

  const fetchLinksData = async () => {
    try {
      const response = await axios.get(`/api/user/socialLinks?username=${username}`);
      const data = response.data;
      setLinksData(data);

      // Prepare Graph Data
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

  return (
  <>
    <div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Sidebar */}
      <PagesList />

      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Analytics Overview
        </h1>

        {/* Graph */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Engagement Overview</h2>
          <div className="overflow-x-auto">
            <LineChart
              xAxis={[{ data: graphData.labels }]}
              series={[
                { data: graphData.clicks, label: "Clicks" },
                { data: graphData.views, label: "Views" },
              ]}
              width={1000}
              height={300}
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Total Clicks</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalClicks}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Total Views</h3>
            <p className="text-3xl font-bold text-yellow-500 dark:text-yellow-400">{totalViews}</p>
          </div>
        </div>

        {/* Links Breakdown */}
        <div className="mt-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Links Breakdown</h2>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {linksData.map(link => (
              <li key={link._id} className="py-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{link.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>URL:</strong>{' '}
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {link.url}
                  </a>
                </p>
                <div className="flex justify-between mt-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Clicks: {link.clickCount}</span>
                  <span className="font-medium">Views: {link.viewCount}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    <Footer/>
  </>
  );
};

export default Analytics;
