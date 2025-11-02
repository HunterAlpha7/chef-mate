import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { 
  User, 
  Settings, 
  Heart, 
  Target, 
  Bell, 
  Shield, 
  HelpCircle,
  ChefHat,
  TrendingUp,
  Calendar,
  Award,
  Save
} from 'lucide-react'
import {
  Container,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Switch,
  Divider,
  useTheme,
  alpha
} from '@mui/material'

const Profile = () => {
  const { user } = useUser()
  const theme = useTheme()
  const [activeTab, setActiveTab] = useState(0)

  // Mock data for tabs
  const tabs = [
    { id: 0, name: 'Profile', icon: User },
    { id: 1, name: 'Preferences', icon: Settings },
    { id: 2, name: 'Statistics', icon: TrendingUp },
    { id: 3, name: 'Notifications', icon: Bell }
  ]

  // Mock data for dietary options
  const dietaryOptions = [
    'None',
    'Vegetarian',
    'Vegan',
    'Pescatarian',
    'Keto',
    'Paleo',
    'Mediterranean',
    'Low Carb',
    'Gluten Free'
  ]

  // Mock data for cuisine preferences
  const cuisineOptions = [
    'Italian',
    'Mexican',
    'Asian',
    'Indian',
    'Mediterranean',
    'American',
    'French',
    'Thai',
    'Japanese',
    'Chinese'
  ]

  // Mock data for spice levels
  const spiceLevels = [
    { value: 'mild', label: 'Mild' },
    { value: 'medium', label: 'Medium' },
    { value: 'hot', label: 'Hot' },
    { value: 'extra-hot', label: 'Extra Hot' }
  ]

  // Mock data for skill levels
  const skillLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ]

  // Mock data for common allergies
  const commonAllergies = [
    'Nuts',
    'Dairy',
    'Eggs',
    'Soy',
    'Gluten',
    'Shellfish',
    'Fish',
    'Sesame'
  ]

  // Mock user preferences state
  const [preferences, setPreferences] = useState({
    dietary: 'None',
    cuisines: ['Italian', 'Mexican'],
    spiceLevel: 'medium',
    skillLevel: 'intermediate',
    allergies: ['Nuts'],
    calorieGoal: 2000
  })

  // Mock notifications state
  const [notifications, setNotifications] = useState({
    mealReminders: true,
    recipeRecommendations: true,
    weeklyReports: false
  })

  // Mock user stats
  const stats = {
    totalRecipes: 127,
    totalCookingTime: 2340,
    caloriesTracked: 45600,
    mealsLogged: 89,
    achievements: [
      {
        name: 'First Recipe',
        description: 'Cooked your first recipe',
        earned: true
      },
      {
        name: 'Week Streak',
        description: 'Cooked for 7 days straight',
        earned: true
      },
      {
        name: 'Calorie Counter',
        description: 'Tracked 1000 calories',
        earned: true
      },
      {
        name: 'Master Chef',
        description: 'Cooked 100 recipes',
        earned: false
      }
    ]
  }

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleNotificationChange = (key, value) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const toggleAllergy = (allergy) => {
    setPreferences(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
    }))
  }

  const handleSavePreferences = () => {
    // Save preferences logic here
    console.log('Saving preferences:', preferences)
  }

  const renderProfileTab = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Avatar
          src={user?.imageUrl}
          sx={{ width: 80, height: 80 }}
        />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            {user?.fullName || 'John Doe'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {user?.primaryEmailAddress?.emailAddress || 'john.doe@example.com'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Member since March 2024
          </Typography>
        </Box>
      </Box>

      <Divider />

      <Box>
        <Typography variant="h5" sx={{ fontWeight: 'semibold', color: 'text.primary', mb: 2 }}>
          Quick Stats
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {stats.totalRecipes}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recipes Tried
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                {Math.floor(stats.totalCookingTime / 60)}h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cooking Time
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {stats.mealsLogged}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Meals Logged
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                {stats.achievements.filter(a => a.earned).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Achievements
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )

  const renderPreferencesTab = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 'semibold', color: 'text.primary' }}>
        Cooking Preferences
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Dietary Preference</InputLabel>
            <Select
              value={preferences.dietary}
              label="Dietary Preference"
              onChange={(e) => handlePreferenceChange('dietary', e.target.value)}
            >
              {dietaryOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Skill Level</InputLabel>
            <Select
              value={preferences.skillLevel}
              label="Skill Level"
              onChange={(e) => handlePreferenceChange('skillLevel', e.target.value)}
            >
              {skillLevels.map((level) => (
                <MenuItem key={level.value} value={level.value}>
                  {level.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Spice Level</InputLabel>
            <Select
              value={preferences.spiceLevel}
              label="Spice Level"
              onChange={(e) => handlePreferenceChange('spiceLevel', e.target.value)}
            >
              {spiceLevels.map((level) => (
                <MenuItem key={level.value} value={level.value}>
                  {level.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 2 }}>
          Allergies & Intolerances
        </Typography>
        <Grid container spacing={1}>
          {commonAllergies.map((allergy) => (
            <Grid item key={allergy}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.allergies.includes(allergy)}
                    onChange={() => toggleAllergy(allergy)}
                    color="primary"
                  />
                }
                label={allergy}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 2 }}>
          Health Goals
        </Typography>
        <TextField
          label="Daily Calorie Goal"
          type="number"
          value={preferences.calorieGoal}
          onChange={(e) => handlePreferenceChange('calorieGoal', parseInt(e.target.value))}
          sx={{ maxWidth: 200 }}
        />
      </Box>

      <Box>
        <Button
          variant="contained"
          onClick={handleSavePreferences}
          startIcon={<Save size={16} />}
          sx={{ px: 3, py: 1 }}
        >
          Save Preferences
        </Button>
      </Box>
    </Box>
  )

  const renderStatsTab = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ bgcolor: alpha(theme.palette.info.light, 0.1) }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.dark' }}>
                    {stats.totalRecipes}
                  </Typography>
                  <Typography variant="body2" color="info.main">
                    Total Recipes
                  </Typography>
                </Box>
                <ChefHat size={32} color={theme.palette.info.main} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ bgcolor: alpha(theme.palette.success.light, 0.1) }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.dark' }}>
                    {stats.totalCookingTime}m
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    Cooking Time
                  </Typography>
                </Box>
                <Target size={32} color={theme.palette.success.main} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ bgcolor: alpha(theme.palette.secondary.light, 0.1) }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.dark' }}>
                    {stats.caloriesTracked}
                  </Typography>
                  <Typography variant="body2" color="secondary.main">
                    Calories Tracked
                  </Typography>
                </Box>
                <TrendingUp size={32} color={theme.palette.secondary.main} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ bgcolor: alpha(theme.palette.warning.light, 0.1) }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.dark' }}>
                    {stats.mealsLogged}
                  </Typography>
                  <Typography variant="body2" color="warning.main">
                    Meals Logged
                  </Typography>
                </Box>
                <Calendar size={32} color={theme.palette.warning.main} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box>
        <Typography variant="h5" sx={{ fontWeight: 'semibold', color: 'text.primary', mb: 2 }}>
          Achievements
        </Typography>
        <Grid container spacing={2}>
          {stats.achievements.map((achievement, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card 
                sx={{ 
                  border: 2, 
                  borderColor: achievement.earned ? 'warning.light' : 'grey.300',
                  bgcolor: achievement.earned ? alpha(theme.palette.warning.light, 0.1) : alpha(theme.palette.grey[100], 0.5)
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Award
                      size={32}
                      color={achievement.earned ? theme.palette.warning.main : theme.palette.grey[400]}
                    />
                    <Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 'semibold',
                          color: achievement.earned ? 'warning.dark' : 'text.secondary'
                        }}
                      >
                        {achievement.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: achievement.earned ? 'warning.main' : 'text.secondary'
                        }}
                      >
                        {achievement.description}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )

  const renderNotificationsTab = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 'semibold', color: 'text.primary' }}>
        Notification Settings
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Bell size={24} color={theme.palette.primary.main} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                    Meal Reminders
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get notified when it's time for your meals
                  </Typography>
                </Box>
              </Box>
              <Switch
                checked={notifications.mealReminders}
                onChange={(e) => handleNotificationChange('mealReminders', e.target.checked)}
                color="primary"
              />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ChefHat size={24} color={theme.palette.primary.main} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                    Recipe Recommendations
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Receive personalized recipe suggestions
                  </Typography>
                </Box>
              </Box>
              <Switch
                checked={notifications.recipeRecommendations}
                onChange={(e) => handleNotificationChange('recipeRecommendations', e.target.checked)}
                color="primary"
              />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Calendar size={24} color={theme.palette.primary.main} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                    Weekly Reports
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get weekly summaries of your cooking activity
                  </Typography>
                </Box>
              </Box>
              <Switch
                checked={notifications.weeklyReports}
                onChange={(e) => handleNotificationChange('weeklyReports', e.target.checked)}
                color="primary"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={(event, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 'medium',
                fontSize: '1rem',
                py: 2
              }
            }}
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <tab.icon size={20} />
                    {tab.name}
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && renderProfileTab()}
          {activeTab === 1 && renderPreferencesTab()}
          {activeTab === 2 && renderStatsTab()}
          {activeTab === 3 && renderNotificationsTab()}
        </Box>
      </Paper>
    </Container>
  )
}

export default Profile