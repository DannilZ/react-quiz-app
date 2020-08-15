import axios from 'axios'
import {AUTH_SUCCESS, AUTH_LOGOUT} from './actionTypes'

export function auth(email, password, isLogin) {
    return async dispatch => {
        const authData = {
            email,
            password,
            returnSecureToken: true
        }

        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAf_y4OJnwBM49fkAtmJoTCn7uMW4AIv_o'

        if(isLogin) {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAf_y4OJnwBM49fkAtmJoTCn7uMW4AIv_o'
        }

        const respons = await axios.post(url, authData)
        const data = respons.data

        const expirationDate = new Date(new Date().getTime() + data.expiresIn * 1000)

        localStorage.setItem('token', data.idToken)
        localStorage.setItem('userId', data.localId)
        localStorage.setItem('expirationDate', expirationDate)

        dispatch(authSuccess(data.idToken))
        dispatch(authLogOut(data.expiresIn))
    }
}

export function authLogOut(time) {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout())
        }, time * 1000)
    }
}

export function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('expirationDate')

    return {
        type: AUTH_LOGOUT
    }
}

export function autoLogin() {
    return dispatch => {
      const token = localStorage.getItem('token')
      if (!token) {
        dispatch(logout())
      } else {
        const expirationDate = new Date(localStorage.getItem('expirationDate'))
        if (expirationDate <= new Date()) {
          dispatch(logout())
        } else {
          dispatch(authSuccess(token))
          dispatch(authLogOut((expirationDate.getTime() - new Date().getTime()) / 1000))
        }
      }
    }
  }

export function authSuccess(token) {
    return {
        type: AUTH_SUCCESS, 
        token
    }
}