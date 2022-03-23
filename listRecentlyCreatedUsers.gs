/*
This requires the usage of the Admin SDK API > Reports Advanced Service, it has to be enabled first following steps at:
https://developers.google.com/apps-script/guides/services/advanced#enable_advanced_services

This is based off of an idea from @FernandoLara
*/

function listUsers() {

      var userKey = 'all';
      var applicationName = 'admin';
      var optionalArgs = {
      eventName:'CREATE_USER',
      startTime: "2022-03-23T12:00:00.000Z", //Adjust this accordingly
      fields : "items.events.parameters.value"
  };

      var rep =  AdminReports.Activities.list(userKey,applicationName,optionalArgs);
      const A = (JSON.parse(rep));
      var totalUsers = Object.keys(A.items).length;

      for(var i=0; i<totalUsers; i++)
      {
        var userEmail = A.items[i].events[0].parameters[0].value;
        Logger.log(userEmail);
      }
      
}
