import axios from 'axios'

// here we a creating an instance of axios, which is just a JavaScript object with some settings.

const instance = axios.create({
  baseURL: 'https://burgerbuilder-cc30a.firebaseio.com/'
})

export default instance;
