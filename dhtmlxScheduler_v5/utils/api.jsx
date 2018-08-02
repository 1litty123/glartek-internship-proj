import axios from 'axios';

var instance = {
    baseURL: "http://192.168.65.50:3000/api",
  };
//   const _token = JSON.parse(localStorage.getItem('_user')).id
//normally will be from local storage but...
const _token = "vyhT6nEKqqKxyVZxsvVjBErGgBeFeEIOflju7ieDAbZOBWEDzfuKKC0cFNCMmsFn"
const _managerId = "5b3ca554d3a8b24d3abe2b44"
module.exports = {
    
    // // Get functions
    
    // fetchAssetList: function(){
    //     return axios.get(instance.baseURL+"/Assets")
    //             .then(function(response){
    //                 return response.data;
    //             })
    // },

    // // Post functions

    // profileLogin(credentials){
    //    /* axios.request({
    //         method:'post',
    //         url: instance.baseURL+"/Profiles/login",
    //         data: credentials
    //     }).then(response => {
    //         if(response.data.code == 200){
    //             const token = response.data.id;
    //             localStorage.setItem('glarToken', token);
    //         }
    //         else if(response.data.code == 204){
    //             console.log("Username password do not match");
    //             alert("username password do not match")
    //             }
    //             else{                    
    //                 console.log("Username does not exists");
    //                 alert("Username does not exist");
    //             }
    //         console.log(response);
    //       })
    //       .catch(function (error) {
    //         console.log(error);
    //       });*/
    // },

    // profileLogout: function(_token){
    //     return axios.post(instance.baseURL+"/Profiles/logout/"+ _token)
    //     .then(function (response) {
    //         instance.defaults.headers.common['Authorization'] = null
    //         console.log(response);
    //       })
    //       .catch(function (error) {
    //         console.log(error);
    //       });
    // },

    // fetchContacts: function(){
    //     return axios.get(instance.baseURL+"/Contacts/count?access"+_token)
    //     .then(function(response){
    //         return response.data;
    //     })
    // },

    // fetchActiveAlarms: function(){
    //     return axios.get(instance.baseURL+"/AlarmsInstance/active/count?access"+_token)
    //     .then(function(response){
    //         return  response.data;
    //     })
    // },

constructor() {
    super();
    this.state = {
        active: null
    };
},


    fetchTeamMembers: function(){
        return axios.get(instance.baseURL+"/Teams/"+_managerId+"/profile?access"+_token)
        .then(function(response){
            return response.data;
        })
    }




}