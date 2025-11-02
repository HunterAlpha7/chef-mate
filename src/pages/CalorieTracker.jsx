import { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { 
  Plus, 
  Target, 
  TrendingUp, 
  Calendar,
  Utensils,
  Coffee,
  Apple,
  Moon,
  Edit3,
  Trash2,
  Save,
  X
} from 'lucide-react'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Divider,
  useTheme,
  alpha
} from '@mui/material'

const CalorieTracker = () => {
  const { user } = useUser()
  const theme = useTheme()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [dailyGoal, setDailyGoal] = useState(2000)
  const [showAddFood, setShowAddFood] = useState(false)
  const [editingMeal, setEditingMeal] = useState(null)
  
  // Mock data for demonstration
  const [meals, setMeals] = useState({
    breakfast: [
      { id: 1, name: 'Oatmeal with berries', calories: 250, protein: 8, carbs: 45, fat: 4 },
      { id: 2, name: 'Greek yogurt', calories: 130, protein: 15, carbs: 9, fat: 0 }
    ],
    lunch: [
      { id: 3, name: 'Grilled chicken salad', calories: 350, protein: 35, carbs: 15, fat: 18 }
    ],
    dinner: [
      { id: 4, name: 'Salmon with quinoa', calories: 420, protein: 30, carbs: 35, fat: 20 }
    ],
    snacks: [
      { id: 5, name: 'Apple with almond butter', calories: 190, protein: 4, carbs: 25, fat: 8 }
    ]
  })

  const [newFood, setNewFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    mealType: 'breakfast'
  })

  const mealTypes = [
    { key: 'breakfast', label: 'Breakfast', icon: Coffee, color: 'bg-yellow-500' },
    { key: 'lunch', label: 'Lunch', icon: Utensils, color: 'bg-orange-500' },
    { key: 'dinner', label: 'Dinner', icon: Utensils, color: 'bg-red-500' },
    { key: 'snacks', label: 'Snacks', icon: Apple, color: 'bg-green-500' }
  ]

  // Calculate totals
  const calculateTotals = () => {
    let totalCalories = 0
    let totalProtein = 0
    let totalCarbs = 0
    let totalFat = 0

    Object.values(meals).flat().forEach(food => {
      totalCalories += food.calories
      totalProtein += food.protein
      totalCarbs += food.carbs
      totalFat += food.fat
    })

    return { totalCalories, totalProtein, totalCarbs, totalFat }
  }

  const totals = calculateTotals()
  const progressPercentage = Math.min((totals.totalCalories / dailyGoal) * 100, 100)
  const remainingCalories = dailyGoal - totals.totalCalories

  const handleAddFood = () => {
    if (!newFood.name || !newFood.calories) return

    const food = {
      id: Date.now(),
      name: newFood.name,
      calories: parseInt(newFood.calories),
      protein: parseInt(newFood.protein) || 0,
      carbs: parseInt(newFood.carbs) || 0,
      fat: parseInt(newFood.fat) || 0
    }

    setMeals(prev => ({
      ...prev,
      [newFood.mealType]: [...prev[newFood.mealType], food]
    }))

    setNewFood({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      mealType: 'breakfast'
    })
    setShowAddFood(false)
  }

  const handleDeleteFood = (mealType, foodId) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: prev[mealType].filter(food => food.id !== foodId)
    }))
  }

  const handleEditFood = (mealType, food) => {
    setEditingMeal({ mealType, food: { ...food } })
  }

  const handleSaveEdit = () => {
    if (!editingMeal) return

    setMeals(prev => ({
      ...prev,
      [editingMeal.mealType]: prev[editingMeal.mealType].map(food =>
        food.id === editingMeal.food.id ? editingMeal.food : food
      )
    }))
    setEditingMeal(null)
  }

  const handleCancelEdit = () => {
    setEditingMeal(null)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
          Calorie Tracker
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Track your daily nutrition and reach your goals
        </Typography>
      </Box>

      {/* Date and Goal */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Calendar size={20} style={{ marginRight: theme.spacing(1), color: theme.palette.primary.main }} />
                <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                  Date
                </Typography>
              </Box>
              <TextField
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                fullWidth
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Target size={20} style={{ marginRight: theme.spacing(1), color: theme.palette.primary.main }} />
                <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                  Daily Goal
                </Typography>
              </Box>
              <TextField
                type="number"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(parseInt(e.target.value) || 0)}
                fullWidth
                size="small"
                InputProps={{
                  endAdornment: <Typography variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>calories</Typography>
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Daily Progress */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
              Daily Progress
            </Typography>
            <Button
              variant="contained"
              startIcon={<Plus size={16} />}
              onClick={() => setShowAddFood(true)}
              sx={{ ml: 'auto' }}
            >
              Add Food
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                  {totals.totalCalories}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  of {dailyGoal} calories
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progressPercentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      backgroundColor: progressPercentage >= 100 ? theme.palette.error.main : theme.palette.primary.main
                    }
                  }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                  {remainingCalories > 0 
                    ? `${remainingCalories} calories remaining`
                    : `${Math.abs(remainingCalories)} calories over goal`
                  }
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                  {totals.totalProtein}g
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Protein
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                  {totals.totalCarbs}g
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Carbs
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                  {totals.totalFat}g
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Fat
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Meals */}
      <Grid container spacing={3}>
        {mealTypes.map((mealType) => {
          const Icon = mealType.icon
          const mealCalories = meals[mealType.key].reduce((sum, food) => sum + food.calories, 0)

          return (
            <Grid item xs={12} md={6} key={mealType.key}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Icon size={20} style={{ marginRight: theme.spacing(1), color: theme.palette.primary.main }} />
                      <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                        {mealType.label}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {mealCalories} calories
                    </Typography>
                    <IconButton
                      onClick={() => {
                        setNewFood(prev => ({ ...prev, mealType: mealType.key }))
                        setShowAddFood(true)
                      }}
                      size="small"
                      sx={{ color: 'text.secondary', ml: 'auto' }}
                    >
                      <Plus size={16} />
                    </IconButton>
                  </Box>
                  
                  {meals[mealType.key].length === 0 ? (
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 4, 
                      color: 'text.secondary',
                      backgroundColor: alpha(theme.palette.grey[500], 0.05),
                      borderRadius: 1,
                      border: `1px dashed ${alpha(theme.palette.grey[500], 0.3)}`
                    }}>
                      <Typography variant="body2">
                        No foods added yet
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {meals[mealType.key].map((food) => (
                        <Box key={food.id}>
                          {editingMeal && editingMeal.food.id === food.id ? (
                            <Paper sx={{ p: 2, border: `1px solid ${theme.palette.primary.main}` }}>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                                <TextField
                                  value={editingMeal.food.name}
                                  onChange={(e) => setEditingMeal(prev => ({
                                    ...prev,
                                    food: { ...prev.food, name: e.target.value }
                                  }))}
                                  size="small"
                                  placeholder="Food name"
                                  fullWidth
                                />
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <TextField
                                    type="number"
                                    value={editingMeal.food.calories}
                                    onChange={(e) => setEditingMeal(prev => ({
                                      ...prev,
                                      food: { ...prev.food, calories: parseInt(e.target.value) || 0 }
                                    }))}
                                    size="small"
                                    placeholder="Calories"
                                    sx={{ flex: 1 }}
                                  />
                                  <TextField
                                    type="number"
                                    value={editingMeal.food.protein}
                                    onChange={(e) => setEditingMeal(prev => ({
                                      ...prev,
                                      food: { ...prev.food, protein: parseInt(e.target.value) || 0 }
                                    }))}
                                    size="small"
                                    placeholder="Protein (g)"
                                    sx={{ flex: 1 }}
                                  />
                                </Box>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <IconButton
                                  onClick={handleCancelEdit}
                                  size="small"
                                  sx={{ color: 'text.secondary' }}
                                >
                                  <X size={16} />
                                </IconButton>
                                <IconButton
                                  onClick={handleSaveEdit}
                                  size="small"
                                  sx={{ color: 'success.main' }}
                                >
                                  <Save size={16} />
                                </IconButton>
                              </Box>
                            </Paper>
                          ) : (
                            <Paper sx={{ 
                              p: 2, 
                              border: `1px solid ${alpha(theme.palette.grey[500], 0.2)}`,
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.grey[500], 0.05)
                              }
                            }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'text.primary', mb: 0.5 }}>
                                    {food.name}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                      {food.calories} cal
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                      {food.protein}g protein
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                      {food.carbs}g carbs
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                      {food.fat}g fat
                                    </Typography>
                                  </Box>
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <IconButton
                                    onClick={() => handleEditFood(mealType.key, food)}
                                    size="small"
                                    sx={{ color: 'text.secondary' }}
                                  >
                                    <Edit3 size={16} />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => handleDeleteFood(mealType.key, food.id)}
                                    size="small"
                                    sx={{ 
                                      color: 'text.secondary',
                                      '&:hover': {
                                        color: 'error.main'
                                      }
                                    }}
                                  >
                                    <Trash2 size={16} />
                                  </IconButton>
                                </Box>
                              </Box>
                            </Paper>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Add Food Modal */}
      <Dialog 
        open={showAddFood} 
        onClose={() => setShowAddFood(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'semibold' }}>
            Add Food
          </Typography>
          <IconButton
            onClick={() => setShowAddFood(false)}
            sx={{ color: 'text.secondary' }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Meal Type</InputLabel>
              <Select
                value={newFood.mealType}
                onChange={(e) => setNewFood(prev => ({ ...prev, mealType: e.target.value }))}
                label="Meal Type"
              >
                {mealTypes.map((type) => (
                  <MenuItem key={type.key} value={type.key}>{type.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              label="Food Name *"
              value={newFood.name}
              onChange={(e) => setNewFood(prev => ({ ...prev, name: e.target.value }))}
              fullWidth
              placeholder="e.g., Grilled chicken breast"
            />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Calories *"
                  type="number"
                  value={newFood.calories}
                  onChange={(e) => setNewFood(prev => ({ ...prev, calories: e.target.value }))}
                  fullWidth
                  placeholder="250"
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  label="Protein (g)"
                  type="number"
                  value={newFood.protein}
                  onChange={(e) => setNewFood(prev => ({ ...prev, protein: e.target.value }))}
                  fullWidth
                  placeholder="25"
                />
              </Grid>
            </Grid>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Carbs (g)"
                  type="number"
                  value={newFood.carbs}
                  onChange={(e) => setNewFood(prev => ({ ...prev, carbs: e.target.value }))}
                  fullWidth
                  placeholder="30"
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  label="Fat (g)"
                  type="number"
                  value={newFood.fat}
                  onChange={(e) => setNewFood(prev => ({ ...prev, fat: e.target.value }))}
                  fullWidth
                  placeholder="10"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setShowAddFood(false)}
            variant="outlined"
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddFood}
            variant="contained"
          >
            Add Food
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default CalorieTracker