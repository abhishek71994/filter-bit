let output=[];
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '111900782773487',
      cookie     : true,
      xfbml      : true,
      version    : 'v2.8'
    });
	    
	FB.getLoginStatus(function(response) {
	    statusChangeCallback(response);
	}); 
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

  function statusChangeCallback(response){
  	if (response.status === "connected") {
  		console.log("We are up and running!");
  		setElements(true);
  		testAPI();
  	}else{
  		console.log("Not authenticated");
  		setElements(false);
  	}
  }




  	function testAPI(){
  		FB.api('/me?fields=name,email,posts,birthday',function(response){
  			if(response && !response.error){
  				buildProf(response);
  			} 
  		});
  		document.getElementById('posts').insertAdjacentHTML('beforeend', '<h3>All Posts</h3>');
  		FB.api('/me/feed',doSomething);
  			
  	}

  	function doSomething(response){
  		if(response && !response.error){
  				
  				// if (response.paging.next != "undefined"){
  					
  					
			   //      FB.api(response.paging.next, doSomething);
			        
			   //  }

			if (typeof response.paging === "undefined" || typeof response.paging.next === "undefined" ){
				console.log("data colllected");
			}
			else
			{ 
				console.log(response);
				buildFeed(response);
				FB.api(response.paging.next, doSomething);
			}



  				
  			} 
  		}
   

  	function buildFeed(feed){
  		
  		let feedOut= '';
  		for(var i=0;i<feed.data.length;i++){
  			output.push(feed.data[i].message);
  		}
  		output=output.filter(function(data){
  			if(data!=undefined){
  				return data;
  			}
  		});
  		for(var i=0;i<output.length;i++){

  			feedOut+='<div class="well">'+output[i]+'</div>';
  		}

  		// document.getElementById('posts').innerHTML=feedOut;
  		document.getElementById('posts').insertAdjacentHTML('beforeend', feedOut);

  	}

  	function buildProf(user){

  		let profile=`
  			<img src="http://graph.facebook.com/${user.id}/picture">
  			<h3>${user.name}</h3>
  			<h4>${user.email}</h4>
  			<h4>${user.birthday}</h4>
  			
  		`;
  		// <ul class="list-unstyled list-group">
	  	// 		<li class="list-group-item">User email:${user.email}<li>
	  	// 		<li class="list-group-item">User Birthday:${user.birthday}<li>
	  	// 		<li class="list-group-item">User Name:${user.name}<li>
  		// 	</ul> 
  		document.getElementById('profile').innerHTML = profile;

  	}

	function checkLoginState() {
	  FB.getLoginStatus(function(response) {
	    statusChangeCallback(response);
	  });
	}

	function setElements(isLoggedIn){
		if (isLoggedIn) {
			document.getElementById('profile').style.display = 'block';
			document.getElementById('logout').style.display = 'block';
			document.getElementById('logcheck').style.display = 'none';
			document.getElementById('fb-btn').style.display = 'none';
			document.getElementById('posts').style.display = 'block';
			document.getElementById('searchPost').style.display = 'block';
		}else{
			document.getElementById('profile').style.display = 'none';
			document.getElementById('fb-btn').style.display = 'block';
			document.getElementById('logout').style.display = 'none';
			document.getElementById('logcheck').style.display = 'block';
			document.getElementById('posts').style.display = 'none';
			document.getElementById('searchPost').style.display = 'none';
		}
	}
	function logout(){
		FB.logout(function(response){
			setElements(false);
		});
	}
	function searchPress(){

  		
	  	var searchVal= document.getElementById('postInput');
	  	if(searchVal.value === ''){
	  		let fooput='<h3>All posts</h3>';
	  		for(var i=0;i<output.length;i++){

	  			fooput+='<div class="well">'+output[i]+'</div>';
	  		}
	  		document.getElementById('posts').innerHTML=fooput;
	  	}
	  	else{
	  		let fooput='<h3>Searched posts</h3>';
	  		var regex=searchVal.value.toLowerCase();
	  		var k=0;
	  		for(var i=0;i<output.length;i++){
				if((new RegExp(regex)).test(output[i].toLowerCase())){
					fooput+='<div class="well">'+output[i]+'</div>';
					k++;
				}
			}
			if(k==0)
				document.getElementById('posts').innerHTML='<h3>No such posts</h3>';
			else
				document.getElementById('posts').innerHTML=fooput;

	  	}
    }