(function(){
	var openbtn = document.getElementById( 'open-button' );
	var closebtn = document.getElementById( 'close-button' );
	var content = document.querySelector('.overlay');
	var eventSelector = document.getElementById('event-selector');
	var optionList = document.getElementById('option-list');
	var searchForm = document.getElementById('search-form');
	var searchInput = document.getElementById('search-input');
	var cards = document.getElementById('cards')
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
		e.preventDefault();
		var query = searchInput.value;
		$.ajax({
			url: '/search',
			data: {query: query},
		})
		.done(function(response) {
			searchInput.value = '';
			var users = response.users;
			eventSelector.innerHTML = '<option value="similar">Search results</option>';
			var arr = optionList.childNodes;
			for (var i = 0; i < arr.length; i++) {
				arr[i].className=''
			};
			if(users.length>0){
				loadUsers(users)
			}
			else{
				cards.innerHTML = '<li class="user table"><h3>No results</h3></li>';
			}
		});
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
					getUsers('similarities');
				}
				else{
					eventSelector.innerHTML = '<option value="popular">Most Popular</option><option value="latest">Latest</option>'
					getEvents();
				}
			}
		});
	};

	init();

	function init(){
		getEvents();
	}
	function getEvents(){
		$.ajax({
			url: '/events'
		})
		.done(function(response) {
			if(response.events.length > 0 ){
				loadEvents(response.events)
			}
			
		})	
	}
	function loadEvents(events){
		var template = '';
		for (var i = 0; i < events.length; i++) {
			template+='<div class="col-xs-6"><a href="/events/'+events[i]._id+'"><article class="card"><div class="eventLogo"><h2>'+events[i].title+'</h2><h3>June 6-7, 2015</h3></div><div class="card-details"><p>'+events[i].participants.length+' participants</p></div></article></a></div>'
		};
		cards.innerHTML = template;
	}
	function getUsers(filter){
		$.ajax({
			url: '/api/users',
			data:{filter: filter}
		})
		.done(function(response) {
			if(response.users.length > 0 ){
				loadUsers(response.users)
			}
		})	
	}
	function loadUsers(users){
		var template = '';
		for (var i = 0; i < users.length; i++) {
			template+='<li class="user table"><a href="/users/'+users[i]._id+'"><div class="user-photo table-cell"><img src="'+users[i].picture_Url+'" alt=""></div><div class="user-details table-cell"><h3>'+users[i].fullname+'</h3><p>'+users[i].company_title+'</p></div></a></li>';
		};
		cards.innerHTML = template;
	}
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