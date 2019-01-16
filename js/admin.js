$(document).ready(function(){
	// View profile details
	$("#profile").click(function(){
		$('#upcoming-content').hide();
		$('#mymeetups-content').hide();
		$('#profile-content').show();
		$('#profile-content').css('display', 'flex');
	});

	// View create meetup
	$("#upcoming").click(function(){
		$('#profile-content').hide();
		$('#mymeetups-content').hide();
		$('#upcoming-content').show();
	});

	// View created meetups
	$("#mymeetups").click(function(){
		$('#profile-content').hide();
		$('#upcoming-content').hide();
		$('#mymeetups-content').show();
	});
});