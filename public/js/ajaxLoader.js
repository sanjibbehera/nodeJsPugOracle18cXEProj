function alertAJAXMsg(appl_name, appl_srv_name) {
    console.log(appl_srv_name);
    $.ajax({
           type: 'GET',
           url: '/get_data_from_DB',
           data: {  appl_name, appl_srv_name },
           success: function(data) {
               console.log(data);
               var issueString = 'Application ' + appl_name + ' having service ' + appl_srv_name + ' facing issues with ' + data;
               alert(issueString);              
           },
           error: function(errData) {
              // generate an error
              console.error(errData);
           }
       });
    }