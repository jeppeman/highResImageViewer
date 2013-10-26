/** 
 *   ____________________________________________
 *  |                  TODO                      |
 *  | 1. Finish helper.                          |
 *  | 2. Clean this mess up. (!)                 |
 *  |____________________________________________|
 *
 */
(function ( $ ) {

	var methods = {
		init : function (_opts)
		{
			var instance = this;

			if (instance.data('instantiated'))
				return;

			instance.data('instantiated', true);

			var opts = {
				'automatic_add' 	 : true,
				'show_event_binding' : 'dblclick'
			};

			$.extend(opts, _opts);		

			// Initialize main DOM elements
			var $imageViewerWrapper = $('<div>').appendTo($('<div>', { 'class' : 'imageviewer_wrapper' }).appendTo($('body')).hide()),
			    $imageWrap          = $('<div>', { 'class' : 'imagewrap' }).appendTo($imageViewerWrapper),
			    $topbar             = $('<div>', { 'class' : 'topbar' }).appendTo($imageViewerWrapper),
			    $bottombar          = $('<div>', { 'class' : 'bottombar' }).appendTo($imageViewerWrapper),
			    $prev               = $('<a>',   { 'class' : 'previous', 'html' : '<i>' }).appendTo($imageViewerWrapper),
			    $next               = $('<a>',   { 'class' : 'next', 'html' : '<i>' }).appendTo($imageViewerWrapper),
			    $fileinfo           = $('<div>', { 'class' : 'fileinfo', 'html' : '<div class="icon" /><span class="filename"></span>' }).appendTo($topbar),
			    $extras             = $('<ul>',  { 'class' : 'extras' }).appendTo($topbar),
			    $close              = $('<div>', { 'class' : 'close_wrap', 'html' : '<div title="Stäng" class="close" />' }).appendTo($topbar);
			
			// Initialize DOM elements for helper
			var $helper             = $('<div>', { 'class' : 'zoomhelper_wrapper' }).appendTo($imageViewerWrapper).hide(),
			    $helperMainFrame    = $('<div>', { 'class' : 'zoomhelper'}).appendTo($helper),
			    $frameWrapper       = $('<div>', { 'class' : 'zoomhelper_framewrapper' }).appendTo($helperMainFrame),
			    $frame              = $('<div>', { 'class' : 'zoomhelper_frame' }).appendTo($helperMainFrame),
			    $toolbar            = $('<div>', { 'class' : 'zoomhelper_toolbar'}).appendTo($helperMainFrame),
			    $toolbar_minus      = $('<div>', { 'class' : 'icon-minus zoomhelper_toolbar_minus' }).appendTo($toolbar),
			    $toolbar_plus       = $('<div>', { 'class' : 'icon-plus zoomhelper_toolbar_plus' }).appendTo($toolbar);
			

			//======================================================//
			//                   FUNCTIONALITY                      //
			//======================================================//

			/**
			* Mousemove for the image, it will make sure the frame wrapper and frame
			* adjusts accordingly after the movement has been applied.
			*/
			function imageMouseMove (e)
			{
				var frameWrap            = instance.data('helper').find('.zoomhelper_framewrapper'),
				    frame                = instance.data('helper').find('.zoomhelper_frame'),
				    image                = instance.data('currentImage'),
				    originalHeight       = image.data('originalHeight'),
				    originalWidth        = image.data('originalWidth'),
				    helperOriginalHeight = image.data('helperOriginalHeight'),
				    helperOriginalWidth  = image.data('helperOriginalWidth'),
				    imageLeft            = parseInt($(this).css('left').split('px')[0]),
				    imageTop             = parseInt($(this).css('top').split('px')[0]);

				if ($(this).hasClass('mousedown'))
				{
					if (imageLeft - (mousePosX - e.pageX) <= 0 && 
						imageLeft - (mousePosX - e.pageX) >= $imageWrap.width()-$(this).width())
					{
						$(this).css('left', imageLeft - (mousePosX - e.pageX));
						frame.css('left', -(imageLeft - (mousePosX - e.pageX))*(helperOriginalWidth/originalWidth)+2);
						frameWrap.css({
							'border-left-width' : -(imageLeft - (mousePosX - e.pageX))*(helperOriginalWidth/originalWidth),
							'border-right-width' : helperOriginalWidth-((-(imageLeft - (mousePosX - e.pageX))*(helperOriginalWidth/originalWidth))+frame.width())+2
						});
					}
					if (imageTop - (mousePosY - e.pageY) <= 0 && 
						imageTop - (mousePosY - e.pageY) >= $imageWrap.height()-$(this).height())
					{
						$(this).css('top', imageTop - (mousePosY - e.pageY));
						frame.css('top', -(imageTop - (mousePosY - e.pageY))*(helperOriginalHeight/originalHeight)+20)
						frameWrap.css({
							'border-top-width' : -(imageTop - (mousePosY - e.pageY))*(helperOriginalHeight/originalHeight),
							'border-bottom-width' : helperOriginalHeight-((-(imageTop - (mousePosY - e.pageY))*(helperOriginalHeight/originalHeight))+frame.height())
						});
					}

					mousePosX = e.pageX;
					mousePosY = e.pageY;
				}
			}

			/**
			* Mousemove for the helper frame, it will make sure the frame wrapper and main image
			* adjusts accordingly after the movement has been applied.
			*/
			function frameMouseMove (e)
			{
				var frameWrap               = instance.data('helper').find('.zoomhelper_framewrapper'),
				    image                   = instance.data('currentImage'),
				    originalHeight          = image.data('originalHeight'),
				    originalWidth           = image.data('originalWidth'),
				    helperOriginalHeight    = image.data('helperOriginalHeight'),
				    helperOriginalWidth     = image.data('helperOriginalWidth'),
				    frameWrapLeftBorder     = parseInt(frameWrap.css('border-left-width').split('px')[0]),
				    frameWrapRightBorder    = parseInt(frameWrap.css('border-right-width').split('px')[0]),
				    frameWrapTopBorder      = parseInt(frameWrap.css('border-top-width').split('px')[0]),
				    frameWrapBottomBorder   = parseInt(frameWrap.css('border-bottom-width').split('px')[0]),
				    frameLeft               = parseInt($(this).css('left').split('px')[0]),
				    frameTop                = parseInt($(this).css('top').split('px')[0]),
				    imageLeft               = parseInt(image.css('left').split('px')[0]),
				    imageTop                = parseInt(image.css('top').split('px')[0]);

				if ($(this).hasClass('mousedown'))
				{
					if (frameLeft - (mousePosX - e.pageX) >= 2 && 
						frameLeft - (mousePosX - e.pageX) <= helperOriginalWidth-$(this).width())
					{
						$(this).css('left', frameLeft - (mousePosX - e.pageX));
						frameWrap.css({
							'border-left-width' : frameWrapLeftBorder - (mousePosX - e.pageX),
							'border-right-width' : frameWrapRightBorder + (mousePosX - e.pageX)
						});
						if (imageLeft + (mousePosX - e.pageX)*(originalWidth/helperOriginalWidth) > 0)
							image.css('left', 0);
						else
							image.css('left', imageLeft + (mousePosX - e.pageX)*(originalWidth/helperOriginalWidth));
					}
					if (frameTop - (mousePosY - e.pageY) >= 20 && 
						frameTop - (mousePosY - e.pageY) <= helperOriginalHeight-$(this).height()+18)
					{
						$(this).css('top', frameTop - (mousePosY - e.pageY));
						frameWrap.css({
							'border-top-width' : frameWrapTopBorder - (mousePosY - e.pageY),
							'border-bottom-width' : frameWrapBottomBorder + (mousePosY - e.pageY)
						});
						if (imageTop + (mousePosY - e.pageY)*(originalHeight/helperOriginalHeight) > 0)
							image.css('top', 0);
						else
							image.css('top', imageTop + (mousePosY - e.pageY)*(originalHeight/helperOriginalHeight));
					}

					mousePosX = e.pageX;
					mousePosY = e.pageY;
				}
			}

			/**
			* Mousedown function for helper frame as well as main image.
			*/
			function mouseDown (e)
			{
				$(this).addClass('mousedown');
				mousePosX = e.pageX;
				mousePosY = e.pageY;
			}

			/**
			* Mouseup function for helper frame as well as main image.
			*/
			function mouseUp (e)
			{
				$(this).removeClass('mousedown');
			}

			/**
			* Handler for the zooming-functionality, does different stuff depending on whether
			* firefox or chrome (or some other browser?) is being used. The zooming functionality
			* is available for images with resolutions higher than the current screen resolution.
			* So you have the option to "zoom" it if you want to see a specific part of the image
			*/
			function handler(e) 
			{
				var delta = (browser == 'firefox' ? e.originalEvent.detail : e.originalEvent.wheelDelta);
				if((delta <= 0 && browser != 'firefox') || (delta > 0 && browser == 'firefox')) 
				{
					zoomOut(zoomValues(1)[0], zoomValues(1)[1]);
				}
				else if ((delta > 0 && browser != 'firefox') || (delta <= 0 && browser == 'firefox'))
				{				         
					zoomIn(zoomValues(0)[0], zoomValues(0)[1])
				}
			}

			/**
			* Determines which values to use for the zooming
			*/
			function zoomValues(val)
			{
				var image           = instance.data('currentImage'),
				    maxHeight       = image.data('maxHeight'),
				    maxWidth        = image.data('maxWidth'),
				    minHeight       = image.data('minHeight'),
				    minWidth        = image.data('minWidth'),
				    animationHeight = image.data('animationHeight'),
				    animationWidth  = image.data('animationWidth');

				if (val > 0)
				{
					if (image.height() > minHeight && image.width() > minWidth)
					{		
						if (minHeight-image.height() > -animationHeight && minWidth-image.width() > -animationWidth)
						{
							return [minHeight-image.height(), minWidth-image.width()];
						}
						else if (minHeight-image.height() > -animationHeight && minWidth-image.width() <= -animationWidth)
						{
							return [minHeight-image.height(), -animationWidth];
						}
						else if (minHeight-image.height() <= animationHeight && minWidth-image.width() > -animationWidth)
						{
							return [-animationHeight, minWidth-image.width()]
						}
						else
						{
							return [-animationHeight, -animationWidth];
						}
					}
				}
				else
				{
					if (image.height() < maxHeight && image.width() < maxWidth)
					{		
						if (maxHeight-image.height() < animationHeight && maxWidth-image.width() < animationWidth)
						{
							return [maxHeight-image.height(), maxWidth-image.width()];
						}
						else if (maxHeight-image.height() < animationHeight && maxWidth-image.width() >= animationWidth)
						{
							return [maxHeight-image.height(), animationWidth];
						}
						else if (maxHeight-image.height() >= animationHeight && maxWidth-image.width() < animationWidth)
						{
							return [animationHeight, maxWidth-image.width()];
						}
						else
						{
							return [animationHeight, animationWidth];
						}
					}
				}

				return [undefined, undefined];
			}

			/**
			* This function obviously zooms in
			*/
			function zoomIn(imageHeightAdder, imageWidthAdder) 
			{
				if (typeof(imageHeightAdder) == undefined || typeof(imageWidthAdder) == undefined) return;

				var imageAnimateOpts        = {}, 
				    imageParentAnimateOpts  = {}, 
				    frameAnimateOpts        = {},
				    borderDimensions        = {},
				    image                   = instance.data('currentImage'),
				    hiddenAreas             = image.data('hiddenAreas'),
				    helperImage             = image.data('helperImage'),
				    originalHeight          = image.data('originalHeight'),
				    originalWidth           = image.data('originalWidth'),
				    helperOriginalHeight    = image.data('helperOriginalHeight'),
				    helperOriginalWidth     = image.data('helperOriginalWidth'),
				    frame                   = instance.data('helper').find('.zoomhelper_frame'),
				    frameWrap               = instance.data('helper').find('.zoomhelper_framewrapper'),
				    imageWrapMaxHeight      = parseInt(instance.data('imageWrap').css('max-height').split('px')[0]);

				if (image.height()+imageHeightAdder < imageWrapMaxHeight && image.width()+imageWidthAdder < $(window).width()*0.98) {
					imageAnimateOpts = {
						'height': image.height()+imageHeightAdder,
						'width' : image.width()+imageWidthAdder,
						'top' : 0,
						'left' : 0 
					};
					imageParentAnimateOpts = {
						'width' : image.width()+imageWidthAdder,
						'height' : image.height()+imageHeightAdder
					};
					image.css('cursor', 'auto');
				}
				else if (image.height()+imageHeightAdder > imageWrapMaxHeight && image.width()+imageWidthAdder > $(window).width()*0.98) {
					imageAnimateOpts = {
						'height': image.height()+imageHeightAdder,
						'width' : image.width()+imageWidthAdder,
						'left' : -(image.width()+imageWidthAdder - $(window).width()*0.98)/2,
						'top' :  -(image.height()+imageHeightAdder - imageWrapMaxHeight)/2
					};
					imageParentAnimateOpts = {
						'width' : $(window).width()*0.98,
						'height' : imageWrapMaxHeight
					};
					image.css('cursor', 'move');
				}		
				else if (image.height()+imageHeightAdder > imageWrapMaxHeight && image.width()+imageWidthAdder < $(window).width()*0.98) {
					imageAnimateOpts = {
						'height': image.height()+imageHeightAdder,
						'width' : image.width()+imageWidthAdder,
						'top' : -(image.height()+imageHeightAdder - imageWrapMaxHeight)/2,
						'left' : 0,
					};
					imageParentAnimateOpts = {
						'width' : image.width()+imageWidthAdder,
						'height' : imageWrapMaxHeight
					};
					image.css('cursor', 'move');
				}
				else if (image.height()+imageHeightAdder < imageWrapMaxHeight && image.width()+imageWidthAdder > $(window).width()*0.98) {
					imageAnimateOpts = {
						'height': image.height()+imageHeightAdder,
						'width' : image.width()+imageWidthAdder,
						'left' : -(image.width()+imageWidthAdder - $(window).width()*0.98)/2,
						'top' : 0,
					};
					imageParentAnimateOpts = {
						'height': image.height()+imageHeightAdder,
						'width' : $(window).width()*0.98
					};
					image.css('cursor', 'move');		
				}

				// The areas of the image which are currently not visible, used to determine the correct size of the helper frame
				hiddenAreas[0] = (imageAnimateOpts.width ? imageAnimateOpts.width : image.width())-(imageParentAnimateOpts.width ? imageParentAnimateOpts.width : $imageWrap.width());
				hiddenAreas[1] = (imageAnimateOpts.height ? imageAnimateOpts.height : image.height())-(imageParentAnimateOpts.height ? imageParentAnimateOpts.height: $imageWrap.height());

				frameAnimateOpts = {
					'width' : (helperOriginalWidth-hiddenAreas[0]*(helperImage.width()/originalWidth))-2,
					'height' : (helperOriginalHeight-hiddenAreas[1]*(helperImage.height()/originalHeight))-2,
					'top' : -imageAnimateOpts.top*(helperImage.height()/originalHeight)+20,
					'left' : -imageAnimateOpts.left*(helperImage.width()/originalWidth)+2
				};

				borderDimensions = {
					'left' : frameAnimateOpts.left-1,
					'top' : frameAnimateOpts.top-19,
					'bottom' : helperOriginalHeight-(frameAnimateOpts.top+frameAnimateOpts.height)+23,
					'right' : helperOriginalWidth-(frameAnimateOpts.left+frameAnimateOpts.width)+5
				}

				frame.stop().animate(frameAnimateOpts);

				frameWrap.stop().animate({	
					'height' : frameAnimateOpts.height+1,
					'width' : frameAnimateOpts.width,			
					'border-left-width' : borderDimensions.left+'px',
					'border-top-width' : borderDimensions.top+'px',
					'border-right-width' : borderDimensions.right+'px',
					'border-bottom-width' : borderDimensions.bottom+'px'
				});

				image.parent('div').stop().animate(imageParentAnimateOpts);
				
				image.stop().animate(imageAnimateOpts);		
			}

			/**
			* This function obviously zooms out
			*/
			function zoomOut(imageHeightAdder, imageWidthAdder)
			{
				if (typeof(imageHeightAdder) == undefined || typeof(imageWidthAdder) == undefined) return;

				var imageAnimateOpts        = {}, 
				    imageParentAnimateOpts  = {}, 
				    frameAnimateOpts        = {},
				    borderDimensions        = {},
				    image                   = instance.data('currentImage'),
				    hiddenAreas             = image.data('hiddenAreas'),
				    helperImage             = image.data('helperImage'),
				    originalHeight          = image.data('originalHeight'),
				    originalWidth           = image.data('originalWidth'),
				    helperOriginalHeight    = image.data('helperOriginalHeight'),
				    helperOriginalWidth     = image.data('helperOriginalWidth'),
				    frame                   = instance.data('helper').find('.zoomhelper_frame'),
				    frameWrap               = instance.data('helper').find('.zoomhelper_framewrapper'),
				    imageWrapMaxHeight      = parseInt(instance.data('imageWrap').css('max-height').split('px')[0]);

				if (image.height()+imageHeightAdder < imageWrapMaxHeight && image.width()+imageWidthAdder < $(window).width()*0.98) {
					imageAnimateOpts = {
						'height': image.height()+imageHeightAdder,
						'width' : image.width()+imageWidthAdder,
						'top' : 0,
						'left' : 0 
					};
					imageParentAnimateOpts = {
						'width' : image.width()+imageWidthAdder,
						'height' : image.height()+imageHeightAdder
					};
					image.css('cursor', 'auto');
				}
				else if (image.height()+imageHeightAdder > imageWrapMaxHeight && image.width()+imageWidthAdder > $(window).width()*0.98) {
					imageAnimateOpts = {
						'height': image.height()+imageHeightAdder,
						'width' : image.width()+imageWidthAdder,
						'left' : -(image.width()+imageWidthAdder - $imageWrap.width())/2,
						'top' :  -(image.height()+imageHeightAdder - $imageWrap.height())/2
					};
					image.css('cursor', 'move');
				}				
				else if (image.height()+imageHeightAdder > imageWrapMaxHeight && image.width()+imageWidthAdder < $(window).width()*0.98) {
					imageAnimateOpts = {
						'height': image.height()+imageHeightAdder,
						'width' : image.width()+imageWidthAdder,
						'top' : -(image.height()+imageHeightAdder - $imageWrap.height())/2,
						'left' : 0,
					};
					imageParentAnimateOpts = {
						'width' : image.width()+imageWidthAdder
					};
					image.css('cursor', 'move');
				}
				else if (image.height()+imageHeightAdder < imageWrapMaxHeight && image.width()+imageWidthAdder > $(window).width()*0.98) {
					imageAnimateOpts = {
						'height': image.height()+imageHeightAdder,
						'width' : image.width()+imageWidthAdder,
						'left' : -(image.width()+imageWidthAdder - $imageWrap.width())/2,
						'top' : 0,
					};
					imageParentAnimateOpts = {
						'height': image.height()+imageHeightAdder
					};
					image.css('cursor', 'move');	
				}

				// The areas of the image which are currently not visible, used to determine the correct size of the helper frame
				hiddenAreas[0] = (imageAnimateOpts.width ? imageAnimateOpts.width : image.width())-(imageParentAnimateOpts.width ? imageParentAnimateOpts.width : $imageWrap.width());
				hiddenAreas[1] = (imageAnimateOpts.height ? imageAnimateOpts.height : image.height())-(imageParentAnimateOpts.height ? imageParentAnimateOpts.height: $imageWrap.height());

				frameAnimateOpts = {
					'width' : (helperOriginalWidth-hiddenAreas[0]*(helperImage.width()/originalWidth))-2,
					'height' : (helperOriginalHeight-hiddenAreas[1]*(helperImage.height()/originalHeight))-2,
					'top' : -imageAnimateOpts.top*(helperImage.height()/originalHeight)+20,
					'left' : -imageAnimateOpts.left*(helperImage.width()/originalWidth)+2
				};

				borderDimensions = {
					'left' : frameAnimateOpts.left-1,
					'top' : frameAnimateOpts.top-19,
					'bottom' : helperOriginalHeight-(frameAnimateOpts.top+frameAnimateOpts.height)+23,
					'right' : helperOriginalWidth-(frameAnimateOpts.left+frameAnimateOpts.width)+5
				};

				frame.stop().animate(frameAnimateOpts);

				frameWrap.stop().animate({	
					'height' : frameAnimateOpts.height+1,
					'width' : frameAnimateOpts.width,			
					'border-left-width' : borderDimensions.left+'px',
					'border-top-width' : borderDimensions.top+'px',
					'border-right-width' : borderDimensions.right+'px',
					'border-bottom-width' : borderDimensions.bottom+'px'
				});
										
				image.parent('div').stop().animate(imageParentAnimateOpts);

				image.stop().animate(imageAnimateOpts);	
			}

			function minusClick() 
			{
				zoomOut(zoomValues(1)[0], zoomValues(1)[1]);
			}

			function plusClick()
			{
				zoomIn(zoomValues(0)[0], zoomValues(0)[1]);	
			}

			function next()
			{
				methods.next.apply(instance);
			}

			function prev()
			{
				methods.prev.apply(instance);
			}

			function show()
			{
				methods.show.apply(instance);
			}

			function hide()
			{
				methods.hide.apply(instance);
			}

			function keyDownHandler (e)
			{
				e.stopPropagation();
				instance.data('keydown_bound', true);

				switch (e.keyCode) {
					case 27:
						hide();
					break;
					case 39:
						next();
					break;
					case 37:
						prev();
					break;
				}
			}

			// Globalize some stuff
			instance.data({
				'opts'                  : opts,
				'mousedown'             : mouseDown,
				'mouseup'               : mouseUp,
				'handler'               : handler,
				'keydown_bound'         : false,
				'imageMouseMove'        : imageMouseMove,
				'keyDownHandler'        : keyDownHandler,
				'image_collection'      : [],
				'imageViewerWrapper'    : $imageViewerWrapper,
				'prev'                  : $prev,
				'next'                  : $next,
				'imageWrap'             : $imageWrap,
				'helper'                : $helper,
				'topbar'                : $topbar,
				'frame'                 : $frame,
				'frameWrapper'          : $frameWrapper
			});

			// Add images already contained in the applied element if automatic_add is set to true
			if (opts.automatic_add)
			{
				$.each(instance.find('img'), function (i, img) {
					if (img.complete)
						methods.addImage.apply(instance, [ { "img" : img } ]);
					else
						$(img).load(function () { methods.addImage.apply(instance, [ { "img" : img } ]); });
				});
			}

			//======================================================//
			//                      BINDINGS					    //
			//======================================================//
			
			$next.on('click', next);
			$prev.on('click', prev);
			$close.on('click', '.close', hide);

			$toolbar_minus.on('click', minusClick);
			$toolbar_plus.on('click', plusClick);

			$frame.on('mousedown', mouseDown);
			$frame.on('mouseup', mouseUp);
			$frame.on('mousemove', frameMouseMove);
			$frame.bind('dragstart', function(e) { return false; });
		},
		// Show dem titties, made this global in case the user wants to bind the showing of the viewer to a different event than doubleclick.
		show : function (opts)
		{
			var img 	 = opts.img,	
				filename = opts.filename,
				instance = this;

			if (!instance.data('imageViewerWrapper').is(':visible')) {
				instance.data('imageViewerWrapper').parent('div').fadeIn(500);

				// Scale down site contents
				var $bc = $('body').children(':not(.imageviewer_wrapper, .zoomhelper_wrapper)');
				$('body')
					.append(
						$('<div>', {
							'id' : 'abyss-wrapper'
						}).append($bc).addClass('abyssed')
					);

				$('body').css('overflow-y', 'hidden');
			}

			if (!instance.data('keydown_bound'))
				$('body').on('keydown.sexyimageviewer', instance.data('keyDownHandler')); 

			instance.data('topbar').find('.extras').empty();

			opts.cb_show();

			if (instance.data('image_collection').length > 1) {
				instance.data('prev').show();
				instance.data('next').show();
			}
			else {
				instance.data('prev').hide();
				instance.data('next').hide();
			}

			// Reset helper stuff			
			if (instance.data('helper')) {
				instance.data('helper').find('.zoomhelper img').hide();
				instance.data('helper').show();
				instance.data('frame').css({'left': '2px', 'top' : '20px'});
				instance.data('frameWrapper').css('border-width', 0);
			}

			instance.data('topbar').find('.filename').html((filename ? filename : img.attr('src').substr(img.attr('src').lastIndexOf('/')+1)));
			// very temporary
			instance.data('topbar').find('.file_extra_info').empty();
				
			// Set heights and widths to the image and give it all the necessary zooming functionality
			if (img.data('maxHeight') > $(window).height()-100 || img.data('maxWidth') > $(window).width()*0.95)
			{
				// If the height and/or width of the image is larger than the window height/width
				// the helper is shown and sizing adjustments are applied to the image.
				img.data('minHeight', img.data('originalHeight')*(($(window).height()-120)/img.data('originalHeight')));
				img.data('minWidth', img.data('originalWidth')*(($(window).height()-120)/img.data('originalHeight')));
				if (img.data('maxHeight') >= img.data('maxWidth'))
				{
					img.data('helperImage').height(200);
					img.data('helperImage').width(img.data('maxWidth')*(200/img.data('maxHeight')));
					img.data('helperOriginalHeight', 200);
					img.data('helperOriginalWidth', img.data('maxWidth')*(200/img.data('maxHeight')));
					instance.data('frame').height(198);
					instance.data('frame').width(img.data('maxWidth')*(200/img.data('maxHeight'))-2);
					instance.data('frameWrapper')
						.height(200)
						.width(img.data('maxWidth')*(200/img.data('maxHeight')));
				}
				else
				{
					img.data('helperImage').width(200);
					img.data('helperImage').height(img.data('maxHeight')*(200/img.data('maxWidth')));
					img.data('helperOriginalWidth', 200);
					img.data('helperOriginalHeight', img.data('maxHeight')*(200/img.data('maxWidth')));
					instance.data('frame').width(198);
					instance.data('frame').height(img.data('maxHeight')*(200/img.data('maxWidth'))-2);
					instance.data('frameWrapper')
						.width(200)
						.height(img.data('maxHeight')*(200/img.data('maxWidth')));
				}
			}
			else
			{
				// The image gets its normal size otherwise.
				img.data('minHeight', img.data('originalHeight'));
				img.data('minWidth', img.data('originalWidth'));
			}

			instance.data('imageWrap').css({ 
				'min-height': img.data('minHeight'), 
				'height' : img.data('minHeight'), 
				'max-height' : $(window).height()-100,
				'min-width' : img.data('minWidth'), 
				'width' : img.data('minWidth') 
			});

			img.siblings().hide();

			img.show().css({'height' : '100%', 'width' : '100%', 'left' : 0, 'top' : 0 });

			if (img.data('helperImage'))
				img.data('helperImage').show();

			instance.data('currentImage', img);
		},
		// Hide the current viewer
		hide : function (opts)
		{	
			var instance = this;

			var abyss = $('body').find('#abyss-wrapper').removeClass('abyssed');

			instance.data('keydown_bound', false);

			$('body').unbind('keydown.sexyimageviewer');
			
			setTimeout(function () {
				abyss.children().unwrap();
				$('body').css('overflow-y', 'auto');
			},250);

			instance.data('helper').find('.zoomhelper_frame').css({'left': '2px', 'top' : '20px'});	
			instance.data('helper').find('.zoomhelper_framewrapper').css('border-width', 0);
			instance.data('helper').hide();
			instance.data('imageViewerWrapper').parent().fadeOut(500);
		},
		// Append an element to the top bar, this is sort of stupid and temporary
		appendToTopbar : function (item) 
		{
			var instance = this;

			instance.data('topbar').find('.extras').append('<li>'+item+'</li>');
		},
		// TODO
		appendToBottomBar : function () 
		{

		},
		// Add an image to the collection of the current instance
		addImage : function (_opts)
		{
			var opts = {
				cb_show : function () { }
			};

			$.extend(opts, _opts);

			var instance = this,
				imageCollection = instance.data('image_collection'),
				$img = $('<img>');

			$img	
				.load(function () {
					var self = this;
					$(self).data({
						'maxHeight'         : this.height,
						'maxWidth'          : this.width,
						'originalHeight'    : this.height,
						'originalWidth'     : this.width,
						'animationWidth'    : this.width*0.3,
						'animationHeight'   : this.height*0.3,
						'hiddenAreas'       : [0, 0]
					});

					if ($(self).data('maxHeight') > $(window).height()-100 || $(self).data('maxWidth') > $(window).width()*0.95)
					{
						$(self).data('helperImage', $('<img>').load(function () { 	
							instance.data('imageWrap').removeClass('loading');	
							$(this).appendTo(instance.data('helper').find('.zoomhelper')).hide();
						}).attr('src', $(self).attr('src')));
					}

					$(this).attr('data-image-index', imageCollection.length);
					imageCollection.push({ 'img' : $img, 'filename' : opts.filename, 'cb_show' : opts.cb_show });

					$(opts.img).on(instance.data('opts')['show_event_binding'], function () {
						methods.show.apply(instance, [ imageCollection[$img.data('image-index')] ]);
					});
				})
				.appendTo(instance.data('imageWrap'))
				.attr('src',                opts.alt_src ? opts.alt_src : $(opts.img).attr('src'))
				.bind('dragstart',          function (e) { return false; }) // remove the default drag that firefox (and possibly other browsers?) applies.
				.on('DOMMouseScroll',       instance.data('handler'))       // firefox
				.on('mousewheel',           instance.data('handler'))       // chrome (and others?)
				.on('mousedown',            instance.data('mousedown'))
				.on('mouseup',              instance.data('mouseup'))
				.on('mousemove',            instance.data('imageMouseMove'))			
				.hide();
		},
		getEventBinding : function ()
		{
			var instance = this;

			return instance.data('opts')['show_event_binding'];
		},
		// TODO
		removeImage : function ()
		{

		},
		// Reset the image collection of the current instance
		resetCollection : function ()
		{
			var instance = this;

			$.each(instance.data('image_collection'), function(i, v) {
				v.img.remove();
			});

			instance.data('image_collection', []);
		},
		// View the next image in the colletion of the current instance
		next : function ()
		{
			var instance = this,
				imageCollection = instance.data('image_collection'),
				currentImageIndex = instance.data('currentImage').data('image-index'); 

			if (currentImageIndex+1 == imageCollection.length)
				methods.show.apply(instance, [ imageCollection[0] ]);
			else
				methods.show.apply(instance, [ imageCollection[currentImageIndex+1] ]);
		},
		// View the previous image in the collection of the current instance
		prev : function ()
		{
			var instance = this,
				imageCollection = instance.data('image_collection'),
				currentImageIndex = instance.data('currentImage').data('image-index'); 

			if (currentImageIndex-1 < 0)
				methods.show.apply(instance, [ imageCollection[imageCollection.length-1] ]);
			else
				methods.show.apply(instance, [ imageCollection[currentImageIndex-1] ]);
		}
	}

	$.fn.sexyImageViewer = function (method)
	{
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		}
		else {
			$.error("Method " + method + " does not exist on Scoutledaren Bosse's plugin");
		}    
	}
})(jQuery);

var browser = (function() {
 	if (navigator.userAgent) {
 		if (String.prototype.match) {
				// Use match()
				
				var n = navigator.userAgent.split(" ");
				if (n[n.length - 1].match("Firefox/*")) return "firefox";
				else if (n[n.length - 1].match("Chrome/*")) return "chrome";
				else if (n[n.length - 2].match("Chrome/*")) return "chrome";
				else if (n[n.length - 1].match("Safari/*")) return "safari";
				else if (navigator.userAgent.match("MSIE 9.*")) return "ie9";
			}
			
			var n = navigator.userAgent.split("(")[1].split(")")[0].split(";");
			for (var i = 0; i < n.length; i++) {
				if (n[i] == " MSIE 8.0" || n[i] == "MSIE 8.0") return "ie8";
				else if (n[i] == " MSIE 7.0" || n[i] == "MSIE 7.0") return "ie7";
				else if (n[i] == " MSIE 6.0" || n[i] == "MSIE 6.0") return "ie6";
			}
		}
		
		return "unknown";
	})();