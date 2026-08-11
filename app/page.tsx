"use client"

import { useState, useEffect } from "react"

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

const SUPABASE_URL = "https://cvrzieobtvakfiqgouhw.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2cnppZW9idHZha2ZpcXFvdWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYzNjkyMjcsImV4cCI6MjAyMjIxMjgzMH0.KXZhfVlY68C9Tuxd54ELhvmn_NhQBX25iw8taEflj3A"

export default function Home() {
  const [servers, setServers] = useState<Server[]>([])
  const [channels, setChannels] = useState<Channel[]>([])
  const [activeServerId, setActiveServerId] = useState<string>("")
  const [activeChannel, setActiveChannel] = useState<string>("general")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const serversRes = await fetch(`${SUPABASE_URL}/rest/v1/servers?select=*`, {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        })
        const serversData = await serversRes.json()

        const channelsRes = await fetch(`${SUPABASE_URL}/rest/v1/channels?select=*`, {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        })
        const channelsData = await channelsRes.json()

        if (Array.isArray(serversData)) {
          setServers(serversData)
          if (serversData.length > 0) {
            setActiveServerId(serversData[0].id)
          }
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
            onClick={() => {
              setActiveServerId(server.id)
              setActiveChannel("general")
            }}
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

      {/* Channels */}
      <div className="w-60 bg-[#2b2d31] flex flex-col">
        <div className="px-4 py-3 border-b border-[#1e1f22] font-semibold">
          {activeServer?.name || "SqorSports"}
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <div className="text-xs text-gray-400 uppercase px-2 mb-1">Channels</div>
          {activeChannels.map((channel) => (
            <div
              key={channel.id}
              onClick={() => setActiveChannel(channel.name)}
              className={`px-2 py-1 rounded cursor-pointer ${
                activeChannel === channel.name ? "bg-[#404249]" : "hover:bg-[#35373c]"
              }`}
            >
              # {channel.name}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <div className="h-12 border-b border-[#1e1f22] flex items-center px-4">
          # {activeChannel}
          <span className="ml-auto text-xs bg-[#404249] px-2 py-1 rounded">Connected to Supabase</span>
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold">
              B
            </div>
            <div>
              <div className="font-semibold">Brian <span className="text-xs text-gray-400">Just now</span></div>
              <div>Servers and channels are now loading from the real database.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}