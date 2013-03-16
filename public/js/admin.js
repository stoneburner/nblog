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

function editcmd(cmd) {
  console.log(cmd);
  if (cmd==='insert-image') {
    $('#imagelist').load("/admin/imagelist");
    $('#imagechooser').modal('show');
  }
}

function preview_image(imagename,id) {
 $('#imageinfo').attr('style','background:url("/image/'+imagename+'");background-size:cover');
 $('#imagelist li').removeClass('active');
 $('#'+id).addClass('active');
 $('input#imagelink').val('/image/'+imagename);
}

function insert_image() {
  var image=$('input#imagelink').val();
  console.log(image);
  $('#imagechooser').modal('hide');
}