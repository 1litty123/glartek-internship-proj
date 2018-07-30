import axios from 'axios'
import Consts from '../../../utils/consts'

export const createCron = (cronData) => {
    const access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
    return async dispatch => {
        try {
            const query = Consts.API_URL + "/PredefinedTimes?" + access_token
            await axios.post(query, cronData)
        } catch (err) {
            return onError(err)
        }

        function onError(err) {
            console.log(err.response.data)
            dispatch({ type: 'ERROR', payload: err })
            return err
        }
    }
}

export const deleteCron = (id, filter) => {
    const access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
    return async dispatch => {
        try {
            const query = Consts.API_URL + "/PredefinedTimes/" + id + "?" + (filter ? filter + "&" : "") + access_token
            /* console.log(query) */
            await axios.delete(query)
        } catch (err) {
            return onError(err)
        }

        function onError(err) {
            dispatch({ type: 'ERROR', payload: err })
            return { data: err.response.data, error: true }
        }
    }
}

export const getCronByName = (name) => {
    const access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
    return async dispatch => {
        try {
            const query = Consts.API_URL + "/PredefinedTimes?filter[where][name]=" + name + "&" + access_token
            const resp = await axios.get(query)

            return onSuccess(resp)
        } catch (err) {
            return onError(err)
        }

        function onError(err) {
            console.log(err)
            dispatch({ type: 'ERROR', payload: err })
            return err
        }

        function onSuccess(resp) {
            return resp
        }
    }
}

export const nextInvocation = (id) => {
    const access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
    return async dispatch => {
        try {
            const query = Consts.API_URL + "/PredefinedTimes/" + id + "/nextInvocation?" + access_token
            const resp = await axios.get(query)

            return onSuccess(resp)
        } catch (err) {
            return onError(err)
        }

        function onError(err) {
            console.log(err)
            dispatch({ type: 'ERROR', payload: err })
            return err
        }

        function onSuccess(resp) {
            /* dispatch({ type: 'GET_ACTIVE_TASKS', payload: resp }) */
            return resp
        }
    }
}

export const getPeriods = () => {
    return dispatch => {
        axios.get(Consts.API_URL + "/PredefinedTimesCatalogs?access_token=" + JSON.parse(localStorage.getItem('_user')).id)
            .then(resp => {
                dispatch({ type: 'GET_PERIODS', payload: resp })
            }).catch(err => {
                swal("Something went wrong!!", {
                    icon: "warning",
                })
                console.log(err.response.data)
            })
    }
}
