import { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { 
  ChefHat, 
  Clock, 
  TrendingUp, 
  Heart, 
  Calendar,
  Target,
  Award,
  BookOpen,
  MessageCircle,
  Plus
} from 'lucide-react'
import { Link } from 'react-router-dom'
import MealDBAPI from '../lib/mealdb'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Avatar,
  LinearProgress,
  Skeleton,
  Paper,
  IconButton,
  useTheme
} from '@mui/material'

const Dashboard = () => {
  const { user } = useUser()
  const theme = useTheme()
  const [randomRecipes, setRandomRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration
  const cookingStats = {
    totalRecipes: 24,
    cookingStreak: 5,
    totalCookingTime: 180, // minutes
    favoriteCategory: 'Italian',
    weeklyGoal: 7,
    completedThisWeek: 4
  }

  const recentActivity = [
    {
      id: 1,
      type: 'recipe_cooked',
      title: 'Cooked Spaghetti Carbonara',
      time: '2 hours ago',
      icon: ChefHat
    },
    {
      id: 2,
      type: 'chat_session',
      title: 'Asked AI about pasta alternatives',
      time: '4 hours ago',
      icon: MessageCircle
    },
    {
      id: 3,
      type: 'recipe_saved',
      title: 'Saved Chicken Tikka Masala',
      time: '1 day ago',
      icon: Heart
    },
    {
      id: 4,
      type: 'calorie_logged',
      title: 'Logged breakfast calories',
      time: '2 days ago',
      icon: Target
    }
  ]

  const quickActions = [
    {
      title: 'Find Recipe',
      description: 'Search by ingredients or name',
      icon: BookOpen,
      link: '/recipes',
      color: theme.palette.info.main
    },
    {
      title: 'Ask AI Chef',
      description: 'Get cooking advice',
      icon: MessageCircle,
      link: '/chat',
      color: theme.palette.success.main
    },
    {
      title: 'Track Calories',
      description: 'Log your meals',
      icon: Target,
      link: '/calories',
      color: theme.palette.secondary.main
    },
    {
      title: 'Random Recipe',
      description: 'Discover something new',
      icon: Plus,
      action: 'random',
      color: theme.palette.warning.main
    }
  ]

  useEffect(() => {
    const fetchRandomRecipes = async () => {
      try {
        const recipes = []
        // Fetch 3 random recipes
        for (let i = 0; i < 3; i++) {
          const recipe = await MealDBAPI.getRandomMeal()
          if (recipe) {
            recipes.push(MealDBAPI.formatMeal(recipe))
          }
        }
        setRandomRecipes(recipes)
      } catch (error) {
        console.error('Error fetching random recipes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRandomRecipes()
  }, [])

  const handleRandomRecipe = async () => {
    try {
      const recipe = await MealDBAPI.getRandomMeal()
      if (recipe) {
        window.open(`/recipe/${recipe.idMeal}`, '_blank')
      }
    } catch (error) {
      console.error('Error getting random recipe:', error)
    }
  }

  const handleQuickAction = (action) => {
    if (action.action === 'random') {
      handleRandomRecipe()
    }
  }

  return (
    <Box sx={{ p: 3, maxWidth: '100%' }}>
      {/* Welcome Header */}
      <Paper
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          p: 3,
          borderRadius: 3,
          mb: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Welcome back, {user?.firstName || 'Chef'}! 👋
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Ready to cook something delicious today?
            </Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {cookingStats.cookingStreak}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Day Streak
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {cookingStats.completedThisWeek}/{cookingStats.weeklyGoal}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Weekly Goal
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Quick Actions */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={6} md={3} key={index}>
            {action.link ? (
              <Card
                component={Link}
                to={action.link}
                sx={{
                  textDecoration: 'none',
                  height: '100%',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4]
                  }
                }}
              >
                <CardContent>
                  <Avatar
                    sx={{
                      bgcolor: action.color,
                      mb: 2,
                      width: 40,
                      height: 40
                    }}
                  >
                    <action.icon size={20} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5, color: 'text.primary' }}>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {action.description}
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4]
                  }
                }}
                onClick={() => handleQuickAction(action)}
              >
                <CardContent>
                  <Avatar
                    sx={{
                      bgcolor: action.color,
                      mb: 2,
                      width: 40,
                      height: 40
                    }}
                  >
                    <action.icon size={20} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {action.description}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Cooking Stats */}
        <Grid item xs={12} lg={8}>
          {/* Stats Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'info.light', mr: 2 }}>
                      <BookOpen size={24} />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Total Recipes
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {cookingStats.totalRecipes}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'success.light', mr: 2 }}>
                      <Clock size={24} />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Cooking Time
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {cookingStats.totalCookingTime}m
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'secondary.light', mr: 2 }}>
                      <Award size={24} />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Favorite
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {cookingStats.favoriteCategory}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Recent Activity */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Recent Activity
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentActivity.map((activity) => (
                  <Box key={activity.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'grey.100' }}>
                      <activity.icon size={20} color={theme.palette.text.secondary} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {activity.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recommended Recipes */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Recommended for You
                </Typography>
                {loading ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[1, 2, 3].map((i) => (
                      <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                        <Skeleton variant="rectangular" width={64} height={64} sx={{ borderRadius: 1 }} />
                        <Box sx={{ flex: 1 }}>
                          <Skeleton variant="text" width="75%" />
                          <Skeleton variant="text" width="50%" />
                          <Skeleton variant="text" width="40%" />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {randomRecipes.map((recipe) => (
                      <CardActionArea
                        key={recipe.id}
                        component={Link}
                        to={`/recipe/${recipe.id}`}
                        sx={{ borderRadius: 1, p: 1 }}
                      >
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Box
                            component="img"
                            src={recipe.image}
                            alt={recipe.name}
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: 1,
                              objectFit: 'cover'
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                              {recipe.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              {recipe.category}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {recipe.area}
                            </Typography>
                          </Box>
                        </Box>
                      </CardActionArea>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Weekly Progress */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Weekly Progress
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    Cooking Goal
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {cookingStats.completedThisWeek}/{cookingStats.weeklyGoal}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(cookingStats.completedThisWeek / cookingStats.weeklyGoal) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    mb: 1,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {cookingStats.weeklyGoal - cookingStats.completedThisWeek} more recipes to reach your goal!
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard