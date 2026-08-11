"use client"

import { useState, useEffect, useRef } from "react"

type Server = {
  id: string
  name: string
  short_name: string
  color: string
  sort_order: number
}

type Channel = {
  id: string
  server_id: string
  name: string
  sort_order: number
}

type Message = {
  id: string
  channel_id: string
  content: string
  created_at: string
}

const SUPABASE_URL = "https://pjifexeqrycpmumsuimk.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqaWZleGVxcnljcG11bXN1aW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0ODI4ODEsImV4cCI6MjEwMjA1ODg4MX0.mPXFp4jRp-DwICSFQeveP6KVpIAjCgeWZhwGbqP5o0o"

export default function Home() {
  const [servers, setServers] = useState<Server[]>([])
  const [channels, setChannels] = useState<Channel[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [activeServerId, setActiveServerId] = useState<string>("")
  const [activeChannelId, setActiveChannelId] = useState<string>("")
  const [activeChannelName, setActiveChannelName] = useState<string>("general")
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load servers and channels
  useEffect(() => {
    async function loadData() {
      try {
        const serversRes = await fetch(`${SUPABASE_URL}/rest/v1/servers?select=*&order=sort_order`, {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        })
        const serversData = await serversRes.json()

        const channelsRes = await fetch(`${SUPABASE_URL}/rest/v1/channels?select=*&order=sort_order`, {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        })
        const channelsData = await channelsRes.json()

        if (Array.isArray(serversData) && serversData.length > 0) {
          setServers(serversData)
          setActiveServerId(serversData[0].id)
        }

        if (Array.isArray(channelsData)) {
          setChannels(channelsData)
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // When server changes, set the first channel of that server
  useEffect(() => {
    if (!activeServerId || channels.length === 0) return

    const serverChannels = channels.filter((c) => c.server_id === activeServerId)
    if (serverChannels.length > 0) {
      setActiveChannelId(serverChannels[0].id)
      setActiveChannelName(serverChannels[0].name)
    }
  }, [activeServerId, channels])

  // Load messages when channel changes
  useEffect(() => {
    if (!activeChannelId) return

    async function loadMessages() {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/messages?channel_id=eq.${activeChannelId}&select=*&order=created_at`,
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
          }
        )
        const data = await res.json()
        if (Array.isArray(data)) {
          setMessages(data)
        }
      } catch (error) {
        console.error("Error loading messages:", error)
      }
    }

    loadMessages()
  }, [activeChannelId])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Send a new message
  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || !activeChannelId) return

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          channel_id: activeChannelId,
          content: newMessage.trim(),
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setMessages((prev) => [...prev, data[0]])
        setNewMessage("")
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const activeServer = servers.find((s) => s.id === activeServerId)
  const activeChannels = channels.filter((c) => c.server_id === activeServerId)

  if (loading) {
    return (
      <div className="flex h-screen bg-[#1e1f22] text-white items-center justify-center">
        Loading SqorSports...
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#1e1f22] text-gray-100 overflow-hidden">
      {/* Servers Sidebar */}
      <div className="w-[72px] bg-[#111214] flex flex-col items-center py-3 space-y-2 flex-shrink-0">
        {servers.map((server) => (
          <div
            key={server.id}
            onClick={() => setActiveServerId(server.id)}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer transition-all duration-200 shadow-md ${
              activeServerId === server.id
                ? "rounded-2xl ring-2 ring-white ring-offset-2 ring-offset-[#111214]"
                : "hover:rounded-2xl"
            }`}
            style={{ backgroundColor: server.color || "#5865f2" }}
          >
            {server.short_name || server.name.substring(0, 2).toUpperCase()}
          </div>
        ))}
      </div>

      {/* Channels Sidebar */}
      <div className="w-60 bg-[#2b2d31] flex flex-col">
        <div className="px-4 py-3 border-b border-[#1e1f22] font-semibold">
          {activeServer?.name || "SqorSports"}
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <div className="text-xs text-gray-400 uppercase px-2 mb-1">Channels</div>
          {activeChannels.map((channel) => (
            <div
              key={channel.id}
              onClick={() => {
                setActiveChannelId(channel.id)
                setActiveChannelName(channel.name)
              }}
              className={`px-2 py-1 rounded cursor-pointer ${
                activeChannelId === channel.id ? "bg-[#404249]" : "hover:bg-[#35373c]"
              }`}
            >
              # {channel.name}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-12 border-b border-[#1e1f22] flex items-center px-4">
          <span className="font-semibold"># {activeChannelName}</span>
          <span className="ml-auto text-xs bg-[#404249] px-2 py-1 rounded">Connected to Supabase</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-gray-500 text-center mt-10">
              No messages yet. Be the first to say something!
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold flex-shrink-0">
                  B
                </div>
                <div>
                  <div className="font-semibold">
                    Brian{" "}
                    <span className="text-xs text-gray-400 font-normal">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <div>{msg.content}</div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={sendMessage} className="p-4 border-t border-[#1e1f22]">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message #${activeChannelName}`}
              className="flex-1 bg-[#404249] text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}