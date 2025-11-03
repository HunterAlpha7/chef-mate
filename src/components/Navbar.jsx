import { UserButton, useUser } from '@clerk/clerk-react'
import { Menu, Search, Bell, ChefHat } from 'lucide-react'
import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Badge,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { NavLink } from 'react-router-dom'

const Navbar = ({ onMenuClick }) => {
  const { user } = useUser()
  const [searchQuery, setSearchQuery] = useState('')
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))

  const handleSearch = (e) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery)
  }

  return (
    <AppBar 
      position="static" 
      elevation={1}
      sx={{ 
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider'
      }}
    >
      <Toolbar sx={{ px: 2, py: 1 }}>
        {/* Left side - Menu button and Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isMobile && (
            <IconButton
              onClick={onMenuClick}
              sx={{ 
                color: 'text.secondary',
                '&:hover': { 
                  color: 'text.primary',
                  bgcolor: 'action.hover'
                }
              }}
            >
              <Menu />
            </IconButton>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ChefHat size={32} color={theme.palette.primary.main} />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                color: 'text.primary',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              ChefMate
            </Typography>
          </Box>
        </Box>

        {/* Center - Navigation (desktop) */}
        <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 1, ml: 2 }}>
          {[
            { to: '/dashboard', label: 'Dashboard' },
            { to: '/recipes', label: 'Recipes' },
            { to: '/chat', label: 'AI Chef' },
            { to: '/calories', label: 'Calories' },
            { to: '/inventory', label: 'Inventory' },
            { to: '/shopping', label: 'Shopping' },
            { to: '/profile', label: 'Profile' }
          ].map((item) => (
            <Button
              key={item.to}
              component={NavLink}
              to={item.to}
              color="inherit"
              sx={{
                color: 'text.secondary',
                textTransform: 'none',
                fontWeight: 'medium',
                '&.active': {
                  color: 'text.primary',
                  bgcolor: 'action.hover'
                }
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Search bar */}
        <Box sx={{ flexGrow: 1, maxWidth: 500, mx: 2 }}>
          <Box component="form" onSubmit={handleSearch}>
            <TextField
              fullWidth
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes, ingredients..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} color={theme.palette.text.secondary} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
          </Box>
        </Box>

        {/* Right side - Notifications and User menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notifications */}
          <IconButton
            sx={{ 
              color: 'text.secondary',
              '&:hover': { 
                color: 'text.primary',
                bgcolor: 'action.hover'
              }
            }}
          >
            <Badge
              badgeContent=""
              variant="dot"
              sx={{
                '& .MuiBadge-dot': {
                  bgcolor: 'error.main',
                  width: 8,
                  height: 8,
                }
              }}
            >
              <Bell />
            </Badge>
          </IconButton>

          {/* User greeting */}
          {user && (
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', ml: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Welcome back, <Box component="span" sx={{ fontWeight: 'medium', color: 'text.primary' }}>{user.firstName}</Box>!
              </Typography>
            </Box>
          )}

          {/* User button */}
          <Box sx={{ ml: 1 }}>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10",
                  userButtonPopoverCard: "shadow-lg border border-gray-200",
                  userButtonPopoverActionButton: "hover:bg-gray-50",
                }
              }}
              showName={false}
            />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar