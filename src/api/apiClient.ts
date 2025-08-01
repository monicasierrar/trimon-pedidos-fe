import axios, { AxiosResponse } from "axios";
import { Cliente } from "./types";
//MS agregué esta línea 
import { Producto } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const CLIENTS_ENDPOINT = "/clientes"
const PRODUCTS_ENDPOINT = "/productos"
const ORDERS_ENDPOINT = "/pedidos"


export const getClients = async (): Promise<Cliente[]> => {
    return getData(CLIENTS_ENDPOINT).then(result => result.clientes)
        .catch(err => console.log("error fetching clients ", err))
}

export const getProducts = async (): Promise<Producto[]> => {
    return getData(PRODUCTS_ENDPOINT).then(result => result.productos)
        .catch(err => console.log("error fetching products ", err))
}


const getData = async (endpoint: string, params?: Record<string, any>): Promise<any> => {
    try {
        const response: AxiosResponse = await axios.get(`${API_BASE_URL}${endpoint}`, {
            params, // Query parameters
        });
        return response.data; // Return the response data
    } catch (error) {
        console.error('Error during GET request:', error);
        throw error; // Re-throw the error for further handling
    }
};

// Function to perform a POST request
const postData = async (endpoint: string, data: Record<string, any>): Promise<any> => {
    try {
        const response: AxiosResponse = await axios.post(`${API_BASE_URL}${endpoint}`, data);
        return response.data; // Return the response data
    } catch (error) {
        console.error('Error during POST request:', error);
        throw error; // Re-throw the error for further handling
    }
};