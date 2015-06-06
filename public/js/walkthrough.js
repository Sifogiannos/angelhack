var crossvent = require('crossvent');
var insignia = require('insignia');
window.$ = require('jquery');
(function(){
	var submitButton = document.getElementById('submitButton');
	var stepForms = document.querySelectorAll('.steps form');
	var insigniaInput = document.getElementById('insignia');
	var ajax = ajax();
	var nsg = insignia(insigniaInput);
	var step = 0;
	initListeners();


	function initListeners(){
		crossvent.add(submitButton,'click',postData);
	}
	function postData(e){
		e.preventDefault();
		if(step==0){
			var categoryNodes = document.querySelectorAll('.js-form-step-1 .checkbox :checked');
			var categories = [];
			for (var i = 0; i < categoryNodes.length; i++) {
				categories.push(categoryNodes[i].name);
			};
			var data = {
				name:document.getElementById('fname').value,
				surname:document.getElementById('lname').value,
				jobTitle:document.getElementById('jobTitle').value,
				company:document.getElementById('company').value,
				categories:categories,
				step: step
			}
			console.log(data);
			$.ajax({
				url: '/',
				type: 'PUT',
				dataType:'json',
				data: data,
			})
			.done(function() {
				console.log("success");
			});
		}
		else if(step==1){
			var data = {
				skills : nsg.tags(),
				step:step
			}
			console.log(data);
			$.ajax({
				url: '/',
				type: 'PUT',
				data: data,
			})
			.done(function() {
				console.log("success");
			});
		}
		else if(step==2){
			var categoryNodes = document.querySelectorAll('.js-form-step-3 .checkbox :checked');
			var categories = [];
			for (var i = 0; i < categoryNodes.length; i++) {
				categories.push(categoryNodes[i].name);
			};
			var data = {
				interests:categories,
				step:step
			}
			console.log(data);
			$.ajax({
				url: '/',
				type: 'PUT',
				data: data,
			})
			.done(function() {
				window.location.href="/";
			});
		}
		else{
			//do nothing. Propably error something
			alert("something is wrong, try refreshing")
		}
		nextStep();
	}
	function nextStep(){
		
		//post data here
		if(step==2){

		}
		else{
			if(step==1){
				submitButton.textContent='Finish'
			}
			var form = stepForms[step];
			var parentArticle = form.parentNode;
			parentArticle.className = 'step hide';
			step++;
			stepForms[step].parentNode.className = 'step show'
		}
	}
	function ajax() {
		var xmlhttp;
		function generateXhr(callback){
			// code for IE7+, Firefox, Chrome, Opera, Safari
	        xmlhttp = new XMLHttpRequest();

		    xmlhttp.onreadystatechange = function() {
		        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
		           if(xmlhttp.status == 200){
		              //success
		              callback();
		           }
		           else if(xmlhttp.status == 400) {
		              //error
		           }
		           else {
		               //biggest error
		           }
		        }
		    }
		    return xmlhttp;
		}
	    function get(url,data,callback){
			var xhr = generateXhr(callback);
			xmlhttp.open("GET", url, true);
	   		xmlhttp.send(data);
	    }
	    function post(url,data){
			var xhr = generateXhr(callback);
			xmlhttp.open("GET", url, true);
	   		xmlhttp.send(data);
	    }
	    function put(url,data){
			var xhr = generateXhr(callback);
			xmlhttp.open("GET", url, true);
	   		xmlhttp.send(data);
	    }
	    function del(url,data){
			var xhr = generateXhr(callback);
			xmlhttp.open("GET", url, true);
	   		xmlhttp.send(data);
	    }
	    return {
	    	get:get,
	    	post:post,
	    	put:put,
	    	del:del
	    }
	}
})();