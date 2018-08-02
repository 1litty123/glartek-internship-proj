import { toastr } from 'react-redux-toastr'
import axios from 'axios'
import consts from '../../utils/consts'


export function login(values) {
        return submit(values, `${consts.API_URL}/Profiles/login`)
}

export function signup(values) {
        return submit(values, `${consts.API_URL}/Profiles/signup`)
}

function submit(values, url) {
        return dispatch => {
                axios.post(url, values)
                        .then(resp => {
                                dispatch([
                                        { type: 'USER_FETCHED', payload: resp.data }
                                ])
                        })
                        .catch(e => {
                                e.response.data.errors.forEach(
                                        error => toastr.error('Erro', error))
                        })
        }
}

export function logout(token) {
        return dispatch => {
                if (token) {
                        console.log(token)
                        axios.post(`${consts.API_URL}/Profiles/logout/` + token)
                                .then(resp => {
                                        dispatch({ type: 'LOGOUT_USER', payload: true })
                                })
                                .catch(e => dispatch({ type: 'LOGOUT_USER', payload: false }))
                } else {
                        dispatch({ type: 'LOGOUT_USER', payload: false })
                }
        }
}

export function validateToken(uid) {
        return dispatch => {
                if (uid) {                      
                        axios.get(`${consts.API_URL}/Profiles/`+ uid.userId +'/accessTokens/'+ uid.id +'?access_token='+uid.id)
                                .then(resp => {
                                        dispatch({ type: 'TOKEN_VALIDATED', payload: true })
                                })
                                .catch(e => dispatch({ type: 'TOKEN_VALIDATED', payload: false }))
                } else {
                        dispatch({ type: 'TOKEN_VALIDATED', payload: false })
                }
        }
}