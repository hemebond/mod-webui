/*Copyright (C) 2009-2014 :
     Gabes Jean, naparuba@gmail.com
     Gerhard Lausser, Gerhard.Lausser@consol.de
     Gregory Starck, g.starck@gmail.com
     Hartmut Goebel, h.goebel@goebel-consult.de
     Andreas Karfusehr, andreas@karfusehr.de
     Frederic Mohier, frederic.mohier@gmail.com

 This file is part of Shinken.

 Shinken is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Shinken is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with Shinken.  If not, see <http://www.gnu.org/licenses/>.
*/

/*
 * To load on run some additional js or css files.
*/
function loadjscssfile(filename, filetype){
  if (filetype=="js"){ //if filename is a external JavaScript file
    $.ajax({
      url: filename,
      dataType: "script",
      error: function () {
        console.error('Shinken script error, not loaded: ', filename);
      }
    });
  } else if (filetype=="css"){ //if filename is an external CSS file
    $('<link>')
      .appendTo('head')
      .attr({type : 'text/css', rel : 'stylesheet'})
      .attr('href', filename);
  }
}


/**
 * Save current user preference value: 
 * - key / value
 * - callback function called after data are posted
**/
function save_user_preference(key, value, callback) {
   callback = (typeof callback !== 'undefined') ? callback : function() {
      console.debug('No callback function');
   };
   
   $.post("/user/save_pref", { 'key' : key, 'value' : value}, function() {
      raise_message_ok("User parameter "+key+" saved");
      try {
         window[callback]();
      }
      catch(err) {
         // console.error('Callback function does not exist!', callback);
      }
   });
}

/**
 * Save common preference value
 * - key / value
 * - callback function called after data are posted
**/
function save_common_preference(key, value, callback) {
   callback = (typeof callback !== 'undefined') ? callback : function() {
      console.debug('No callback function');
   };
   
   $.post("/user/save_common_pref", { 'key' : key, 'value' : value}, function() {
      raise_message_ok("Common parameter "+key+" set to "+value);
      try {
         window[callback]();
      }
      catch(err) {
         // console.error('Callback function does not exist!', callback);
      }
   });
}


/**
 * Display the layout modal form
 */
function display_form(form) {
   stop_refresh();
   $('#modal').modal({
      keyboard: true,
      show: true,
      backdrop: 'static',
      remote: form
   });
}

/* We will check timeout each 1s */
$(document).ready(function(){
   // Clean modal box content when hidden ...
   $('#modal').on('hidden.bs.modal', function () {
      $(this).removeData('bs.modal');
   });
});
