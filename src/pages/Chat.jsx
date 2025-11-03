import { useState, useRef, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Send, Bot, User, Loader2, ChefHat, Lightbulb, Clock, Utensils } from 'lucide-react'
import { getChatCompletion } from '../lib/openai'
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
  Divider,
  IconButton
} from '@mui/material'

const Chat = () => {
  const { user } = useUser()
  const theme = useTheme()
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: `Hello ${user?.firstName || 'there'}! 👋 I'm your AI cooking assistant. I can help you with recipes, cooking techniques, ingredient substitutions, meal planning, and much more! What would you like to cook today?`,
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const quickPrompts = [
    {
      icon: ChefHat,
      text: "What can I cook with chicken and rice?",
      category: "Recipe Ideas"
    },
    {
      icon: Lightbulb,
      text: "How do I make pasta sauce from scratch?",
      category: "Cooking Tips"
    },
    {
      icon: Clock,
      text: "Quick 15-minute dinner ideas",
      category: "Quick Meals"
    },
    {
      icon: Utensils,
      text: "Healthy meal prep ideas for the week",
      category: "Meal Planning"
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Prepare conversation history for AI
      const conversationHistory = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const responseMessage = await getChatCompletion(conversationHistory)
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: responseMessage?.content || "I’m here to help with anything food-related — recipes, techniques, nutrition, and more.",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickPrompt = (prompt) => {
    handleSendMessage(prompt.text)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 8rem)' }}>
      {/* Chat Header */}
      <Paper sx={{ p: 2, borderRadius: 0, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.light' }}>
            <Bot size={24} color={theme.palette.primary.main} />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'semibold' }}>
              AI Cooking Assistant
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your personal chef companion
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Messages Container */}
      <Box 
        sx={{ 
          flex: 1, 
          overflowY: 'auto', 
          p: 2, 
          bgcolor: 'grey.50',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{ 
              display: 'flex', 
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start' 
            }}
          >
            <Paper
              sx={{
                maxWidth: { xs: '85%', sm: '70%', md: '60%' },
                p: 2,
                bgcolor: message.role === 'user' 
                  ? 'primary.main' 
                  : message.isError 
                    ? 'error.light' 
                    : 'white',
                color: message.role === 'user' 
                  ? 'white' 
                  : message.isError 
                    ? 'error.dark' 
                    : 'text.primary',
                borderRadius: 2,
                ...(message.isError && {
                  border: 1,
                  borderColor: 'error.main'
                })
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                {message.role === 'assistant' && (
                  <Bot size={16} color={theme.palette.primary.main} />
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 0.5 }}>
                    {message.content}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: message.role === 'user' 
                        ? 'primary.light' 
                        : 'text.secondary',
                      display: 'block'
                    }}
                  >
                    {formatTime(message.timestamp)}
                  </Typography>
                </Box>
                {message.role === 'user' && (
                  <User size={16} color={theme.palette.primary.light} />
                )}
              </Box>
            </Paper>
          </Box>
        ))}

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Paper sx={{ p: 2, borderRadius: 2, maxWidth: '60%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Bot size={16} color={theme.palette.primary.main} />
                <CircularProgress size={16} />
                <Typography variant="body2" color="text.secondary">
                  Thinking...
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <Paper sx={{ p: 2, borderRadius: 0, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'medium' }}>
            Quick suggestions:
          </Typography>
          <Grid container spacing={1}>
            {quickPrompts.map((prompt, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    bgcolor: 'grey.50',
                    '&:hover': {
                      bgcolor: 'grey.100'
                    },
                    transition: 'background-color 0.2s'
                  }}
                  onClick={() => handleQuickPrompt(prompt)}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>
                        <prompt.icon size={16} color={theme.palette.primary.main} />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                          {prompt.text}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {prompt.category}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Message Input */}
      <Paper sx={{ p: 2, borderRadius: 0, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            inputRef={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about cooking..."
            multiline
            maxRows={4}
            fullWidth
            variant="outlined"
            size="small"
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
          <IconButton
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            color="primary"
            sx={{ 
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark'
              },
              '&:disabled': {
                bgcolor: 'grey.300',
                color: 'grey.500'
              }
            }}
          >
            {isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <Send size={20} />
            )}
          </IconButton>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Press Enter to send, Shift+Enter for new line
        </Typography>
      </Paper>
    </Box>
  )
}

export default Chat