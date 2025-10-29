import axios, { AxiosResponse } from "axios";
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

export const getClients = async (
  token: string,
  filtro?: string,
): Promise<Cliente[]> => {
  // Si hay filtro, se agrega el parámetro ?search=
  const endpoint =
    filtro && filtro.trim().length >= 3
      ? `${CLIENTS_ENDPOINT}?search=${encodeURIComponent(filtro)}`
      : CLIENTS_ENDPOINT;

  return getData(endpoint, token)
    .then((result) => result.clientes)
    .catch((err) => {
      console.log("❌ Error al obtener clientes:", err);
      return [];
    });
};

export const getProducts = async (
  token: string,
  clientenit: string,
  sucursalId: string,
  filtro?: string,
): Promise<Producto[]> => {
  const filtroParam = filtro ? `&search=${filtro.toUpperCase()}` : "";
  return getData(
    `${PRODUCTS_ENDPOINT}?clientenit=${clientenit}&sucursalId=${sucursalId}${filtroParam}`,
    token,
  )
    .then((result) => result.productos)
    .catch((err) => console.log("error fetching products ", err));
};

export const getUserInfo = async (token: string): Promise<any> => {
  return getData(USER_INFO_ENDPOINT, token).catch((err) => {
    console.log("error fetching user info ", err);
    return err?.response?.data;
  });
};

export const guardarPedido = async (token: string, pedido: CrearPedido) => {
  return postData(token, PEDIDOS_ENDPOINT, pedido).catch((err) => {
    console.log("error creando pedido: ", err);
    return { status: err.status, pedido: err.response.data.pedido };
  });
};

const getData = async (
  endpoint: string,
  token: string,
  params?: Record<string, any>,
): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.get(
      `${API_BASE_URL}${endpoint}`,
      {
        params, // Query parameters
        headers: {
          Authorization: `Bearer ${token || ""}`, // Add Bearer token if provided
        },
      },
    );
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error during GET request:", error);
    throw error; // Re-throw the error for further handling
  }
};

const postData = async (
  token: string,
  endpoint: string,
  data: Record<string, any>,
): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.post(
      `${API_BASE_URL}${endpoint}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token || ""}`, // Add Bearer token if provided
        },
      },
    );
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error during POST request:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const getHistorialPedidos = async (
  token: string,
  fechaInicio: string,
  fechaFin: string,
): Promise<HistorialPedidos[]> => {
  try {
    const response = await getData(PEDIDOS_ENDPOINT, token, {
      fechaInicio,
      fechaFin,
    });

    return response as HistorialPedidos[];
  } catch (error) {
    console.error("Error fetching historial pedidos", error);
    return [];
  }
};

export const getTransacciones = async (
  token: string,
  fechaInicio: string,
  fechaFin: string,
): Promise<Transaccion[]> => {
  try {
    const response = await getData(TRANSACCIONES_ENDPOINT, token, {
      fechaInicio,
      fechaFin,
    });

    return response as Transaccion[];
  } catch (error) {
    console.error("Error fetching historial pedidos", error);
    return [];
  }
};
