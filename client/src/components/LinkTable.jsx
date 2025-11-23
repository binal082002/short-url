import API from "../api";

export default function LinkTable({ links, refresh }) {

  const deleteLink = async (code) => {
    if (!window.confirm("Delete this link?")) return;

    try {
      await API.delete(`/links/${code}`);
      refresh();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full bg-white border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Short Code</th>
            <th className="p-3 text-left">Target URL</th>
            <th className="p-3 text-left">Clicks</th>
            <th className="p-3 text-left">Last Clicked</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {links.map((l) => (
            <tr key={l.shortCode} className="border-t">
              <td className="p-3">{l.shortCode}</td>
              <td className="p-3">
                <a
                  href={l.originalUrl}
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  {l.originalUrl}
                </a>
              </td>
              <td className="p-3">{l.clicks}</td>
              <td className="p-3">
                {l.lastAccessedAt ? new Date(l.lastAccessedAt).toLocaleString() : "—"}
              </td>
              <td className="p-3">
                <button
                  onClick={() => deleteLink(l.shortCode)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {links.length === 0 && (
            <tr>
              <td className="p-4 text-center text-gray-500" colSpan="5">
                No links found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
