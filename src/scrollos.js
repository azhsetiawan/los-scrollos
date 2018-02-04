// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;( function( $, window, document, undefined ) {

	"use strict";

	// undefined is used here as the undefined global variable in ECMAScript 3 is
	// mutable (ie. it can be changed by someone else). undefined isn't really being
	// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
	// can no longer be modified.

	// window and document are passed through as local variables rather than global
	// as this (slightly) quickens the resolution process and can be more efficiently
	// minified (especially when both are regularly referenced in your plugin).

	// Create the defaults once
	var pluginName = "Scrollos",
			pluginNamespace = ".scrollos",
			defaults = {
				scrollTravelling: false,
				scrollDirection: "",
				scrollDistance: 212,
				wrapperHeight: "auto"
			};

	// The actual plugin constructor
	function Plugin ( element, options ) {
		this.element    = element;
		this.$element   = $( element );
		this.container  = this.$element.find( ".scrollos-container" )[ 0 ];
		this.$container = this.$element.find( ".scrollos-container" );
		this.content    = this.$element.find( ".scrollos-content" )[ 0 ];
		this.$content   = this.$element.find( ".scrollos-content" );

		// jQuery has an extend method which merges the contents of two or
		// more objects, storing the result in the first object. The first object
		// is generally empty as we don't want to alter the default options for
		// future instances of the plugin
		this.settings = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	// Avoid Plugin.prototype conflicts
	$.extend( Plugin.prototype, {
		init: function() {
			// if ( this.settings.wrapperHeight === "auto" ) {
			// 	var wrapHeight = this.$content.children().first().outerHeight();
			// 	this.$element.css( "height", wrapHeight );
			// }

			// Place initialization logic here
			// You already have access to the DOM element and the options via the instance,
			// e.g. this.element and this.settings
			this.updateOverflow();
			this.bindScroll();
			this.bindClick();
			this.afterScroll();
		},

		getClientRect: function( el ) {
			var clientRect = {},
					$el = $( el );
			clientRect.left = $el.offset().left;
			clientRect.right = $el.offset().left + $el.outerWidth();
			return clientRect;
		},

		determineOverflow: function( container, content ) {
			var containerRect = this.getClientRect( container );
			var containerRectRight = Math.floor( containerRect.right );
			var containerRectLeft = Math.floor( containerRect.left );
			var contentRect = this.getClientRect( content );
			var contentRectRight = Math.floor( contentRect.right );
			var contentRectLeft = Math.floor( contentRect.left );
			if ( containerRectLeft > contentRectLeft && containerRectRight < contentRectRight ) {
				return "both";
			} else if ( contentRectLeft < containerRectLeft ) {
				return "left";
			} else if ( contentRectRight > containerRectRight ) {
				return "right";
			} else {
				return "none";
			}
		},

		updateOverflow: function() {

			// More: https://caniuse.com/#search=setAttribute
			this.container.setAttribute(
				"data-overflowing",
				this.determineOverflow( this.container, this.content )
			);
		},

		clickHandler: function( container, content, scrollDirection ) {
			var _distance = this._defaults.scrollDistance;

			// If in the middle of a move return
			if ( this._defaults.scrollTravelling === true ) { return; }

			// If we have content overflowing both sides or on the one side
			if ( this.determineOverflow( container, content ) !== "none" ) {

				if ( scrollDirection === "left" ) {

					// Find how far this panel has been scrolled
					var availableScrollLeft = container.scrollLeft;

					// If the space available is less than one half of distance settings,
					// just move the whole space
					// otherwise, move by distance settings
					if ( availableScrollLeft > _distance * 1.5 ) {
						content.style.transform = "translateX(" + _distance + "px)";
					} else {
						content.style.transform = "translateX(" + availableScrollLeft + "px)";
					}
				}

				if ( scrollDirection === "right" ) {

					// Get the right edge of the container and content
					var contentRightEdge = content.getBoundingClientRect().right;
					var containerRightEdge = container.getBoundingClientRect().right;

					// Now we know how much space we have available to scroll
					var availableScrollRight = Math.floor( contentRightEdge - containerRightEdge );

					// If the space available is less than one half of distance settings,
					// just move the whole space
					// otherwise, move by distance settings
					if ( availableScrollRight > _distance * 1.5 ) {
						content.style.transform = "translateX(-" + _distance + "px)";
					} else {
						content.style.transform = "translateX(-" + availableScrollRight + "px)";
					}
				}

				// Make CSS transition when moving so remove the class that would prevent that
				content.classList.remove( "-no-transition" );

				// Update our settings
				this._defaults.scrollDirection = scrollDirection;
				this._defaults.scrollTravelling = true;
			}

			// Now update data attribute in the DOM
			this.updateOverflow();
		},

		bindClick: function() {
			var _this = this;

			_this.$element.on( "click" + pluginNamespace, ".scrollos-prev", function() {
				_this.clickHandler.call( _this, _this.container, _this.content, "left" );
			} );

			_this.$element.on( "click" + pluginNamespace, ".scrollos-next", function() {
				_this.clickHandler.call( _this, _this.container, _this.content, "right" );
			} );
		},

		// Alright, partner! keep on scrollin', baby! you know what time is it?
		// Keep scrollin' scrollin' scrollin' scrollin' (yeah!)
		bindScroll: function() {
			var _this = this;

			// Handle the scroll of the horizontal container
			var ticking = false;

			_this.$container.on( "scroll" + pluginNamespace, function() {
				if ( !ticking ) {
					window.requestAnimationFrame( function() {
						_this.updateOverflow.call( _this );
						ticking = false;
					} );
				}
				ticking = true;
			} );

			console.log( "bind scroll" );
		},

		afterScroll: function() {
			var _this = this;

			_this.content.addEventListener( "transitionend", function() {

				// get the value of the transform, apply that to the current scroll position
				// (so get the scroll pos first) and then remove the transform
				var styleOfTransform = window.getComputedStyle( _this.content, null );
				var tr = styleOfTransform.getPropertyValue( "-webkit-transform" ) ||
								 styleOfTransform.getPropertyValue( "transform" );

				// If there is no transition we want to default to 0 and not null
				var amount = Math.abs( parseInt( tr.split( "," )[ 4 ] ) || 0 );
				_this.content.style.transform = "none";
				_this.content.classList.add( "-no-transition" );

				// Now lets set the scroll position
				if ( _this._defaults.scrollDirection === "left" ) {
					_this.container.scrollLeft = _this.container.scrollLeft - amount;
				} else {
					_this.container.scrollLeft = _this.container.scrollLeft + amount;
				}
				_this._defaults.scrollTravelling = false;
			}, false );
		}

	} );

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[ pluginName ] = function( options ) {
		return this.each( function() {
			if ( !$.data( this, "plugin_" + pluginName ) ) {
				$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
			}
		} );
	};

} )( jQuery, window, document );
