$(function() {

  let loginID
  let output=[];
  var test;

  window.fbAsyncInit = function() {
    FB.init({
      appId            : '111900782773487',
      autoLogAppEvents : true,
      xfbml            : true,
      cookie: true,
      version          : 'v2.9'
    });
    FB.AppEvents.logPageView();
    FB.getLoginStatus(function(response) {
      console.log('response', response)
      if (response.status === 'connected') {
        statusChangeCallback(response)
      };
    })
  };

  $('#login').click(myFacebookLogin)
  $('#postInput').keypress(search)



  function myFacebookLogin() {
    FB.login(statusChangeCallback);
  }


  function statusChangeCallback(response){
    if (response.status === "connected") {
      console.log(response);
      loginID=response.authResponse.userID;
      console.log(loginID);
      //setElements(true);
      testAPI();
    }else{
      console.log("Not authenticated");
      setElements(false);
    }
  }

  function testAPI(){
    FB.api('/'+loginID+'?fields=name,email,posts,birthday',function(response){
      if(response && !response.error){
        buildProf(response);
        document.getElementById('posts').insertAdjacentHTML('beforeend', '<h3>All Posts</h3>');

      }
    });
    test=0;
    FB.api('/'+loginID+'/feed?since=2017-04-01',doSomething);

  }

  function doSomething(response){
    console.log(response);
    if(response && !response.error){
      if (typeof response.paging === "undefined" || typeof response.paging.next === "undefined" ){
        document.getElementById('retcheck').innerHTML='<h3 class="heading text-center" id="retcheck">Data retrieving Finished</h3>';
      }
      else
      {
        console.log(response);
        buildFeed(response,test);
          // test=1;
          FB.api(response.paging.next, doSomething);
        }

      }
      else{
        console.log(response.error);
      }

    }

    function buildFeed(feed,test){

      let feedOut= '';
      for(var i=0;i<feed.data.length;i++){
        output.push(feed.data[i].message);
      }

      //}
      output=output.filter(function(data){
        if(data!=undefined){
          return data;
        }
      });
      for(var i=0;i<output.length;i++){

        feedOut+='<div class="well">'+output[i]+'</div>';
      }

      document.getElementById('posts').insertAdjacentHTML('beforeend', feedOut);

    }

    function buildProf(user){
     let profile=`
     <img src="http://graph.facebook.com/${user.id}/picture">
     <h3>${user.name}</h3>
     <h4>${user.email}</h4>

     `;
     if (user.birthday !== undefined) {

      profile+=`
      <h4>${user.birthday}</h4>

      `;
    }
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
      document.getElementById('retcheck').style.display = 'block';
      document.getElementById('searchPost').style.display = 'block';
    }else{
      document.getElementById('profile').style.display = 'none';
      document.getElementById('fb-btn').style.display = 'block';
      document.getElementById('logout').style.display = 'none';
      document.getElementById('logcheck').style.display = 'block';
      document.getElementById('posts').style.display = 'none';
      document.getElementById('retcheck').style.display = 'none';
      document.getElementById('searchPost').style.display = 'none';
    }
  }
  function logout(){
    FB.logout(function(response){
      setElements(false);
    });
  }
  function search(){


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
})
