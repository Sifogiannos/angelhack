(function(){
	var openbtn = document.getElementById( 'open-button' );
	var closebtn = document.getElementById( 'close-button' );
	var content = document.querySelector('.overlay');
	var body = document.querySelector('body');
	var selector = document.getElementById('selector')
	var isOpen = false;

	openbtn.addEventListener( 'click', toggleMenu );
	closebtn.addEventListener( 'click', toggleMenu );
	content.addEventListener( 'click', closeMenu);

	crossvent.add(selector,'change',function(e){
		var filter = e.target.value;
	})
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
	var backgroundImage = '/img/eventCover.jpg'
	document.getElementById('event-background').style['backgroundImage'] = 'linear-gradient(rgba(0,0,0, 0.3), rgba(0,0,0, 0.3)), url('+backgroundImage+')';
})();