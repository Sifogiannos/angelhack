(function(){
	var openbtn = document.getElementById( 'open-button' );
	var closebtn = document.getElementById( 'close-button' );
	var content = document.querySelector('.overlay');
	var body = document.querySelector('body');
	var selector = document.getElementById('selector');
	var userList = document.getElementById('user-list');
	var notifications = document.getElementById('push-notification');
	var str = document.URL;
	var n = str.lastIndexOf('/');
	var event_id = str.substring(n + 1);
	var isOpen = false;

	openbtn.addEventListener( 'click', toggleMenu );
	closebtn.addEventListener( 'click', toggleMenu );
	content.addEventListener( 'click', closeMenu);

	crossvent.add(selector,'change',function(e){
		var filter = e.target.value;
	});
	var pusher = new Pusher('cd774e2b8a51f506bc9f');
    var channel;
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
	init()

	function init(){
		$.ajax({
			url: '/api/events/'+event_id
		})
		.done(function(response) {
			var event = response.event;
			loadEvent(event);
			getSimilarUsers();
			channel = pusher.subscribe(response.user_id);
		    channel.bind('new-notification', function(data) {
		      notifications.innerHTML = '<ul class="user-list"><li class="user table"><a href="/messages/'+data.message_id+'" class="full-width"><div class="user-photo table-cell"><img alt="" src="'+data.photo+'"></div><div class="user-details table-cell full-width"><h3>'+data.fullname+'</h3><p class="white-color">'+data.company_title+'</p><p class="white-color">'+data.message.substring(0,30)+'...</p></div></a><div class="table-cell"><i id="close-notifications" class="fa fa-times close-notification"></i></div></li></ul>';
		      notifications.className += ' show'
		      crossvent.add(document.getElementById('close-notifications'),'click',function(e){
		      	notifications.className = 'bg-prm-color push-notifications'
		      });
		    });
		})
	}
	function loadEvent(event){

		var backgroundImage = event.cover;
		document.getElementById('event-background').style['backgroundImage'] = 'linear-gradient(rgba(0,0,0, 0.3), rgba(0,0,0, 0.3)), url('+backgroundImage+')';
		document.getElementById('event-title').textContent = event.title;
	}
	function getSimilarUsers(){
		$.ajax({
			url: '/api/events/'+event_id+'/users'
		})
		.done(function(response) {
			console.log("success");
			loadUsers(response.participants);
		})
	}
	function loadUsers(users){
		template ='';
		for (var i = 0; i < users.length; i++) {
			template+='<li class="user table bg-white-color"><a href="/users/'+users[i].user._id+'"><div class="user-photo table-cell"><img src="'+users[i].user.picture_Url+'" alt=""></div><div class="user-details table-cell"><h3>'+users[i].user.fullname+'</h3><p>'+users[i].user.company_title+' @ '+users[i].user.company+'</p></div></a></li>';
		};
		userList.innerHTML = template;
	}
})();