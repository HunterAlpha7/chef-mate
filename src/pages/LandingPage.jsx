import { SignInButton, SignUpButton } from '@clerk/clerk-react'
import { ChefHat, MessageCircle, BookOpen, Target, TrendingUp, Users, Star, Utensils, Apple, Coffee, Carrot } from 'lucide-react'
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  useTheme,
  Paper,
  Rating
} from '@mui/material'

const LandingPage = () => {
  const theme = useTheme()
  
  const features = [
    {
      icon: MessageCircle,
      title: 'AI Chat Assistant',
      description: 'Get personalized recipe suggestions and cooking guidance from our intelligent AI assistant.'
    },
    {
      icon: BookOpen,
      title: 'Recipe Management',
      description: 'Browse thousands of recipes, save favorites, and discover new dishes based on your preferences.'
    },
    {
      icon: Target,
      title: 'Calorie Tracking',
      description: 'Track your daily nutrition intake and get personalized health recommendations.'
    },
    {
      icon: TrendingUp,
      title: 'Cooking Analytics',
      description: 'Monitor your cooking progress, streaks, and improve your culinary skills over time.'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Home Cook',
      content: 'ChefMate has transformed my cooking experience. The AI suggestions are spot-on!',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Food Enthusiast',
      content: 'Love the calorie tracking feature. It helps me maintain a healthy lifestyle.',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Busy Parent',
      content: 'Quick recipe suggestions based on what I have in my fridge are a lifesaver!',
      rating: 5
    }
  ]

  return (
    <Box sx={{ minHeight: '100vh', background: `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.secondary.light}20)` }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 1 }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ChefHat size={32} color={theme.palette.primary.main} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                ChefMate
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SignInButton mode="modal">
                <Button color="inherit" sx={{ color: 'text.primary', fontWeight: 'medium' }}>
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="contained" color="primary" sx={{ fontWeight: 'medium' }}>
                  Get Started
                </Button>
              </SignUpButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="xl" sx={{ py: 10, textAlign: 'center', position: 'relative' }}>
        <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 3, fontSize: { xs: '2.5rem', md: '4rem' } }}>
          Your Personal
          <Typography component="span" sx={{ color: 'primary.main', fontSize: 'inherit', fontWeight: 'inherit' }}>
            {' '}Cooking Companion
          </Typography>
        </Typography>
        {/* Floating food icons row */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 3 }}>
          <Box className="food-float">
            <Utensils size={28} color={theme.palette.primary.main} />
          </Box>
          <Box className="food-float delay-1">
            <Apple size={28} color={theme.palette.success.main} />
          </Box>
          <Box className="food-float delay-2">
            <Coffee size={28} color={theme.palette.brown?.main || '#8B4513'} />
          </Box>
          <Box className="food-float delay-3">
            <Carrot size={28} color={theme.palette.warning.main} />
          </Box>
          <Box className="food-float delay-4">
            <ChefHat size={28} color={theme.palette.secondary.main} />
          </Box>
        </Box>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4, maxWidth: '800px', mx: 'auto', lineHeight: 1.6 }}>
          Discover recipes, get AI-powered cooking assistance, track your nutrition, 
          and become a better cook with ChefMate - your all-in-one culinary platform.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
          <SignUpButton mode="modal">
            <Button 
              variant="contained" 
              size="large" 
              sx={{ px: 4, py: 2, fontSize: '1.1rem', fontWeight: 'semibold' }}
            >
              Start Cooking Today
            </Button>
          </SignUpButton>
          <Button 
            variant="outlined" 
            size="large" 
            sx={{ px: 4, py: 2, fontSize: '1.1rem', fontWeight: 'semibold' }}
          >
            Watch Demo
          </Button>
        </Box>
      </Container>

      {/* Features Section */}
      <Box sx={{ py: 10, bgcolor: 'white' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
              Everything You Need to Cook Better
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}>
              From recipe discovery to nutrition tracking, ChefMate provides all the tools 
              you need for your culinary journey.
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <Card 
                  sx={{ 
                    textAlign: 'center', 
                    p: 3, 
                    height: '100%',
                    bgcolor: 'grey.50',
                    '&:hover': {
                      bgcolor: 'grey.100',
                      transform: 'translateY(-4px)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  <CardContent>
                    <Box 
                      sx={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        width: 48, 
                        height: 48, 
                        bgcolor: 'primary.light', 
                        borderRadius: 2, 
                        mb: 2 
                      }}
                    >
                      <feature.icon size={24} color={theme.palette.primary.main} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'semibold', mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 10, bgcolor: 'primary.main', color: 'white' }}>
        <Container maxWidth="xl">
          <Grid container spacing={4} sx={{ textAlign: 'center' }}>
            <Grid item xs={12} md={4}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                10,000+
              </Typography>
              <Typography variant="h6" sx={{ color: 'primary.light' }}>
                Recipes Available
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                50,000+
              </Typography>
              <Typography variant="h6" sx={{ color: 'primary.light' }}>
                Happy Cooks
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                1M+
              </Typography>
              <Typography variant="h6" sx={{ color: 'primary.light' }}>
                Meals Prepared
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box sx={{ py: 10, bgcolor: 'white' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
              What Our Users Say
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ bgcolor: 'grey.50', p: 3, height: '100%' }}>
                  <CardContent>
                    <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                    <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2, color: 'text.secondary' }}>
                      "{testimonial.content}"
                    </Typography>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'semibold' }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{ 
          py: 10, 
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
            Ready to Transform Your Cooking?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: 'primary.light' }}>
            Join thousands of home cooks who are already using ChefMate to create amazing meals.
          </Typography>
          <SignUpButton mode="modal">
            <Button 
              variant="contained" 
              size="large" 
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main', 
                px: 4, 
                py: 2, 
                fontSize: '1.1rem', 
                fontWeight: 'semibold',
                '&:hover': {
                  bgcolor: 'grey.100'
                }
              }}
            >
              Get Started for Free
            </Button>
          </SignUpButton>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 6 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 2, md: 0 } }}>
              <ChefHat size={32} color={theme.palette.primary.light} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                ChefMate
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              © 2024 ChefMate. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default LandingPage