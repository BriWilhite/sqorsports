export default function Home() {
  return (
    <div className="flex h-screen bg-[#1e1f22] text-gray-100">
      {/* Servers Sidebar */}
      <div className="w-[72px] bg-[#111214] flex flex-col items-center py-3 space-y-2">
        {/* SqorSports home */}
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-lg font-bold cursor-pointer hover:rounded-xl transition-all duration-200">
          S
        </div>
        
        <div className="w-8 h-[2px] bg-gray-700 rounded-full my-1"></div>

        {/* TeamSnap */}
        <div className="w-12 h-12 rounded-full bg-[#00a8e8] flex items-center justify-center text-xs font-bold cursor-pointer hover:rounded-2xl transition-all duration-200" title="TeamSnap">
          TS
        </div>

        {/* SportsYou */}
        <div className="w-12 h-12 rounded-full bg-[#7c3aed] flex items-center justify-center text-xs font-bold cursor-pointer hover:rounded-2xl transition-all duration-200" title="SportsYou">
          SY
        </div>

        {/* Hudl */}
        <div className="w-12 h-12 rounded-full bg-[#ff6b00] flex items-center justify-center text-xs font-bold cursor-pointer hover:rounded-2xl transition-all duration-200" title="Hudl">
          HU
        </div>

        {/* Sprocket */}
        <div className="w-12 h-12 rounded-full bg-[#10b981] flex items-center justify-center text-xs font-bold cursor-pointer hover:rounded-2xl transition-all duration-200" title="Sprocket">
          SP
        </div>

        {/* Remind */}
        <div className="w-12 h-12 rounded-full bg-[#3b82f6] flex items-center justify-center text-xs font-bold cursor-pointer hover:rounded-2xl transition-all duration-200" title="Remind">
          RE
        </div>

        {/* Add server */}
        <div className="w-12 h-12 rounded-full bg-[#1e1f22] border border-gray-600 flex items-center justify-center text-xl text-green-500 cursor-pointer hover:rounded-2xl hover:bg-green-500 hover:text-white transition-all duration-200">
          +
        </div>
      </div>

      {/* Channels Sidebar */}
      <div className="w-60 bg-[#2b2d31] flex flex-col">
        <div className="h-12 px-4 flex items-center border-b border-[#1e1f22] font-semibold text-white shadow-sm">
          TeamSnap Soccer
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-2 mb-1 mt-2">
            Channels
          </div>
          
          <div className="flex items-center px-2 py-1.5 rounded hover:bg-[#35373c] cursor-pointer text-gray-300">
            <span className="mr-1.5 text-gray-500">#</span> announcements
          </div>
          <div className="flex items-center px-2 py-1.5 rounded hover:bg-[#35373c] cursor-pointer text-gray-300">
            <span className="mr-1.5 text-gray-500">#</span> schedule
          </div>
          <div className="flex items-center px-2 py-1.5 rounded hover:bg-[#35373c] cursor-pointer text-gray-300">
            <span className="mr-1.5 text-gray-500">#</span> carpool
          </div>
          <div className="flex items-center px-2 py-1.5 rounded bg-[#35373c] cursor-pointer text-white">
            <span className="mr-1.5 text-gray-400">#</span> general
          </div>
          <div className="flex items-center px-2 py-1.5 rounded hover:bg-[#35373c] cursor-pointer text-gray-300">
            <span className="mr-1.5 text-gray-500">#</span> parents-only
          </div>
        </div>

        {/* User area */}
        <div className="h-14 bg-[#232428] px-2 flex items-center">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-medium">
            B
          </div>
          <div className="ml-2">
            <div className="text-sm font-medium">Brian</div>
            <div className="text-xs text-gray-400">Online</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#313338]">
        {/* Channel header */}
        <div className="h-12 px-4 flex items-center border-b border-[#1e1f22] shadow-sm">
          <span className="text-gray-400 mr-2">#</span>
          <span className="font-semibold">general</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="text-center text-xs text-gray-500 my-4">
            August 10, 2026
          </div>

          <div className="flex group">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
              B
            </div>
            <div className="ml-3">
              <div className="flex items-baseline">
                <span className="font-medium text-indigo-300">Brian</span>
                <span className="text-xs text-gray-500 ml-2">10:30 AM</span>
              </div>
              <p className="text-gray-100">Practice is at 5:30pm tomorrow on Field 3. Please arrive 10 minutes early.</p>
            </div>
          </div>

          <div className="flex group">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
              E
            </div>
            <div className="ml-3">
              <div className="flex items-baseline">
                <span className="font-medium text-emerald-300">Emaleigh</span>
                <span className="text-xs text-gray-500 ml-2">10:42 AM</span>
              </div>
              <p className="text-gray-100">Got it. I can take 3 extra kids if anyone needs a ride.</p>
            </div>
          </div>
        </div>

        {/* Message input */}
        <div className="p-4">
          <div className="bg-[#383a40] rounded-lg px-4 py-3 flex items-center">
            <input
              type="text"
              placeholder="Message #general"
              className="bg-transparent w-full text-sm focus:outline-none placeholder-gray-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
