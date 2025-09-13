import { useState} from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [query, setQuery] = useState("");
  const [isCleared, setIsCleared] = useState(false);
  const [copiedItemId, setCopiedItemId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    Files: true,
    People: true,
    Chats: true,
    Lists: false
  });

  // Mock data for search results with real asset paths
  const [allResults] = useState([
    // People
    {
      id: 1,
      type: "person",
      name: "Caroline Dribsson",
      status: "Unactivated",
      statusColor: "bg-red-500",
      avatar: "/assets/images/avatar1.jpg",
    },
    {
      id: 2,
      type: "person", 
      name: "Adam Cadribean",
      status: "Active 1w ago",
      statusColor: "bg-yellow-500",
      avatar: "/assets/images/avatar2.jpg",
    },
    {
      id: 3,
      type: "person",
      name: "Margareth Cendribgssen", 
      status: "Active 1w ago",
      statusColor: "bg-yellow-500",
      avatar: "/assets/images/avatar3.jpg",
    },
    // Files
    {
      id: 4,
      type: "file",
      name: "final_dribbble_presentation.jpg",
      details: "in Presentations • Edited 1w ago",
      icon: "🖼️",
      filePath: "/assets/images/final_dribbble_presentation.jpg",
      fileType: "image"
    },
    {
      id: 5,
      type: "file",
      name: "dribbble_animation.avi",
      details: "in Videos • Added 1y ago",
      icon: "🎥",
      filePath: "/assets/videos/dribbble_animation.avi",
      fileType: "video"
    },
    {
      id: 6,
      type: "file",
      name: "design_system_v2.pdf",
      details: "in Documents • Added 3d ago",
      icon: "📄",
      filePath: "/assets/documents/design_system_v2.pdf",
      fileType: "document"
    },
    // Chats
    {
      id: 7,
      type: "chat",
      name: "Design Team Discussion",
      details: "Last message 2h ago • 5 participants",
      icon: "💬"
    },
    {
      id: 8,
      type: "chat",
      name: "Project Updates",
      details: "Last message 1d ago • 3 participants", 
      icon: "💬"
    },
    // More files
    {
      id: 9,
      type: "file",
      name: "dribbble_logo.svg",
      details: "in Assets • Added 2d ago",
      icon: "🎨",
      filePath: "/assets/images/dribbble_logo.svg",
      fileType: "image"
    },
    {
      id: 10,
      type: "folder",
      name: "Dribbble Resources",
      subtitle: "8 Files",
      details: "in Design • Updated 3h ago",
      icon: "📁",
      filePath: "/assets/folders/dribbble_resources",
      fileType: "folder"
    },
    // Lists
    {
      id: 11,
      type: "list",
      name: "Design Inspiration",
      details: "12 items • Updated 2h ago",
      icon: "📋"
    },
    {
      id: 12,
      type: "list",
      name: "Project Tasks",
      details: "8 items • Updated 1d ago",
      icon: "✅"
    }
  ]);

  const filteredResults = allResults.filter(result => {
    const matchesQuery = query === "" || 
      result.name.toLowerCase().includes(query.toLowerCase()) ||
      (result.details && result.details.toLowerCase().includes(query.toLowerCase()));
    
    // First check if the result type is enabled in settings
    const isTypeEnabled = (type) => {
      if (type === "person") return settings.People;
      if (type === "file" || type === "folder") return settings.Files;
      if (type === "chat") return settings.Chats;
      if (type === "list") return settings.Lists;
      return true;
    };
    
    // If the type is disabled in settings, don't show it regardless of active filter
    if (!isTypeEnabled(result.type)) {
      return false;
    }
    
    // Then apply the active filter
    if (activeFilter === "All") {
      return matchesQuery;
    }
    if (activeFilter === "Files") return matchesQuery && (result.type === "file" || result.type === "folder");
    if (activeFilter === "People") return matchesQuery && result.type === "person";
    if (activeFilter === "Chats") return matchesQuery && result.type === "chat";
    if (activeFilter === "Lists") return matchesQuery && result.type === "list";
    
    return matchesQuery;
  });

  // Calculate counts based on all results (considering settings and query, but not active filter)
  const fileCount = allResults.filter(r => {
    const matchesQuery = query === "" || 
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      (r.details && r.details.toLowerCase().includes(query.toLowerCase()));
    return matchesQuery && (r.type === "file" || r.type === "folder") && settings.Files;
  }).length;
  
  const peopleCount = allResults.filter(r => {
    const matchesQuery = query === "" || 
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      (r.details && r.details.toLowerCase().includes(query.toLowerCase()));
    return matchesQuery && r.type === "person" && settings.People;
  }).length;
  
  const chatCount = allResults.filter(r => {
    const matchesQuery = query === "" || 
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      (r.details && r.details.toLowerCase().includes(query.toLowerCase()));
    return matchesQuery && r.type === "chat" && settings.Chats;
  }).length;
  
  const listCount = allResults.filter(r => {
    const matchesQuery = query === "" || 
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      (r.details && r.details.toLowerCase().includes(query.toLowerCase()));
    return matchesQuery && r.type === "list" && settings.Lists;
  }).length;
  
  // Total count for All tab (considering settings and query, but not active filter)
  const totalCount = allResults.filter(r => {
    const matchesQuery = query === "" || 
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      (r.details && r.details.toLowerCase().includes(query.toLowerCase()));
    
    // Check if the result type is enabled in settings
    const isTypeEnabled = (type) => {
      if (type === "person") return settings.People;
      if (type === "file" || type === "folder") return settings.Files;
      if (type === "chat") return settings.Chats;
      if (type === "list") return settings.Lists;
      return true;
    };
    
    return matchesQuery && isTypeEnabled(r.type);
  }).length;

  const toggleSetting = (key) => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        [key]: !prev[key]
      };
      
      // If we're disabling a filter and it's currently active, switch to "All"
      if (!newSettings[key]) {
        if (key === "Files" && activeFilter === "Files") {
          setTimeout(() => setActiveFilter("All"), 0);
        } else if (key === "People" && activeFilter === "People") {
          setTimeout(() => setActiveFilter("All"), 0);
        } else if (key === "Chats" && activeFilter === "Chats") {
          setTimeout(() => setActiveFilter("All"), 0);
        } else if (key === "Lists" && activeFilter === "Lists") {
          setTimeout(() => setActiveFilter("All"), 0);
        }
      }
      
      return newSettings;
    });
  };

  const copyToClipboard = (text, itemId) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedItemId(itemId);
      setTimeout(() => setCopiedItemId(null), 2000); // Hide after 2 seconds
      console.log('Copied to clipboard:', text);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const openInNewTab = (url) => {
    window.open(url, '_blank');
  };

  // Close settings dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (showSettings && !e.target.closest('.settings-dropdown')) {
      setShowSettings(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" onClick={handleClickOutside}>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-2xl mx-4 sm:mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden"
      >
        {/* Search Bar */}
        <motion.div 
          className="p-4 sm:p-6 border-b border-gray-100"
          animate={{ 
            padding: isCleared ? "1.5rem" : "1.5rem",
            backgroundColor: isCleared ? "#f8f9fa" : "transparent"
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="flex items-center gap-3 sm:gap-4"
            animate={{
              scale: isCleared ? 0.9 : 1,
              opacity: isCleared ? 0.8 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            {query && query.length > 0 ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5"
              >
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </motion.div>
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          <input
            type="text"
            value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value.length > 0) {
                  setIsCleared(false);
                }
              }}
              placeholder={isCleared ? "Searching is easier" : "Search..."}
              className="flex-1 text-base sm:text-lg bg-transparent outline-none text-gray-800 placeholder-gray-400"
            />
            {isCleared ? (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-600">S</span>
                </div>
                <span className="text-sm text-gray-500">quick access</span>
              </div>
            ) : query ? (
              <button
                onClick={() => {
                  setQuery("");
                  setIsCleared(true);
                }}
                className="text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                Clear
              </button>
            ) : null}
          </motion.div>
        </motion.div>

        {/* Filter Tabs */}
        {!isCleared && (
          <motion.div 
            className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 relative"
            initial={{ opacity: 1, height: "auto" }}
            animate={{ 
              opacity: isCleared ? 0 : 1,
              height: isCleared ? 0 : "auto",
              padding: isCleared ? "0 1.5rem" : "1rem 1.5rem"
            }}
            transition={{ duration: 0.3 }}
          >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 sm:gap-8 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveFilter("All")}
                className={`relative pb-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  activeFilter === "All" 
                    ? "text-gray-900" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                All <span className="bg-gray-200 px-1.5 py-0.5 rounded text-xs font-medium">{totalCount}</span>
                {activeFilter === "All" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full"
                  />
                )}
              </button>
              
              {settings.Files && (
                <button
                  onClick={() => setActiveFilter("Files")}
                  className={`relative pb-2 text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap ${
                    activeFilter === "Files" 
                      ? "text-gray-900" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  Files <span className="bg-gray-200 px-1.5 py-0.5 rounded text-xs font-medium">{fileCount}</span>
                  {activeFilter === "Files" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full"
                    />
                  )}
                </button>
              )}
              
              {settings.People && (
                <button
                  onClick={() => setActiveFilter("People")}
                  className={`relative pb-2 text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap ${
                    activeFilter === "People" 
                      ? "text-gray-900" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  People <span className="bg-gray-200 px-1.5 py-0.5 rounded text-xs font-medium">{peopleCount}</span>
                  {activeFilter === "People" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full"
                    />
                  )}
                </button>
              )}
              
              {settings.Chats && (
                <button
                  onClick={() => setActiveFilter("Chats")}
                  className={`relative pb-2 text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap ${
                    activeFilter === "Chats" 
                      ? "text-gray-900" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Chats <span className="bg-gray-200 px-1.5 py-0.5 rounded text-xs font-medium">{chatCount}</span>
                  {activeFilter === "Chats" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full"
                    />
                  )}
                </button>
              )}
              
              {settings.Lists && (
                <button
                  onClick={() => setActiveFilter("Lists")}
                  className={`relative pb-2 text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap ${
                    activeFilter === "Lists" 
                      ? "text-gray-900" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  Lists <span className="bg-gray-200 px-1.5 py-0.5 rounded text-xs font-medium">{listCount}</span>
                  {activeFilter === "Lists" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full"
                    />
                  )}
                </button>
              )}
        </div>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          {/* Settings Dropdown */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="settings-dropdown absolute top-12 right-0 sm:right-0 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 w-44 sm:w-48 z-50"
              >
                <div className="space-y-3">
                  {Object.entries(settings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 text-gray-400">
                          {key === "Files" && (
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                          )}
                          {key === "People" && (
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          )}
                          {key === "Chats" && (
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          )}
                          {key === "Lists" && (
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{key}</span>
                      </div>
                      <button
                        onClick={() => toggleSetting(key)}
                        className={`relative w-10 h-6 rounded-full transition-colors ${
                          value ? "bg-gray-900" : "bg-gray-200"
                        }`}
                      >
                        <motion.div
                          animate={{ x: value ? 16 : 2 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </motion.div>
        )}

        {/* Search Results */}
        {!isCleared && (
          <motion.div 
            className="max-h-80 sm:max-h-96 overflow-y-auto"
            initial={{ opacity: 1, height: "auto" }}
            animate={{ 
              opacity: isCleared ? 0 : 1,
              height: isCleared ? 0 : "auto"
            }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {filteredResults.length > 0 ? (
            <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="divide-y divide-gray-100"
              >
                {filteredResults.map((item, index) => (
                  <motion.div
                  key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{ backgroundColor: "#f9fafb" }}
                    className="p-3 sm:p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    {item.type === "person" ? (
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="relative">
                          <img
                            src={item.avatar}
                            alt={item.name}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                          />
                          <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 ${item.statusColor} rounded-full border-2 border-white`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-500 truncate">{item.status}</p>
                        </div>
                      </div>
                    ) : item.type === "chat" ? (
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center text-lg sm:text-xl">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-500 truncate">{item.details}</p>
                        </div>
                      </div>
                    ) : item.type === "list" ? (
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center text-lg sm:text-xl">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-500 truncate">{item.details}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg sm:text-xl">
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.name}</h3>
                            {item.subtitle && (
                              <p className="text-xs sm:text-sm text-gray-500 truncate">{item.subtitle}</p>
                            )}
                            <p className="text-xs sm:text-sm text-gray-500 truncate">{item.details}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="relative">
                            <button 
                              onClick={() => copyToClipboard(item.filePath || `/assets/files/${item.name}`, item.id)}
                              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors group/btn"
                              title="Copy link"
                            >
                              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover/btn:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                              </svg>
                            </button>
                            {copiedItemId === item.id && (
                              <motion.div
                                initial={{ opacity: 0, y: 5, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 5, scale: 0.8 }}
                                className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10"
                              >
                                Link copied!
                              </motion.div>
                            )}
                          </div>
                          <button 
                            onClick={() => openInNewTab(item.filePath || `/assets/files/${item.name}`)}
                            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
                            title="Open in new tab"
                          >
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </button>
                        </div>
                  </div>
                    )}
                  </motion.div>
              ))}
            </motion.div>
            ) : !isCleared && query.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 sm:p-8 text-center text-gray-500"
              >
                <svg className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-sm sm:text-base">No results found</p>
              </motion.div>
            ) : !isCleared && query.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 sm:p-8 text-center text-gray-500"
            >
                  <p className="text-sm sm:text-base text-gray-500">Type something to get started</p>
            </motion.div>
            ) : null}
            </AnimatePresence>
            </motion.div>
          )}

      </motion.div>
    </div>
  );
}
