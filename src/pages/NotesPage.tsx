import { useState } from "react";
import { useStore } from "../store/useStore";
import { Plus, Search, Trash2, Edit3, X, StickyNote, Eye } from "lucide-react";
import type { Note } from "../types";

const NotesPage = () => {
  const { notes, addNote, updateNote, deleteNote } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const openAppModal = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setTitle(note.title);
      setContent(note.content);
    } else {
      setEditingNote(null);
      setTitle("");
      setContent("");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
    setTitle("");
    setContent("");
  };

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;

    if (editingNote) {
      updateNote(editingNote.id, {
        title: title.trim() || "Untitled Note",
        content: content.trim(),
      });
    } else {
      addNote(title.trim() || "Untitled Note", content.trim());
    }
    closeModal();
  };

  const openViewModal = (note: Note) => {
    setViewingNote(note);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewingNote(null);
  };

  const handleEditFromView = () => {
    if (viewingNote) {
      openAppModal(viewingNote);
      closeViewModal();
    }
  };

  return (
    <div className="h-full flex flex-col pt-4 md:pt-8 px-2 md:px-8 max-w-[1400px] mx-auto w-full animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
            Quick Notes
          </h1>
          <p className="text-slate-500 font-medium">
            Jot down your thoughts, ideas, and reminders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-full md:w-64 shadow-sm"
            />
          </div>
          <button
            onClick={() => openAppModal()}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm font-medium whitespace-nowrap"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">New Note</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="bg-red-50/10 bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group flex flex-col h-64 relative overflow-hidden cursor-pointer"
            onClick={() => openViewModal(note)}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-slate-800 text-lg line-clamp-1 flex-1 pr-2">
                {note.title}
              </h3>
              <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openViewModal(note);
                  }}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="View Note"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openAppModal(note);
                  }}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Edit Note"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Note"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <p className="text-slate-600 text-sm flex-1 overflow-hidden whitespace-pre-wrap truncate line-clamp-6 leading-relaxed">
              {note.content}
            </p>

            <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] font-medium text-slate-400 flex items-center justify-between">
              <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
              <StickyNote size={14} className="opacity-50" />
            </div>
          </div>
        ))}

        {filteredNotes.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4 text-indigo-300">
              <StickyNote size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              No notes found
            </h3>
            <p className="text-slate-500 max-w-sm">
              {searchQuery
                ? "Your search didn't match any notes. Try different keywords."
                : "You haven't added any notes yet. Create your first note to get started."}
            </p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {editingNote ? "Edit Note" : "New Note"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note Title"
                className="text-2xl font-bold text-slate-900 placeholder:text-slate-300 border-none focus:outline-none focus:ring-0 px-0 bg-transparent"
                autoFocus
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing..."
                className="flex-1 w-full min-h-[300px] text-slate-700 placeholder:text-slate-400 border-none focus:outline-none focus:ring-0 px-0 bg-transparent resize-none leading-relaxed"
              />
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 text-slate-600 font-medium hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 shadow-sm transition-all"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && viewingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={closeViewModal}
          />
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <StickyNote size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 line-clamp-1 pr-4">
                  {viewingNote.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEditFromView}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                  title="Edit"
                >
                  <Edit3 size={20} />
                </button>
                <button
                  onClick={closeViewModal}
                  className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-[15px]">
                {viewingNote.content}
              </p>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs text-slate-500 font-medium">
              <span>
                Created: {new Date(viewingNote.createdAt).toLocaleString()}
              </span>
              <span>
                Last updated: {new Date(viewingNote.updatedAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;
