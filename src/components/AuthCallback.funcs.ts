import axios from 'axios'; // Import axios

export const exchangeCodeForTokens = async (code:string):Promise<boolean> => {
      try {
        const redirectUrl = import.meta.env.VITE_REDIRECT_URI;
        const tokenUrl = `${import.meta.env.VITE_API_BASE_URL}/authorize`
        
        const response = await axios.post(tokenUrl, {
          code,
          redirectUrl
        });
        console.log(response)

        const { accessToken, expiresIn } = response.data;

        // Store tokens in local storage
        localStorage.setItem('accessToken', accessToken);
        // localStorage.setItem('refreshToken', refresh_token);
        localStorage.setItem('expiresAt', `${Date.now() + expiresIn * 1000}`);
        return true
    } catch (error: unknown) {
        // Check if the error is an AxiosError
        if (axios.isAxiosError(error)) {
          // It's an Axios error, you can safely access its properties
          console.error('Axios Error:', error.message);

          // You can also check if there's a response from the server
          if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
          }
        } else {
          // It's a different kind of error (e.g., network error, a different promise rejection)
          console.error('An unexpected error occurred:', error);
        }
        return false
      }
    };