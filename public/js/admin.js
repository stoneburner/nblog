/*
 Copyright 2013 Alexander Kasimir

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */


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
      showError("Could not save blogpost!");
    }
  });
}

function deletePost(id) {
  $.ajax({
    url:"/admin/delete_post/"+id,
    type: "get",
    success: function(result) {
      window.location="/admin/list_posts";
    },
    error: function(result) {
      showError("Could not delete blogpost!");
    }
  });
}

function showError(errmsg) {
  $('span.error').html(errmsg);
  $('.alert').show();
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

window.onerror = function (message, url, lineNo) {
  showError( message +
    '\nUrl: ' + url +
    '\nLine Number: ' + lineNo);
  return true;
};
