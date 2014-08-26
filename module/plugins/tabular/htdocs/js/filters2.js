

//var cont = null;


function get_K_id(k){
    return k.fn+'-'+k.kn;
}

function get_listed_options(){
    var options = [];
    for(var key in filter_properties){
	if (filter_properties.hasOwnProperty(key)) {
	    e = filter_properties[key];
	    if(typeof e.listed == 'undefined' || e.listed){
		options.push(key);
	    }
	}
    }
    
    return options.sort();
}


function get_unlisted_options(){
    var options = [];
    for(var key in filter_properties){
	if (filter_properties.hasOwnProperty(key)) {
	    e = filter_properties[key];
	    if(typeof e.listed != 'undefined' && !e.listed){
		options.push(key);
	    }
	}
    }
    return options;
}


function get_last_FN(){
    // First try to find the hiest kN value
    var maxN = 1;
    for(var i=0; i< filters.length; i++){
	f = filters[i];
	var i_fn = parseInt(f.name.slice(1));
	maxN = Math.max(i_fn, maxN);
    }
    return maxN;
}


// say if the fn is the last one or not
function is_last_filter(fn){
    var maxN = get_last_FN();
    var i_fn = parseInt(fn.slice(1));
    if(i_fn == maxN){
	return true;
    }
    return false;
    
}


// Add the huge SELECT for the type
function create_type_select(k){
    // Create the SELECT container
    var kid = get_K_id(k);
    var select = $('<select>');
    select.addClass('select-type');
    select.attr('id', 'sel-'+kid+'-type');
    select.attr('name', 'sel-'+kid+'-type');
    select.data('fn', k.fn);
    select.data('kn', k.kn);

    var selected = k.type;
    
    // Now add the options inside it
    var options = get_listed_options();
    for(var i=0; i<options.length; i++){
	var option = $('<option>');
	var o = options[i];
	option.attr('value', o);
	// Tag the selected one
	if(o == selected){
	    option.attr('selected', 'selected');
	}
	option.html(filter_properties[o].desc);
	select.append(option);
    }

    select.change(function() {
	    console.log('CHANGE ON');
	    console.log(select);
	    update_ops_options(select.data('fn'), select.data('kn'));
	});



    return select;
    
}


// Some types are static, like the first 4th
function create_type_static(k){
    // Create the SELECT container
    var kid = get_K_id(k);
    var span = $('<span class="span_type_static"><p>'+filter_properties[k.type].desc+'</p></span>');
    var input = $('<input>');

    input.attr('id', 'inp-'+kid+'-type');
    input.attr('name', 'inp-'+kid+'-type');
    input.attr('type', 'hidden');
    input.attr('value', k.type);
    // WARNING: add the input AFTER setting its type property, can't be changed dynamically!
    span.append(input);    
    return span;
    
}



function update_ops_options(fn, kn){
    console.log('update_ops_options::'+fn+' '+kn);
    var select_type = $('#sel-'+fn+'-'+kn+'-type');
    console.log('SELECT?');
    console.log(select);
    var val = select_type.val();
    console.log('Looking for'+val);
    var ops = filter_properties[val].ops;
    
    var select = $('#sel-'+fn+'-'+kn+'-op');
    
    var kid = fn+'-'+kn;
    select.empty();
    // Now add the options inside it
    for(var i=0; i<ops.length; i++){
	var option = $('<option>');
	var o = ops[i];
	option.attr('value', o);
	// Tag the selected one
	if(o == selected){
	    option.attr('selected', 'selected');
	}
	option.html(o);
	select.append(option);
    }
    console.log('DONE');

}

// Add the huge SELECT for the type. If def(ault) is not set
// use the search
function create_ops_select(k, def){
    if(typeof def == 'undefined'){
	def = 'search';
    }
    
    // Create the SELECT container
    var kid = get_K_id(k);
    var ops = filter_properties[k.type].ops;
    /*
    // If we got only one possible value, use it as fixed input
    if(ops.length <= 1){
	var op = k.op;
	var span = $('<span>');
	span.html(k.op);
	var input = $('<input>');

	input.attr('id', 'inp-'+kid+'-op');
	input.attr('name', 'inp-'+kid+'-op');
	input.attr('type', 'hidden');

	// Add after set the type
	span.append(input);	
	
	return span;

    }else{
    */
    var select = $('<select>');
    select.addClass('select-op');
    
    select.attr('id', 'sel-'+kid+'-op');
    select.attr('name', 'sel-'+kid+'-op');
    select.data('fn', k.fn);
    select.data('kn', k.kn);
    var selected = k.op;

    // Now add the options inside it
    for(var i=0; i<ops.length; i++){
	var option = $('<option>');
	var o = ops[i];
	option.attr('value', o);
	// Tag the selected one
	if(o == selected){
	    option.attr('selected', 'selected');
	}
	option.html(o);
	select.append(option);
    }
    
    return select;
	//    }
    
}



// Add the huge SELECT for the type. If def(ault) is not set
// use the search
function create_value_input(k){
    // Create the SELECT container
    var kid = get_K_id(k);
    var input = $('<input>');
    var v = k.value;
    input.addClass('input-medium input-value');
    input.attr('id', 'inp-'+kid+'-value');
    input.attr('name', 'inp-'+kid+'-value');
    
    input.attr('value', v);
    return input;    
}


//For the 4th ones value, we got an hiddent input
// and a <p>that will display the sumpup of the filter
function create_value_hidden(k){
    var span = $('<span>');
    // Create the SELECT container
    var kid = get_K_id(k);
    
    // Create an hidden input
    var input = $('<input>');
    var v = k.value;
    input.attr('id', 'inp-'+kid+'-value');
    input.attr('name', 'inp-'+kid+'-value');
    input.attr('hidden', true);
    input.attr('value', v);
    
    var a_panel = $('<a></a>');
    a_panel.attr('onclick', 'javascript:display_'+k.type+'_panel(this);');
    a_panel.data('fn', k.fn);
	
	


    // Create a shown <p> for the sum-up
    var p = $('<p class="nomargin p-sumup">');
    a_panel.append(p);
    p.attr('id', 'sumup-'+k.type+'-'+k.fn);
    p.html('');
    /*
    if(k.type == 'hp' || k.type == 'sp'){
	p.html('any');
	}*/
    
    // Add all of this into our span result
    span.append(input);
    span.append(a_panel);
    return span;
}


// Add the huge SELECT for the type. If def(ault) is not set
// use the search
function create_delete_cros(k){
    // Create the SELECT container
    var a = $('<a title="Remove">');
    var cross = $('<i class="icon-remove"></i>');
    a.append(cross);
    a.attr('onclick', "javascript:remove_filter_K(this);");
    a.data('kn', k.kn);
    a.data('fn', k.fn);
    return a;
}



// Remove an existing filter K entry, in both the DATA and
// in the HTML part
function remove_filter_K(a){
    var kn = $(a).data('kn');
    var fn = $(a).data('fn');

    // First remove from the filter data
    for(var i=0; i< filters.length; i++){
	var f = filters[i];
	if(fn == f.name){
	    for(var j=0; j<f.value.length; j++){
		var k = f.value[j];
		if(k.kn == kn){
		    f.value.remove(k);
		    break;
		}
	    }
	    
	}
    }    
    // And also remove the HTML part
    var tr = $('#TR-'+fn+'-'+kn);
    tr.remove();
}



// Remove an existing filter K entry, in both the DATA and
// in the HTML part
function add_filter_K(a){
    var fn = $(a).data('fn');

    // First try to find the hiest kN value
    var maxN = 1;
    var f = null;
    for(var i=0; i< filters.length; i++){
	f = filters[i];
	if(fn == f.name){
	    for(var j=0; j<f.value.length; j++){
		var kn = f.value[j].kn;
		var i_kn = parseInt(kn.slice(1));
		maxN = Math.max(i_kn, maxN);
	    }
	    // We want to keep this f, so we breack here
	    break;
	}
    }    
    var nkn = maxN + 1;
    // Creating a new K with fn/nkn, default to search,~,''
    var k = {'kn':'K'+nkn, 'fn':fn, 'type':'search',  'op':'~', 'value':''};
    f.value.push(k);
    
    // Now update the HTML part
    var tr = create_filter_k(k);
    $('#T-'+fn).append(tr);
}


function create_filter_k(k){
    if(typeof filter_properties[k.type] == 'undefined'){
	console.log('WARNING: unknown filter type '+k.type);
	return null;
    }
    var e = filter_properties[k.type];
    var kn = k.kn;
    var fn = k.fn;
    var kid = get_K_id(k);
    
    var tr = $('<tr>');
    tr.attr('id', 'TR-'+kid);
    
    //////// First TD: type
    var td_type = $('<td>');
    tr.append(td_type);
    //td_type.html(e.desc);
    
    // If the type is in the first 4th, get a static input
    if(get_unlisted_options().indexOf(k.type) != -1){
	var input_type = create_type_static(k);
	td_type.append(input_type);
    }else{
	var select_type = create_type_select(k);
	td_type.append(select_type);
    }

    //////////// Second TD: ops
    var td_ops = $('<td>');
    tr.append(td_ops);
    var select_ops = create_ops_select(k);
    td_ops.append(select_ops);

    /////////// THIRD: value
    var td_value = $('<td>');
    tr.append(td_value);
    // If the type is in the first 4th, get a static input
    if(get_unlisted_options().indexOf(k.type) != -1){
	var input_value = create_value_hidden(k);
        td_value.append(input_value);

    }else{// Normal one
	var input_value = create_value_input(k);
	td_value.append(input_value);
    }

    ///////// 4th: cross delete K
    var td_delete = $('<td>');
    tr.append(td_delete);
    
    // Add a button to show the special panels
    if(k.type == 'hst' || k.type == 'hp' || k.type == 'sst' || k.type == 'sp'){
	/*var a_panel = $('<a><i class="icon-plus"></i></a>');
	a_panel.attr('onclick', 'javascript:display_'+k.type+'_panel(this);');
	a_panel.data('fn', fn);
	td_delete.append(a_panel);*/
    }else{// Other types can be deleted
	var a_delete = create_delete_cros(k);
	td_delete.append(a_delete);
    }


    
    return tr;
}


function update_add_filter_F_links(){
    $('.add_filter_F_link').each(function(idx, a){
	    a = $(a);
	    var fn = a.data('fn');
	    if(is_last_filter(fn)){
		a.show();
	    }else{
		a.hide();
	    }
	    
	});
}

function create_filter_f(f){
    var fn = f.name;
    
    var div = $('<div class="filters_F low_padding well span4">');
    // ADD THE F panel to the global CONTENER
    cont = $('#filtering_cont');
    cont.append(div);
    
    div.attr('id', 'F-'+f.name);


    
    // Add a table to this div, where we put our inputs
    var table = $('<table class="filters_panel_table">');
    
    table.attr('id','T-'+f.name);
    div.append(table);
    for(var i=0;i<f.value.length;i++){
	var k = f.value[i];
	var tr = create_filter_k(k);
	table.append(tr);
    }
    
    var div_add = $('<div class="add_filter_K_cont span12">');
    div.append(div_add);
    var a = $('<a class="add_filter_K_link">and <i class="icon-chevron-down"></i></a>');
    div_add.append(a);
    div_add.data('fn', fn);
    div_add.attr('onclick', 'javascript:add_filter_K(this);');



    // Add a apply button on the first filter (F1)
    if(fn == 'F1'){
	var a = $('<a class="btn btn-success"><i class="icon-ok"></i></a>');
	a.attr('id', 'filters_apply_btn');
	div.append(a);
	a.attr('onclick', 'javascript:filter_apply_form();');
    }else{
	var a = $('<a class=""><i class="icon-minus"></i></a>');
	a.attr('id', 'filters_remove_filter_F_btn');
	a.data('fn', fn);
        div.append(a);
        a.attr('onclick', 'javascript:remove_filter_F(this);');
	
    }

    // Add a link for adding new F panel. It will be hide if not the last one
    var a = $('<a class="add_filter_F_link">or <i class="icon-chevron-right"></i></a>');
    a.data('fn', fn);
    a.attr('onclick', 'javascript:add_filter_F();');
    div.append(a);



    
    // Update the add filter link so only the last one is shown
    update_add_filter_F_links();

    // Update all sumups spans
    compute_sumpup_spans();
}



// Add a new Filter panel
function add_filter_F(){
    var fn = 'F'+(get_last_FN()+1);
    
    var f = {
	'name':fn,
	'value': [
    {'kn':'K1', 'fn':fn, 'type':'hst', 'op':'=', 'value':15},
    {'kn':'K2', 'fn':fn, 'type':'hp',  'op':'=', 'value':0},
    {'kn':'K3', 'fn':fn, 'type':'sst', 'op':'=', 'value':31},
    {'kn':'K4', 'fn':fn, 'type':'sp',  'op':'=', 'value':0}
		  ]
    };
    // Add the filter into the data 
    filters.push(f);
    
    // And now the HTML part
    create_filter_f(f);
    
}



// Remove an existing filter K entry, in both the DATA and
// in the HTML part
function remove_filter_F(a){
    var fn = $(a).data('fn');

    // First remove from the filter data
    for(var i=0; i< filters.length; i++){
	var f = filters[i];
	if(fn == f.name){
	    filters.remove(f);
	}
    } 
    // And also remove the HTML part
    var F = $('#F-'+fn);
    F.remove();

    // Update the add filter link so only the last one is shown
    update_add_filter_F_links();
}







function filter_apply_form(){
    console.log('Getting an applying the filtering form');
    console.log($("#filtering").serialize());
    var uri = page+'?'+$("#filtering").serialize();
    console.log('Go the the new URI: '+uri);
    document.location.href = uri;
}




function display_hst_panel(a){
    display_FILTER_panel(a, 'hst', hst_properties, 'K1', false)
}

function display_hp_panel(a){
    display_FILTER_panel(a, 'hp', hp_properties, 'K2', true)
}

function display_sst_panel(a){
    display_FILTER_panel(a, 'sst', sst_properties, 'K3', false)
}

function display_sp_panel(a){
    display_FILTER_panel(a, 'sp', sp_properties, 'K4', true)
}


function display_FILTER_panel(a, prop, lst, KN, double_col){
    var orig_a = a;
    a = $(a);
    var fn = a.data('fn');
    var div = $('#filtering_'+prop+'_panel');
    div.data('fn', fn);

    // Set the div near the link
    var pos = orig_a.getBoundingClientRect();
    div.css('left', pos.left + 10);
    div.css('top' , pos.top  - 50);
    
    // Get the panel table and clear it, we will recreate it
    var table = $('#filtering_'+prop+'_table');
    table.empty();

    // Now set the value of the checkbox based on the FN-K1 value
    var val = parseInt($('#inp-'+fn+'-'+KN+'-value').val());

    // If we got a double_col, we will put 4 td into a tr
    // each time flap is true (flap between true and false :) )
    var tr = $("<tr>");
    var flap = false
    for(var i=0; i<lst.length; i++){
	var p = lst[i];
	var offset = i;
	var mask = 1 << offset; // gets the ith bit
	var m = val & mask;
	var td = $("<td>"+p.desc+"</td><td><input type='checkbox' name='"+i+"' /></td>");
	tr.append(td);
	// Set the bit if need
	if (m != 0) {
	    // bit is set
	    td.find('input[name='+i+']').attr('checked', true);
	}// Else checked is false, but it's the default 
	
	if(!double_col || flap){
	    table.append(tr);
	    var tr = $("<tr>");
	}
	flap = !flap;
    }
    
    //Compute the different sumpups
    compute_sumpup_span(fn, KN, prop, lst);

    // The panel is filled, so we can now display it
    div.show();
    
}


function compute_sumpup_spans(){
    for(var fn=0; fn< filters.length; fn++){
	var f = filters[fn];
	compute_sumpup_span('F'+(fn+1), 'K1', 'hst', hst_properties);
	compute_sumpup_span('F'+(fn+1), 'K2', 'hp', hp_properties);
	compute_sumpup_span('F'+(fn+1), 'K3', 'sst', sst_properties);
	compute_sumpup_span('F'+(fn+1), 'K4', 'sp', sp_properties);
    }

}

function compute_sumpup_span(fn, KN, prop, lst){
    selected = [];
    var val = parseInt($('#inp-'+fn+'-'+KN+'-value').val());
    for(var i=0; i<lst.length; i++){
	var p = lst[i];
	var offset = i;
	var mask = 1 << offset; // gets the ith bit
	var m = val & mask;
	// Set the bit if need
	if (m != 0) {// bit is set
	    selected.push(lst[i].desc);

	}
    }
    var sumup = $('#sumup-'+prop+'-'+fn);
    // None case
    if(selected.length == 0){
	var none_txt = 'none';
	// One exception is the properties: none selected means all are selected
	if(prop == 'hp' || prop == 'sp'){
	    none_txt = 'any';
	}
	sumup.html(none_txt);
	// ALL case
    }else if(selected.length ==  lst.length){
	sumup.html('all');
	// medium one :)
    }else{
	sumup.html(selected.join('&'));
    }
    
}


function submit_hst_panel(){
    submit_FILTER_panel('hst', hst_properties, 'K1');
}

function submit_hp_panel(){
    submit_FILTER_panel('hp', hp_properties, 'K2');
}

function submit_sst_panel(){
    submit_FILTER_panel('sst', sst_properties, 'K3');
}

function submit_sp_panel(){
    submit_FILTER_panel('sp', sp_properties, 'K4');
}


function submit_FILTER_panel(prop, lst, KN){
    var panel = $('#filtering_'+prop+'_panel');
    var fn = panel.data('fn');
    var v = 0; // Will be the bitmap of the checked values
    
    for(var i=0; i<lst.length; i++){
	var p = lst[i];
	var mask = 1 << i; // gets the Ith bit
	var is_checked = panel.find('input[name='+i+']').attr('checked');
	if(is_checked){
	    v |= mask;
	}
    }
    // Now set it
    $('#inp-'+fn+'-'+KN+'-value').val(v);
    // Update the sumup pan
    compute_sumpup_span(fn, KN, prop, lst);
    panel.hide();
}



function remove_all_hp_panel(){
    remove_all_FILTER_panel('hp');
}

function remove_all_hst_panel(){
    remove_all_FILTER_panel('hst');
}

function remove_all_sp_panel(){
    remove_all_FILTER_panel('sp');
}

function remove_all_sst_panel(){
    remove_all_FILTER_panel('sst');
}

function remove_all_FILTER_panel(prop){
    $('#filtering_'+prop+'_panel').find('input').attr('checked', false);
} 



// When load, we will automatically create the filters panels
$(function(){
	for(var fn=0; fn< filters.length; fn++){
	    var f = filters[fn];
	    console.log('Creating Filter '+fn);
	    create_filter_f(f);
	}
    // Also update all span sumups
    compute_sumpup_spans();	
});



var is_filters_panel_show = false;
$(function(){
	$('#filters_panel').hide();
	$('#filters_panel_cont').hide();
	$('#filters_panel_btn').html('<i class="icon-filter"></i>');
    });

function close_filters_panel(){
    $('#filters_panel').hide(100);
    $('#filters_panel_cont').hide(100);
    is_filters_panel_show = false;
    $('#filters_panel_btn').html('<i class="icon-filter"></i>');
    //filters_panel_cont.removeClass('well');
}

function toggle_filters_panel(){
    if(!is_filters_panel_show){
	$('#filters_panel_cont').show();
	$('#filters_panel').show(300);
	is_filters_panel_show = true;
	$('#filters_panel_btn').html('<i class="icon-remove"></i>');
	//filters_panel_cont.addClass('well');
    }else{
	close_filters_panel();
    }
}




/* 
*********************** FILTER SAVE FUNCTIONS **********
*/
$(function(){
	$('#save_filter_name').on("keypress", function(e) {
		console.log('ENTER!!!!!!!!!');
		if (e.which == 13) {
		    e.preventDefault();
		    do_save_new_bookmark();
	}
	    });
    });

function save_new_bookmark(){
    var div = $('#save_search_div');
    var btn = $('#save_new_bookmark_btn');
    var pos = btn[0].getBoundingClientRect();
    div.css('left', pos.left + 40 );
    div.css('top' , pos.top  + 20);
    div.show();
    $('#save_filter_name').focus();
}

function do_save_new_bookmark(){
    var n = $('#save_filter_name').val();
    // If there is no name enter, just whine and bail out
    if(n == ''){
	$('#save_filter_name').attr('placeholder', 'Please enter a name');
	return;
    }
    var location = window.location.pathname;
    var s = window.location.search;
    add_new_bookmark(n, location+s);

    close_save_bookmark();
}

function close_save_bookmark(){
    $('#save_search_div').hide();
}