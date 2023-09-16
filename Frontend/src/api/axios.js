import axios from 'axios';

export default axios.create({
    baseURL : 'https://localhost:7205',
    Authorization : `Bearer ${localStorage.getItem('token')}`

})

