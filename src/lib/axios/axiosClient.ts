import axios from "axios";

const AXIOS_INSTANCE = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

export default AXIOS_INSTANCE;
