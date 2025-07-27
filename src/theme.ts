// src/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark', // Fundamental para que los colores se apliquen correctamente
    primary: {
      main: '#FFFF00', // El amarillo vibrante de tu logo
    },
    secondary: {
      main: '#FFFFFF', // El blanco para contraste
    },
    background: {
      default: '#1E1E1E', // Fondo principal oscuro
      paper: '#282828',   // Fondo para superficies como Cards o Menús
    },
    text: {
      primary: '#FFFFFF', // Color de texto principal
      secondary: '#BDBDBD', // Color de texto secundario (más tenue)
    },
  },
});