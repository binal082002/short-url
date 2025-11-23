import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";

export default function StatsPage() {
  const { code } = useParams();
  const [data, setData] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadStats();
  }, [code]);

  const loadStats = async () => {
    try {
      const res = await API.get(`/links/${code}`);
      if (res) setData(res.data);
    } catch (error) {
      setNotFound(true);
      console.error(error);
    }
  };

  if (notFound) return <div className="p-6 text-center">Not found</div>;

  if (!notFound && !data) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Short code: <span className="text-blue-600">{code}</span>
        </h1>

        <div className="space-y-4">
          {/* Original URL */}
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600 font-medium">Original URL</span>
            <a
              href={data.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all max-w-[200px] text-right"
            >
              {data.originalUrl}
            </a>
          </div>

          {/* Total Clicks */}
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600 font-medium">Total Clicks</span>
            <span className="text-gray-800 font-semibold">{data.clicks}</span>
          </div>

          {/* Created At */}
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600 font-medium">Created At</span>
            <span className="text-gray-800">
              {new Date(data.createdAt).toLocaleString()}
            </span>
          </div>

          {/* Last Click */}
          <div className="flex justify-between items-center pb-2">
            <span className="text-gray-600 font-medium">Last Click</span>
            <span className="text-gray-800">
              {data.lastAccessedAt
                ? new Date(data.lastAccessedAt).toLocaleString()
                : "Never"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
