"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, MessageSquare } from "lucide-react"
import { toast } from "sonner"

interface Member {
  id: string
  name: string
  avatar: string
  role: "Admin" | "Mod" | "Member"
  online: boolean
  status?: string
}

const members: Member[] = [
  {
    id: "alex",
    name: "Alex Rivera",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    role: "Admin",
    online: true,
    status: "Building something cool",
  },
  {
    id: "maya",
    name: "Maya Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    role: "Mod",
    online: true,
    status: "In a meeting",
  },
  {
    id: "chris",
    name: "Chris Park",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
    role: "Member",
    online: false,
  },
  {
    id: "lena",
    name: "Lena Schmidt",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces",
    role: "Mod",
    online: true,
    status: "Reviewing PRs",
  },
  {
    id: "raj",
    name: "Raj Krishnamurthy",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
    role: "Member",
    online: false,
    status: "On PTO",
  },
  {
    id: "sam",
    name: "Sam Chen",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces",
    role: "Member",
    online: true,
  },
  {
    id: "emma",
    name: "Emma Wilson",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    role: "Member",
    online: true,
    status: "Available",
  },
]

const roleStyles = {
  Admin: "bg-violet-100 text-violet-700 border-violet-200",
  Mod: "bg-blue-100 text-blue-700 border-blue-200",
  Member: "bg-gray-100 text-gray-600 border-gray-200",
}

export function MembersPanel() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"members" | "activity">("members")

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const onlineMembers = filteredMembers.filter(m => m.online)
  const offlineMembers = filteredMembers.filter(m => !m.online)

  const handleMessageMember = (member: Member) => {
    toast.success(`Opening DM with ${member.name}`)
  }

  return (
    <div className="flex flex-col h-full w-full bg-[#f8f9fa]">
      {/* Header with tabs */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTab("members")}
            className={cn(
              "text-sm font-semibold pb-2 transition-colors relative",
              activeTab === "members" 
                ? "text-gray-900" 
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            Members
            {activeTab === "members" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-full" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab("activity")}
            className={cn(
              "text-sm font-semibold pb-2 transition-colors relative",
              activeTab === "activity" 
                ? "text-gray-900" 
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            Activity
            {activeTab === "activity" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-violet-200 transition-all">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Find members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Shared Media Gallery - Horizontal Scroll Snap */}
      {activeTab === "members" && (
        <div className="px-3 py-3 border-b border-gray-100">
          <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">
            Shared Media
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scroll-snap-x hide-scrollbar">
            {[
              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop",
              "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=200&fit=crop",
              "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&h=200&fit=crop",
              "https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=200&h=200&fit=crop",
              "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=200&h=200&fit=crop",
            ].map((src, i) => (
              <button
                key={i}
                className="flex-shrink-0 scroll-snap-item group relative overflow-hidden rounded-xl"
              >
                <img
                  src={src}
                  alt={`Shared media ${i + 1}`}
                  className="w-20 h-20 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Members list */}
      <div className="flex-1 overflow-y-auto min-h-0 px-2 py-3">
        {activeTab === "members" ? (
          <>
            {/* Online section */}
            {onlineMembers.length > 0 && (
              <div className="mb-4">
                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Online — {onlineMembers.length}
                </h3>
                <div className="space-y-0.5">
                  {onlineMembers.map((member) => (
                    <MemberItem 
                      key={member.id} 
                      member={member}
                      onMessage={() => handleMessageMember(member)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Offline section */}
            {offlineMembers.length > 0 && (
              <div>
                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-400" />
                  Offline — {offlineMembers.length}
                </h3>
                <div className="space-y-0.5">
                  {offlineMembers.map((member) => (
                    <MemberItem 
                      key={member.id} 
                      member={member}
                      onMessage={() => handleMessageMember(member)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center px-4">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
              <MessageSquare className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  )
}

function MemberItem({ member, onMessage }: { member: Member; onMessage: () => void }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button 
        onClick={onMessage}
        className="flex items-center gap-3 w-full px-2 py-2.5 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200"
      >
        <div className="relative flex-shrink-0">
          <Avatar className={cn(
            "h-9 w-9 ring-2 ring-white shadow-sm transition-opacity",
            !member.online && "opacity-60"
          )}>
            <AvatarImage src={member.avatar} alt={member.name} className="object-cover" />
            <AvatarFallback className="bg-violet-100 text-violet-600">{member.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-[#f8f9fa]",
              member.online ? "bg-emerald-400 animate-pulse-ring" : "bg-gray-400"
            )}
          />
        </div>
        <div className="flex flex-col items-start min-w-0 flex-1">
          <div className="flex items-center gap-2 w-full">
            <span className={cn(
              "text-sm font-medium truncate",
              member.online ? "text-gray-900" : "text-gray-500"
            )}>
              {member.name}
            </span>
            <Badge 
              variant="outline" 
              className={cn(
                "text-[10px] h-4 px-1.5 font-semibold border flex-shrink-0",
                roleStyles[member.role]
              )}
            >
              {member.role}
            </Badge>
          </div>
          {member.status && (
            <span className="text-xs text-gray-400 truncate w-full text-left">
              {member.status}
            </span>
          )}
        </div>
      </button>

      {/* Hover actions */}
      {isHovered && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={onMessage}
            className="p-1.5 rounded-lg bg-white shadow-sm border border-gray-200 text-gray-500 hover:text-violet-600 hover:border-violet-200 transition-colors"
          >
            <MessageSquare className="h-3.5 w-3.5" />
          </button>
          <button className="p-1.5 rounded-lg bg-white shadow-sm border border-gray-200 text-gray-500 hover:text-gray-700 transition-colors">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
