import { ExternalLink, Trash2, Folder, Tag } from "lucide-react";
import type { Bookmark } from "../../types";

interface Props {
  bookmark: Bookmark;
  onDelete: () => void;
  isLoading?: boolean;
  viewMode?: "grid" | "list";
}

const BookmarkCard = ({
  bookmark,
  onDelete,
  isLoading,
  viewMode = "grid",
}: Props) => {
  if (isLoading) {
    return (
      <div
        className={`bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm flex flex-col h-full animate-pulse ${
          viewMode === "list" ? "flex-row h-24" : "min-h-[200px]"
        }`}
      >
        <div
          className={`bg-slate-200 flex-shrink-0 ${
            viewMode === "list" ? "w-24 h-full" : "h-32 w-full"
          }`}
        />
        <div className="p-4 flex-1 flex flex-col gap-3">
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-100 rounded w-full mt-1" />
          <div className="h-3 bg-slate-100 rounded w-4/5" />
        </div>
      </div>
    );
  }

  const isList = viewMode === "list";

  return (
    <div
      className={`bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm hover:border-slate-300 hover:shadow transition-colors flex group h-full relative ${
        isList ? "flex-row items-stretch" : "flex-col"
      }`}
    >
      {/* Search Result Style Image Area */}
      {bookmark.imageUrl ? (
        <div
          className={`overflow-hidden bg-slate-50 flex-shrink-0 border-slate-100 ${
            isList ? "w-24 h-full border-r" : "h-32 w-full border-b"
          }`}
        >
          <img
            src={bookmark.imageUrl}
            alt={bookmark.title}
            className="w-full h-full object-cover transition-opacity duration-300 opacity-90 group-hover:opacity-100 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              (
                e.target as HTMLImageElement
              ).nextElementSibling?.classList.remove("hidden");
            }}
          />
          <div className="hidden h-full w-full flex items-center justify-center bg-slate-100 text-slate-400">
            <ExternalLink size={24} strokeWidth={1.5} />
          </div>
        </div>
      ) : (
        <div
          className={`bg-slate-50 border-slate-100 flex flex-col items-center justify-center flex-shrink-0 ${
            isList ? "w-24 h-full border-r" : "h-32 w-full border-b"
          }`}
        >
          <ExternalLink
            className="text-slate-300"
            size={32}
            strokeWidth={1.5}
          />
        </div>
      )}

      {/* Content Area */}
      <div
        className={`p-4 flex-1 flex flex-col relative z-10 ${
          isList ? "justify-center" : ""
        }`}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-semibold text-sm text-slate-800 leading-tight line-clamp-2 pr-6">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600 transition-colors after:absolute after:inset-0 hover:underline underline-offset-2"
              title={bookmark.title}
            >
              {bookmark.title}
            </a>
          </h3>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete();
            }}
            className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 absolute top-2 right-2 rounded transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0 z-20"
            title="Delete File"
          >
            <Trash2 size={14} strokeWidth={2} />
          </button>
        </div>

        {bookmark.description && (
          <p
            className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed"
            title={bookmark.description}
          >
            {bookmark.description}
          </p>
        )}

        <div
          className={`mt-auto pt-3 flex flex-col gap-2 border-slate-100 z-20 relative ${
            isList ? "" : "border-t"
          }`}
        >
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-500">
            <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50">
              <Folder size={10} strokeWidth={2} />
              <span>{bookmark.group}</span>
            </div>

            {bookmark.subgroup && (
              <>
                <span className="text-slate-300">/</span>
                <span className="px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 flex items-center gap-1">
                  {bookmark.subgroup}
                </span>
              </>
            )}
          </div>

          {bookmark.metadata && Object.keys(bookmark.metadata).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {Object.entries(bookmark.metadata).map(([key, val]) => (
                <div
                  key={key}
                  className="flex items-center gap-1 bg-slate-100 text-slate-600 rounded px-1.5 py-0.5 text-[10px] cursor-default"
                >
                  <Tag size={8} className="text-slate-400" />
                  <span className="font-semibold text-slate-700">{key}:</span>
                  <span className="truncate max-w-[80px]">{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookmarkCard;
