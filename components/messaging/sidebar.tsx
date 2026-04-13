"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Hash, Plus, Settings, Bell, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { ActiveConversation } from "@/app/page"

interface SidebarProps {
  activeConversation: ActiveConversation
  onConversationSelect: (conversation: ActiveConversation) => void
}

const channels = [
  { id: "general", name: "general", unread: 3 },
  { id: "engineering", name: "engineering", unread: 0 },
  { id: "design", name: "design", unread: 0 },
  { id: "product", name: "product", unread: 1 },
  { id: "random", name: "random", unread: 0 },
  { id: "announcements", name: "announcements", unread: 7, locked: true },
]

const directMessages = [
  {
    id: "alex",
    name: "Alex Rivera",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    online: true,
    status: "typing...",
    isTyping: true,
    unread: 2,
  },
  {
    id: "maya",
    name: "Maya Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    online: true,
    status: "Sounds good!",
    isTyping: false,
    unread: 0,
  },
  {
    id: "chris",
    name: "Chris Park",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
    online: false,
    status: "See you tomorrow",
    isTyping: false,
    unread: 0,
  },
  {
    id: "lena",
    name: "Lena Schmidt",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces",
    online: true,
    status: "PR is ready for review",
    isTyping: false,
    unread: 0,
  },
  {
    id: "raj",
    name: "Raj Krishnamurthy",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
    online: false,
    status: "On PTO until Monday",
    isTyping: false,
    unread: 0,
  },
]

export function Sidebar({ activeConversation, onConversationSelect }: SidebarProps) {
  const [channelsOpen, setChannelsOpen] = useState(true)
  const [dmsOpen, setDmsOpen] = useState(true)
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <div className="flex flex-col h-full w-full bg-[#1a1d21]">
      {/* Workspace header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <button className="flex items-center gap-2 hover:bg-white/5 rounded-lg px-2 py-1.5 -ml-2 transition-all duration-200 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/25">
            S
          </div>
          <span className="font-semibold text-white">Relay</span>
          <ChevronDown className="h-4 w-4 text-white/50 group-hover:text-white/70 transition-colors" />
        </button>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all duration-200">
            <Bell className="h-4 w-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all duration-200">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-3">
        <div className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 transition-all duration-200",
          searchFocused ? "bg-white/15 ring-1 ring-white/20" : "bg-white/5 hover:bg-white/10"
        )}>
          <Search className="h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search messages..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded bg-white/10 px-1.5 text-[10px] font-medium text-white/40">
            <span className="text-xs">Ctrl</span>K
          </kbd>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto min-h-0 px-2 py-1 space-y-4">
        {/* Channels */}
        <div>
          <div className="flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-white/60 w-full group">
            <button
              onClick={() => setChannelsOpen(!channelsOpen)}
              className="flex items-center gap-1 hover:text-white/90 transition-colors"
            >
              {channelsOpen ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
              <span className="uppercase tracking-wider">Channels</span>
            </button>
            <button 
              className="ml-auto p-1 rounded hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => { e.stopPropagation() }}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          
          <div className={cn(
            "space-y-0.5 overflow-hidden transition-all duration-200",
            channelsOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}>
            {channels.map((channel) => {
              const isActive = activeConversation.type === "channel" && activeConversation.id === channel.id
              return (
                <button
                  key={channel.id}
                  onClick={() => onConversationSelect({ type: "channel", id: channel.id, name: channel.name })}
                  className={cn(
                    "flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-sm transition-all duration-150 group",
                    isActive
                      ? "bg-violet-600/90 text-white shadow-md shadow-violet-500/20"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Hash className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-white" : "text-white/50")} />
                  <span className={cn("truncate", channel.unread > 0 && !isActive && "font-semibold text-white")}>
                    {channel.name}
                  </span>
                  {channel.unread > 0 && !isActive && (
                    <span className="ml-auto bg-violet-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center animate-count-up">
                      {channel.unread}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Direct Messages */}
        <div>
          <div className="flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-white/60 w-full group">
            <button
              onClick={() => setDmsOpen(!dmsOpen)}
              className="flex items-center gap-1 hover:text-white/90 transition-colors"
            >
              {dmsOpen ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
              <span className="uppercase tracking-wider">Direct Messages</span>
            </button>
            <button 
              className="ml-auto p-1 rounded hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => { e.stopPropagation() }}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          
          <div className={cn(
            "space-y-0.5 overflow-hidden transition-all duration-200",
            dmsOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          )}>
            {directMessages.map((dm) => {
              const isActive = activeConversation.type === "dm" && activeConversation.id === dm.id
              return (
                <button
                  key={dm.id}
                  onClick={() => onConversationSelect({ 
                    type: "dm", 
                    id: dm.id, 
                    name: dm.name, 
                    avatar: dm.avatar 
                  })}
                  className={cn(
                    "flex items-center gap-2.5 w-full px-2 py-2 rounded-lg text-sm transition-all duration-150",
                    isActive
                      ? "bg-violet-600/90 text-white shadow-md shadow-violet-500/20"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-7 w-7 ring-2 ring-transparent">
                      <AvatarImage src={dm.avatar} alt={dm.name} className="object-cover" />
                      <AvatarFallback className="bg-white/20 text-white text-xs">{dm.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-[#1a1d21]",
                        dm.online ? "bg-emerald-400 animate-pulse-ring" : "bg-gray-500"
                      )}
                    />
                  </div>
                  <div className="flex flex-col items-start min-w-0 flex-1">
                    <span className={cn(
                      "truncate text-sm",
                      dm.unread > 0 && !isActive ? "font-semibold text-white" : ""
                    )}>
                      {dm.name}
                    </span>
                    <span className={cn(
                      "text-xs truncate w-full text-left",
                      isActive ? "text-white/80" : dm.isTyping ? "italic text-emerald-400" : "text-white/40"
                    )}>
                      {dm.status}
                    </span>
                  </div>
                  {dm.unread > 0 && !isActive && (
                    <span className="bg-violet-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center animate-count-up">
                      {dm.unread}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* User status footer */}
      <div className="px-3 py-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
          <div className="relative">
            <Avatar className="h-8 w-8 ring-2 ring-emerald-400/50">
              <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces" />
              <AvatarFallback className="bg-violet-600 text-white">Y</AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-[#1a1d21] animate-pulse-ring" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">You</p>
            <p className="text-xs text-white/50 truncate">Active</p>
          </div>
        </div>
      </div>
    </div>
  )
}
