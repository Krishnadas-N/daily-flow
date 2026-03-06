import { useState } from "react";
import { useStore } from "../../store/useStore";
import { X, Loader2, Link as LinkIcon, Plus, Trash2 } from "lucide-react";

interface Props {
  onClose: () => void;
  existingGroups: string[];
}

const AddBookmarkModal = ({ onClose, existingGroups }: Props) => {
  const { addBookmark } = useStore();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [group, setGroup] = useState("");
  const [subgroup, setSubgroup] = useState("");

  const [metadataEntries, setMetadataEntries] = useState<
    { k: string; v: string }[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetchPreview = async () => {
    if (!url) return;
    setIsLoading(true);
    setError("");
    try {
      // Basic URL validation
      new URL(url);

      const response = await fetch(
        `https://api.microlink.io?url=${encodeURIComponent(url)}`,
      );
      const data = await response.json();

      if (data.status === "success" && data.data) {
        setTitle(data.data.title || "");
        setDescription(data.data.description || "");
        if (data.data.image && data.data.image.url) {
          setImageUrl(data.data.image.url);
        }
      } else {
        setError("Could not fetch preview for this URL.");
      }
    } catch (err) {
      setError(
        "Please ensure the URL is valid (including http:// or https://) or input manually.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !title || !group) return;

    const metadata: Record<string, string> = {};
    for (const entry of metadataEntries) {
      if (entry.k.trim() && entry.v.trim()) {
        metadata[entry.k.trim()] = entry.v.trim();
      }
    }

    addBookmark(
      url,
      title,
      group,
      subgroup || undefined,
      description || undefined,
      imageUrl || undefined,
      Object.keys(metadata).length > 0 ? metadata : undefined,
    );
    onClose();
  };

  const addMetadataField = () => {
    setMetadataEntries([...metadataEntries, { k: "", v: "" }]);
  };

  const removeMetadataField = (index: number) => {
    setMetadataEntries(metadataEntries.filter((_, i) => i !== index));
  };

  const updateMetadataField = (
    index: number,
    field: "k" | "v",
    value: string,
  ) => {
    const updated = [...metadataEntries];
    updated[index][field] = value;
    setMetadataEntries(updated);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <LinkIcon size={20} className="text-indigo-600" />
            Add Bookmark
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form
            id="add-bookmark-form"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  URL <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    required
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleFetchPreview}
                    disabled={isLoading || !url}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200"
                  >
                    {isLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      "Fetch Preview"
                    )}
                  </button>
                </div>
                {error && (
                  <p className="text-red-500 text-xs mt-1.5">{error}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Website Name"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Preview Image URL
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... (Optional)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A short description..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm resize-none"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Group <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  placeholder="e.g., Learnings, Finance"
                  list="group-options"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm bg-white"
                />
                <datalist id="group-options">
                  {existingGroups.map((g) => (
                    <option key={g} value={g} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Sub-group
                </label>
                <input
                  type="text"
                  value={subgroup}
                  onChange={(e) => setSubgroup(e.target.value)}
                  placeholder="e.g., Tutorials, Taxes"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm bg-white"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-slate-700">
                  Custom Metadata (Optional)
                </label>
                <button
                  type="button"
                  onClick={addMetadataField}
                  className="text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus size={14} /> Add Field
                </button>
              </div>

              {metadataEntries.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  No custom metadata added.
                </p>
              ) : (
                <div className="space-y-2">
                  {metadataEntries.map((entry, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={entry.k}
                        onChange={(e) =>
                          updateMetadataField(index, "k", e.target.value)
                        }
                        placeholder="Key (e.g., Author)"
                        className="w-1/3 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
                      />
                      <input
                        type="text"
                        value={entry.v}
                        onChange={(e) =>
                          updateMetadataField(index, "v", e.target.value)
                        }
                        placeholder="Value (e.g., John Doe)"
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeMetadataField(index)}
                        className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 mt-auto">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200/50 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-bookmark-form"
            className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.98]"
          >
            Save Bookmark
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBookmarkModal;
