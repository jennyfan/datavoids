// show sidebar on scroll
sidebar = $("aside").fadeTo(0, 0);

$(window).scroll(function(d,h) {
    sidebar.each(function(i) {
        a = $(this).offset().top + $(this).height();
        b = $(window).scrollTop() + $(window).height();
        if (a < b) $(this).fadeTo(600,1);
    });
})



// SMOOTH SCROLLING
$(document).on('click', 'a[href^="#"]', function(e) {
	var id = $(this).attr('href');

	var $id = $(id);
	if ($id.length === 0) {
		return;
	}

	e.preventDefault();

	// top position relative to the document. offset by menu height
	var pos = $id.offset().top - 64;
	$('body, html').animate({scrollTop: pos});

});


// // Progress reading ticker
jQuery(document).ready(function($){
	var articlesWrapper = $('.cd-articles');

	if( articlesWrapper.length > 0 ) {
		// cache jQuery objects
		var windowHeight = $(window).height(),
			articles = articlesWrapper.find('article'),
			nav = $('.menu'),
			articleSidebarLinks = nav.find('li');

		// initialize variables
		var	scrolling = false,
			sidebarAnimation = false,
			resizing = false,
			mq = checkMQ(),
			windowWidth = $(window).width(),
			svgCircleLength = parseInt(Math.PI*(articleSidebarLinks.eq(0).find('circle').attr('r')*2));
		

		// check media query and bind corresponding events
		// if( mq == 'desktop' ) {
		if( windowWidth > 1100) {
			$(window).on('scroll', checkRead);
			$(window).on('scroll', checkSidebar);
		}

		$(window).on('resize', resetScroll);

		updateArticle();
		updateSidebarPosition();

		nav.on('click', '.menu a', function(event){
			event.preventDefault();
			var selectedArticle = articles.eq($(this).parent('li').index()),
				selectedArticleTop = selectedArticle.offset().top - 64;

			$(window).off('scroll', checkRead);

			$('body,html').animate(
				{'scrollTop': selectedArticleTop}, 
				300, function(){
					// console.log("scrollTop: ", selectedArticleTop);

					checkRead();
					$(window).on('scroll', checkRead);
				}
			); 
	    });
	}

	function checkRead() {
		// console.log("checkRead");

		if( !scrolling ) {
			scrolling = true;
			(!window.requestAnimationFrame) ? setTimeout(updateArticle, 300) : window.requestAnimationFrame(updateArticle);
		}
	}

	function checkSidebar() {
		if( !sidebarAnimation ) {
			sidebarAnimation = true;
			(!window.requestAnimationFrame) ? setTimeout(updateSidebarPosition, 300) : window.requestAnimationFrame(updateSidebarPosition);
		}
	}

	function resetScroll() {
		if( !resizing ) {
			resizing = true;
			(!window.requestAnimationFrame) ? setTimeout(updateParams, 300) : window.requestAnimationFrame(updateParams);
		}
	}

	function updateParams() {
		windowHeight = $(window).height();
		mq = checkMQ();
		$(window).off('scroll', checkRead);
		$(window).off('scroll', checkSidebar);
		
		// if( mq == 'desktop') {
		if( windowWidth > 1100) {
			$(window).on('scroll', checkRead);
			$(window).on('scroll', checkSidebar);
		}
		resizing = false;
	}

	function updateArticle() {
		var scrollTop = $(window).scrollTop();

		// console.log("updateArticle", scrollTop);

		articles.each(function(){
			var article = $(this),
				// articleTop has to be offset 1 extra px so clicking on the link makes it active
				articleTop = article.offset().top - 65,
				articleHeight = article.outerHeight(),
				articleSidebarLink = articleSidebarLinks.eq(article.index()).children('a');

			if( article.is(':last-of-type') ) articleHeight = articleHeight - windowHeight;
			
			// console.log(articleTop, scrollTop);

			if( articleTop > scrollTop) {
				articleSidebarLink.removeClass('read reading');
			} else if( scrollTop >= articleTop && articleTop + articleHeight > scrollTop) {
				var dashoffsetValue = svgCircleLength*( 1 - (scrollTop - articleTop)/articleHeight);
				articleSidebarLink.addClass('reading').removeClass('read').find('circle').attr({ 'stroke-dashoffset': dashoffsetValue });
				changeUrl(articleSidebarLink.attr('href'));
			} else {
				articleSidebarLink.removeClass('reading').addClass('read');
			}
		});
		scrolling = false;
	}

	function updateSidebarPosition() {
		// console.log("updateSidebarPosition");

		var articlesWrapperTop = articlesWrapper.offset().top,
			articlesWrapperHeight = articlesWrapper.outerHeight(),
			scrollTop = $(window).scrollTop();

		// console.log(articlesWrapperTop, articlesWrapperHeight, scrollTop);

		if( scrollTop < articlesWrapperTop) {
			nav.removeClass('fixed').attr('style', '');
		} else if( scrollTop >= articlesWrapperTop && scrollTop < articlesWrapperTop + articlesWrapperHeight - windowHeight) {
			nav.addClass('fixed').attr('style', '');
		} else {
			var articlePaddingTop = Number(articles.eq(1).css('padding-top').replace('px', ''));

			if( nav.hasClass('fixed') ) nav.removeClass('fixed').css('top', articlesWrapperHeight + articlePaddingTop - windowHeight + 'px');
		}
		sidebarAnimation =  false;
	}

	function changeUrl(link) {
		var pageArray = location.pathname.split('/'),
        	actualPage = pageArray[pageArray.length - 1] ;
        if( actualPage != link && history.pushState ) window.history.pushState({path: link},'',link);
	}

	function checkMQ() {
		return window.getComputedStyle(articlesWrapper.get(0), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "");
	}
});
 