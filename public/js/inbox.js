(function(){
	var openbtn = document.getElementById( 'open-button' );
	var closebtn = document.getElementById( 'close-button' );
	var content = document.querySelector('.overlay');
	var optionList = document.getElementById('option-list');
	var sendMessage = document.getElementById('send-message');
	var body = document.querySelector('body');
	var messages = document.getElementById('messages')
	var user_id;
	var messagesArray;
	var isOpen = false;

	openbtn.addEventListener( 'click', toggleMenu );
	closebtn.addEventListener( 'click', toggleMenu );
	content.addEventListener( 'click', closeMenu);
	function toggleMenu() {
		if( isOpen ) {
			body.className=''
		}
		else {
			$('body').addClass('show-menu');
		}
		isOpen = !isOpen;
	}
	function closeMenu(ev){
		var target = ev.target;
		if( isOpen && target !== openbtn ) {
			toggleMenu();
		}
	}
	init();
	var options = optionList.querySelectorAll('a');
	for (var i = 0; i < options.length; i++) {
		crossvent.add(options[i],'click',function(e){
			e.preventDefault();
			if(e.target.className !='active'){
				var arr = e.target.parentNode.childNodes;
				for (var i = 0; i < arr.length; i++) {
					arr[i].className=''
				};
				e.target.className+='active';
					//Load different option
					var option = e.target.dataset.option;
					loadMessages(option)
				}
			});
	};
	function init(){
		$.ajax({
			url: '/api/user/messages'
		})
		.done(function(response) {
			messagesArray = response.messages;
			user_id = response.user_id;
			loadMessages('inbox');
		});
	}

	function loadMessages(filter){
		var templateMessages = messagesArray.filter(function(index) {
			if(filter=="inbox"){
				return index.to == user_id;
			}
			else{
				return index.from._id == user_id;
			}
		});
		messages.innerHTML = '';
		if(filter=="inbox"){
			for (var i = 0; i < templateMessages.length; i++) {
				messages.innerHTML += '<li class="user table bg-white-color"><a href="/message/'+templateMessages[i]._id+'"><div class="user-photo table-cell"><img src="'+templateMessages[i].from.picture_Url+'" alt=""></div><div class="user-details table-cell"><h3>'+templateMessages[i].from.fullname+'</h3><p>'+templateMessages[i].from.company_title+' @ '+templateMessages[i].from.company+'</p><p class="subject">"'+templateMessages[i].content+'"</p></div></a></li>';
			};
		}
		else{
			for (var i = 0; i < templateMessages.length; i++) {
				messages.innerHTML += '<li class="user table bg-white-color"><a href="/message/'+templateMessages[i]._id+'"><div class="user-photo table-cell"><img src="'+templateMessages[i].to.picture_Url+'" alt=""></div><div class="user-details table-cell"><h3>'+templateMessages[i].to.fullname+'</h3><p>'+templateMessages[i].to.company_title+' @ '+templateMessages[i].to.company+'</p><p class="subject">"'+templateMessages[i].content+'"</p></div></a></li>';
			};
		}
	}
})();