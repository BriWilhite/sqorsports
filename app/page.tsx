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
  user_name?: string
}

type ConnectedApp = {
  id: string
  app_name: string
  link_url: string | null
  notes: string | null
}

const SUPABASE_URL = "https://pjifexeqrycpmumsuimk.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqaWZleGVxcnljcG11bXN1aW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0ODI4ODEsImV4cCI6MjEwMjA1ODg4MX0.mPXFp4jRp-DwICSFQeveP6KVpIAjCgeWZhwGbqP5o0o"

const AVAILABLE_APPS = [
  "TeamSnap",
  "SportsYou",
  "Hudl",
  "Sprocket Sports",
  "Remind",
]

export default function Home() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [authError, setAuthError] = useState("")
  const [authLoading, setAuthLoading] = useState(false)

  const [servers, setServers] = useState<Server[]>([])
  const [channels, setChannels] = useState<Channel[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [connectedApps, setConnectedApps] = useState<ConnectedApp[]>([])
  const [activeServerId, setActiveServerId] = useState<string>("")
  const [activeChannelId, setActiveChannelId] = useState<string>("")
  const [activeChannelName, setActiveChannelName] = useState<string>("general")
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [showConnectedApps, setShowConnectedApps] = useState(false)
  const [newAppName, setNewAppName] = useState("Sprocket Sports")
  const [newAppLink, setNewAppLink] = useState("")
  const [newAppNotes, setNewAppNotes] = useState("")

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check if user is already logged in
  useEffect(() => {
    const saved = localStorage.getItem("sqorsports_user")
    if (saved) {
      setUser(JSON.parse(saved))
    }
  }, [])

  // Load servers and channels
  useEffect(() => {
    async function loadData() {
      try {
        const serversRes = await fetch(`${SUPABASE_URL}/rest/v1/servers?select=*&order=sort_order`, {
          headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        })
        const serversData = await serversRes.json()

        const channelsRes = await fetch(`${SUPABASE_URL}/rest/v1/channels?select=*&order=sort_order`, {
          headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        })
        const channelsData = await channelsRes.json()

        if (Array.isArray(serversData) && serversData.length > 0) {
          setServers(serversData)
          setActiveServerId(serversData[0].id)
        }
        if (Array.isArray(channelsData)) setChannels(channelsData)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Load connected apps when user is logged in
  useEffect(() => {
    if (!user) return
    async function loadConnectedApps() {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/connected_apps?user_email=eq.${user.email}&select=*`,
        { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
      )
      const data = await res.json()
      if (Array.isArray(data)) setConnectedApps(data)
    }
    loadConnectedApps()
  }, [user])

  // When server changes
  useEffect(() => {
    if (!activeServerId || channels.length === 0) return
    const serverChannels = channels.filter((c) => c.server_id === activeServerId)
    if (serverChannels.length > 0) {
      setActiveChannelId(serverChannels[0].id)
      setActiveChannelName(serverChannels[0].name)
    }
  }, [activeServerId, channels])

  // Load messages
  useEffect(() => {
    if (!activeChannelId) return
    async function loadMessages() {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/messages?channel_id=eq.${activeChannelId}&select=*&order=created_at`,
        { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
      )
      const data = await res.json()
      if (Array.isArray(data)) setMessages(data)
    }
    loadMessages()
  }, [activeChannelId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Auth
  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    setAuthError("")
    setAuthLoading(true)
    try {
      if (authMode === "signup") {
        const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
          method: "POST",
          headers: { apikey: SUPABASE_ANON_KEY, "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, data: { full_name: name } }),
        })
        const data = await res.json()
        if (!res.ok) {
          setAuthError(data.error_description || data.msg || "Signup failed")
          return
        }
        const userData = { email, name: name || email.split("@")[0] }
        setUser(userData)
        localStorage.setItem("sqorsports_user", JSON.stringify(userData))
      } else {
        const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
          method: "POST",
          headers: { apikey: SUPABASE_ANON_KEY, "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })
        const data = await res.json()
        if (!res.ok) {
          setAuthError(data.error_description || data.msg || "Login failed")
          return
        }
        const userData = { email, name: name || email.split("@")[0] }
        setUser(userData)
        localStorage.setItem("sqorsports_user", JSON.stringify(userData))
      }
    } catch {
      setAuthError("Something went wrong")
    } finally {
      setAuthLoading(false)
    }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem("sqorsports_user")
  }

  // Send message
  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || !activeChannelId || !user) return
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
        user_name: user.name,
      }),
    })
    if (res.ok) {
      const data = await res.json()
      setMessages((prev) => [...prev, data[0]])
      setNewMessage("")
    }
  }

  // Add connected app
  async function addConnectedApp(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !newAppName) return
    const res = await fetch(`${SUPABASE_URL}/rest/v1/connected_apps`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        user_email: user!.email,
        app_name: newAppName,
        link_url: newAppLink || null,
        notes: newAppNotes || null,
      }),
    })
    if (res.ok) {
      const data = await res.json()
      setConnectedApps((prev) => [...prev, data[0]])
      setNewAppLink("")
      setNewAppNotes("")
    }
  }

  const activeServer = servers.find((s) => s.id === activeServerId)
  const activeChannels = channels.filter((c) => c.server_id === activeServerId)

  // LOGIN SCREEN
  if (!user) {
    return (
      <div className="flex h-screen bg-[#1e1f22] text-white items-center justify-center">
        <div className="bg-[#2b2d31] p-8 rounded-xl w-full max-w-md shadow-2xl">
          <h1 className="text-2xl font-bold text-center mb-2">SqorSports</h1>
          <p className="text-gray-400 text-center mb-6">
            {authMode === "login" ? "Log in to continue" : "Create your account"}
          </p>
          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === "signup" && (
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#404249] px-4 py-3 rounded-lg outline-none"
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#404249] px-4 py-3 rounded-lg outline-none"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#404249] px-4 py-3 rounded-lg outline-none"
              required
            />
            {authError && <p className="text-red-400 text-sm">{authError}</p>}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium"
            >
              {authLoading ? "Please wait..." : authMode === "login" ? "Log In" : "Sign Up"}
            </button>
          </form>
          <p className="text-center text-gray-400 mt-4 text-sm">
            {authMode === "login" ? (
              <>
                Don’t have an account?{" "}
                <button onClick={() => setAuthMode("signup")} className="text-blue-400">
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => setAuthMode("login")} className="text-blue-400">
                  Log in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-[#1e1f22] text-white items-center justify-center">
        Loading SqorSports...
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#1e1f22] text-gray-100 overflow-hidden">
      {/* Servers */}
      <div className="w-[72px] bg-[#111214] flex flex-col items-center py-3 space-y-2 flex-shrink-0">
        {servers.map((server) => (
          <div
            key={server.id}
            onClick={() => {
              setActiveServerId(server.id)
              setShowConnectedApps(false)
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer ${
              activeServerId === server.id && !showConnectedApps
                ? "rounded-2xl ring-2 ring-white ring-offset-2 ring-offset-[#111214]"
                : "hover:rounded-2xl"
            }`}
            style={{ backgroundColor: server.color }}
          >
            {server.short_name}
          </div>
        ))}

        {/* Connected Apps button */}
        <div
          onClick={() => setShowConnectedApps(true)}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer bg-gray-600 ${
            showConnectedApps ? "rounded-2xl ring-2 ring-white ring-offset-2 ring-offset-[#111214]" : "hover:rounded-2xl"
          }`}
        >
          🔗
        </div>
      </div>

      {/* Channels or Connected Apps sidebar */}
      <div className="w-60 bg-[#2b2d31] flex flex-col">
        <div className="px-4 py-3 border-b border-[#1e1f22] font-semibold">
          {showConnectedApps ? "My Connected Apps" : activeServer?.name || "SqorSports"}
        </div>

        {showConnectedApps ? (
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {connectedApps.length === 0 ? (
              <p className="text-gray-400 text-sm">No apps connected yet.</p>
            ) : (
              connectedApps.map((app) => (
                <div key={app.id} className="bg-[#404249] p-3 rounded-lg">
                  <div className="font-medium">{app.app_name}</div>
                  {app.link_url && (
                    <a
                      href={app.link_url}
                      target="_blank"
                      className="text-blue-400 text-sm break-all hover:underline"
                    >
                      {app.link_url}
                    </a>
                  )}
                  {app.notes && <p className="text-gray-400 text-sm mt-1">{app.notes}</p>}
                </div>
              ))
            )}

            {/* Add new app form */}
            <form onSubmit={addConnectedApp} className="mt-4 space-y-2 border-t border-[#1e1f22] pt-4">
              <select
                value={newAppName}
                onChange={(e) => setNewAppName(e.target.value)}
                className="w-full bg-[#404249] px-3 py-2 rounded text-sm"
              >
                {AVAILABLE_APPS.map((app) => (
                  <option key={app} value={app}>
                    {app}
                  </option>
                ))}
              </select>
              <input
                type="url"
                placeholder="Important link (optional)"
                value={newAppLink}
                onChange={(e) => setNewAppLink(e.target.value)}
                className="w-full bg-[#404249] px-3 py-2 rounded text-sm"
              />
              <input
                type="text"
                placeholder="Notes (optional)"
                value={newAppNotes}
                onChange={(e) => setNewAppNotes(e.target.value)}
                className="w-full bg-[#404249] px-3 py-2 rounded text-sm"
              />
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded text-sm">
                Add App
              </button>
            </form>
          </div>
        ) : (
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
        )}

        {/* User info */}
        <div className="p-3 border-t border-[#1e1f22] flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 truncate text-sm">{user.name}</div>
          <button onClick={logout} className="text-xs text-gray-400 hover:text-white">
            Logout
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {showConnectedApps ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-4">🔗</div>
              <p>Select or add your connected sports apps on the left</p>
            </div>
          </div>
        ) : (
          <>
            <div className="h-12 border-b border-[#1e1f22] flex items-center px-4">
              <span className="font-semibold"># {activeChannelName}</span>
              <span className="ml-auto text-xs bg-[#404249] px-2 py-1 rounded">
                Logged in as {user.name}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-gray-500 text-center mt-10">No messages yet.</div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold">
                      {(msg.user_name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold">
                        {msg.user_name || "User"}{" "}
                        <span className="text-xs text-gray-400">
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

            <form onSubmit={sendMessage} className="p-4 border-t border-[#1e1f22]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message #${activeChannelName}`}
                  className="flex-1 bg-[#404249] px-4 py-2 rounded-lg outline-none"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
                  Send
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}