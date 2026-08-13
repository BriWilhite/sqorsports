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

type Event = {
  id: string
  title: string
  description: string | null
  start_time: string
  end_time: string | null
  location: string | null
  created_by: string | null
}

const SUPABASE_URL = "https://pjifexeqrycpmumsuimk.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqaWZleGVxcnljcG11bXN1aW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0ODI4ODEsImV4cCI6MjEwMjA1ODg4MX0.mPXFp4jRp-DwICSFQeveP6KVpIAjCgeWZhwGbqP5o0o"

const AVAILABLE_APPS = ["TeamSnap", "SportsYou", "Hudl", "Sprocket Sports", "Remind"]

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
  const [events, setEvents] = useState<Event[]>([])
  const [activeServerId, setActiveServerId] = useState("")
  const [activeChannelId, setActiveChannelId] = useState("")
  const [activeChannelName, setActiveChannelName] = useState("general")
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<"chat" | "apps" | "calendar">("chat")

  // Connected Apps form
  const [newAppName, setNewAppName] = useState("Sprocket Sports")
  const [newAppLink, setNewAppLink] = useState("")
  const [newAppNotes, setNewAppNotes] = useState("")

  // Calendar form
  const [eventTitle, setEventTitle] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [eventTime, setEventTime] = useState("")
  const [eventLocation, setEventLocation] = useState("")

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem("sqorsports_user")
    if (saved) setUser(JSON.parse(saved))
  }, [])

  useEffect(() => {
    async function loadData() {
      try {
        const [serversRes, channelsRes] = await Promise.all([
          fetch(`${SUPABASE_URL}/rest/v1/servers?select=*&order=sort_order`, {
            headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
          }),
          fetch(`${SUPABASE_URL}/rest/v1/channels?select=*&order=sort_order`, {
            headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
          }),
        ])
        const serversData = await serversRes.json()
        const channelsData = await channelsRes.json()
        if (Array.isArray(serversData) && serversData.length > 0) {
          setServers(serversData)
          setActiveServerId(serversData[0].id)
        }
        if (Array.isArray(channelsData)) setChannels(channelsData)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    if (!user) return
    async function loadConnected() {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/connected_apps?user_email=eq.${user!.email}&select=*`,
        { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
      )
      const data = await res.json()
      if (Array.isArray(data)) setConnectedApps(data)
    }
    loadConnected()
  }, [user])

  useEffect(() => {
    async function loadEvents() {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/events?select=*&order=start_time`,
        { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
      )
      const data = await res.json()
      if (Array.isArray(data)) setEvents(data)
    }
    loadEvents()
  }, [])

  useEffect(() => {
    if (!activeServerId || channels.length === 0) return
    const serverChannels = channels.filter((c) => c.server_id === activeServerId)
    if (serverChannels.length > 0) {
      setActiveChannelId(serverChannels[0].id)
      setActiveChannelName(serverChannels[0].name)
    }
  }, [activeServerId, channels])

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
        user_email: user.email,
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

  async function addEvent(e: React.FormEvent) {
    e.preventDefault()
    if (!eventTitle || !eventDate || !user) return
    const start = new Date(`${eventDate}T${eventTime || "12:00"}`)
    const res = await fetch(`${SUPABASE_URL}/rest/v1/events`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        title: eventTitle,
        start_time: start.toISOString(),
        location: eventLocation || null,
        created_by: user.name,
      }),
    })
    if (res.ok) {
      const data = await res.json()
      setEvents((prev) => [...prev, data[0]].sort((a, b) => a.start_time.localeCompare(b.start_time)))
      setEventTitle("")
      setEventDate("")
      setEventTime("")
      setEventLocation("")
    }
  }

  const activeServer = servers.find((s) => s.id === activeServerId)
  const activeChannels = channels.filter((c) => c.server_id === activeServerId)

  if (!user) {
    return (
      <div className="flex h-screen bg-[#1e1f22] text-white items-center justify-center">
        <div className="bg-[#2b2d31] p-8 rounded-xl w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-2">SqorSports</h1>
          <p className="text-gray-400 text-center mb-6">
            {authMode === "login" ? "Log in to continue" : "Create your account"}
          </p>
          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === "signup" && (
              <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#404249] px-4 py-3 rounded-lg" required />
            )}
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#404249] px-4 py-3 rounded-lg" required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#404249] px-4 py-3 rounded-lg" required />
            {authError && <p className="text-red-400 text-sm">{authError}</p>}
            <button type="submit" disabled={authLoading} className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium">
              {authLoading ? "Please wait..." : authMode === "login" ? "Log In" : "Sign Up"}
            </button>
          </form>
          <p className="text-center text-gray-400 mt-4 text-sm">
            {authMode === "login" ? (
              <>Don’t have an account? <button onClick={() => setAuthMode("signup")} className="text-blue-400">Sign up</button></>
            ) : (
              <>Already have an account? <button onClick={() => setAuthMode("login")} className="text-blue-400">Log in</button></>
            )}
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="flex h-screen bg-[#1e1f22] text-white items-center justify-center">Loading SqorSports...</div>
  }

  return (
    <div className="flex h-screen bg-[#1e1f22] text-gray-100 overflow-hidden">
      {/* Left server bar */}
      <div className="w-[72px] bg-[#111214] flex flex-col items-center py-3 space-y-2">
        {servers.map((server) => (
          <div
            key={server.id}
            onClick={() => { setActiveServerId(server.id); setView("chat") }}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer ${view === "chat" && activeServerId === server.id ? "rounded-2xl ring-2 ring-white ring-offset-2 ring-offset-[#111214]" : "hover:rounded-2xl"}`}
            style={{ backgroundColor: server.color }}
          >
            {server.short_name}
          </div>
        ))}
        <div onClick={() => setView("apps")} className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer bg-gray-600 ${view === "apps" ? "rounded-2xl ring-2 ring-white ring-offset-2 ring-offset-[#111214]" : ""}`}>🔗</div>
        <div onClick={() => setView("calendar")} className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer bg-indigo-600 ${view === "calendar" ? "rounded-2xl ring-2 ring-white ring-offset-2 ring-offset-[#111214]" : ""}`}>📅</div>
      </div>

      {/* Middle sidebar */}
      <div className="w-60 bg-[#2b2d31] flex flex-col">
        <div className="px-4 py-3 border-b border-[#1e1f22] font-semibold">
          {view === "chat" ? activeServer?.name : view === "apps" ? "My Connected Apps" : "Calendar"}
        </div>

        {view === "chat" && (
          <div className="flex-1 overflow-y-auto p-2">
            <div className="text-xs text-gray-400 uppercase px-2 mb-1">Channels</div>
            {activeChannels.map((ch) => (
              <div key={ch.id} onClick={() => { setActiveChannelId(ch.id); setActiveChannelName(ch.name) }} className={`px-2 py-1 rounded cursor-pointer ${activeChannelId === ch.id ? "bg-[#404249]" : "hover:bg-[#35373c]"}`}>
                # {ch.name}
              </div>
            ))}
          </div>
        )}

        {view === "apps" && (
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {connectedApps.map((app) => (
              <div key={app.id} className="bg-[#404249] p-3 rounded-lg">
                <div className="font-medium">{app.app_name}</div>
                {app.link_url && <a href={app.link_url} target="_blank" className="text-blue-400 text-sm break-all">{app.link_url}</a>}
                {app.notes && <p className="text-gray-400 text-sm mt-1">{app.notes}</p>}
              </div>
            ))}
            <form onSubmit={addConnectedApp} className="space-y-2 border-t border-[#1e1f22] pt-4">
              <select value={newAppName} onChange={(e) => setNewAppName(e.target.value)} className="w-full bg-[#404249] px-3 py-2 rounded text-sm">
                {AVAILABLE_APPS.map((a) => <option key={a}>{a}</option>)}
              </select>
              <input type="url" placeholder="Important link" value={newAppLink} onChange={(e) => setNewAppLink(e.target.value)} className="w-full bg-[#404249] px-3 py-2 rounded text-sm" />
              <input type="text" placeholder="Notes" value={newAppNotes} onChange={(e) => setNewAppNotes(e.target.value)} className="w-full bg-[#404249] px-3 py-2 rounded text-sm" />
              <button type="submit" className="w-full bg-blue-600 py-2 rounded text-sm">Add App</button>
            </form>
          </div>
        )}

        {view === "calendar" && (
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            <form onSubmit={addEvent} className="space-y-2 mb-4">
              <input type="text" placeholder="Event title" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} className="w-full bg-[#404249] px-3 py-2 rounded text-sm" required />
              <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full bg-[#404249] px-3 py-2 rounded text-sm" required />
              <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} className="w-full bg-[#404249] px-3 py-2 rounded text-sm" />
              <input type="text" placeholder="Location (optional)" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} className="w-full bg-[#404249] px-3 py-2 rounded text-sm" />
              <button type="submit" className="w-full bg-indigo-600 py-2 rounded text-sm">Add Event</button>
            </form>
<div className="mt-6 p-3 bg-[#1e1f22] rounded-lg text-sm">
  <p className="font-medium mb-2">Subscribe to Calendar</p>
  <p className="text-gray-400 text-xs mb-2">
    Copy this link and add it to your iPhone or Android calendar:
  </p>
  <input
    type="text"
    readOnly
    value={typeof window !== "undefined" ? `${window.location.origin}/api/calendar` : "https://sqorsports.com/api/calendar"}
    className="w-full bg-[#404249] px-2 py-1 rounded text-xs mb-2"
    onClick={(e) => (e.target as HTMLInputElement).select()}
  />
  <p className="text-gray-500 text-xs">
    iPhone: Settings → Calendar → Accounts → Add Account → Other → Add Subscribed Calendar<br/>
    Android: Open Google Calendar → + → From URL
  </p>
</div>
            {events.map((ev) => (
  <div key={ev.id} className="bg-[#404249] p-3 rounded-lg">
    <div className="font-medium">{ev.title}</div>
    <div className="text-sm text-gray-400">{new Date(ev.start_time).toLocaleString()}</div>
    {ev.location && <div className="text-sm text-gray-400">{ev.location}</div>}
    
    <button
      onClick={() => {
        const start = new Date(ev.start_time)
        const end = ev.end_time ? new Date(ev.end_time) : new Date(start.getTime() + 60 * 60 * 1000)
        
        const formatDate = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
        
        const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
UID:${ev.id}@sqorsports.com
DTSTART:${formatDate(start)}
DTEND:${formatDate(end)}
SUMMARY:${ev.title}
DESCRIPTION:${ev.description || ""}
LOCATION:${ev.location || ""}
END:VEVENT
END:VCALENDAR`

        const blob = new Blob([ics], { type: "text/calendar" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${ev.title || "event"}.ics`
        a.click()
        URL.revokeObjectURL(url)
      }}
      className="mt-2 text-xs bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded"
    >
      Add to Calendar
    </button>
  </div>
))}
          </div>
        )}

        <div className="p-3 border-t border-[#1e1f22] flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold">{user.name.charAt(0)}</div>
          <div className="flex-1 truncate text-sm">{user.name}</div>
          <button onClick={logout} className="text-xs text-gray-400">Logout</button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {view === "chat" ? (
          <>
            <div className="h-12 border-b border-[#1e1f22] flex items-center px-4">
              <span className="font-semibold"># {activeChannelName}</span>
              <span className="ml-auto text-xs bg-[#404249] px-2 py-1 rounded">Logged in as {user.name}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold">{(msg.user_name || "U").charAt(0)}</div>
                  <div>
                    <div className="font-semibold">{msg.user_name || "User"} <span className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleTimeString()}</span></div>
                    <div>{msg.content}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="p-4 border-t border-[#1e1f22]">
              <div className="flex gap-2">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder={`Message #${activeChannelName}`} className="flex-1 bg-[#404249] px-4 py-2 rounded-lg" />
                <button type="submit" className="bg-blue-600 px-4 py-2 rounded-lg">Send</button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-5xl mb-4">{view === "apps" ? "🔗" : "📅"}</div>
              <p>{view === "apps" ? "Manage your connected sports apps on the left" : "Add and view events on the left"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}