import axios from 'axios'

export default axios.create({
    baseURL: 'https://react-quiz-app-c8f48.firebaseio.com/'
})