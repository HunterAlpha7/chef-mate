import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  ChefHat, 
  Heart, 
  Share2, 
  Printer,
  CheckCircle,
  Circle,
  ExternalLink,
  Loader2
} from 'lucide-react'
import MealDBAPI from '../lib/mealdb'
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Grid,
  Chip,
  CircularProgress,
  Container,
  useTheme,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper
} from '@mui/material'

const RecipeDetail = () => {
  const theme = useTheme()
  const { id } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorited, setIsFavorited] = useState(false)
  const [checkedIngredients, setCheckedIngredients] = useState({})
  const [checkedInstructions, setCheckedInstructions] = useState({})

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true)
        const recipeData = await MealDBAPI.getMealById(id)
        if (recipeData) {
          const formattedRecipe = MealDBAPI.formatMeal(recipeData)
          const ingredients = MealDBAPI.parseMealIngredients(recipeData)
          setRecipe({
            ...formattedRecipe,
            ingredients,
            instructions: recipeData.strInstructions?.split('\n').filter(step => step.trim()) || [],
            youtubeUrl: recipeData.strYoutube,
            sourceUrl: recipeData.strSource,
            tags: recipeData.strTags?.split(',').map(tag => tag.trim()) || []
          })
        }
      } catch (error) {
        console.error('Error fetching recipe:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchRecipe()
    }
  }, [id])

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited)
    // TODO: Implement favorite functionality with backend
  }

  const toggleIngredient = (index) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const toggleInstruction = (index) => {
    setCheckedInstructions(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.name,
          text: `Check out this recipe: ${recipe.name}`,
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Recipe link copied to clipboard!')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={40} />
      </Box>
    )
  }

  if (!recipe) {
    return (
      <Box sx={{ textAlign: 'center', py: 12 }}>
        <ChefHat size={48} color={theme.palette.grey[400]} style={{ marginBottom: 16 }} />
        <Typography variant="h6" sx={{ mb: 1 }}>
          Recipe not found
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          The recipe you're looking for doesn't exist.
        </Typography>
        <Button
          component={Link}
          to="/recipes"
          startIcon={<ArrowLeft size={16} />}
          color="primary"
        >
          Back to Recipes
        </Button>
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Back Button */}
      <Button
        component={Link}
        to="/recipes"
        startIcon={<ArrowLeft size={16} />}
        sx={{ mb: 3, color: 'text.secondary' }}
      >
        Back to Recipes
      </Button>

      {/* Recipe Header */}
      <Card sx={{ mb: 3, overflow: 'hidden' }}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              image={recipe.image}
              alt={recipe.name}
              sx={{ height: { xs: 300, md: '100%' }, objectFit: 'cover' }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {recipe.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ChefHat size={16} />
                      <Typography variant="body2">{recipe.category}</Typography>
                    </Box>
                    <Typography variant="body2">{recipe.area}</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton onClick={toggleFavorite}>
                    <Heart 
                      size={20}
                      color={isFavorited ? theme.palette.error.main : theme.palette.grey[400]}
                      fill={isFavorited ? theme.palette.error.main : 'none'}
                    />
                  </IconButton>
                  <IconButton onClick={handleShare}>
                    <Share2 size={20} color={theme.palette.grey[400]} />
                  </IconButton>
                  <IconButton onClick={handlePrint}>
                    <Printer size={20} color={theme.palette.grey[400]} />
                  </IconButton>
                </Box>
              </Box>

              {/* Recipe Stats */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={4}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                    <Clock size={20} color={theme.palette.text.secondary} style={{ marginBottom: 4 }} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>30 min</Typography>
                    <Typography variant="caption" color="text.secondary">Prep Time</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                    <Users size={20} color={theme.palette.text.secondary} style={{ marginBottom: 4 }} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>4</Typography>
                    <Typography variant="caption" color="text.secondary">Servings</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                    <ChefHat size={20} color={theme.palette.text.secondary} style={{ marginBottom: 4 }} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Easy</Typography>
                    <Typography variant="caption" color="text.secondary">Difficulty</Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Tags */}
              {recipe.tags.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                    Tags
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {recipe.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* External Links */}
              <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
                {recipe.youtubeUrl && (
                  <Button
                    href={recipe.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    color="error"
                    startIcon={<ExternalLink size={16} />}
                  >
                    Watch Video
                  </Button>
                )}
                {recipe.sourceUrl && (
                  <Button
                    href={recipe.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    startIcon={<ExternalLink size={16} />}
                  >
                    Original Recipe
                  </Button>
                )}
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>

      <Grid container spacing={3}>
        {/* Ingredients */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Ingredients
              </Typography>
              <List dense>
                {recipe.ingredients.map((ingredient, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => toggleIngredient(index)}
                    sx={{
                      px: 0,
                      '&:hover': {
                        bgcolor: 'grey.50'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {checkedIngredients[index] ? (
                        <CheckCircle size={20} color={theme.palette.success.main} />
                      ) : (
                        <Circle size={20} color={theme.palette.grey[400]} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: checkedIngredients[index] ? 'line-through' : 'none',
                            color: checkedIngredients[index] ? 'text.secondary' : 'text.primary'
                          }}
                        >
                          <Typography component="span" sx={{ fontWeight: 'bold' }}>
                            {ingredient.measure}
                          </Typography>{' '}
                          {ingredient.ingredient}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Instructions */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Instructions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recipe.instructions.map((instruction, index) => (
                  <Box
                    key={index}
                    onClick={() => toggleInstruction(index)}
                    sx={{
                      display: 'flex',
                      gap: 2,
                      cursor: 'pointer',
                      p: 1,
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: 'grey.50'
                      }
                    }}
                  >
                    <Box sx={{ flexShrink: 0, mt: 0.5 }}>
                      {checkedInstructions[index] ? (
                        <CheckCircle size={20} color={theme.palette.success.main} />
                      ) : (
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            border: 2,
                            borderColor: 'grey.300',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '&:hover': {
                              borderColor: 'grey.400'
                            }
                          }}
                        >
                          <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: 'bold' }}>
                            {index + 1}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        lineHeight: 1.6,
                        textDecoration: checkedInstructions[index] ? 'line-through' : 'none',
                        color: checkedInstructions[index] ? 'text.secondary' : 'text.primary'
                      }}
                    >
                      {instruction}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Nutrition Info Placeholder */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Nutrition Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>~350</Typography>
                <Typography variant="body2" color="text.secondary">Calories</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>25g</Typography>
                <Typography variant="body2" color="text.secondary">Protein</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>45g</Typography>
                <Typography variant="body2" color="text.secondary">Carbs</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>12g</Typography>
                <Typography variant="body2" color="text.secondary">Fat</Typography>
              </Paper>
            </Grid>
          </Grid>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            * Nutrition values are estimated and may vary based on ingredients and preparation methods.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  )
}

export default RecipeDetail