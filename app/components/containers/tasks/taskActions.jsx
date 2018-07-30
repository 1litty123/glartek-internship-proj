import axios from 'axios'
import Consts from '../../../utils/consts'
import qs from 'qs'
import moment from 'moment'

export const getProfiles = () => {
    return dispatch => {
        axios.get(Consts.API_URL + "/Profiles?access_token=" + JSON.parse(localStorage.getItem('_user')).id)
            .then(resp => {
                dispatch({ type: 'GET_PROFILES', payload: resp })
            }).catch(err => console.log(err.response.data))
    }
}


export const getHistoryTasks = (fieldsToFilter = []) => {
    const userId = JSON.parse(localStorage.getItem('_user')).userId
    const access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
    return async dispatch => {
        try {
            const countData = await axios.get(Consts.API_URL + "/Profiles/" + userId + "/taskHistory/count?" + access_token)
            let filter = '?'

            if (fieldsToFilter.length > 0 && fieldsToFilter[0].label !== "fromTo") {

                filter += 'filter={"where":{"and":['
                fieldsToFilter.map(f => {
                    if (f.label !== "fromTo") { filter += '{"' + f.label + '":"' + f.value + '"},' }
                })

                filter = filter.substring(0, filter.length - 1);
                filter += ']}}'
            }
            else if (fieldsToFilter.length > 1) {

                filter += 'filter={"where":{"and":['
                fieldsToFilter.map(f => {
                    if (f.label !== "fromTo") { filter += '{"' + f.label + '":"' + f.value + '"},' }
                })

                filter = filter.substring(0, filter.length - 1);
                filter += ']}}'
            }

            const query = Consts.API_URL + "/Profiles/" + userId + "/taskHistory" + filter + "&" + access_token

            const taskData = await axios.get(query)
            var after = taskData.data

            if (fieldsToFilter.length !== 0) {
                fieldsToFilter.map(f => {
                    if (f.label === "fromTo") {
                        after = []
                        taskData.data.map(d => {
                            if (moment(d.createdAt).local().format("YYYY-MM-DD") <= f.value.split(" ")[3] && moment(d.createdAt).local().format("YYYY-MM-DD") >= f.value.split(" ")[1]) {
                                after.push(d)
                            }
                        })
                    }
                })

            }


            const resp = {
                rows: after,
                pages: Math.ceil(countData.data / 10)
            }
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
            dispatch({ type: 'GET_HISTORY_TASKS', payload: resp })
            return resp
        }
    }
}

export const getActiveTasks = (fieldsToFilter = []) => {
    const userId = JSON.parse(localStorage.getItem('_user')).userId
    const access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
    return async dispatch => {
        try {
            /* To show pagination correctly, we need to get a task count, on another query */
            const countData = await axios.get(Consts.API_URL + "/Profiles/" + userId + "/taskList/count?" + access_token)

            /* 1st line - 'where' that limits the tasks to those associated by userId or teamId: {"where": {"or": [{"assignedToId": profileId},{"assignedToId": teamId}]}  */
            /* 3rd line - sorting (ref: https://loopback.io/doc/en/lb2/Order-filter.html) */
            /* 4th line - filtering  (ref: https://loopback.io/doc/en/lb2/Where-filter.html) <- filtering not working properly */
            /* 5th line - pagination (ref: https://loopback.io/doc/en/lb2/Skip-filter.html) */
            // let filter = "?"/*  + encoded + "&" */
            //sorted.map((s, i) => filter += "filter[order]" + (sorted.length > 1 ? "[" + i + "]" : "") + "=" + s.id + "%20" + (s.desc ? "DESC" : "ASC") + "&")

            // filter += "filter[limit]=" + pageSize + "&filter[skip]=" + (pageSize * page)
            //let filter = '{"include": {"relation":"instances", "scope":  { "where": { "createdAt":{ "gt": "2018-06-11T08:45:33.106Z"} } }  } }'
            let filter = '?'

            if (fieldsToFilter.length > 0 && fieldsToFilter[0].label !== "fromTo") {
                filter += 'filter={"where":{"and":['
                fieldsToFilter.map(f => {
                    if (f.label !== "fromTo") { filter += '{"' + f.label + '":"' + f.value + '"},' }
                })

                filter = filter.substring(0, filter.length - 1);
                filter += ']}}'
            } else if (fieldsToFilter.length > 1) {
                filter += 'filter={"where":{"and":['
                fieldsToFilter.map(f => {
                    if (f.label !== "fromTo") { filter += '{"' + f.label + '":"' + f.value + '"},' }
                })

                filter = filter.substring(0, filter.length - 1);
                filter += ']}}'
            }



            const query = Consts.API_URL + "/Profiles/" + userId + "/taskList" + filter + "&" + access_token

            const taskData = await axios.get(query)

            var after = taskData.data
            //console.log(taskData.data)
            if (fieldsToFilter.length !== 0) {
                fieldsToFilter.map(f => {
                    if (f.label === "fromTo") {
                        after = []
                        taskData.data.map(d => {
                            if (moment(d.createdAt).local().format("YYYY-MM-DD") <= f.value.split(" ")[3] && moment(d.createdAt).local().format("YYYY-MM-DD") >= f.value.split(" ")[1]) {
                                after.push(d)
                            }
                        })
                    }
                })

            }
            const resp = {
                rows: after,
                pages: Math.ceil(countData.data / 10)
            }
            return onSuccess(resp, fieldsToFilter)
        } catch (err) {
            return onError(err)
        }

        function onError(err) {
            console.log(err)
            dispatch({ type: 'ERROR', payload: err })
            return err
        }

        function onSuccess(resp, fieldsToFilter) {

            var corrective = 0
            var preventive = 0
            var evolutionary = 0

            resp.rows.map(r => {
                if (r.taskCatalog.type === "corrective") { corrective++ }
                else if (r.taskCatalog.type === "preventive") { preventive++ }
                else if (r.taskCatalog.type === "evolutionary") { evolutionary++ }
            })

            const result = {
                data: resp.rows,
                corrective: corrective,
                preventive: preventive,
                evolutionary: evolutionary,
            }
            if (fieldsToFilter.length === 0) {
                dispatch({ type: 'GET_ACTIVE_TASKS', payload: result })
                dispatch({ type: 'GET_TASKS', payload: result })
            }
            return resp
        }
    }
}

export const getFeedTasks = (userId) => {
    const access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
    return async dispatch => {
        try {
            // console.log("UPDATE")
            const resp = await axios.get(Consts.API_URL + "/Profiles/" + userId + "/taskList?" + access_token)

            return onSuccess(resp)
        } catch (err) {
            return onError(err)
        }

        function onError(err) {
            console.log(err.response.data)
            return err
        }

        function onSuccess(resp) {

            dispatch({ type: 'GET_ACTIVE_TASKS', payload: resp })
            return resp.data
        }
    }
}

export const updateTask = (taskData, taskId) => {

    const access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
    return async dispatch => {
        try {
            // console.log("UPDATE")
            const resp = await axios.put(Consts.API_URL + "/TaskCatalogs/" + taskId + "?" + access_token, qs.stringify(taskData))
            return onSuccess(resp)
        } catch (err) {
            return onError(err)
        }

        function onError(err) {
            dispatch({ type: 'ERROR', payload: err })
            return err
        }

        function onSuccess(resp) {
            dispatch({ type: 'END_TASK', payload: resp })
            return resp
        }
    }
}

export const endTask = (taskData, taskId, action) => {

    const access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
    return async dispatch => {
        try {
            const resp = await axios.post(Consts.API_URL + "/TaskInstances/" + taskId + "/" + action + "?" + access_token, taskData)
            return onSuccess(resp)
        } catch (err) {
            return onError(err)
        }

        function onError(err) {
            dispatch({ type: 'ERROR', payload: err })
            console.log(err.response.data)
            return err
        }

        function onSuccess(resp) {
            dispatch({ type: 'END_TASK', payload: resp })
            return resp
        }
    }
}

export const createTask = (taskData) => {

    const access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
    return async dispatch => {
        try {
            const resp = await axios.post(Consts.API_URL + "/TaskCatalogs?" + access_token, qs.stringify(taskData))
            //console.log("CRIAR")
            return onSuccess(resp)
        } catch (err) {
            return onError(err)
        }

        function onError(err) {
            console.log(err.response.data)
        }

        function onSuccess(resp) {
            dispatch({ type: 'DELETE_TASK' })
            return resp
        }
    }
}

export const getTask = (id) => {
    const userId = JSON.parse(localStorage.getItem('_user')).userId
    const access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
    return async dispatch => {
        try {
            let filter = "?filter[where][id]=" + id
            const query = Consts.API_URL + "/Profiles/" + userId + "/taskList" + filter + "&" + access_token
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

export const getInstance = (catalogId) => {
    const access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
    return async dispatch => {
        try {
            const query = Consts.API_URL + "/TaskCatalogs" + catalogId + "/activeInstance?" + access_token
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

export const getEventProfile = (eventId, instanceId, context) => {
    const access_token = "access_token=" + JSON.parse(localStorage.getItem('_user')).id
    return async dispatch => {
        try {
            const query = Consts.API_URL + "/" + context + "/" + instanceId + "/events/" + eventId + "/by?" + access_token
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

export const getManagerData = (begin, end, teamId) => {
    const access_token = "&access_token=" + JSON.parse(localStorage.getItem('_user')).id
    const userId = JSON.parse(localStorage.getItem('_user')).userId
    return async dispatch => {
        try {

            let team = teamId
            if (team === undefined) {
                const teamData = await axios.get(Consts.API_URL + "/Profiles/" + userId + "?" + access_token)
                team = teamData.data.teamId
            }
            const baseTaskQuery = Consts.API_URL + "/Teams/" + team + "/taskList?"
            const baseChecklistQuery = Consts.API_URL + "/Teams/" + team + "/checklist/active?"

            const filterAlarmTasks = "filter=" + JSON.stringify({
                where: {
                    and: [
                        {
                            'createdAt': {
                                between: [begin, end]
                            }
                        },
                        {
                            'alarmInstanceId': {
                                exists: true
                            }
                        }
                    ]
                }
            })
            const filterChecklistTasks = "filter=" + JSON.stringify({
                where: {
                    and: [
                        {
                            'createdAt': {
                                between: [begin, end]
                            }
                        },
                        {
                            'checkpointId': {
                                exists: true
                            }
                        }
                    ]
                }
            })

            const filterChecklists = "filter=" + JSON.stringify({
                where: {
                    'createdAt': {
                        between: [begin, end]
                    }
                }
            })

            const respAlarmTasks = await axios.get(baseTaskQuery + filterAlarmTasks + access_token)
            const respChecklistTasks = await axios.get(baseTaskQuery + filterChecklistTasks + access_token)
            const respMiscTasks = await axios.get(baseTaskQuery + access_token)
            const resp = {
                tasks: {
                    alarm: respAlarmTasks.data,
                    checklist: respChecklistTasks.data,
                    misc: respMiscTasks.data
                },
            }

            return onSuccess(resp)
        } catch (err) {
            return onError(err)
        }

        function onError(err) {
            console.log(err.response.data)
            dispatch({ type: 'ERROR', payload: err })
            return err
        }

        function onSuccess(resp) {
            return resp
        }
    }
}

export const saveTask = (data) => {
    return async dispatch => {
        try {
            dispatch({ type: 'SAVE_TASK', payload: data })
            return true
        } catch (err) {
            return false
        }
    }
}
