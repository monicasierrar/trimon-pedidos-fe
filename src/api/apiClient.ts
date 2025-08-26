import axios, { AxiosResponse } from "axios";
import { Cliente, Producto } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const CLIENTS_ENDPOINT = "/clientes"
const PRODUCTS_ENDPOINT = "/productos"
// const ORDERS_ENDPOINT = "/pedidos"


export const getClients = async (token: string): Promise<Cliente[]> => {
    return getData(CLIENTS_ENDPOINT, token).then(result => result.clientes)
        .catch(err => console.log("error fetching clients ", err))
}

export const getProducts = async (token: string): Promise<Producto[]> => {
    return getData(PRODUCTS_ENDPOINT, token).then(result => result.productos)
        .catch(err => console.log("error fetching products ", err))
}

export const getUserInfo = async (token: string): Promise<any> => {
    return getData("/user-info", token )
        .catch(err => console.log("error fetching user info ", err))
}


const getData = async (endpoint: string, token: string, params?: Record<string, any>): Promise<any> => {
    try {
        const response: AxiosResponse = await axios.get(`${API_BASE_URL}${endpoint}`, {
            params, // Query parameters
            headers: {
            Authorization: `Bearer ${token || ''}`, // Add Bearer token if provided
            },
        });
        return response.data; // Return the response data
    } catch (error) {
        console.error('Error during GET request:', error);
        throw error; // Re-throw the error for further handling
    }
};

// Function to perform a POST request
// const postData = async (endpoint: string, data: Record<string, any>): Promise<any> => {
//     try {
//         const response: AxiosResponse = await axios.post(`${API_BASE_URL}${endpoint}`, data);
//         return response.data; // Return the response data
//     } catch (error) {
//         console.error('Error during POST request:', error);
//         throw error; // Re-throw the error for further handling
//     }
// };