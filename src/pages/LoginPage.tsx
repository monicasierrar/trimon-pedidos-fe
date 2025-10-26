// src/pages/LoginPage.tsx
//import TestLogin from '../components/TestLogin'; // <-- Importa el botón de prueba
import LoginButton from "../components/LoginButton";
import { Alert, Box, Paper, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const [notificacion, setNotificacion] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info",
  });

  useEffect(() => {
    const err = searchParams.get("error");
    if (err && err !== notificacion.message) {
      setNotificacion({
        open: true,
        message: err,
        severity: "error",
      });
    }
  }, [searchParams, notificacion]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper sx={{ padding: 4 }}>
        <LoginButton /> {/* <-- Usa el nuevo botón aquí */}
      </Paper>
      {/* Notificaciones */}
      <Snackbar
        open={notificacion.open}
        autoHideDuration={4000}
        onClose={() => setNotificacion({ ...notificacion, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={notificacion.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {notificacion.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;
