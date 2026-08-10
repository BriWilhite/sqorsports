export default function Home() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Servers Sidebar */}
      <div className="w-20 bg-gray-950 flex flex-col items-center py-4 space-y-3">
        <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-lg font-bold cursor-pointer hover:rounded-2xl transition-all">
          S
        </div>
        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-sm cursor-pointer hover:rounded-2xl transition-all">
          TS
        </div>
        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-sm cursor-pointer hover:rounded-2xl transition-all">
          HU
        </div>
      </div>

      {/* Channels Sidebar */}
      <div className="w-60 bg-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-700 font-semibold">
          TeamSnap Soccer
        </div>
        <div className="flex-1 p-3 space-y-1">
          <div className="px-2 py-1.5 rounded hover:bg-gray-700 cursor-pointer text-gray-300">
            # announcements
          </div>
          <div className="px-2 py-1.5 rounded hover:bg-gray-700 cursor-pointer text-gray-300">
            # schedule
          </div>
          <div className="px-2 py-1.5 rounded hover:bg-gray-700 cursor-pointer text-gray-300">
            # carpool
          </div>
          <div className="px-2 py-1.5 rounded bg-gray-700 cursor-pointer">
            # general
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="h-12 border-b border-gray-700 flex items-center px-4 font-medium">
          # general
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="text-gray-400 text-sm mb-4">
            This is the beginning of the #general channel.
          </div>
          <div className="space-y-4">
            <div>
              <span className="font-semibold text-indigo-400">Brian</span>
              <span className="text-gray-500 text-xs ml-2">Today at 10:30 AM</span>
              <p className="text-gray-200">Practice is at 5:30pm tomorrow. Field 3.</p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <input
            type="text"
            placeholder="Message #general"
            className="w-full bg-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none"
          />
        </div>
      </div>
    </div>
  )
}
