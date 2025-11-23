import { useState } from "react";
import API from "../api";

export default function AddLinkModal({ open, onClose, onAdded }) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customCode, setCustomCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/links", {
        originalUrl,
        customCode: customCode || undefined,
      });

      onAdded();
      setOriginalUrl("");
      setCustomCode("");
      onClose();
    } catch (err) {
      alert(err?.response?.data?.error || "Error adding link");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-gray-400 bg-opacity-40 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Link</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="url"
            required
            placeholder="Original URL"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="text"
            placeholder="Custom code (optional)"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Add Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
