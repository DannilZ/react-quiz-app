import {CREATE_QUIZ_QUESTION, RESET_QUIZ_CREATION} from '../actions/actionTypes'

const initiallState = {
    quiz: []
}

export default function createReducer(state = initiallState, action) {
    switch(action.typr) {
        case CREATE_QUIZ_QUESTION: 
            return {
                ...state,
                quiz: [...state.quiz, action.item]
            }
        case RESET_QUIZ_CREATION: 
            return {
                ...state,
                quiz: []
            }
        default: 
            return state
    }
}