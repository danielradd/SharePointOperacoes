$(document).ready(function() {
      var id = getVar("ID");
      retrieveItem(id);
});


function retrieveItem(id) {
    
    var siteUrl = _spPageContextInfo.webAbsoluteUrl;
    var fullUrl = siteUrl + "/_api/web/lists/GetByTitle('NomeDaBiblioteca')/items?$select=Id,Title,Campo&$filter=Id eq "+id;

    var call = $.ajax({
        url: fullUrl,
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose",
        },
    });
    call.done(function (data,textStatus, jqXHR){
        var title = '';
		var campo = '';
            
    	$.each(data.d.results, function (key, value) {
              title += value.Title;
              campo += value.Campo;
	    });
        $("#txtTitle").val(''+title+'');
        $("#txtCampo").val(''+campo+'');

    });
    call.fail(function (jqXHR,textStatus,errorThrown){
            alert('Erro Ao carregar');
        });
}

$(function () {
    bindButtonClick();
});

function bindButtonClick() {
    $("#btnSubmit").on("click", function () {
        atualizarItem();
    });
    $("#btnCancel").on("click", function () {
        cancelar();
    });
}

function cancelar(){
    location.href="/CaminhoDoSite/";
}

// funcao chamada quando clicado botão de salvar
function atualizarItem(){
 	var clientContext = new SP.ClientContext('/sites/NomeDoSite');// caminho do site
    var oList = clientContext.get_web().get_lists().getByTitle('NomeDaBiblioteca'); //Nome biblioteca
	
	var title = $("#txtTitle").val();
	var dadoCampo = $("#txtCampo").val();
	

    this.oListItem = oList.getItemById(getVar("ID"));// id do Item 
		oListItem.set_item('Title', title); //update da coluna/campo
		oListItem.set_item('Campo', dadoCampo); //update da coluna/campo

    oListItem.update();

    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceededStatusLivro), Function.createDelegate(this, this.onQueryFailedStatusLivro));
}

function onQuerySucceededStatusLivro() {

    alert('Atualizado Item');
	location.href="/CaminhoDoSite/";
	
}

function onQueryFailedStatusLivro(sender, args) {

    alert('Falha Atualizar Item. ' + args.get_message() + '\n' + args.get_stackTrace());
}

/**
 * Obter id do livro na URL da página
 */

function urlDecode(string, overwrite){
	if(!string || !string.length){
		return {};
	}
	var obj = {};
	var pairs = string.split('&');
	var pair, name, value;
	var lsRegExp = /\+/g;
	for(var i = 0, len = pairs.length; i < len; i++){
		pair = pairs[i].split('=');
		name = unescape(pair[0]);
		value = unescape(pair[1]).replace(lsRegExp, " ");
		if(overwrite !== true){
			if(typeof obj[name] == "undefined"){
				obj[name] = value;
			}else if(typeof obj[name] == "string"){
				obj[name] = [obj[name]];
				obj[name].push(value);
			}else{
				obj[name].push(value);
			}
		}else{
			obj[name] = value;
		}
	}
	return obj;
}

function getVar(param){
	var wl = window.location.href;
	var params = urlDecode(wl.substring(wl.indexOf("?")+1));
	return(params[param]);
}