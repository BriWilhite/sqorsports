"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase" 
console.log('Supabase URL being used:', supabase)

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

export default function Home() {
  const [servers, setServers] = useState<Server[]>([])
  const [channels, setChannels] = useState<Channel[]>([])
  const [activeServerId, setActiveServerId] = useState<string>("")
  const [activeChannel, setActiveChannel] = useState<string>("general")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const { data: serversData } = await supabase
        .from("servers")
        .select("*")
        
      const { data: channelsData } = await supabase
        .from("channels")
        .select("*")
        
      if (serversData) {
        setServers(serversData)
        if (serversData.length > 0) {
          setActiveServerId(serversData[0].id)
        }
      }

      if (channelsData) {
        setChannels(channelsData)
      }

      setLoading(false)
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
            style={{ backgroundColor: server.color }}
            title={server.name}
          >
            {server.short_name}
          </div>
        ))}

        <div className="w-12 h-12 rounded-full bg-[#1e1f22] border-2 border-dashed border-gray-600 flex items-center justify-center text-2xl text-green-500 cursor-pointer hover:rounded-2xl hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-200">
          +
        </div>
      </div>

      {/* Channels Sidebar */}
      <div className="w-60 bg-[#2b2d31] flex flex-col flex-shrink-0">
        <div className="h-12 px-4 flex items-center border-b border-[#1e1f22] font-semibold text-white">
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-bold">
            SqorSports
          </span>
          <span className="ml-2 text-gray-400 text-sm">
            • {activeServer?.name || ""}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
            Channels
          </div>

          <div className="space-y-0.5">
            {activeChannels.map((channel) => (
              <div
                key={channel.id}
                onClick={() => setActiveChannel(channel.name)}
                className={`flex items-center px-2 py-1.5 rounded cursor-pointer group ${
                  activeChannel === channel.name
                    ? "bg-[#35373c] text-white"
                    : "hover:bg-[#35373c] text-gray-300"
                }`}
              >
                <span className="text-gray-500 mr-1.5">#</span>
                {channel.name}
              </div>
            ))}
          </div>
        </div>

        <div className="h-14 bg-[#232428] px-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold">
            B
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">Brian</div>
            <div className="text-xs text-green-400">Online</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#313338] min-w-0">
        <div className="h-12 px-4 flex items-center border-b border-[#1e1f22] shadow-sm gap-2">
          <span className="text-gray-400 text-xl">#</span>
          <span className="font-semibold text-white">{activeChannel}</span>
          <span className="text-gray-500 text-sm ml-2">
            • {activeServer?.name}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <div className="flex justify-center">
            <span className="text-xs text-gray-500 bg-[#2b2d31] px-3 py-1 rounded-full">
              Connected to Supabase
            </span>
          </div>

          <div className="flex gap-3 hover:bg-[#2e3035] -mx-2 px-2 py-1 rounded">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              B
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-medium text-indigo-300">Brian</span>
                <span className="text-xs text-gray-500">Just now</span>
              </div>
              <p className="text-gray-100 mt-0.5">
                Servers and channels are now loading from the real database.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="bg-[#383a40] rounded-xl px-4 py-3 flex items-center gap-3">
            <input
              type="text"
              placeholder={`Message #${activeChannel}`}
              className="bg-transparent w-full text-sm focus:outline-none placeholder-gray-500 text-gray-100"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
