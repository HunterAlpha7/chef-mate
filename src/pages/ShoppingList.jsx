import { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Box, Container, Typography, Card, CardContent, TextField, Button, Grid, List, ListItem, ListItemText, IconButton, Snackbar, Alert } from '@mui/material'
import { Plus, Trash2 } from 'lucide-react'
import { getShoppingList, addToShoppingList, removeFromShoppingList } from '../lib/storage'

const ShoppingList = () => {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: '', quantity: '', unit: '' })
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })
  const { user } = useUser()

  useEffect(() => {
    async function load() {
      const uid = user?.id
      const data = await getShoppingList(uid)
      setItems(data)
    }
    load()
  }, [user])

  const refresh = async () => {
    const uid = user?.id
    const data = await getShoppingList(uid)
    setItems(data)
  }

  const handleAdd = async () => {
    if (!form.name.trim()) {
      setSnackbar({ open: true, message: 'Item name is required', severity: 'warning' })
      return
    }
    await addToShoppingList(user?.id, {
      name: form.name,
      quantity: Number(form.quantity) || 0,
      unit: form.unit
    })
    setForm({ name: '', quantity: '', unit: '' })
    await refresh()
    setSnackbar({ open: true, message: 'Added to shopping list', severity: 'success' })
  }

  const handleRemove = async (id) => {
    await removeFromShoppingList(user?.id, id)
    await refresh()
    setSnackbar({ open: true, message: 'Removed from shopping list', severity: 'info' })
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>Shopping List</Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField label="Item" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth size="small" />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField label="Quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} fullWidth size="small" />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField label="Unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} fullWidth size="small" />
            </Grid>
            <Grid item xs={12} md={1}>
              <Button fullWidth variant="contained" startIcon={<Plus size={16} />} onClick={handleAdd}>Add</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {items.length === 0 ? (
            <Typography color="text.secondary">Your shopping list is empty.</Typography>
          ) : (
            <List>
              {items.map((it) => (
                <ListItem key={it._id} divider secondaryAction={
                  <IconButton edge="end" onClick={() => handleRemove(it._id)}>
                    <Trash2 size={18} />
                  </IconButton>
                }>
                  <ListItemText primary={`${it.name} — ${it.quantity} ${it.unit || ''}`} />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  )
}

export default ShoppingList