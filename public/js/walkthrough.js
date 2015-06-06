(function(){
	var submitButton = document.getElementById('submitButton');
	var stepForms = document.querySelectorAll('.steps form');
	var step = 0;
	initListeners();


	function initListeners(){

		crossvent.add(submitButton,'click',nextStep);
	}
	function nextStep(e){
		e.preventDefault();
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
})();