import { useEffect, useState } from "react";

export default function HealthPage() {
  const [status, setStatus] = useState(null);

  async function toJson(res) {
    if (!res.ok) throw new Error("Failed to fetch health data");
    return res.json();
  }

  useEffect(() => {
    fetch("http://localhost:5000/healthz")
      .then(toJson)
      .then((data) => setStatus(data))
      .catch((err) => {
        console.error(err);
        setStatus({ ok: false, version: "-", timestamp: "-", uptime: "-" });
      });
  }, []);

  if (!status) return <div className="p-6">Checking...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">
          System Health
        </h1>

        <div className="space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600 font-medium">Status</span>
            <span
              className={`font-bold ${
                status.ok ? "text-green-600" : "text-red-600"
              }`}
            >
              {status.ok ? "🟢 OK" : "🔴 DOWN"}
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600 font-medium">Version</span>
            <span className="text-gray-800">{status.version}</span>
          </div>

          <div className="flex justify-between pb-2">
            <span className="text-gray-600 font-medium">Server Time</span>
            <span className="text-gray-800">{status.timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
