import axios from "axios";
import qs from "qs";

const SIGNIN_URL = "http://localhost:8082/auth/login";

interface LoginDetails {
    userName: string;
    password: string;
}

export async function signin(loginDetails :LoginDetails) {
    const response = await axios.post(SIGNIN_URL, loginDetails, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
}