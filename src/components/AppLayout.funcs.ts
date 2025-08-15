import axios from 'axios'

export const getUserInfo = async () => {
    try {
        const url = `${import.meta.env.VITE_API_BASE_URL}/user-info`
        const token = localStorage.getItem('accessToken')
        const response = await axios.get(url, {
            headers: {
                // The Authorization header should be 'Zoho-oauthtoken <your_access_token>'
                'Authorization': `Bearer ${token}`
            }
        });

        // The response will contain the user's details
        const userInfo = response.data;
        console.log(userInfo);
        return userInfo;

    } catch (error) {
        console.error('Error fetching user info:', error);
        // Handle token expiration or other errors
        if (error.response && error.response.status === 401) {
            // Token is likely expired, you should handle a refresh here.
            // For example: refreshAccessTokenAndRetry();
        }
        return null;
    }
};