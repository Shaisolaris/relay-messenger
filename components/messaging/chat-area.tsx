"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { 
  Hash,
  Pin, 
  Search, 
  Bold, 
  Italic, 
  Strikethrough, 
  Code, 
  Smile, 
  Paperclip, 
  AtSign, 
  Send,
  MessageSquare,
  Users,
  MoreHorizontal,
  Phone,
  Video,
  ChevronDown,
  ArrowDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { ActiveConversation } from "@/app/page"

interface ChatAreaProps {
  activeConversation: ActiveConversation
  onMembersToggle: () => void
}

const users = {
  alex: {
    name: "Alex Rivera",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
  },
  maya: {
    name: "Maya Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
  },
  chris: {
    name: "Chris Park",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
  },
  lena: {
    name: "Lena Schmidt",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces",
  },
  raj: {
    name: "Raj Krishnamurthy",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
  },
}

type UserKey = keyof typeof users

interface Reaction {
  emoji: string
  count: number
  reacted: boolean
}

interface Message {
  id: string
  userId: UserKey
  time: string
  content: string
  codeBlock?: string
  reactions: Reaction[]
  threadCount?: number
}

interface MessageGroup {
  date: string
  messages: Message[]
}

const channelMessages: Record<string, MessageGroup[]> = {
  engineering: [
    {
      date: "Yesterday",
      messages: [
        {
          id: "1",
          userId: "maya",
          time: "3:42 PM",
          content: "Has anyone looked at the new React Server Components RFC? Some interesting changes for our data fetching layer.",
          reactions: [],
        },
        {
          id: "2",
          userId: "chris",
          time: "3:45 PM",
          content: "Yeah, the cache invalidation approach is way better. We should prototype it next sprint.",
          reactions: [
            { emoji: "👍", count: 3, reacted: false },
            { emoji: "🔥", count: 2, reacted: true },
          ],
        },
        {
          id: "3",
          userId: "alex",
          time: "3:51 PM",
          content: "Here's the pattern they recommend for data loading:",
          codeBlock: `async function getUser(id: string) {
  const user = await db.user.findUnique({
    where: { id },
    include: { posts: true }
  });
  return user;
}`,
          reactions: [{ emoji: "💡", count: 4, reacted: false }],
        },
      ],
    },
    {
      date: "Today",
      messages: [
        {
          id: "4",
          userId: "lena",
          time: "9:15 AM",
          content: "Morning team! I've pushed the auth middleware refactor. PR #847 is ready for review.",
          reactions: [{ emoji: "👀", count: 2, reacted: false }],
        },
        {
          id: "5",
          userId: "maya",
          time: "9:18 AM",
          content: "On it. BTW the Figma designs for the settings page are updated too.",
          reactions: [],
        },
        {
          id: "6",
          userId: "chris",
          time: "9:22 AM",
          content: "Nice! I'll check both. @Alex can you review the GraphQL schema changes in that PR?",
          reactions: [],
        },
        {
          id: "7",
          userId: "alex",
          time: "9:30 AM",
          content: "Sure, looking at it now. The type definitions look solid.",
          reactions: [{ emoji: "✅", count: 1, reacted: false }],
        },
        {
          id: "8",
          userId: "raj",
          time: "10:05 AM",
          content: "Quick heads up - I'll be OOO Friday. Left detailed notes on the deployment runbook for the release.",
          reactions: [],
          threadCount: 3,
        },
      ],
    },
  ],
  general: [
    {
      date: "Today",
      messages: [
        {
          id: "g1",
          userId: "maya",
          time: "8:00 AM",
          content: "Good morning everyone! Hope you all had a great weekend.",
          reactions: [{ emoji: "☀️", count: 5, reacted: false }, { emoji: "👋", count: 3, reacted: false }],
        },
        {
          id: "g2",
          userId: "raj",
          time: "8:15 AM",
          content: "Morning! Anyone else excited about the company all-hands later today?",
          reactions: [{ emoji: "🎉", count: 4, reacted: true }],
        },
        {
          id: "g3",
          userId: "alex",
          time: "9:00 AM",
          content: "Don't forget - coffee run at 10:30! Who's in?",
          reactions: [],
          threadCount: 7,
        },
      ],
    },
  ],
  design: [
    {
      date: "Today",
      messages: [
        {
          id: "d1",
          userId: "maya",
          time: "10:00 AM",
          content: "Just uploaded the new component library to Figma. Check out the updated button variants!",
          reactions: [{ emoji: "🎨", count: 3, reacted: false }],
        },
        {
          id: "d2",
          userId: "lena",
          time: "10:15 AM",
          content: "Love the new hover states! The micro-interactions feel so much smoother.",
          reactions: [{ emoji: "❤️", count: 2, reacted: false }],
        },
      ],
    },
  ],
  product: [
    {
      date: "Today",
      messages: [
        {
          id: "p1",
          userId: "chris",
          time: "11:00 AM",
          content: "Q2 roadmap is finalized. Sharing the Notion doc in the thread below.",
          reactions: [{ emoji: "📊", count: 4, reacted: false }],
          threadCount: 12,
        },
      ],
    },
  ],
}

const dmMessages: Record<string, MessageGroup[]> = {
  alex: [
    {
      date: "Today",
      messages: [
        {
          id: "dm1",
          userId: "alex",
          time: "11:30 AM",
          content: "Hey! Quick question about the auth flow - are we using JWT or session cookies?",
          reactions: [],
        },
      ],
    },
  ],
  maya: [
    {
      date: "Today",
      messages: [
        {
          id: "dm2",
          userId: "maya",
          time: "9:45 AM",
          content: "The mockups look great! Just left some comments on the Figma file.",
          reactions: [],
        },
      ],
    },
  ],
  chris: [
    {
      date: "Yesterday",
      messages: [
        {
          id: "dm3",
          userId: "chris",
          time: "5:00 PM",
          content: "See you tomorrow at the standup!",
          reactions: [],
        },
      ],
    },
  ],
  lena: [
    {
      date: "Today",
      messages: [
        {
          id: "dm4",
          userId: "lena",
          time: "10:30 AM",
          content: "PR is ready for your review when you get a chance.",
          reactions: [],
        },
      ],
    },
  ],
  raj: [
    {
      date: "Monday",
      messages: [
        {
          id: "dm5",
          userId: "raj",
          time: "4:00 PM",
          content: "I'll be on PTO this week but reachable on Slack if anything urgent comes up.",
          reactions: [],
        },
      ],
    },
  ],
}

const quickEmojis = ["👍", "❤️", "🔥", "👀", "🎉", "💡"]

export function ChatArea({ activeConversation, onMembersToggle }: ChatAreaProps) {
  const [message, setMessage] = useState("")
  const [allMessages, setAllMessages] = useState<Record<string, MessageGroup[]>>({
    ...channelMessages,
    ...Object.fromEntries(Object.entries(dmMessages).map(([k, v]) => [`dm_${k}`, v]))
  })
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      setIsScrolled(scrollTop > 10)
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100)
    }
  }, [])

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [])

  const messageKey = activeConversation.type === "dm" ? `dm_${activeConversation.id}` : activeConversation.id
  const currentMessages = allMessages[messageKey] || []

  useEffect(() => {
    inputRef.current?.focus()
  }, [activeConversation])

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll)
      return () => scrollElement.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  const handleSendMessage = () => {
    if (!message.trim()) return
    
    const newMessage: Message = {
      id: `new_${Date.now()}`,
      userId: "alex" as UserKey,
      time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      content: message,
      reactions: [],
    }

    setAllMessages(prev => {
      const key = messageKey
      const existing = prev[key] || []
      const todayGroup = existing.find(g => g.date === "Today")
      
      if (todayGroup) {
        return {
          ...prev,
          [key]: existing.map(g => 
            g.date === "Today" 
              ? { ...g, messages: [...g.messages, newMessage] }
              : g
          )
        }
      } else {
        return {
          ...prev,
          [key]: [...existing, { date: "Today", messages: [newMessage] }]
        }
      }
    })
    
    toast.success("Message sent", {
      description: activeConversation.type === "channel" 
        ? `Sent to #${activeConversation.name}`
        : `Sent to ${activeConversation.name}`,
    })
    setMessage("")
  }

  const handleAddReaction = (messageId: string, emoji: string) => {
    setAllMessages(prev => {
      const key = messageKey
      const groups = prev[key] || []
      
      return {
        ...prev,
        [key]: groups.map(group => ({
          ...group,
          messages: group.messages.map(msg => {
            if (msg.id !== messageId) return msg
            
            const existingReaction = msg.reactions.find(r => r.emoji === emoji)
            if (existingReaction) {
              if (existingReaction.reacted) {
                const newCount = existingReaction.count - 1
                return {
                  ...msg,
                  reactions: newCount === 0 
                    ? msg.reactions.filter(r => r.emoji !== emoji)
                    : msg.reactions.map(r => r.emoji === emoji ? { ...r, count: newCount, reacted: false } : r)
                }
              } else {
                return {
                  ...msg,
                  reactions: msg.reactions.map(r => r.emoji === emoji ? { ...r, count: r.count + 1, reacted: true } : r)
                }
              }
            } else {
              return {
                ...msg,
                reactions: [...msg.reactions, { emoji, count: 1, reacted: true }]
              }
            }
          })
        }))
      }
    })
    setShowEmojiPicker(null)
  }

  const headerAvatars = Object.values(users).map(u => u.avatar)

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <header className={cn(
        "flex items-center gap-3 px-4 h-14 border-b flex-shrink-0 header-scroll-shadow transition-all duration-300",
        isScrolled ? "border-transparent scrolled" : "border-gray-200 bg-white"
      )}>
        <div className="flex-1 min-w-0 pl-10 md:pl-0">
          <div className="flex items-center gap-2">
            {activeConversation.type === "channel" ? (
              <>
                <Hash className="h-5 w-5 text-gray-400" />
                <h1 className="font-semibold text-gray-900 text-lg">{activeConversation.name}</h1>
              </>
            ) : (
              <>
                <Avatar className="h-6 w-6">
                  <AvatarImage src={activeConversation.avatar} />
                  <AvatarFallback>{activeConversation.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h1 className="font-semibold text-gray-900 text-lg">{activeConversation.name}</h1>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </>
            )}
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="flex items-center gap-1">
          {activeConversation.type === "channel" && (
            <div className="hidden sm:flex items-center mr-2">
              <div className="flex -space-x-2">
                {headerAvatars.slice(0, 4).map((avatar, i) => (
                  <Avatar key={i} className="h-6 w-6 ring-2 ring-white">
                    <AvatarImage src={avatar} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500 font-medium">12</span>
            </div>
          )}
          {activeConversation.type === "dm" && (
            <>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <Video className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
            <Pin className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
            <Search className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            onClick={onMembersToggle}
          >
            <Users className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto min-h-0 smooth-scroll relative" ref={scrollRef}>
        <div className="px-4 py-4">
          {currentMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mb-4">
                {activeConversation.type === "channel" ? (
                  <Hash className="h-8 w-8 text-violet-600" />
                ) : (
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={activeConversation.avatar} />
                    <AvatarFallback>{activeConversation.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {activeConversation.type === "channel" 
                  ? `Welcome to #${activeConversation.name}`
                  : `Chat with ${activeConversation.name}`
                }
              </h3>
              <p className="text-gray-500 text-sm max-w-sm">
                {activeConversation.type === "channel"
                  ? "This is the start of the channel. Send a message to get the conversation started."
                  : "This is the beginning of your direct message history."
                }
              </p>
            </div>
          ) : (
            currentMessages.map((group, groupIndex) => (
              <div key={group.date}>
                {/* Date divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                    {group.date}
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Messages */}
                <div className="space-y-1">
                  {group.messages.map((msg, msgIndex) => {
                    const user = users[msg.userId]
                    const isHovered = hoveredMessage === msg.id
                    
                    return (
                      <div
                        key={msg.id}
                        className="group relative animate-slide-up-fade"
                        style={{ animationDelay: `${msgIndex * 50}ms` }}
                        onMouseEnter={() => setHoveredMessage(msg.id)}
                        onMouseLeave={() => {
                          setHoveredMessage(null)
                          setShowEmojiPicker(null)
                        }}
                      >
                        <div className={cn(
                          "flex gap-3 px-3 py-2 rounded-lg transition-colors",
                          isHovered && "bg-gray-50"
                        )}>
                          <Avatar className="h-9 w-9 flex-shrink-0 mt-0.5 ring-2 ring-white shadow-sm">
                            <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                            <AvatarFallback className="bg-violet-100 text-violet-600">{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2">
                              <span className="font-semibold text-gray-900 hover:underline cursor-pointer">{user.name}</span>
                              <span className="text-xs text-gray-400">{msg.time}</span>
                            </div>
                            <p className="text-gray-700 mt-0.5 leading-relaxed">{msg.content}</p>
                            
                            {msg.codeBlock && (
                              <pre className="mt-3 p-4 bg-[#1e1e2e] text-[#cdd6f4] rounded-xl overflow-x-auto text-sm font-mono border border-[#313244] shadow-lg">
                                <code>{msg.codeBlock}</code>
                              </pre>
                            )}

                            {(msg.reactions.length > 0 || isHovered) && (
                              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                {msg.reactions.map((reaction) => (
                                  <button
                                    key={reaction.emoji}
                                    onClick={() => handleAddReaction(msg.id, reaction.emoji)}
                                    className={cn(
                                      "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105",
                                      reaction.reacted
                                        ? "bg-violet-100 text-violet-700 ring-1 ring-violet-300"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    )}
                                  >
                                    <span>{reaction.emoji}</span>
                                    <span>{reaction.count}</span>
                                  </button>
                                ))}
                                {isHovered && (
                                  <div className="relative">
                                    <button
                                      onClick={() => setShowEmojiPicker(showEmojiPicker === msg.id ? null : msg.id)}
                                      className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                    >
                                      <Smile className="h-3.5 w-3.5 text-gray-500" />
                                    </button>
                                    {showEmojiPicker === msg.id && (
                                      <div className="absolute left-0 top-full mt-1 z-50 bg-white rounded-xl shadow-xl border border-gray-200 p-2 flex gap-1">
                                        {quickEmojis.map(emoji => (
                                          <button
                                            key={emoji}
                                            onClick={() => handleAddReaction(msg.id, emoji)}
                                            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-lg transition-transform hover:scale-110"
                                          >
                                            {emoji}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                            {msg.threadCount && (
                              <button className="flex items-center gap-2 mt-2 text-violet-600 text-sm font-medium hover:text-violet-700 group/thread">
                                <div className="flex -space-x-1.5">
                                  <Avatar className="h-5 w-5 ring-2 ring-white">
                                    <AvatarImage src={users.maya.avatar} />
                                  </Avatar>
                                  <Avatar className="h-5 w-5 ring-2 ring-white">
                                    <AvatarImage src={users.chris.avatar} />
                                  </Avatar>
                                </div>
                                <MessageSquare className="h-3.5 w-3.5" />
                                <span className="group-hover/thread:underline">{msg.threadCount} replies</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Hover actions */}
                        {isHovered && (
                          <div className="absolute -top-3 right-3 flex items-center gap-0.5 bg-white rounded-lg shadow-lg border border-gray-200 p-0.5">
                            <button className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700">
                              <MessageSquare className="h-4 w-4" />
                            </button>
                            <button className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}

          {/* Typing indicator */}
          {activeConversation.type === "channel" && (
            <div className="flex items-center gap-2 mt-4 px-3 py-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={users.alex.avatar} />
              </Avatar>
              <span className="text-sm text-gray-600">
                <span className="font-medium">Alex</span> is typing
              </span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-typing-dot" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-typing-dot" style={{ animationDelay: "200ms" }} />
                <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-typing-dot" style={{ animationDelay: "400ms" }} />
              </span>
            </div>
          )}
        </div>

        {/* Scroll to bottom FAB */}
        <button
          onClick={scrollToBottom}
          className={cn(
            "absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300",
            showScrollButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          )}
        >
          <ArrowDown className="h-4 w-4" />
          <span>Jump to latest</span>
        </button>
      </div>

      {/* Message input */}
      <div className="px-4 py-3 border-t border-gray-100 bg-white flex-shrink-0">
        <div className="flex items-end gap-2 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-violet-300 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
          <div className="flex items-center gap-0.5 p-2 border-r border-gray-200">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg hidden sm:flex">
              <Strikethrough className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg hidden sm:flex">
              <Code className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-0.5 p-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <Smile className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <AtSign className="h-4 w-4" />
            </Button>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
            placeholder={activeConversation.type === "channel" 
              ? `Message #${activeConversation.name}` 
              : `Message ${activeConversation.name}`
            }
            className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none py-3 px-1"
          />
          <div className="p-2">
            <Button 
              size="icon" 
              disabled={!message.trim()}
              className={cn(
                "h-10 w-10 rounded-xl transition-all duration-300 relative",
                message.trim() 
                  ? "bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 btn-glow" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
              onClick={handleSendMessage}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
