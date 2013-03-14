/**
 * Created with IntelliJ IDEA.
 * User: akasimir
 * Date: 14.03.13
 * Time: 20:02
 * To change this template use File | Settings | File Templates.
 */

function login() {
  var data={username:$('#username').val(),password:$('#password').val(),rememberme:$('#remember-me').val()};
  console.log(data);
  jQuery.post('/admin/login',
                data,
                function(data,textStatus,jqXHR) {
                  console.log(data);
                  if (data.success===true && data.logged===true) {
                    location.reload();
                  } else {
                    console.log("nixda!");
                  }
                }
  );
}

function logout() {
  jQuery.post('/admin/logout',function(data) {
    location.reload();
  });
}