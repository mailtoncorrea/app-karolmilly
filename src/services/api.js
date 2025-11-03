import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.18.14:5000", // coloque o IP do seu servidor Flask
});

export default api;
