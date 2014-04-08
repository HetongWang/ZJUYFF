$(document).ready(function() {
	var view = new View();
	view.setElement();
	view.createCurrentPoster();
	view.fillPosters();
	$(window).bind('load resize', function() {
		view.setElement();
	});
	$('#main-info-submit').click(function() {
		$('#submit-container').slideDown(800);
	});

	$('#submit-back-button').click(function() {
		$('#submit-container').slideUp(800);
	});

	$('#main-info-vote').bind('click', view.vote);
	$('#left-button, #right-button').bind('click', view.slide);
	$('.posters').bind('click', view.posterClick);
});

function View() {
// set element width and height
	var that = this;
	var speed = 600;
	this.setElement = function() {
		this.w = $(window).width(),
		this.h = $(window).height();
		this.containerHeight = this.h-60;
		this.posterH = (this.containerHeight / 2),
		this.posterW = (this.containerHeight / 6 * 2),
		this.sw = (this.containerHeight / 3 * 2);
		this.mainInfoPosition = $('#main-info-container').position().left;
		$('#main-info-container').css('left', this.mainInfoPosition.toString() + 'px');

		$('#container').height(this.containerHeight);
		$('#main-info-container').width(this.sw);	
		$('#submit-poster').width(this.sw);
		$('#submit-container').width(this.sw + 360);
		$('#submit-origin-poster').width(this.sw / 8 * 3).height(this.sw / 16 * 9);
	}
// insert current poster
	this.createCurrentPoster = function() {
		var currentPoster = document.createElement('img');
		$(currentPoster).height(this.containerHeight).width(this.sw);
		$(currentPoster).css({
			position: 'absolute',
			left: (this.mainInfoPosition - this.sw).toString() + 'px',
		});
		$(currentPoster).attr({
			id: 'current-poster',
			class: 'posters',
			/******test code******/
			src: './img/1.jpg' 
			/******test code******/
		});
		$('#poster-container').prepend(currentPoster);
	}

	this.fillPosters = function() {
		// create posters on the left
		var leftPosition = this.mainInfoPosition - this.sw,
				leftCount = parseInt(leftPosition / this.posterW) + 1;
		for (var i = 0; i<leftCount; i++) {
			leftPosition -= this.posterW;
			this.createPosters(leftPosition, 'left');
		}
		// create posters on the right
		var rightPosition = this.mainInfoPosition + this.sw,
		    rightCount = parseInt((this.w - rightPosition) / this.posterW) + 1;
		for (var i = 0; i<rightCount; i++) {
				this.createPosters(rightPosition, 'right');
			rightPosition += this.posterW;
		}
	}

	this.createPosters = function(position, dir) {
		var posterTop = document.createElement('img'),
				posterBottom = document.createElement('img');
		$(posterTop).width(this.posterW).height(this.posterH);
		$(posterBottom).width(this.posterW).height(this.posterH);
		$(posterTop).css({
			position: 'absolute',
			left: position.toString() + 'px',
			top: 0
		});
		$(posterTop).attr({
			class: 'posters',
			src: './img/1.jpg' 
		});

		$(posterBottom).css({
			position: 'absolute',
			left: position.toString() + 'px',
			top: this.posterH.toString() + 'px'
		});
		$(posterBottom).attr({
			class: 'posters',
			src: './img/1.jpg' 
		});
		if (dir == 'right')
			$('#poster-container').append(posterTop).append(posterBottom);
		else 
			$('#poster-container').prepend(posterBottom).prepend(posterTop);
	}

	this.showMainInfo = function() {
		$('.posters').each(function(index) {
			var left = $(this).position().left;
			if (left>that.mainInfoPosition)
				$(this).animate({left: '+=' + that.sw}, 800);
		});
		$('#main-info-container').animate({
				left: '+=' + that.sw}, 
				800,
				function() {
					$('#main-info-container').css('display', 'block');
		});
	}

	this.hideMainInfo = function(speed) {
		$('#main-info-container').animate(
			{left: '-=' + that.sw},
			speed, 
			function() {
				$('#main-info-container').css('display', 'none');
		});
	}

	this.vote = function() {
		$('.poster-button').fadeIn(400);
		$('#main-info').fadeOut('400');
		$('#vote-container').animate({left: 0}, 400);
	}

	this.slide = function() {
		// judge if the first click
		if ($('#main-info-container').css('display') !== 'none') {
			if (this.id == 'left-button')
				that.slideInitial('left', speed);
			else
				that.slideInitial('right', speed);
			return;
		}
		// create firstly, move secondly
		if (this.id == 'left-button') {
			var left = $('.posters').first().position().left;
			if (left + 2 * that.sw>=0) {
				left -= that.posterW;
				that.createPosters(left, 'left');
				left -= that.posterW;
				that.createPosters(left, 'left');
			}
			$('.posters').each(function(index) {
				var left = $(this).position().left;
				$(this).animate({left: '+=' + that.sw}, speed);
			});
		}
		else {
			var right = $('.posters').last().position().left + that.posterW;
			if (right - that.sw<that.w) {
				that.createPosters(right, 'right');
				right += that.posterW;
				that.createPosters(right, 'right');
			}
			$('.posters').each(function() {
				var left = $(this).position().left;
				$(this).animate({left: '-=' + that.sw}, speed);
			});
		}
	}

	this.slideInitial = function(dir ,speed) {
		if (dir == 'left') {
			var left = $('.posters').first().position().left;
			if (left + 2 * that.sw>=0) {
				left -= that.posterW;
				that.createPosters(left, 'left');
				left -= that.posterW;
				that.createPosters(left, 'left');
			}
			$('.posters').each(function() {
				var left = $(this).position().left;
				if (left<=that.mainInfoPosition)
					$(this).animate({left: '+=' + that.sw}, speed)
			});
		}
		else {
			var right = $('.posters').last().position().left + that.posterW;
			if (right - that.sw<that.w) {
				that.createPosters(right, 'right');
				right += that.posterW;
				that.createPosters(right, 'right');
			}
			$('.posters').each(function() {
				var left = $(this).position().left;
				if (left>that.mainInfoPosition)
					$(this).animate({left: '-=' + that.sw}, speed)
			});
		}
		that.hideMainInfo(speed);
	}

	this.posterClick = function() {
		if ($(this).attr('id') === 'current-poster')
			return;
		var posters = $('.posters');
		var top = $(this).position().top,
		    left = $(this).position().left,
		    h = $(this).height(),
		    w = $(this).width();
		if (top == 0) {
			if ($('#current-poster').position().left < left) {
				$(this).animate({
					width: w * 2,
					height: h * 2,
					left: '-=' + that.posterW}, 
					speed
				);
				$('#current-poster').animate({
					width: w,
					height: h},
					speed
				);
				$(this).next().animate({left: '-=' + that.sw}, speed);
				$(this).before($(this).next()[0]);
			}
			else {
				$(this).animate({
					width: w * 2,
					height: h * 2,}, 
					speed
				);
				$('#current-poster').animate({
					width: w,
					height: h,
					left: '+=' + that.posterW},
					speed
				);
				$(this).next().animate({left: '+=' + that.sw}, speed);
				$('#current-poster').after($(this).next()[0]);
			}
		}
		else {
			if ($('#current-poster').position().left < left) {
				$(this).animate({
					width: w * 2,
					height: h * 2,
					left: '-=' + that.posterW,
					top: '-=' + that.posterH}, 
					speed
				);
				$('#current-poster').animate({
					width: w,
					height: h},
					speed
				);
				$(this).prev().animate({
					left: '-=' + that.sw,
					top: '+=' + that.posterH}, 
					speed
				);
			}
			else {
				$(this).animate({
					width: w * 2,
					height: h * 2,
					top: '-=' + that.posterH}, 
					speed
				);
				$('#current-poster').animate({
					width: w,
					height: h,
					left: '+=' + that.posterW},
					speed
				);
				$(this).prev().animate({
					left: '+=' + that.sw,
					top: '+=' + that.posterH}, 
					speed
				);
				$('#current-poster').after($(this).prev()[0]);
			}
		}
		$('#current-poster').removeAttr('id');
		$(this).attr('id', 'current-poster');
	}
}
