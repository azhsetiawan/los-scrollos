/*
 *  Los Scrollos - v1.0.0
 *  Simple jQuery plugins for scrolling overflow content.
 *  https://github.com/azhsetiawan/los-scrollos
 *
 *  Azh Setiawan
 *  Under MIT License
 */
;( function( $, window, document, undefined ) {

	"use strict";

	if ( typeof undefined !== "undefined" ) {
		undefined = void 0;
	}

	var pluginName = "Scrollos",
			pluginNamespace = ".scrollos",
			defaults = {
				scrollTravelling: false,
				scrollDirection: "",
				scrollDistance: 100
			};

	function Plugin( element, options ) {
		this.element    = element;
		this.$element   = $( element );
		this.container  = this.$element.find( ".scrollos-container" )[ 0 ];
		this.$container = this.$element.find( ".scrollos-container" );
		this.content    = this.$element.find( ".scrollos-content" )[ 0 ];
		this.$content   = this.$element.find( ".scrollos-content" );

		this.settings = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	$.extend( Plugin.prototype, {
		init: function() {

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
			this.container.setAttribute(
				"data-overflowing",
				this.determineOverflow( this.container, this.content )
			);
		},

		clickHandler: function( container, content, scrollDirection ) {
			var _distance = this._defaults.scrollDistance;

			if ( this._defaults.scrollTravelling === true ) {
				return;
			}

			if ( this.determineOverflow( container, content ) !== "none" ) {

				if ( scrollDirection === "left" ) {

					var availableScrollLeft = container.scrollLeft;

					if ( availableScrollLeft > _distance * 1.5 ) {
						content.style.transform = "translateX(" + _distance + "px)";
					} else {
						content.style.transform = "translateX(" + availableScrollLeft + "px)";
					}
				}

				if ( scrollDirection === "right" ) {

					var contentRightEdge = content.getBoundingClientRect().right;
					var containerRightEdge = container.getBoundingClientRect().right;

					var availableScrollRight = Math.floor( contentRightEdge - containerRightEdge );

					if ( availableScrollRight > _distance * 1.5 ) {
						content.style.transform = "translateX(-" + _distance + "px)";
					} else {
						content.style.transform = "translateX(-" + availableScrollRight + "px)";
					}
				}

				content.classList.remove( "-no-transition" );

				this._defaults.scrollDirection = scrollDirection;
				this._defaults.scrollTravelling = true;
			}

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

		bindScroll: function() {
			var _this = this;

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

			void 0;
		},

		afterScroll: function() {
			var _this = this;

			_this.content.addEventListener( "transitionend", function() {

				var styleOfTransform = window.getComputedStyle( _this.content, null );
				var tr = styleOfTransform.getPropertyValue( "-webkit-transform" ) ||
								styleOfTransform.getPropertyValue( "transform" );

				var amount = Math.abs( parseInt( tr.split( "," )[ 4 ] ) || 0 );
				_this.content.style.transform = "none";
				_this.content.classList.add( "-no-transition" );

				if ( _this._defaults.scrollDirection === "left" ) {
					_this.container.scrollLeft = _this.container.scrollLeft - amount;
				} else {
					_this.container.scrollLeft = _this.container.scrollLeft + amount;
				}
				_this._defaults.scrollTravelling = false;
			}, false );
		}

	} );

	$.fn[ pluginName ] = function( options ) {
		return this.each( function() {
			if ( !$.data( this, "plugin_" + pluginName ) ) {
				$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
			}
		} );
	};

} )( jQuery, window, document );
