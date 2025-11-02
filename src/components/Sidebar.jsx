import { NavLink } from 'react-router-dom'
import { 
  Home, 
  BookOpen, 
  MessageCircle, 
  Target, 
  User, 
  X,
  ChefHat,
  TrendingUp,
  Heart,
  Settings
} from 'lucide-react'
import { useUser } from '@clerk/clerk-react'
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material'

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useUser()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Recipes', href: '/recipes', icon: BookOpen },
    { name: 'AI Chat', href: '/chat', icon: MessageCircle },
    { name: 'Calorie Tracker', href: '/calories', icon: Target },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  const quickActions = [
    { name: 'Favorite Recipes', icon: Heart, count: 12 },
    { name: 'Cooking Stats', icon: TrendingUp, count: null },
    { name: 'Settings', icon: Settings, count: null },
  ]

  const drawerWidth = 256

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider' 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ChefHat size={32} color={theme.palette.primary.main} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            ChefMate
          </Typography>
        </Box>
        {isMobile && (
          <IconButton
            onClick={onClose}
            sx={{ 
              color: 'text.secondary',
              '&:hover': { color: 'text.primary' }
            }}
          >
            <X size={24} />
          </IconButton>
        )}
      </Box>

      {/* User info */}
      {user && (
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              src={user.imageUrl}
              alt={user.fullName}
              sx={{ width: 40, height: 40 }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 'medium', 
                  color: 'text.primary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {user.fullName}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'text.secondary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {user.primaryEmailAddress?.emailAddress}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Navigation */}
      <Box sx={{ flex: 1, px: 2, py: 2 }}>
        <List sx={{ py: 0 }}>
          {navigation.map((item) => (
            <ListItem key={item.name} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={NavLink}
                to={item.href}
                onClick={() => isMobile && onClose()}
                sx={{
                  borderRadius: 1,
                  '&.active': {
                    bgcolor: 'primary.50',
                    color: 'primary.700',
                    borderRight: 2,
                    borderColor: 'primary.main',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                  },
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <item.icon size={20} />
                </ListItemIcon>
                <ListItemText 
                  primary={item.name}
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: 'medium'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Quick Actions */}
        <Box sx={{ pt: 3 }}>
          <Typography 
            variant="overline" 
            sx={{ 
              px: 1.5, 
              color: 'text.secondary',
              fontWeight: 'bold',
              letterSpacing: 1
            }}
          >
            Quick Actions
          </Typography>
          <List sx={{ py: 1 }}>
            {quickActions.map((item) => (
              <ListItem key={item.name} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  sx={{
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <item.icon size={20} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.name}
                    primaryTypographyProps={{
                      variant: 'body2',
                      fontWeight: 'medium'
                    }}
                  />
                  {item.count && (
                    <Chip
                      label={item.count}
                      size="small"
                      sx={{
                        bgcolor: 'grey.200',
                        color: 'text.primary',
                        height: 20,
                        fontSize: '0.75rem'
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Paper
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: 'white',
            p: 2,
            borderRadius: 2
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            Cooking Streak
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9, mt: 0.5, display: 'block' }}>
            🔥 5 days in a row! Keep it up!
          </Typography>
        </Paper>
      </Box>
    </Box>
  )

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={isOpen}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: 1,
          borderColor: 'divider'
        },
      }}
    >
      {drawerContent}
    </Drawer>
  )
}

export default Sidebar