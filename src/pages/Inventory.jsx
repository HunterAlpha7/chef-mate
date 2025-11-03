import { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Box, Container, Typography, Grid, Card, CardContent, TextField, Button, IconButton, Snackbar, Alert, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material'
import { Plus, Trash2, ScanLine } from 'lucide-react'
import { getInventory, addInventoryItem, removeInventoryItem } from '../lib/storage'

const Inventory = () => {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: '', quantity: '', unit: '', expiryDate: '' })
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })
  const { user } = useUser()

  useEffect(() => {
    async function load() {
      const uid = user?.id
      const data = await getInventory(uid)
      setItems(data)
    }
    load()
  }, [user])

  const refresh = async () => {
    const uid = user?.id
    const data = await getInventory(uid)
    setItems(data)
  }

  const handleAdd = async () => {
    if (!form.name.trim()) {
      setSnackbar({ open: true, message: 'Item name is required', severity: 'warning' })
      return
    }
    await addInventoryItem(user?.id, {
      name: form.name,
      quantity: Number(form.quantity) || 0,
      unit: form.unit,
      expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : null
    })
    setForm({ name: '', quantity: '', unit: '', expiryDate: '' })
    await refresh()
    setSnackbar({ open: true, message: 'Item added to inventory', severity: 'success' })
  }

  const handleRemove = async (id) => {
    await removeInventoryItem(user?.id, id)
    await refresh()
    setSnackbar({ open: true, message: 'Item removed', severity: 'info' })
  }

  const handleScan = () => {
    setSnackbar({ open: true, message: 'AI is out-of-credit. Try again later.', severity: 'error' })
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Inventory</Typography>
        <Button variant="outlined" startIcon={<ScanLine size={16} />} onClick={handleScan}>Scan packaging</Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>Add Item</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField label="Item" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth size="small" />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField label="Quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} fullWidth size="small" />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField label="Unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} fullWidth size="small" />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="Expiry Date (optional)" type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} fullWidth size="small" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} md={1}>
              <Button fullWidth variant="contained" startIcon={<Plus size={16} />} onClick={handleAdd}>Add</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>Items</Typography>
          {items.length === 0 ? (
            <Typography color="text.secondary">No items yet. Add your first item above.</Typography>
          ) : (
            <List>
              {items.map((it) => (
                <ListItem key={it._id} divider>
                  <ListItemText
                    primary={`${it.name} — ${it.quantity} ${it.unit || ''}`}
                    secondary={it.expiryDate ? `Expiry: ${new Date(it.expiryDate).toLocaleDateString()}` : ''}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleRemove(it._id)}>
                      <Trash2 size={18} />
                    </IconButton>
                  </ListItemSecondaryAction>
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

export default Inventory