import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

export default function UserDisplay({ username }) {
    const initial = username ? username.charAt(0).toUpperCase() : '';

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#3c385b', p: '6px', borderRadius: 8, mr: 1 }}>
            <Typography variant="body1">{username}</Typography>
            <Avatar sx={{ bgcolor: '#9460ff', color: '#000', width: '24px', height: '24px', fontSize: '1rem' }}>{initial}</Avatar>
        </Box>
    );
}