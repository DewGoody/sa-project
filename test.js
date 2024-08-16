var request = require('request'); 
var options = {
    'method': 'GET',
    'url': 'https://cunexdev.azurewebsites.net/service.svc/ext/type3/profile?token=1776d552baad4b66b07379dfe3332b0e',
    'headers': {
        'Content-Type': 'application/json',
        'ClientId': 'cuserv',
        'ClientSecret': '25a4b9d2efb6b16cc75ed6786c92526c'
    }
};
request(options, function (error, response) {
    if (error) throw new Error(error); console.log(response.body);
});

