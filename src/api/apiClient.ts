import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  Cliente,
  CrearPedido,
  HistorialPedidos,
  Producto,
  Transaccion,
} from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CLIENTS_ENDPOINT = "/clientes";
const PRODUCTS_ENDPOINT = "/productos";
const PEDIDOS_ENDPOINT = "/pedidos";
const TRANSACCIONES_ENDPOINT = "/transacciones";
const USER_INFO_ENDPOINT = "/user-info";
const REFRESH_ENDPOINT = "/refresh-token";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("session_token");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("Sesion vencida, intentando refrescar el token");
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        // Call your n8n PROXY, NOT Zoho directly
        
        const res = await axios.post(
          `${API_BASE_URL}${REFRESH_ENDPOINT}`,
          { refresh_token: refreshToken },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("session_token") || ""}`, // Add Bearer token if provided
            },
          },
        );
        console.log(res)

        const { accessToken } = res.data;

        localStorage.setItem("session_token", accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        // If the refresh token is also invalid, log the user out
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    // return Promise.reject(error);
  },
);

export default apiClient;

export const getClients = async (filtro?: string): Promise<Cliente[]> => {
  // Si hay filtro, se agrega el parámetro ?search=
  const endpoint =
    filtro && filtro.trim().length >= 3
      ? `${CLIENTS_ENDPOINT}?search=${encodeURIComponent(filtro)}`
      : CLIENTS_ENDPOINT;

  return getData(endpoint)
    .then((result) => result.clientes)
    .catch((err) => {
      console.log("❌ Error al obtener clientes:", err);
      throw err;
    });
};

export const getProducts = async (
  clientenit: string,
  sucursalId: string,
  filtro?: string,
): Promise<Producto[]> => {
  const filtroParam = filtro ? `&search=${filtro.toUpperCase()}` : "";
  return getData(
    `${PRODUCTS_ENDPOINT}?clientenit=${clientenit}&sucursalId=${sucursalId}${filtroParam}`,
  )
    .then((result) => result.productos)
    .catch((err) => console.log("error fetching products ", err));
};

export const getUserInfo = async (): Promise<any> => {
  return getData(USER_INFO_ENDPOINT).catch((err) => {
    console.log("error fetching user info ", err);
    return err?.response?.data;
  });
};

export const guardarPedido = async (pedido: CrearPedido) => {
  return postData(PEDIDOS_ENDPOINT, pedido).catch((err) => {
    console.log("error creando pedido: ", err);
    return { status: err.status, pedido: err.response.data.pedido };
  });
};

const getData = async (
  endpoint: string,
  params?: Record<string, any>,
): Promise<any> => {
  try {
    const response: AxiosResponse = await apiClient.get(endpoint, {
      params, // Query parameters},
    });
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error during GET request:", error);
    throw error; // Re-throw the error for further handling
  }
};

const postData = async (
  endpoint: string,
  data: Record<string, any>,
): Promise<any> => {
  try {
    const response: AxiosResponse = await apiClient.post(endpoint, data);
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error during POST request:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const getHistorialPedidos = async (
  fechaInicio: string,
  fechaFin: string,
): Promise<HistorialPedidos[]> => {
  try {
    const response = await getData(PEDIDOS_ENDPOINT, {
      fechaInicio,
      fechaFin,
    });

    return response as HistorialPedidos[];
  } catch (error) {
    console.error("Error fetching historial pedidos", error);
    throw error;
  }
};

export const getTransacciones = async (
  fechaInicio: string,
  fechaFin: string,
): Promise<Transaccion[]> => {
  try {
    const response = await getData(TRANSACCIONES_ENDPOINT, {
      fechaInicio,
      fechaFin,
    });

    return response as Transaccion[];
  } catch (error) {
    console.error("Error fetching historial pedidos", error);
    throw error;
  }
};
