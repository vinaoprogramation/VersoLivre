import React from 'react';
import styles from './styles.module.css';

export function ActivityIndicator({ size = 200, color = '#007AFF' }) {
  return (
    <div
      className={styles.activityIndicator}
      style={{
        width: size,
        height: size,
        borderColor: `${color}33`, // Borda de fundo semitransparente
        borderTopColor: color,     // Borda superior em destaque
      }}
      role="status"
      aria-label="Carregando"
    />
  );
}