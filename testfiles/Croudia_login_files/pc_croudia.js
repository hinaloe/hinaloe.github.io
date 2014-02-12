var focus_flg = 0;
(function($){
$.fn.bottom = function(options) {
var defaults = {
proximity: 0
};
var options = $.extend(defaults, options);
return this.each(function() {
var obj = this;
$(obj).bind("scroll", function() {
if (obj == window) {
scrollHeight = $(document).height();
}
else {
scrollHeight = $(obj)[0].scrollHeight;
}
scrollPosition = $(obj).height() + $(obj).scrollTop();
if ( (scrollHeight - scrollPosition) / scrollHeight <= options.proximity) {
$(obj).trigger("bottom");
}
});
return false;
});
};
$.fn.autolink = function () {
return this.each( function(){
var re =
/(@[a-zA-Z0-9_]+)/g;
$(this).html( $(this).html().replace(re, function(whole, p1){return "<a href=\"/" + p1.slice(1) + "\">" + p1 + "</a> "}) );
});
}
$.fn.timeCalc = function() {
return this.each(function(){
var writetime = $(this).attr("data-time");
var tD = new Date( writetime * 1000 );
var tS = new Date().getTime();
var difftime = tS - tD;
if (difftime < (60 * 1000)){
date = (difftime / 1000|0) + "秒前";
}
else if (difftime < (60 * 60 * 1000)){
date = (difftime / (60 * 1000)|0) + "分前";
}
else if (difftime < (60 * 60 * 24 * 1000)){
date = "約" + (difftime / (60 * 60 * 1000)|0) + "時間前";
}
else if (difftime < (60 * 60 * 24 * 30 * 1000)){
date = (difftime / (60 * 60 * 24 * 1000)|0) + "日前";
}
else{
var year  = tD.getFullYear(),
month = tD.getMonth()+1,
date  = tD.getDate();
var date = year + '/' + month +'/' + date;
}
$(this).text(date);
});
}
})(jQuery);
function showAlert(level, message, limit){
console.log('showAlert() was called');
var notify = $('<div class="alert"><button type="button" class="close" data-dismiss="alert">×</button></div>');
if (level == 'error'){
notify.addClass('alert-error');
} else if(level == 'warn'){
} else if(level == 'success'){
notify.addClass('alert-success');
} else if(level == 'info'){
notify.addClass('alert-info');
}
notify.append('<p>' + message + '</p>');
notify.css({marginTop: -50});
notify.appendTo('#notify-block');
notify.animate({
marginTop: 10,
opacity: 0.9
}, { duration: 500});
window.setTimeout(function(){
var disappearPoint = (notify.height() * -1) - 20;
notify.animate({marginTop: disappearPoint, opacity: 0}, 300, function(){
notify.alert('close');
});
}, limit);
}
$('#searchTab a').click(function (e) {
e.preventDefault();
$(this).tab('show');
});
jQuery(document).ready(function() {
var hash = document.location.hash;
var prefix = "tab_";
if (hash) {
var tabref = hash.replace(prefix,"");
$('#searchTab a[href='+tabref+']').tab('show');
}
});
$('#sidesearchTab a').click(function (e) {
var hash = $(this)
var prefix = "tab_";
if (hash) {
var tabref = e.target.hash.replace(prefix,"")
$('#searchTab a[href='+tabref+']').tab('show');
}
});
$('#unitList a.unitDelete').click(function (e) {
var unit_id = $(this).attr("unit_id");
var unit_name = $(this).attr("unit_name");
$("#listDeleteModal .modal-footer form").attr("action", "/units/destroy/"+unit_id);
$("#listDeleteModal .modal-body span#unitName").html(unit_name);
$('#listDeleteModal').modal({
keyboard: false
})
});
$(document).on('click','a.follow_button',function(event) {
event.preventDefault();
var follow_button = $(this);
var csrf_token = $('meta[name="csrf-token"]').attr('content');
if( follow_button.hasClass("btn-primary") ){
follow_action = "follow_destroy"
}
else if( follow_button.hasClass("btn-normal") ){
follow_action = "target_follow"
}
else{
follow_button.html('error');
}
$.ajax({
type:"POST",
url:'/inner_api/' + follow_action,
beforeSend: function(xhr) {
xhr.setRequestHeader("X-CSRF-Token", csrf_token)
},
data:{
target_user_name:follow_button.attr('username')
},
dataType:"json",
success:function(msg){
if(msg.status === "OK"){
if( follow_action == "follow_destroy" ){
follow_button.removeClass("btn-primary").addClass("btn-normal");
}
else if( follow_action == "target_follow" ){
follow_button.removeClass("btn-normal").addClass("btn-primary");
}
else{
follow_button.html('error');
}
}
if ( typeof msg.alert != "undefined"){
}
},
error:function(msg){
}
});
});
$("div[class*='sasayaki_area'] a.reply").live('click', function (e) {
if ( $(this).parents("div.contents").next().hasClass("form_area") ){
if ( !$(this).parents("div.contents").next().hasClass("quote") ){
$(this).parents("div.contents").next().remove();
$(this).parents("div.contents").after('<div class="form_area quote" style="display:none;"><div class="reply_form"><form accept-charset="UTF-8" action="/inner_api/sasayaki" enctype="multipart/form-data" method="post"><input name="utf8" type="hidden" value="&#x2713;" /><input name="in_reply_to_status_id" type="hidden" value="' + $(this).parents('div.contents').attr('id') + '" /><input name="authenticity_token" type="hidden" value="'+ $('meta[name="csrf-token"]').attr('content') + '"><img src=' + $("img.img-polaroid.form_img").attr("src") + ' class="img-polaroid form_img"><textarea class="editor-textarea-reply" name="status">'+ $(this).parents("div[class*='sasayaki_area']").find("span[class*='username']").html() +' </textarea><div class="editor_toolbar"><input type="file" class="file-input" name="media" style="display: none;"><a onclick="$(this).prev().click();"><i class="icon-camera"></i></a><div class="editor_counter"><span class="counter">372</span><button type="submit" class="btn btn-warning sasayaku">ささやく</button></div></div></form></div></div>');}
}
else{
$(this).parents("div.contents").after('<div class="form_area quote" style="display:none;"><div class="reply_form"><form accept-charset="UTF-8" action="/inner_api/sasayaki" enctype="multipart/form-data" method="post"><input name="utf8" type="hidden" value="&#x2713;" /><input name="in_reply_to_status_id" type="hidden" value="' + $(this).closest('div.contents').attr('id') + '" /><input name="authenticity_token" type="hidden" value="'+ $('meta[name="csrf-token"]').attr('content') + '"><img src=' + $("img.img-polaroid.form_img").attr("src") + ' class="img-polaroid form_img"><textarea class="editor-textarea-reply" name="status">'+ $(this).closest("div[class*='sasayaki_area'] div.contents").find("span[class*='username']").html() +' </textarea><div class="editor_toolbar"><input type="file" class="file-input" name="media" style="display: none;"><a onclick="$(this).prev().click();"><i class="icon-camera"></i></a><div class="editor_counter"><span class="counter">372</span><button type="submit" class="btn btn-warning sasayaku">ささやく</button></div></div></form></div></div>');
}
$(this).parents("div.contents").next().slideToggle("fast");
e.preventDefault();
});
$("div[class*='sasayaki_area'] a.share").live('click', function (e) {
if ( !$(this).parents("div.contents").next().hasClass("form_area share") ){
$(this).parents("div.contents").next().remove();
}
if  ( !$(this).parents("div.contents").next().hasClass("form_area") ){
$(this).parents("div.contents").after('<div class="form_area share" style="display:none;"><div class="reply_form"><form accept-charset="UTF-8" action="/inner_api/sasayaki" enctype="multipart/form-data" method="post"><input name="utf8" type="hidden" value="&#x2713;" /><input name="in_reply_with_quote" type="hidden" value="true" /><input name="in_reply_to_status_id" type="hidden" value="' + $(this).closest('div.contents').attr('id') + '" /><input name="authenticity_token" type="hidden" value="'+ $('meta[name="csrf-token"]').attr('content') + '"><img src=' + $("img.img-polaroid.form_img").attr("src") + ' class="img-polaroid form_img"><textarea class="editor-textarea-reply" name="status"  placeholder="このささやきをシェア"></textarea><div class="editor_toolbar"><input type="file" class="file-input" name="media" style="display: none;"><a onclick="$(this).prev().click();"><i class="icon-camera"></i></a><div class="editor_counter"><span class="counter">372</span><button type="submit" class="btn btn-warning sasayaku">ささやく</button></div></div></form></div></div>');
}
$(this).parents("div.contents").next().slideToggle("fast");
$(this).parents("div.contents").next().find(".editor-textarea-reply").focus();
e.preventDefault();
});
$("div[class*='sasayaki_area'] a.quote").live('click', function (e) {
if ( !$(this).parents("div.contents").next().hasClass("form_area modal") ){
$(this).parents("div.contents").next().remove();
}
if  ( !$(this).parents("div.contents").next().hasClass("form_area") ){
$(this).parents("div.contents").after('<div id="quoteModal" class="form_area modal hide fade" tabindex="-1" role="dialog" aria-labelledby="quoteModalLabel" aria-hidden="true"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h3 id="quoteModalLabel">引用返信</h3></div><div class="modal-body"><form accept-charset="UTF-8" action="/inner_api/sasayaki" enctype="multipart/form-data" method="post"><input name="utf8" type="hidden" value="&#x2713;" /><input name="in_reply_to_status_id" type="hidden" value="' + $(this).parents('div.contents').attr('id') + '" /><input name="authenticity_token" type="hidden" value="'+ $('meta[name="csrf-token"]').attr('content') + '"><img src=' + $("img.img-polaroid.form_img").attr("src") + ' class="img-polaroid form_img" style="margin-left: 0;"><textarea class="editor-textarea" name="status" rows="5" style="height: 100%; margin-left: 0px;"> SP '+ $(this).parents("div[class*='sasayaki_area']").find("span[class*='username']").html() + ' ' + $(this).parents('div.contents').children("p").text() +  ' </textarea><div class="editor_toolbar"><input type="file" class="file-input" name="media" style="display: none;"><a onclick="$(this).prev().click();"><i class="icon-camera"></i></a><div class="editor_counter"><span class="counter">372</span><button type="submit" class="btn btn-warning sasayaku">ささやく</button></div></div></form></div></div>');
}
$(this).parents("div.contents").next().modal('show');
setTimeout( function() {
$("div.contents").next("div[aria-hidden='false']").find(" .editor-textarea").focus();
}, 1000);
e.preventDefault();
});
$(document).on('click','a.secret_mail_action',function(e){
var secret_mail_btn = $(this);
if ( secret_mail_btn.next().hasClass("secret_mail_form") ){
secret_mail_btn.next().modal('show');
console.log('sm_toggle');
e.preventDefault();
}
else {
secret_mail_btn.after('<div id="secretMailModal" class="secret_mail_form modal hide fade" tabindex="-1" role="dialog" aria-labelledby="secretMailModalLabel" aria-hidden="true"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h5 id="secretMailModalLabel" style="margin: 0;">@' + secret_mail_btn.attr('username') + 'へシークレットメールを送る</h5></div><div class="modal-body"><form accept-charset="UTF-8" action="/inner_api/secret_mail" enctype="multipart/form-data" method="post"><input name="utf8" type="hidden" value="&#x2713;" /><input id="user_name" name="user_name" type="hidden" value="' + secret_mail_btn.attr('username') + '" /><input name="authenticity_token" type="hidden" value="'+ $('meta[name="csrf-token"]').attr('content') + '"><img src="' + $("img.img-polaroid.form_img").attr("src") + '" class="img-polaroid form_img" style="margin-top:0;width:50px;height:50px;"><textarea class="editor-textarea" name="message" rows="5" style="height: 100%;"></textarea><div class="editor_toolbar"><input type="file" class="file-input" name="media" style="display: none;"><a onclick="$(this).prev().click();"><i class="icon-camera" style="margin:0;font-size:14px;vertical-align:text-bottom;color:#555;"></i></a><div class="editor_counter"><span class="counter">372</span><button type="submit" class="btn btn-warning sasayaku">送信</button></div></div></form></div></div>');
secret_mail_btn.next().modal('show');
e.preventDefault();
}
});
$(document).on('submit','div.secret_mail_form form',function(event) {
event.preventDefault();
form_obj = $(this);
console.log(form_obj);
var form_data  = new FormData( form_obj[0] );
$.ajax({
url: form_obj.attr("action"),
type: 'POST',
data: form_data,
enctype  : 'multipart/form-data',
dataType: 'json',
contentType: false,
processData: false
})
.done(function(data) {
if (data.ok){
location.href="/secret_mails/list"
}
else if(data.error){
showAlert('error', data.error, 10000);
}
})
.fail(function() {
console.log('error');
});
});
$(document).on('change','.file-input',function(){
console.log('file-input change');
var fileInput = $(this);
if (!this.files.length) {
if (fileInput.prev("div.preview").length > 0){
fileInput.prev("div.preview").remove();
fileInput.next("a").removeAttr("disabled");
};
return;
}
var file = this.files[0],
fileReader = new FileReader();
if (fileInput.prev("div.preview").length == 0){
fileInput.after(function() {
return '<div class="preview" style="background-image: url("")"><a href="#" class="close">×</a></div>';
});
};
var preview = fileInput.next("div.preview");
fileReader.onload = function(event) {
console.log('img load');
preview.css("background-image",'url(' + event.target.result + ')');
fileInput.prev("a").attr("disabled","disabled");
};
fileReader.readAsDataURL(file);
});
$(document).on('click','div.preview a.close',function(event) {
event.preventDefault();
console.log("close click");
$(this).parent("div.preview").siblings("input.file-input").val('').siblings("a").removeAttr("disabled");
$(this).parent("div.preview").remove();
});
$(document).on('submit','form.sasayaki_form',function(event) {
event.preventDefault();
form_obj = $(this);
console.log(form_obj);
var form_data  = new FormData( form_obj[0] );
$.ajax({
url: form_obj.attr("action"),
type: 'POST',
data: form_data,
enctype  : 'multipart/form-data',
dataType: 'json',
contentType: false,
processData: false
})
.done(function(data) {
if (data.ok){
showAlert('info', data.ok, 3000);
console.log(data);
form_obj[0].reset();
form_obj.find("div.preview").remove();
form_obj.find("a").removeAttr("disabled");
var max_id = $("div#stream-container div#editor-and-status").next().children("div.contents").attr("id");
setTimeout( function() {
$.stream();
}, 100);
}
else if(data.error){
showAlert('error', data.error, 10000);
}
})
.fail(function() {
console.log('error');
});
});
$(document).on('focus','textarea.editor-textarea-reply',function(){
focus_flg = 1;
console.log(focus_flg);
});
$(document).on('blur','textarea.editor-textarea-reply',function(){
focus_flg = 0;
console.log(focus_flg);
})
$(document).on('submit','div.form_area form',function(event) {
event.preventDefault();
form_obj = $(this);
var form_data  = new FormData( form_obj[0] );
$.ajax({
url: form_obj.attr("action"),
type: 'POST',
data: form_data,
enctype  : 'multipart/form-data',
dataType: 'json',
contentType: false,
processData: false
})
.done(function(data) {
if (data.ok){
showAlert('info', data.ok, 3000);
console.log(data);
form_obj.parents("div.form_area").remove();
$("div.modal-backdrop").remove();
setTimeout( function() {
$.stream();
}, 100);
}
else if(data.error){
showAlert('error', data.error, 10000);
}
})
.fail(function() {
console.log('error');
showAlert('error', "エラー", 10000);
});
});
$(document).on('submit','form.sasayaki_form_modal',function(event) {
event.preventDefault();
form_obj = $(this);
console.log(form_obj);
var form_data  = new FormData( form_obj[0] );
$.ajax({
url: form_obj.attr("action"),
type: 'POST',
data: form_data,
enctype  : 'multipart/form-data',
dataType: 'json',
contentType: false,
processData: false
})
.done(function(data) {
if (data.ok){
showAlert('info', data.ok, 3000);
console.log(data);
form_obj[0].reset();
form_obj.find("div.preview").remove();
form_obj.find("a").removeAttr("disabled");
form_obj.closest("div.modal").modal('hide');
setTimeout( function() {
$.stream();
}, 100);
}
else if(data.error){
showAlert('error', data.error, 10000);
}
})
.fail(function() {
console.log('error');
});
});
$(document).on('submit','form.jsonResponse',function(event) {
event.preventDefault();
form_obj = $(this);
var form_data  = new FormData( form_obj[0] );
$.ajax({
url: form_obj.attr("action"),
type: 'POST',
data: form_data,
enctype  : 'multipart/form-data',
dataType: 'json',
contentType: false,
processData: false
})
.done(function(data) {
showAlert('info', data.ok, 3000);
console.log(data);
})
.fail(function() {
console.log('error');
showAlert('error', "エラー", 10000);
});
});
$(document).on('click','div[class*=\'sasayaki_detail\'] i.icon-star + a',function(e) {
var fav_flg = 0;
var ajax_url = ""
var fav = $(this);
if (fav.hasClass("fav_enable")){
fav.removeClass("fav_enable");
fav.html('お気に入り登録中');
fav_flg = 1;
ajax_url = "favorite"
}
else if (fav.hasClass("fav_disable")){
fav.removeClass("fav_disable");
fav.html('お気に入り解除中');
fav_flg = 0;
ajax_url = "unfavorite"
}
else{
e.preventDefault();
return false;
}
var id = $(this).parents('div.contents').attr('id');
var csrfToken = $('meta[name="csrf-token"]').attr('content');
$.ajax({
url: "/inner_api/" + ajax_url,
type: 'post',
data: {
"voice_id": id,
"authenticity_token": csrfToken
}
})
.success(function() {
if (fav_flg == 1){
fav.addClass("fav_disable fav").prev().addClass("fav")
fav.html('お気に入り解除');
}
else{
fav.addClass("fav_enable").removeClass("fav").prev().removeClass("fav")
fav.html('お気に入り');
}
})
.error(function(xhr) {
fav.html('error');
showAlert('error', $.parseJSON(xhr.responseText).error, 10000);
});
e.preventDefault();
return false;
});
$(document).on('click','#gold_history_more', function(){
var next_btn = $(this);
console.log(next_btn);
var list_count = $("div.gold_history ul li").length;
$.ajax({
url: "/gold_histories/history",
data: {
'offset': list_count,
},
cache: false,
success: function (html) {
if (html == false){
next_btn.val("これ以上の履歴はありません。");
}
else {
$("#gold_history_list").append(html);
}
}
});
});
$(document).on('click','div[class*=\'sasayaki_detail\'] i.icon-thumbs-up + a',function(e) {
var like_flg = 0;
var ajax_url = ""
var like = $(this);
if (like.hasClass("like_enable")){
like.removeClass("like_enable");
like.html('イイネ！登録中');
like_flg = 1;
ajax_url = "spread"
}
else if (like.hasClass("like_disable")){
like.removeClass("like_disable");
like.html('イイネ！解除中');
like_flg = 0;
ajax_url = "unspread"
}
else{
e.preventDefault();
return false;
}
var id = $(this).parents('div.contents').attr('id');
var csrfToken = $('meta[name="csrf-token"]').attr('content');
$.ajax({
url: "/inner_api/" + ajax_url,
type: 'post',
data: {
"id": id,
"authenticity_token": csrfToken
}
})
.success(function() {
if (like_flg == 1){
like.addClass("like_disable like").prev().addClass("like")
like.html('イイネ！解除');
}
else{
like.addClass("like_enable").removeClass("like").prev().removeClass("like")
like.html('イイネ！');
}
})
.error(function(xhr) {
like.html('error');
showAlert('error', $.parseJSON(xhr.responseText).error, 10000);
});
e.preventDefault();
return false;
});
$("div.secretmail_detail i.icon-remove").next('a').click(function (e) {
var sm_delete_btn = $(this);
var csrfToken = $('meta[name="csrf-token"]').attr('content');
sm_delete_btn.after('<div id="secretMailDeleteModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="secretMailDeleteModalLabel" aria-hidden="true"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h3 id="secretMailDeleteModalLabel">このメールを削除しますか？</h3></div><div class="modal-body">'+ sm_delete_btn.parents("div.secretmail_area").html() + '</div><div class="modal-footer"><form accept-charset="UTF-8" action="/secret_mails/mail_delete" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="'+ csrfToken +'" /></div><input id="id" name="id" type="hidden" value="' + sm_delete_btn.attr("mail-id") + '" /><input type="submit" class="btn btn-primary" data-icon="arrow-r" value="削除"><button class="btn" data-dismiss="modal" aria-hidden="true">キャンセル</button></div></div>');
sm_delete_btn.next().find("div.secretmail_detail").remove();
sm_delete_btn.next().modal('show');
e.preventDefault();
});
$(document).on('click','div[class*=\'sasayaki_area\'] i.icon-trash + a',function(e) {
var delete_btn = $(this);
delete_btn.after('<div id="sasayakiDeleteModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="sasayakiDeleteModalLabel" aria-hidden="true"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h3 id="sasayakiDeleteModalLabel">このささやきを削除しますか？</h3></div><div class="modal-body">'+ delete_btn.parents("div.contents").outerHTML() + '</div><div class="modal-footer"><a href="#" class="sasayaki-delete btn btn-primary" style="color:#fff;">削除</a><button class="btn" data-dismiss="modal" aria-hidden="true">キャンセル</button></div></div>');
$("div#sasayakiDeleteModal div.modal-body div.sasayaki_detail").remove();
delete_btn.next().modal('show');
e.preventDefault();
});
$(document).on('click',"div[class*='sasayaki_area'] div#sasayakiDeleteModal a.sasayaki-delete",function(event) {
var delete_btn = $(this);
var id = $(this).parents('div.contents').attr('id');
var csrfToken = $('meta[name="csrf-token"]').attr('content');
$.ajax({
url: "/inner_api/sasayaki_destroy",
type: 'post',
data: {
"id": id,
"authenticity_token": csrfToken
}
})
.success(function() {
$('#sasayakiDeleteModal').modal('hide');
$('div#'+ id + '.contents').parent().fadeOut('slow').queue( function() {
this.remove();
} );
})
.error(function(xhr) {
delete_btn.html('error');
showAlert('error', $.parseJSON(xhr.responseText).error, 10000);
});
event.preventDefault();
return false;
});
$(document).on('click','div.sasayaki_detail div.status a.like',function(e) {
e.preventDefault();
var like_box = $(this);
var like_count = like_box.text().replace(/イイネ！/g,'');
var sasayaki_id = $(this).closest('div.contents').attr('id')
$("div#likeMemberModal").remove();
$.ajax({
url: "/spreads/spread_user_list/" + sasayaki_id,
type: 'GET'
})
.done(function(data) {
var $div = $('<div id="likeMemberModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="likeMemberModalLabel" aria-hidden="true" />');
$div.append('<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h3 id="likeMemberModalLabel">' + like_count + '件のイイネ！</h3></div>');
$div.append('<div class="modal-body">'+ like_box.closest("div.contents").outerHTML() + '</div>');
$div.append('<div class="user-list" style="max-height: 200px; overflow-y: scroll; margin-bottom:5px;">'+ data + '</div>');
like_box.closest("div.contents").after($div);
$("div#likeMemberModal div.modal-body div.sasayaki_detail").remove();
like_box.closest("div.contents").next().modal('show');
})
.fail(function() {
console.log('error');
showAlert('error', "イイネ！ユーザー取得エラー", 10000);
});
});
$(document).on('click','div.sasayaki_detail div.status a.fav',function(e) {
e.preventDefault();
var fav_box = $(this);
var fav_count = fav_box.text().replace(/★/g,'');
var sasayaki_id = $(this).closest('div.contents').attr('id')
$.ajax({
url: "/favorites/list/" + sasayaki_id,
type: 'GET'
})
.done(function(data) {
var $div = $('<div id="favMemberModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="favMemberModalLabel" aria-hidden="true" />');
$div.append('<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h3 id="favMemberModalLabel">' + fav_count + '件のお気に入り</h3></div>');
$div.append('<div class="modal-body">'+ fav_box.closest("div.contents").outerHTML() + '</div>');
$div.append('<div class="user-list" style="max-height: 200px; overflow-y: scroll; margin-bottom:5px;">'+ data + '</div>');
fav_box.closest("div.contents").after($div);
$("div#favMemberModal div.modal-body div.sasayaki_detail").remove();
fav_box.closest("div.contents").next().modal('show');
})
.fail(function() {
console.log('error');
showAlert('error', "favユーザー取得エラー", 10000);
});
});
$(document).on('keyup','textarea',function(event) {
var thisValueLength = $(this).val().length;
$(this).siblings("div.editor_toolbar").children("div.editor_counter").children("span.counter").html(372 - thisValueLength);
});
$(document).ready(function () {
$.trends();
setInterval(function () {
$.trends();
}, 300000);
});
$(document).ready(function(){
setInterval(function(){
$("div#stream-container div[class*='sasayaki_time']:lt(100)").timeCalc();
},1000);
if( $("div#stream-container div#editor-and-status").hasClass("stream") ){
setInterval(function(){
if($(document).scrollTop() < 120){
if(focus_flg == 0) {
$.stream();
}
}
},5000);
}
});
$.extend({
trends : function(){
$.ajax({
url: "/html/trends.json",
type: 'GET',
dataType: 'json',
})
.done(function (json) {
var $ul = $('<ul class="nav nav-list" />');
$ul.append('<li class="nav-header">トレンド</li>');
$.each(json, function () {
$('<li />').append(
$('<a />').text(this[0]).attr('href', "/search/voices?voices=" + this[0])
).appendTo($ul);
});
$('div.advertising div.well').empty().append($ul);
})
.fail(function () {
console.log('trends_error');
});
},
stream : function(){
if (jQuery.active != 0) {
return false;
}
var newest_id = $("div#stream-container div#editor-and-status").next().children("div.contents").attr("id");
if ( ($("div#next_param").attr("data-type") == "normalResponse") && newest_id) {
var ajax_url = $("div#next_param").attr("request_url")
$.ajax({
url: ajax_url,
data: {
'max_id': newest_id
},
timeout : 5000,
cache: false,
success: function (html) {
if (html == false){
return false;
} else {
var append_html = $(html).insertAfter($("div#stream-container.main div#editor-and-status"));
var oldMarginTop = append_html.css('margin-top');
var form_areas = $("div.form_area");
var form_check = false;
form_areas.each(function(){
if ( !($(this).is(":hidden")) ) {
form_check = true;
return false;
};
});
if ( form_check ) {
var now_scrolltop = $(window).scrollTop();
var append_outer_height = 0;
var append_first = append_html.filter("div").first();
var append_last = append_html.filter("div").last();	append_outer_height = append_last.offset().top + append_last.outerHeight() - append_first.offset().top;
append_html.filter("div").first();
$(window).scrollTop(now_scrolltop  + append_outer_height );
console.log(append_outer_height);
}
}
},
error : function(){
}
});
}
else{
console.log('stream_cancel');
return false;
}
}
});
$(function () {
$(window).bottom({
proximity: 0.05
});
$(window).on('bottom', function () {
if (jQuery.active != 0) {
return false;
}
if ($("div#next_param").attr("data-type")) {
if ($("div#next_param").attr("data-type") == "normalResponse") {
since_id = $("div#next_param").prev().children("div.contents").attr("id");
request_url = $("div#next_param").attr("request_url");
$.ajax({
url: request_url,
data: {
'since_id': since_id
},
cache: false,
success: function (html) {
if (html == false) {
$(window).unbind('bottom');
} else {
$(html).insertBefore("div#next_param");
}
}
});
}
else {
offset = $("div#next_param").attr("offset");
request_url = $("div#next_param").attr("request_url");
$("div#next_param").remove();
$.ajax({
url: request_url,
data: {
'offset': offset
},
cache: false,
success: function (html) {
if (html == false) {
$(window).unbind('bottom');
} else {
$(html).appendTo("div#stream-container");
}
}
});
}
} else {
console.log('.error');
$(window).unbind('bottom');
console.log('unbind');
}
});
});
jQuery.fn.outerHTML = function(s) {
return (s)
? this.before(s).remove()
: jQuery("<p>").append(this.eq(0).clone()).html();
}