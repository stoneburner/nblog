/**
 * Created with IntelliJ IDEA.
 * User: akasimir
 * Date: 12.02.13
 * Time: 21:50
 * To change this template use File | Settings | File Templates.
 */

function saveNewPost() {
  $.ajax({
    url:"/admin/save_post",
    type: "post",
    data: {
      html:$('.textarea').val(),
      title:$('#inputTitle').val(),
      tags:$('#inputTags').val(),
      category:$('#inputCategory').val()
    },
    success: function(result) {
      console.log(result);
        //window.location=
    },
    error: function() {
      alert("FAIL!(BOOOOOH)");
    }

  });
}