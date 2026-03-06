import React, { useState } from "react";
import { useStore } from "../../store/useStore";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Folder,
  ChevronDown,
  ChevronRight,
  Inbox,
} from "lucide-react";
import BookmarkCard from "./BookmarkCard";

const BookmarksBoard = () => {
  const { bookmarks, deleteBookmark, addBookmark, updateBookmark } = useStore();
  const [selectedView, setSelectedView] = useState<{
    group: string | null;
    subgroup: string | null;
  }>({ group: null, subgroup: null });
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [errorMsg, setErrorMsg] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Build folder hierarchy
  const hierarchy: Record<string, Set<string>> = {};
  bookmarks.forEach((b) => {
    if (!hierarchy[b.group]) {
      hierarchy[b.group] = new Set();
    }
    if (b.subgroup) {
      hierarchy[b.group].add(b.subgroup);
    }
  });

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };

  const filteredBookmarks = bookmarks
    .filter((b) => {
      if (selectedView.group === null) return true; // 'All' selected
      if (selectedView.group !== b.group) return false;
      if (
        selectedView.subgroup !== null &&
        selectedView.subgroup !== b.subgroup
      )
        return false;
      return true;
    })
    .filter((b) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.url.toLowerCase().includes(q) ||
        (b.description && b.description.toLowerCase().includes(q))
      );
    });

  const parseInput = (text: string) => {
    const urlMatch = text.match(/(https?:\/\/[^\s]+)/);
    const url = urlMatch ? urlMatch[0] : "";

    // Extract tags like #Finance #React
    const tags = Array.from(text.matchAll(/#([a-zA-Z0-9_-]+)/g)).map(
      (m) => m[1],
    );
    const group = tags.length > 0 ? tags[0] : "Inbox";
    const subgroup = tags.length > 1 ? tags[1] : undefined;

    // The rest is description
    let description = text;
    if (url) description = description.replace(url, "");
    tags.forEach((tag) => {
      description = description.replace(`#${tag}`, "");
    });

    return {
      url,
      group,
      subgroup,
      description: description.trim() || undefined,
    };
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      const { url, group, subgroup, description } = parseInput(inputValue);

      if (!url) {
        setErrorMsg(
          "Please include a valid URL (starting with http:// or https://)",
        );
        setTimeout(() => setErrorMsg(""), 3000);
        return;
      }

      setInputValue("");
      setSelectedView({ group: null, subgroup: null }); // Go to All to see the new addition

      // Ensure the group is expanded to show subgroup if any
      setExpandedGroups((prev) => new Set(prev).add(group));

      const newId = addBookmark(
        url,
        url,
        group,
        subgroup,
        description,
        undefined,
        undefined,
      );

      setLoadingIds((prev) => new Set(prev).add(newId));

      try {
        const response = await fetch(
          `https://api.microlink.io?url=${encodeURIComponent(url)}`,
        );
        const data = await response.json();

        if (data.status === "success" && data.data) {
          const fetchedTitle = data.data.title || url;
          const fetchedDesc = data.data.description || description;
          const fetchedImg = data.data.image?.url;

          updateBookmark(newId, {
            title: fetchedTitle,
            description:
              description && description !== "" ? description : fetchedDesc,
            imageUrl: fetchedImg,
          });
        }
      } catch (err) {
        console.error("Preview fetch failed:", err);
      } finally {
        setLoadingIds((prev) => {
          const next = new Set(prev);
          next.delete(newId);
          return next;
        });
      }
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Omni-bar Area */}
      <div className="w-full relative">
        <div className="flex items-center px-4 py-3 bg-white border border-slate-300 rounded-md focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-colors shadow-sm">
          <Plus className="text-slate-400 mr-3 flex-shrink-0" size={20} />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Quick Add: Paste a URL, add #group #subgroup optionally, type notes, and press Enter"
            className="w-full bg-transparent focus:outline-none text-slate-700 text-sm placeholder-slate-400"
          />
        </div>
        {errorMsg && (
          <div className="absolute -bottom-6 left-2 text-xs text-red-600 font-medium">
            {errorMsg}
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Professional Sidebar Directory */}
        <div className="w-full lg:w-64 flex-shrink-0 flex flex-col bg-slate-50 border border-slate-200 rounded-md overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-100 flex items-center gap-2">
            <Folder size={16} className="text-slate-600" />
            <h2 className="text-sm font-semibold text-slate-800">Directory</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            <button
              onClick={() => setSelectedView({ group: null, subgroup: null })}
              className={`w-full text-left px-3 py-1.5 rounded-sm text-sm font-medium flex items-center justify-between ${
                selectedView.group === null
                  ? "bg-indigo-100 text-indigo-900"
                  : "text-slate-700 hover:bg-slate-200"
              }`}
            >
              <span>All Bookmarks</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-sm ${selectedView.group === null ? "bg-indigo-200" : "bg-slate-200 text-slate-500"}`}
              >
                {bookmarks.length}
              </span>
            </button>

            {Object.keys(hierarchy)
              .sort()
              .map((group) => {
                const subgroups = Array.from(hierarchy[group]).sort();
                const isGroupSelected =
                  selectedView.group === group &&
                  selectedView.subgroup === null;
                const isExpanded = expandedGroups.has(group);
                const groupCount = bookmarks.filter(
                  (b) => b.group === group,
                ).length;

                return (
                  <div key={group} className="mt-1">
                    <button
                      onClick={() => {
                        if (!isExpanded) toggleGroup(group);
                        setSelectedView({ group, subgroup: null });
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded-sm text-sm font-medium flex items-center ${
                        isGroupSelected
                          ? "bg-indigo-100 text-indigo-900"
                          : "text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <span
                        className="mr-1 p-0.5 hover:bg-slate-300 rounded-sm cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleGroup(group);
                        }}
                      >
                        {subgroups.length > 0 ? (
                          isExpanded ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronRight size={14} />
                          )
                        ) : (
                          <div className="w-3.5" />
                        )}
                      </span>
                      <Folder
                        className={`mr-2 flex-shrink-0 ${isGroupSelected ? "text-indigo-600" : "text-slate-500"}`}
                        size={14}
                        fill={isGroupSelected ? "currentColor" : "none"}
                      />
                      <span className="truncate flex-1">{group}</span>
                      <span
                        className={`text-xs ml-2 px-1.5 py-0.5 rounded-sm ${isGroupSelected ? "bg-indigo-200" : "bg-slate-200 text-slate-500"}`}
                      >
                        {groupCount}
                      </span>
                    </button>

                    {isExpanded && subgroups.length > 0 && (
                      <div className="ml-6 border-l border-slate-300 pl-1 mt-0.5 space-y-0.5">
                        {subgroups.map((sub) => {
                          const isSubSelected =
                            selectedView.group === group &&
                            selectedView.subgroup === sub;
                          const subCount = bookmarks.filter(
                            (b) => b.group === group && b.subgroup === sub,
                          ).length;
                          return (
                            <button
                              key={sub}
                              onClick={() =>
                                setSelectedView({ group, subgroup: sub })
                              }
                              className={`w-full text-left px-2 py-1.5 rounded-sm text-sm font-medium flex items-center ${
                                isSubSelected
                                  ? "bg-indigo-100 text-indigo-900"
                                  : "text-slate-700 hover:bg-slate-200"
                              }`}
                            >
                              <Folder
                                className={`mr-2 flex-shrink-0 ${isSubSelected ? "text-indigo-600" : "text-slate-400"}`}
                                size={14}
                                fill={isSubSelected ? "currentColor" : "none"}
                              />
                              <span className="truncate flex-1">{sub}</span>
                              <span
                                className={`text-xs ml-2 px-1.5 py-0.5 rounded-sm ${isSubSelected ? "bg-indigo-200" : "transparent text-slate-500"}`}
                              >
                                {subCount}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white border border-slate-200 rounded-md overflow-hidden">
          {/* Top Controls Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <Search size={14} className="text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-1 bg-white border border-slate-300 rounded p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1 rounded-sm transition-colors ${
                  viewMode === "grid"
                    ? "bg-slate-200 text-slate-800"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
                title="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1 rounded-sm transition-colors ${
                  viewMode === "list"
                    ? "bg-slate-200 text-slate-800"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
                title="List View"
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Bookmarks Display */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
            {filteredBookmarks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="p-4 bg-slate-100 rounded-full mb-4">
                  <Inbox size={32} className="text-slate-400" />
                </div>
                <h3 className="text-base font-semibold text-slate-800 mb-1">
                  No items found
                </h3>
                <p className="text-sm text-slate-500">
                  {searchQuery
                    ? "Adjust your search terms to find what you're looking for."
                    : "This directory is currently empty."}
                </p>
              </div>
            ) : (
              <div
                className={`grid gap-4 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {filteredBookmarks.map((bookmark) => (
                  <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    onDelete={() => deleteBookmark(bookmark.id)}
                    isLoading={loadingIds.has(bookmark.id)}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarksBoard;
