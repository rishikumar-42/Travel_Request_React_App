import React from 'react';
import { Dialog, DialogActions, DialogContent, AppBar, Toolbar, Typography, Button } from '@mui/material';

const CancelDialog = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <AppBar position="static" style={{ background: 'linear-gradient(90deg, #003D71 0%, #5482AB 100%)' }}> {/* Blue color */}
      <Toolbar>
        <Typography variant="h6">Confirm Cancellation</Typography>
      </Toolbar>
    </AppBar>
    <DialogContent>
      Are you sure you want to cancel this item?
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        No
      </Button>
      <Button onClick={onConfirm} color="secondary">
        Yes
      </Button>
    </DialogActions>
  </Dialog>
);

export default CancelDialog;
