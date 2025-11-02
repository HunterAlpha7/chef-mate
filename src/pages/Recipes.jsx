import { useState, useEffect } from 'react'
import { Search, Filter, Clock, Users, ChefHat, Heart, ExternalLink, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import MealDBAPI from '../lib/mealdb'
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Collapse,
  CircularProgress,
  IconButton,
  InputAdornment,
  Chip,
  useTheme
} from '@mui/material'

const Recipes = () => {
  const theme = useTheme()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedArea, setSelectedArea] = useState('')
  const [categories, setCategories] = useState([])
  const [areas, setAreas] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true)
        
        // Fetch categories and areas for filters
        const [categoriesData, areasData] = await Promise.all([
          MealDBAPI.getCategories(),
          MealDBAPI.getAreas()
        ])
        
        setCategories(categoriesData || [])
        setAreas(areasData || [])
        
        // Fetch some random recipes initially
        const randomRecipes = []
        for (let i = 0; i < 12; i++) {
          const recipe = await MealDBAPI.getRandomMeal()
          if (recipe) {
            randomRecipes.push(MealDBAPI.formatMeal(recipe))
          }
        }
        setRecipes(randomRecipes)
      } catch (error) {
        console.error('Error fetching initial data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  const handleSearch = async () => {
    if (!searchTerm.trim() && !selectedCategory && !selectedArea) return

    try {
      setLoading(true)
      let results = []

      if (searchTerm.trim()) {
        // Search by name
        const searchResults = await MealDBAPI.searchByName(searchTerm)
        results = searchResults ? searchResults.map(MealDBAPI.formatMeal) : []
      } else if (selectedCategory && selectedArea) {
        // Combine filters: fetch by category then filter by area
        const categoryResults = await MealDBAPI.filterByCategory(selectedCategory)
        const formatted = categoryResults ? categoryResults.map(MealDBAPI.formatMeal) : []
        results = formatted.filter(r => r.area === selectedArea)
      } else if (selectedCategory) {
        const categoryResults = await MealDBAPI.filterByCategory(selectedCategory)
        results = categoryResults ? categoryResults.map(MealDBAPI.formatMeal) : []
      } else if (selectedArea) {
        const areaResults = await MealDBAPI.filterByArea(selectedArea)
        results = areaResults ? areaResults.map(MealDBAPI.formatMeal) : []
      }

      // Post-filter when searching by name and filters are set
      if (searchTerm.trim()) {
        if (selectedCategory) {
          results = results.filter(r => r.category === selectedCategory)
        }
        if (selectedArea) {
          results = results.filter(r => r.area === selectedArea)
        }
      }

      setRecipes(results)
    } catch (error) {
      console.error('Error searching recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = async () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedArea('')
    
    // Fetch random recipes again
    try {
      setLoading(true)
      const randomRecipes = []
      for (let i = 0; i < 12; i++) {
        const recipe = await MealDBAPI.getRandomMeal()
        if (recipe) {
          randomRecipes.push(MealDBAPI.formatMeal(recipe))
        }
      }
      setRecipes(randomRecipes)
    } catch (error) {
      console.error('Error fetching random recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
            Discover Recipes
          </Typography>
          
          {/* Search Bar */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Search recipes by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 1 }}
            />
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => setShowFilters(!showFilters)}
                startIcon={<Filter size={16} />}
              >
                Filters
              </Button>
              
              <Button
                variant="contained"
                onClick={handleSearch}
                startIcon={<Search size={16} />}
              >
                Search
              </Button>
            </Box>
          </Box>

          {/* Filters */}
          <Collapse in={showFilters}>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={selectedCategory}
                      label="Category"
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.strCategory} value={category.strCategory}>
                          {category.strCategory}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Cuisine</InputLabel>
                    <Select
                      value={selectedArea}
                      label="Cuisine"
                      onChange={(e) => setSelectedArea(e.target.value)}
                    >
                      <MenuItem value="">All Cuisines</MenuItem>
                      {areas.map((area) => (
                        <MenuItem key={area.strArea} value={area.strArea}>
                          {area.strArea}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  onClick={clearFilters}
                  color="inherit"
                >
                  Clear Filters
                </Button>
              </Box>
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      {/* Results */}
      <Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={40} />
          </Box>
        ) : recipes.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <ChefHat size={48} color={theme.palette.grey[400]} style={{ marginBottom: 16 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No recipes found
            </Typography>
            <Typography color="text.secondary">
              Try adjusting your search terms or filters
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                {searchTerm || selectedCategory || selectedArea ? 'Search Results' : 'Featured Recipes'}
                <Typography component="span" color="text.secondary" sx={{ ml: 1 }}>
                  ({recipes.length} recipes)
                </Typography>
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              {recipes.map((recipe) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.id}>
                  <RecipeCard recipe={recipe} />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
    </Box>
  )
}

const RecipeCard = ({ recipe }) => {
  const theme = useTheme()
  const [isFavorited, setIsFavorited] = useState(false)

  const toggleFavorite = (e) => {
    e.preventDefault()
    setIsFavorited(!isFavorited)
    // TODO: Implement favorite functionality with backend
  }

  return (
    <Card
      component={Link}
      to={`/recipe/${recipe.id}`}
      sx={{
        textDecoration: 'none',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={recipe.image}
          alt={recipe.name}
          sx={{
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        />
        <IconButton
          onClick={toggleFavorite}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'white',
            '&:hover': {
              bgcolor: 'grey.100'
            }
          }}
        >
          <Heart 
            size={16}
            color={isFavorited ? theme.palette.error.main : theme.palette.grey[400]}
            fill={isFavorited ? theme.palette.error.main : 'none'}
          />
        </IconButton>
      </Box>
      
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold', 
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            color: 'text.primary'
          }}
        >
          {recipe.name}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Chip
            icon={<ChefHat size={14} />}
            label={recipe.category}
            size="small"
            variant="outlined"
          />
          <Typography variant="body2" color="text.secondary">
            {recipe.area}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Clock size={14} color={theme.palette.text.secondary} />
              <Typography variant="caption" color="text.secondary">
                30 min
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Users size={14} color={theme.palette.text.secondary} />
              <Typography variant="caption" color="text.secondary">
                4 servings
              </Typography>
            </Box>
          </Box>
          
          <ExternalLink size={16} color={theme.palette.grey[400]} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default Recipes