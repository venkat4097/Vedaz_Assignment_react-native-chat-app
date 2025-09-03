import React, { useContext } from 'react'
import Sidebar from '../Components/Sidebar'
import ChatContainer from '../Components/ChatContainer'
import RightSidebar from '../Components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div className="w-screen h-screen">
      {selectedUser ? (
        // ✅ Full chat layout (3 columns)
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr] 
                        backdrop-blur-xl border-2 border-gray-600 overflow-hidden h-full w-full">
          <Sidebar />
          <ChatContainer />
          <RightSidebar />
        </div>
      ) : (
        // ✅ Center Sidebar in the middle when no user is selected
       <div className="h-full w-full backdrop-blur-xl border-2 border-gray-600 text-x">
          <Sidebar />
        </div>
      )}
    </div>
  )
}

export default HomePage
