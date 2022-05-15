import config from "./Config";
import axios from "axios"
axios.defaults.headers.common['mode'] = "cors";

const createmode = axios.create({
  headers:{
    mode:"cors"
  }
})
class Auth {
  token;
  setToken;

  constructor(argToken, argSetToken) {
    this.token = argToken;
    this.setToken = argSetToken;
  }

  //we can use ths methode for both signup and signin 


  async user(url,credentials) {
    console.log(url,credentials)
    return createmode.post(config.AUTH_URL+url,credentials)
    .then(({data})=>{
      this.storeTokens(data);
      return data;
    })
    .catch(config.handleError);
  }

  async refreshToken() {
   return axios.post(config.AUTH_URL+"/token/refresh",JSON.stringify({refreshToken:this.token.refreshToken}))
      .then(({data})=>{
      this.storeTokens(data);
      return data;
    })
  }

  async logoutUser() {
    return axios.post(config.AUTH_URL+"/token/refresh",JSON.stringify({refreshToken:this.token.refreshToken}))
      .then(({data})=>{
      this.clearTokens(this.token.refreshToken);
      return data;
    })
  }

  storeTokens(json) {
    this.setToken(json);
    config.storeAccessToken(json.accessToken);
  }

  clearTokens() {
    config.storeAccessToken("");
    this.setToken(null);
  }
}

export default Auth;
