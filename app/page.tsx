"use client"

import { useState } from "react"
import { Sidebar } from "@/components/messaging/sidebar"
import { ChatArea } from "@/components/messaging/chat-area"
import { MembersPanel } from "@/components/messaging/members-panel"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export interface ActiveConversation {
  type: "channel" | "dm"
  id: string
  name: string
  avatar?: string
}

export default function MessagingApp() {
  const [activeConversation, setActiveConversation] = useState<ActiveConversation>({
    type: "channel",
    id: "engineering",
    name: "engineering"
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [membersPanelOpen, setMembersPanelOpen] = useState(false)

  const handleConversationSelect = (conversation: ActiveConversation) => {
    setActiveConversation(conversation)
    setSidebarOpen(false)
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Mobile sidebar trigger */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 md:hidden h-9 w-9 rounded-lg bg-[#1a1d21] text-white/80 hover:bg-[#2c2f33] hover:text-white shadow-lg"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0 border-0">
          <Sidebar
            activeConversation={activeConversation}
            onConversationSelect={handleConversationSelect}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[272px] flex-shrink-0">
        <Sidebar
          activeConversation={activeConversation}
          onConversationSelect={handleConversationSelect}
        />
      </aside>

      {/* Main chat area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        <ChatArea 
          activeConversation={activeConversation}
          onMembersToggle={() => setMembersPanelOpen(!membersPanelOpen)}
        />
      </main>

      {/* Mobile members panel */}
      <Sheet open={membersPanelOpen} onOpenChange={setMembersPanelOpen}>
        <SheetContent side="right" className="w-[280px] p-0 border-0">
          <MembersPanel />
        </SheetContent>
      </Sheet>

      {/* Desktop members panel */}
      <aside className="hidden lg:flex w-[260px] flex-shrink-0 border-l border-gray-200 bg-[#f8f9fa]">
        <MembersPanel />
      </aside>
    </div>
  )
}
