import { Routes, Route } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { Box, Container } from '@mui/material'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Recipes from './pages/Recipes'
import RecipeDetail from './pages/RecipeDetail'
import Chat from './pages/Chat'
import CalorieTracker from './pages/CalorieTracker'
import Profile from './pages/Profile'
import LandingPage from './pages/LandingPage'
import { useState } from 'react'
import Inventory from './pages/Inventory'
import ShoppingList from './pages/ShoppingList'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <SignedOut>
        <LandingPage />
      </SignedOut>
      
      <SignedIn>
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          
          {/* Main content */}
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Navbar */}
            <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            
            {/* Page content */}
            <Box 
              component="main" 
              sx={{ 
                flexGrow: 1, 
                overflowY: 'auto', 
                bgcolor: 'background.default', 
                py: 2 
              }}
            >
              <Container maxWidth="xl" disableGutters>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/recipes" element={<Recipes />} />
                  <Route path="/recipe/:id" element={<RecipeDetail />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/calories" element={<CalorieTracker />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/shopping" element={<ShoppingList />} />
                </Routes>
              </Container>
            </Box>
          </Box>
        </Box>
      </SignedIn>
    </Box>
  )
}

export default App