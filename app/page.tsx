"use client"

import { useState } from "react"

const servers = [
  {
    id: "sqorsports",
    name: "SqorSports",
    short: "S",
    color: "bg-gradient-to-br from-indigo-500 to-purple-600",
    channels: ["announcements", "schedule", "carpool", "general", "parents-only"],
  },
  {
    id: "teamsnap",
    name: "TeamSnap",
    short: "TS",
    color: "bg-[#00a8e8]",
    channels: ["announcements", "schedule", "carpool", "general", "parents-only"],
  },
  {
    id: "sportsyou",
    name: "SportsYou",
    short: "SY",
    color: "bg-[#7c3aed]",
    channels: ["announcements", "schedule", "chat", "general"],
  },
  {
    id: "remind",
    name: "Remind",
    short: "RE",
    color: "bg-[#3b82f6]",
    channels: ["announcements", "class-updates", "general"],
  },
  {
    id: "sprocket",
    name: "Sprocket Sports",
    short: "SP",
    color: "bg-[#10b981]",
    channels: ["announcements", "schedule", "photos", "general"],
  },
  {
    id: "hudl",
    name: "Hudl",
    short: "HU",
    color: "bg-[#ff6b00]",
    channels: ["announcements", "film-review", "schedule", "general"],
  },
]

export default function Home() {
  const [activeServerId, setActiveServerId] = useState("teamsnap")
  const [activeChannel, setActiveChannel] = useState("general")

  const activeServer = servers.find((s) => s.id === activeServerId) || servers[1]

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
              server.color
            } ${
              activeServerId === server.id
                ? "rounded-2xl ring-2 ring-white ring-offset-2 ring-offset-[#111214]"
                : "hover:rounded-2xl"
            }`}
            title={server.name}
          >
            {server.short}
          </div>
        ))}

        {/* Add Server */}
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
          <span className="ml-2 text-gray-400 text-sm">• {activeServer.name}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
            Channels
          </div>

          <div className="space-y-0.5">
            {activeServer.channels.map((channel) => (
              <div
                key={channel}
                onClick={() => setActiveChannel(channel)}
                className={`flex items-center px-2 py-1.5 rounded cursor-pointer group ${
                  activeChannel === channel
                    ? "bg-[#35373c] text-white"
                    : "hover:bg-[#35373c] text-gray-300"
                }`}
              >
                <span className="text-gray-500 mr-1.5 group-hover:text-gray-300">#</span>
                {channel}
              </div>
            ))}
          </div>

          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2 mt-5">
            Events
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center px-2 py-1.5 rounded hover:bg-[#35373c] cursor-pointer text-gray-300">
              <span className="mr-1.5">📅</span>
              Upcoming
            </div>
          </div>
        </div>

        {/* User area */}
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
        {/* Channel header */}
        <div className="h-12 px-4 flex items-center border-b border-[#1e1f22] shadow-sm gap-2">
          <span className="text-gray-400 text-xl">#</span>
          <span className="font-semibold text-white">{activeChannel}</span>
          <span className="text-gray-500 text-sm ml-2">• {activeServer.name}</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <div className="flex justify-center">
            <span className="text-xs text-gray-500 bg-[#2b2d31] px-3 py-1 rounded-full">
              August 10, 2026
            </span>
          </div>

          <div className="flex gap-3 hover:bg-[#2e3035] -mx-2 px-2 py-1 rounded">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              B
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-medium text-indigo-300">Brian</span>
                <span className="text-xs text-gray-500">10:30 AM</span>
              </div>
              <p className="text-gray-100 mt-0.5">
                Welcome to the {activeServer.name} server. This is the #{activeChannel} channel.
              </p>
            </div>
          </div>

          <div className="flex gap-3 hover:bg-[#2e3035] -mx-2 px-2 py-1 rounded">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              E
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-medium text-emerald-300">Emaleigh</span>
                <span className="text-xs text-gray-500">10:42 AM</span>
              </div>
              <p className="text-gray-100 mt-0.5">
                Looking forward to using SqorSports instead of jumping between all the apps.
              </p>
            </div>
          </div>
        </div>

        {/* Message input */}
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
