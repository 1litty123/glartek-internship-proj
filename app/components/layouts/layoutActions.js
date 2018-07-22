import axios from 'axios'
import Consts from '../../utils/consts'


export const getProfile = (query) =>{
    return dispatch => {
        if (query){
            axios.get(Consts.API_URL + query)
            .then(resp => {
                //console.log(resp)
                dispatch({type: 'PROFILE_RECEIVED',payload: resp})
            }).catch(e => dispatch ({type: 'PROFILE_UNAUTHORIZED',payload: false}))
        }
    }
}