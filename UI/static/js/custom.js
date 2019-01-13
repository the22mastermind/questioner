$(document).ready(function(){
	// Collapse menu button
	$(".navbtn").click(function(){
		$("#mobile-nav-links-wrapper").toggle();
		if($(this).children("i").hasClass("fa fa-bars")){
			$(this).children("i").removeClass("fa fa-bars").addClass("fa fa-times");
		}else{
			$(this).children("i").removeClass("fa fa-times").addClass("fa fa-bars");
		}
		// $(".navbtn").children("i").removeClass("fa-bars").addClass("fa-times");
	});

	$(".question-form-toggler").click(function(){
		$(".images-form-wrapper").css("display", "none");
		// $(this).next(".question-form-wrapper").toggle();
		$(this).closest(".comments").children(".question-form-wrapper").toggle();
		$('html, body').animate({
			scrollTop: $(this).offset().top
		}, 2000);
	});
	// Collapse add images to meetup form
	$(".question-list-toggler").click(function(){
		$(".question-form-wrapper").css("display", "none");
		// $(".images-form-wrapper").css("display", "block");
		$(this).closest(".comments").children(".images-form-wrapper").toggle();
		$('html, body').animate({
			scrollTop: $(".images-form-wrapper").offset().top
		}, 2000);
	});

	// Close dialog box
	$("#close").click(function(){
		$(this).closest(".dialog-box").hide();
	});
	// View meetup details
	$(".meetup_detail").click(function(){
		window.location.href = $(this).data('url');
	});

	// Get started
	$(".quarter-button").click(function(){
		window.location.href = $(this).data('url');
	});

	// Hide/Show all comments of a question
	$(".hide-comments-toggler").click(function(){
		$(this).closest(".meetup_card_wrapper").children(".commented").toggle();
		$(this).html("Show comments")
		$('html, body').animate({
			scrollTop: $(".hide-comments-toggler").offset().top
		}, 2000);
	});

	// Scroll to featured meetups
	$(".down").click(function(){
		$('html, body').animate({
			scrollTop: $("#featured-meetups").offset().top
		}, 1000);
	});
});