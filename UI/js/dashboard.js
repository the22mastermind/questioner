$(document).ready(function(){
	// View profile details
	$("#profile").click(function(){
		$('#upcoming-content').hide();
		$('#profile-content').show();
		$('#profile-content').css('display', 'flex');
	});

	// View upcoming meetup details
	$("#upcoming").click(function(){
		$('#profile-content').hide();
		$('#upcoming-content').show();
	});
});