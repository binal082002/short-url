import axios from "axios";

const API = axios.create({
  baseURL: "https://short-url-iyw2.onrender.com/api", // change if needed
});

export default API;
