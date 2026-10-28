'use client';

import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { useGame } from '../../lib/game-context';
import { ITEMS, weightedPick } from '../../data/items';
import AdModal from '../AdModal';
import styles from './styles.module.css';

export default function CheatBar() {
  const { addBalance, addItem, reset, toast } = useGame();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [adOpen, setAdOpen] = useState(false);

  return (
    <>
      <div className={styles.row}>
        <Button
          color="secondary"
          variant="outlined"
          size="small"
          onClick={() => {
            addBalance(5000);
            toast('Занял 5000 у бабушки', 'success');
            setAdOpen(true);
          }}
        >
          +5000 (занять у бабушки)
        </Button>
        <Button
          color="info"
          variant="outlined"
          size="small"
          onClick={() => {
            const it = weightedPick(ITEMS);
            addItem(it);
            toast(`Выдана шмотка: ${it.name}`, 'info');
          }}
        >
          Выдать рандомную шмотку
        </Button>
        <Button color="error" variant="outlined" size="small" onClick={() => setConfirmOpen(true)}>
          Сброс (с крыши)
        </Button>
      </div>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Точно всё обнулить?</DialogTitle>
        <DialogContent>
          <DialogContentText>Шмотки и коины пропадут. Баланс вернётся к 1000.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setConfirmOpen(false)}>
            Отмена
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              reset();
              setConfirmOpen(false);
            }}
          >
            Обнулить(ся)
          </Button>
        </DialogActions>
      </Dialog>

      <AdModal open={adOpen} onClose={() => setAdOpen(false)} />
    </>
  );
}
