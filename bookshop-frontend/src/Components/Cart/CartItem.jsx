import React from 'react';
import { Box, Typography, IconButton, TextField } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useCart } from '../../Context/CartContext';

function CartItem({ item }) {
    const { removeFromCart, updateQuantity } = useCart();

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
                <Typography variant="subtitle1">{item.title}</Typography>
                <Typography variant="body2">Price: ${item.price.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    size="small"
                    sx={{ width: 80, mr: 1 }}
                    inputProps={{ min: 1 }}
                />
                <IconButton onClick={() => removeFromCart(item.id)}>
                    <Delete />
                </IconButton>
            </Box>
        </Box>
    );
}

export default CartItem;
