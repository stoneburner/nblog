
function savePost() {
  $.ajax({
    url:"/admin/save_post",
    type: "post",
    data: {
      id:$('#post_id').val(),
      html:$('#editor').val(),
      title:$('#inputTitle').val(),
      tags:$('#inputTags').val(),
      category:$('#inputCategory').val()
    },
    success: function(result) {
      console.log(result);
      window.location="/admin/list_posts";
    },
    error: function() {
      alert("FAIL!(BOOOOOH)");
    }
  });
}

function deletePost(id) {
  $.ajax({
    url:"/admin/delete_post/"+id,
    type: "get",
    success: function(result) {
      console.log(result);
      window.location="/admin/list_posts";
    },
    error: function(result) {
      console.log(result);
      alert("FAIL!(BOOOOOH)");
    }
  });
}

function editor_cmd(cmd) {
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
  var editor=$('#imagechooser').data('editor');
  editor.composer.commands.exec("insertImage", { src: $('input#imagelink').val(), alt: $('input#alttext').val() });
  $('#imagechooser').modal('hide');
}

var editorInstance;
$(document).ready(function() {
  editorInstance = new wysihtml5.Editor("editor", {
    toolbar:        "toolbar",
    parserRules:    wysihtml5ParserRules,
    useLineBreaks:  false
  });
  $('#imagechooser').data('editor',editorInstance);
  $('#save_post').on('click',savePost);
});


