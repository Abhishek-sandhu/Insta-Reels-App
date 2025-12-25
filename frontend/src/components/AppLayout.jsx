import { useState } from 'react'
import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'
import BottomNav from './BottomNav.jsx'
import CreatePostModal from './CreatePostModal.jsx'

function AppLayout({ children }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const openCreate = () => setIsCreateOpen(true)
  const closeCreate = () => setIsCreateOpen(false)

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <Navbar onOpenCreate={openCreate} />

      <div className="mx-auto flex w-full max-w-6xl flex-1 px-2 sm:px-4">
        <Sidebar onOpenCreate={openCreate} />
        <main className="flex-1 pb-16 pt-4 sm:pb-6 sm:pt-6">{children}</main>
      </div>

      <BottomNav onOpenCreate={openCreate} />

      <CreatePostModal open={isCreateOpen} onClose={closeCreate} />
    </div>
  )
}

export default AppLayout
