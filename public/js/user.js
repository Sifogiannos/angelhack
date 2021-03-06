(function(){
	var openbtn = document.getElementById( 'open-button' );
	var closebtn = document.getElementById( 'close-button' );
	var content = document.querySelector('.overlay');
	var sendButton = document.getElementById('send-message');
	var sendMessage = document.getElementById('send-message-submit');
	var messageContent = document.getElementById('message-content');
	var notifications = document.getElementById('push-notification');
	var body = document.querySelector('body');
	var str = document.URL;
	var n = str.lastIndexOf('/');
	var user_id = str.substring(n + 1);
	var isOpen = false;

	openbtn.addEventListener( 'click', toggleMenu );
	closebtn.addEventListener( 'click', toggleMenu );
	content.addEventListener( 'click', closeMenu);
	crossvent.add(sendMessage,'click',function(e){
		e.preventDefault();
		user_id;
		$.ajax({
			url: '/messages/users/'+user_id,
			type: 'POST',
			data: {message: messageContent.value},
		})
		.done(function() {
			$('#composeModal').modal('hide');
			sendButton.className='button bg-green-color button-rounded'
			sendButton.innerHTML = '<i class="fa fa-check"></i> Message sent!'
		})		
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
	init();

	function init(){
		$.ajax({
			url: '/api/users/'+user_id
		})
		.done(function(response) {
			var user = response.user;
			var backgroundImage = user.picture_Url;
			document.querySelector('#user-background img').src = backgroundImage;
			var userDetails = document.getElementById('user-details');
			var photo = userDetails.querySelector('img').src= backgroundImage;
			var name = userDetails.querySelector('h3').textContent = user.fullname;
			var title = userDetails.querySelector('p').textContent = user.company_title;
			var skills = document.getElementById('skills');
			var overview = document.getElementById('overview').innerHTML = user.summary || 'No description'
			for (var i = 0; i < user.skills.length; i++) {
				skills.innerHTML+='<span class="nsg-tag">'+user.skills[i]+'</span>'
			};
			channel = pusher.subscribe(response.user_id);
		    channel.bind('new-notification', function(data) {
		      notifications.innerHTML = '<ul class="user-list"><li class="user table"><a href="/messages/'+data.message_id+'" class="full-width"><div class="user-photo table-cell"><img alt="" src="'+data.photo+'"></div><div class="user-details table-cell full-width"><h3>'+data.fullname+'</h3><p class="white-color">'+data.company_title+'</p><p class="white-color">'+data.message.substring(0,30)+'...</p></div></a><div class="table-cell"><i id="close-notifications" class="fa fa-times close-notification"></i></div></li></ul>';
		      notifications.className += ' show'
		      crossvent.add(document.getElementById('close-notifications'),'click',function(e){
		      	notifications.className = 'bg-prm-color push-notifications'
		      });
		    });
		});
	}
})();