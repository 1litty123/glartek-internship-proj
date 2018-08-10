import axios from 'axios';

var instance = {
    baseURL: 'http://192.168.65.50:3000/api',
}



localStorage.setItem('_token', 'tGdTHiYbJObGsYyhZVFwo6HNfuPYIZA7EnaV8IaFaZ2NNe8zWCpvRSdlcvZMLDWf')
const _token = localStorage.getItem('_token')







module.exports = {
    
    // Get functions
    
    fetchAssetList: function(){
        return axios.get(instance.baseURL+"/Assets")
                .then(function(response){
                    return response.data;
                })
    },

    // Post functions

    profileLogin(credentials){
       /* axios.request({
            method:'post',
            url: instance.baseURL+"/Profiles/login",
            data: credentials
        }).then(response => {
            if(response.data.code == 200){
                const token = response.data.id;
                localStorage.setItem('glarToken', token);
            }
            else if(response.data.code == 204){
                console.log("Username password do not match");
                alert("username password do not match")
                }
                else{                    
                    console.log("Username does not exists");
                    alert("Username does not exist");
                }
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });*/
    },

    profileLogout: function(_token){
        console.log(_token)
        return axios.post(instance.baseURL+"/Profiles/logout?access_token="+ _token)
        .then(function (response) {
            instance.defaults.headers.common['Authorization'] = null
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    },
    getSeverity: function() {
        return axios.get(instance.baseURL+"/Severities?access_token="+_token)
        .then(function(response) {
            return response.data;
        })
        
    },
    getTeamId: function() {
        return axios.get(instance.baseURL+"/Teams?access_token="+_token)
        .then(function(response) {
            return response.data
        })
    },
    getElements: function() {
        return axios.get(instance.baseURL+"/Elements?access_token="+_token)
        .then(function(response) {
            return response.data
        })
    },
    getSites: function() {
        return axios.get(instance.baseURL+"/CompanySites?access_token="+_token)
        .then(function(response) {
            return response.data
        })
    }
}