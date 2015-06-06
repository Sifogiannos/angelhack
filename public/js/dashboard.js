(function(){
	var openbtn = document.getElementById( 'open-button' );
	var closebtn = document.getElementById( 'close-button' );
	var content = document.querySelector('.overlay');
	var eventSelector = document.getElementById('event-selector');
	var optionList = document.getElementById('option-list');
	var searchForm = document.getElementById('search-form');
	var searchInput = document.getElementById('search-input');
	var body = document.querySelector('body')
	var isOpen = false;

	openbtn.addEventListener( 'click', toggleMenu );
	closebtn.addEventListener( 'click', toggleMenu );
	content.addEventListener( 'click', closeMenu);
	//Event selector
	crossvent.add(eventSelector,'change',function(e){
		var choice = e.target.value;
	})
	crossvent.add(searchForm,'submit',function(e){
		var query = searchInput.value;
	})
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
				if(option=="users"){
					eventSelector.innerHTML = '<option value="similar">Interesting users</option>'
				}
				else{
					eventSelector.innerHTML = '<option value="popular">Most Popular</option><option value="latest">Latest</option>'
				}
			}
		});
	};
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
})();