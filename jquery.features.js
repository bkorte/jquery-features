/*
Copyright (C) 2011 by BK I.T. Services (www.bkit.ca)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
(function($) {
	
	$.fn.features = function(options, param) {
				
		var opts = $.extend({}, $.fn.features.defaults, options);
		
		opts.parent = this;
		opts.$parent = $(this);

		if(opts.$parent.length < 1) {
			return false;
		}
		
		opts.change = function(opts, over) {

			if(typeof opts.beforeChange == 'function') { opts.beforeChange(opts); }

			opts.$links = opts.$parent.find(opts.links);
			opts.$features = opts.$parent.find(opts.images);
			
			clearTimeout(opts.timeout);

			if(over === undefined) {
				var i = 0;
				var total = opts.$links.find('li').length - 1;
				var current = 0;
				var next = 0;

				opts.$links.find('li').each(function(){
					if($(this).hasClass(opts.current))
						current = i;

					i++;
				});

				if(current != total)
					next = current + 1;

				over = $(opts.$links.find('li')[next]).find('a');
			}

			var $over = $(over);
			var id = $over.attr('class');
			var top = $over.parent().position().top;
			var $next_image = opts.$features.find('#'+id);
			var $current_image = opts.$features.find('.'+opts.current);

			if($over.parent().hasClass(opts.current))
				return false;

			opts.$features.stop(false, true);

			$current_image.fadeOut(function(){
				$current_image.removeClass(opts.current);

				$next_image.fadeIn(function(){
					$next_image.addClass(opts.current);
				});
			});

			$next_link = $over;
			$current_link = opts.$links.find('.'+opts.current+' a');
			
			$next_link.parent().addClass(opts.current);
			$current_link.parent().removeClass(opts.current);

			if(typeof opts.afterChange == 'function') { opts.afterChange(opts); }
			
			opts.timeout = setTimeout(function(){
				opts.change(opts);
			},opts.duration);

		}
			
		opts.$parent.find(opts.links).find('a').live('click touchstart', function(e){
			opts.change(opts, this);
			e.preventDefault();
		});
		
		opts.timeout = setTimeout(function(){opts.change(opts);}, opts.duration);

		if(typeof opts.onInit == 'function') { opts.onInit(opts); }
	};
	
	$.fn.features.defaults = {
		change: null,
		timeout: null,
		parent: null,
		duration: '5000',
		links: '#features-links',
		images: '#features-images',
		current: 'current',
		beforeChange: null,
		afterChange: null,
		onInit: null
	};
	
})(jQuery);