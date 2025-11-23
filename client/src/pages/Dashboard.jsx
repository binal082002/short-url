import { useEffect, useState } from "react";
import AddLinkModal from "../components/AddLinkModal";
import LinkTable from "../components/LinkTable";
import API from "../api";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [search, setSearch] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);

  const fetchLinks = async () => {
    const res = await API.get(`/links?search=${search}`);
    setLinks(res.data.results);
  };

  useEffect(() => {
    fetchLinks();
  }, [search]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">URL Shortener Dashboard</h1>

        <button
          onClick={() => setOpenAddModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          + Add Link
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by code or URL..."
        className="mt-4 w-full border px-3 py-2 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <LinkTable links={links} refresh={fetchLinks} />

      <AddLinkModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdded={fetchLinks}
      />
    </div>
  );
}
