import axios from 'axios'
import Consts from '../../../utils/consts'
import qs from 'qs'

export const getTeamData = () => {
    return async dispatch => {
        try {

            const access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
            const query = Consts.API_URL + "/Teams/?" + access_token

            const resp = await axios.get(query)

            return onSuccess(resp)

        } catch (err) {
            return onError(err)
        }

        function onError(err) {
            console.log(err)
            return err
        }

        function onSuccess(resp) {
            dispatch({ type: 'TEAM_DATA_RECEIVED', payload: resp })
            return resp
        }
    }
}

export const addRiskLetter = (idTeam, riskLetter) => {
    return async dispatch => {
        try {
            const access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
            const query = Consts.API_URL + "/Teams/" + idTeam + "/riskLetter?" + access_token
            let formData = new FormData()
            formData.append(riskLetter.name, riskLetter, riskLetter.name)

            const resp = await axios.post(query, formData)

            return onSuccess(resp)

        } catch (err) {
            return onError(err)
        }

        function onError(err) {
            console.log(err)
            return err
        }

        function onSuccess(resp) {
            return resp
        }
    }
}

export const deleteRiskLetter = (idTeam) => {
    return async dispatch => {
        try {
            const access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
            const query = Consts.API_URL + "/Teams/" + idTeam + "/riskLetter?" + access_token


            const resp = await axios.delete(query)

            return onSuccess(resp)

        } catch (err) {
            return onError(err)
        }

        function onError(err) {
            console.log(err)
            return err
        }

        function onSuccess(resp) {
            return resp
        }
    }
}

export const getRiskLetter = (idTeam) => {
    return async dispatch => {
        try {
            const access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
            const query = Consts.API_URL + "/Teams/" + idTeam + "/riskLetter?" + access_token


            const resp = await axios.get(query)

            return onSuccess(resp)

        } catch (err) {
            return onError(err)
        }

        function onError(err) {
            console.log(err)
            return err
        }

        function onSuccess(resp) {
            return resp
        }
    }
}




export const createTeam = (data) => {
    return async dispatch => {
        try {
            const access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
            const query = Consts.API_URL + "/Teams/?" + access_token
            const resp = await axios.post(query, qs.stringify(data))

            return onSuccess(resp)

        } catch (err) {
            return onError(err)
        }

        function onError(err) {
            console.log(err)
            return err
        }

        function onSuccess(resp) {
            dispatch({ type: 'TEAM_CREATED', payload: resp })
            return resp
        }
    }
}

export const updateTeam = (id, data) => {
    return async dispatch => {
        try {
            const access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
            const query = Consts.API_URL + "/Teams/" + id + "?" + access_token

            const resp = await axios.patch(query, qs.stringify(data))

            return onSuccess(resp)

        } catch (err) {
            return onError(err)
        }

        function onError(err) {
            console.log(err)
            return err
        }

        function onSuccess(resp) {
            dispatch({ type: 'TEAM_UPDATED', payload: resp })
            return resp
        }
    }
}

export const deleteRelTeamProfile = (idProfile) => {
    return async dispatch => {
        var resp
        try {
            const access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
            const query = Consts.API_URL + "/Profiles/" + idProfile + "/team?" + access_token
            resp = await axios.delete(query)

            return onSuccess(resp)

        } catch (err) {
            return onError(err)
        }

        function onError(err) {
            console.log(err)
            return err
        }

        function onSuccess(resp) {

            return resp
        }
    }
}

export const relTeamProfile = (idProfile, teams, flag = 0) => {
    return async dispatch => {
        var resp
        try {
            if (flag === 0) {
                const access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
                teams.map(async team => {
                    const query = Consts.API_URL + "/Teams/" + team.value + "/profile/rel/" + idProfile + "?" + access_token

                    resp = await axios.put(query, qs.stringify({ profileId: idProfile, teamId: team.value }))
                })
            } else {
                const access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
                teams.map(async team => {
                    const query = Consts.API_URL + "/Teams/" + team.id + "/profile/rel/" + idProfile + "?" + access_token

                    resp = await axios.put(query, qs.stringify({ profileId: idProfile, teamId: team.value }))
                })
            }
            return onSuccess(resp)

        } catch (err) {
            return onError(err)
        }

        function onError(err) {
            console.log(err)
            return err
        }

        function onSuccess(resp) {

            return resp
        }
    }
}

export const deleteTeam = (id) => {
    return async dispatch => {
        try {
            const access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
            const query = Consts.API_URL + "/Teams/" + id + "?" + access_token

            const resp = await axios.delete(query)

            return onSuccess(resp)

        } catch (err) {
            return onError(err)
        }

        function onError(err) {
            console.log(err)
            return err
        }

        function onSuccess(resp) {
            dispatch({ type: 'TEAM_DELETED', payload: resp })
            return resp
        }
    }
}

export const getTeamTypes = () => {
    return async dispatch => {
        try {

            const access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
            const query = Consts.API_URL + "/Teams/types?" + access_token

            const resp = await axios.get(query)

            return onSuccess(resp)

        } catch (err) {
            return onError(err)
        }

        function onError(err) {
            console.log(err)
            return err
        }

        function onSuccess(resp) {
            return resp
        }
    }
}

export const getTeamMembers = (id) => {
    return async dispatch => {
        try {

            const access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
            const query = Consts.API_URL + "/Teams/" + id + "/profile?" + access_token

            const resp = await axios.get(query)

            return onSuccess(resp)

        } catch (err) {
            return onError(err)
        }

        function onError(err) {
            console.log(err)
            return err
        }

        function onSuccess(resp) {
            return resp
        }
    }
}

export const getTeam = (id) => {
    return async dispatch => {
        try {

            const access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
            const query = Consts.API_URL + "/Teams/" + id + "?" + access_token

            const resp = await axios.get(query)

            return onSuccess(resp)

        } catch (err) {
            return onError(err)
        }

        function onError(err) {
            console.log(err)
            return err
        }

        function onSuccess(resp) {
            return resp
        }
    }
}
