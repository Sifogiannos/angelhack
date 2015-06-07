(function(){
	var openbtn = document.getElementById( 'open-button' );
	var closebtn = document.getElementById( 'close-button' );
	var content = document.querySelector('.overlay');
	var sendMessage = document.getElementById('send-message');
	var body = document.querySelector('body');
	var str = document.URL;
	var n = str.lastIndexOf('/');
	var user_id = str.substring(n + 1);
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
			var overview = document.getElementById('overview').innerHTML = '<p>Methodical, organised and not afraid to wrestle with multiple complex projects, Nick\'s talents lie in constantly pushing his skills further.</p><p>Experienced in full stack coding, he combines front end and back end development with an eye for design and a love of photography - all with a good understanding of business requirements.</p> '
			for (var i = 0; i < user.skills.length; i++) {
				skills.innerHTML+='<span class="nsg-tag">'+user.skills[i]+'</span>'
			};
		});
	}
})();