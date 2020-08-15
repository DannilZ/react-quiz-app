import {combineReducers} from 'redux'
import quizReducer from './quiz'
import  createReducer from './creat'
import authReducer from './auth'

export default combineReducers({
    quiz: quizReducer,
    create: createReducer,
    auth: authReducer
})