import axios from "axios";

export default function initialAxios() {
  axios.defaults.baseURL = "https://api.example.com";
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${localStorage.getItem("token")}`;
}
