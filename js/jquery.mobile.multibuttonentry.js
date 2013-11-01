( function ( $, document, window, undefined ) {
	$.widget( "mobile.multibuttonentry", $.mobile.widget, {
		options : {
			label : "Test : ",
			initSelector : ":jqmData(role='multibuttonentry')"
		},
		_minInputWidth : 50,
		_maxInputWidthRate : 0.6,
		_focusState : true,

		_create : function () {
			var self = this,
				$view = this.element, // jQuery
				$inputbox = $( document.createElement( "input" ) ),
				$label = $( document.createElement( "label" ) ),
				$addressBtn = $( document.createElement( "a" ) ).text( "+" );

			$label.addClass( "ui-label" );
			$addressBtn.attr( { "href": "#addressbook", "data-transition": "slideup" } ).addClass( "ui-address");

			$view.append( $label ).append( $inputbox ).append( $addressBtn ).addClass( "ui-multibuttonentry" );

			$inputbox.addClass( "ui-input" ).on( "keyup", function ( event ) {
				event.preventDefault();
				if ( event.keyCode === 13 ) { // enter
					self._addTextBtn( $( this ).val() );
					$inputbox.val( null );
				} else if( event.keyCode === 8 || event.keyCode === 46 ) {
					if ( self.inputText() === null ) {
						self._removeTextBtn();
					}
				}
				self._resizeInputBox();
			});

			$view.delegate( ".ui-textbtn, .ui-textbtn-focusout, .ui-label", "keyup click", function ( event ) {
				event.preventDefault();
				if ( !self._focusState ) {
					self.focusIn();
					return false;
				}
				if( event.keyCode === 46 ) {
					self._removeTextBtn();
				} else if ( event.type === "click" ) {
					self.select( $( this ).index() - 1 );
				}
			});
		},

		_addTextBtn: function ( msg, index ) {
			if ( !msg ) {
				window.alert( "please input some words" );
				return false;
			}
			var self = this,
				$view = self.element,
				$textBtn = $( document.createElement( "span" ) ),
				$inputbox = $view.find( ".ui-input" ),
				$buttons = $view.find( ".ui-textbtn" ),
				checkExist = false;

			$textBtn.text( msg ).addClass( "ui-textbtn" );
			
			$buttons.each( function () {
				checkExist = ( $( this ).text() === msg ) ? true : false;
				if( checkExist ){
					return false;
				}
			});
			
			if( checkExist ) {
				window.alert( "Already added [" + msg + "], input another text" );
			} else {
				if( index >= 0 ){
					$buttons.eq( index ).before( $textBtn );
				} else {
					$inputbox.before( $textBtn );
				}
			}
			self._unselect();
			self.refresh();
		},

		_removeTextBtn: function ( index ) {
			var $buttons = this.element.find( ".ui-textbtn" );

			if ( index === "all") {
				$buttons.remove();
			} else if( index >= 0 ){
				$buttons.eq( index ).remove();
			} else {
				if( $buttons.hasClass( "ui-textbtn-selected" ) ){
					$buttons.eq( $( ".ui-textbtn-selected" ).index() -1 ).remove();
				} else {
					this.select( $buttons.length - 1);
				}
			}
			this.refresh();
		},

		_resizeTextBtn: function () {
			var self = this,
				$view = self.element,
				$buttons = $view.find(".ui-textbtn"),
				$inputBox = $view.find("ui-input"),
				totalWidth = $view.width(),
				labelWidth = $view.find("ui-label").outerWidth( true ),
				addressWidth = $view.find("ui-address").outerWidth( true ),
				inputPaddingMargin = $inputBox.outerWidth( true ) - $inputBox.width(),
				maxWidth = ( totalWidth - labelWidth - addressWidth - inputPaddingMargin ),
				btnLength = $buttons.length,
				index = 0;

			for ( index = 0 ; index < btnLength ; index += 1 ) {
				$buttons.eq( index ).css( "width", "auto" ); // for resizing windows width
				if ( $buttons.eq( index ).width() > maxWidth ) {
					$buttons.eq( index ).width( Math.round( maxWidth * this._maxInputWidthRate ) ); // will be applied ellipsis effect.
				}
			}
		},

		_resizeInputBox: function () {
			var $view		= this.element,
				$inputBox	= $view.find( ".ui-input" ),
				$label		= $view.find( ".ui-label" ),
				$buttons		= $view.find( ".ui-textbtn" ),
				$thisBtn		= null,
				totalWidth	= $view.width(),
				labelWidth	= $label.outerWidth( true ),
				addressWidth= $view.find(".ui-address").outerWidth( true ),
				inputPaddingMargin = $inputBox.outerWidth( true ) - $inputBox.width(),
				btnsTop		= 0,
				btnsWidth	= 0,
				inputWidth	= 0,
				index		= 0,
				btnsLength	= $buttons.length;

			for ( index = 0; index < btnsLength; index += 1 ) {
				$thisBtn = $buttons.eq( index );
				if ( index === 0 ) {
					btnsTop = $thisBtn.position().top;
				}
				if ( btnsTop !== $thisBtn.position().top ) { // rows > 1
					labelWidth = 0;
				}
				if ( $label.position().left === $thisBtn.position().left ) {
					btnsWidth = 0;
				}
				btnsWidth += $thisBtn.outerWidth( true );
			}
			inputWidth = totalWidth - labelWidth - addressWidth - btnsWidth;
			inputWidth = ( inputWidth > this._minInputWidth ) ? inputWidth : ( totalWidth - addressWidth );
			
			$inputBox.width( inputWidth - inputPaddingMargin );
		},

		_unselect: function () {
			if ( this._focusState ) {
				this.element.find( ".ui-textbtn" ).removeClass( "ui-textbtn-selected" );
			}
		},

		add: function ( str, index ) {
			if( this._focusState ) {
				this._addTextBtn( str, index );
			}
		},

		remove: function ( index ) {
			if ( this._focusState ) {
				this._removeTextBtn( index );
			}
		},

		select: function ( idx ) {
			var $view = this.element,
				$buttons = $view.find( ".ui-textbtn" ),
				$selectedBtn = $view.find( ".ui-textbtn-selected" );
			if( idx === undefined ) {
				return ( $selectedBtn.length === 0 ) ? null : $selectedBtn.text();
			} else if ( $buttons.eq( idx ).hasClass( "ui-textbtn-selected" ) ) {
				this._removeTextBtn( idx );
			} else {
				this._unselect();
				$buttons.eq( idx ).addClass( "ui-textbtn-selected" ).trigger( "select" );
			}
		},
		
		focusIn: function () {
			var $view	= this.element;
			if( !this._focusState ) {
				$view.find( ".ui-textbtn-focusout" ).remove();
				$view.find( ".ui-textbtn" ).show();
				$view.find( ".ui-input" ).show();
				$view.find( ".ui-address" ).show();
				this._unselect();
				this._focusState = true;
				this.refresh();
			} else {
				return false;
			}
		},

		focusOut: function () {
			var $view	= this.element,
				$buttons	= $view.find( ".ui-textbtn" ),
				$input		= $view.find( ".ui-input" ),
				$address	= $view.find( ".ui-address" ),
				$moreBtn	= $( document.createElement("span") ),
				btnLength = $buttons.length - 1;

			if( this._focusState ) {
				
				if( btnLength > 0 ) {
					$moreBtn.text( " + " + btnLength ).addClass( "ui-textbtn-focusout" );
					$address.hide();
					$buttons.hide();
					$input.hide();
					$buttons.eq( 0 ).show();
					$input.before( $moreBtn );
					this._unselect();
					this._focusState = false;
				} else {
					this._focusState = true;
				}
			}
		},

		inputText: function ( inputStr ) {
			var $view = this.element,
				$inputBox;
			if( this._focusState ) {
				$inputBox = $view.find( ".ui-input" );
				if( !inputStr ) {
					if( $inputBox.val() === "" ){
						return null;
					}
					return $inputBox.val();
				} else {
					$inputBox.val( inputStr );
				}
				return false;
			} else {( function ( $, document, window, undefined ) {
	$.widget( "mobile.multibuttonentry", $.mobile.widget, {
		options : {
			label : "Test : ",
			initSelector : ":jqmData(role='multibuttonentry')"
		},
		_minInputWidth : 50,
		_maxInputWidthRate : 0.6,
		_focusState : true,

		_create : function () {
			var self = this,
				$view = this.element, // jQuery
				$inputbox = $( document.createElement( "input" ) ),
				$label = $( document.createElement( "label" ) ),
				$addressBtn = $( document.createElement( "a" ) ).text( "+" );

			$label.addClass( "ui-label" );
			$addressBtn.attr( { "href": "#addressbook", "data-transition": "slideup" } ).addClass( "ui-address");

			$view.append( $label ).append( $inputbox ).append( $addressBtn ).addClass( "ui-multibuttonentry" );

			$inputbox.addClass( "ui-input" ).on( "keyup", function ( event ) {
				event.preventDefault();
				if ( event.keyCode === 13 ) { // enter
					self._addTextBtn( $( this ).val() );
					$inputbox.val( null );
				} else if( event.keyCode === 8 || event.keyCode === 46 ) {
					if ( self.inputText() === null ) {
						self._removeTextBtn();
					}
				}
				self._resizeInputBox();
			});

			$view.delegate( ".ui-textbtn, .ui-textbtn-focusout, .ui-label", "keyup click", function ( event ) {
				event.preventDefault();
				if ( !self._focusState ) {
					self.focusIn();
					return false;
				}
				if( event.keyCode === 46 ) {
					self._removeTextBtn();
				} else if ( event.type === "click" ) {
					self.select( $( this ).index() - 1 );
				}
			});
		},

		_addTextBtn: function ( msg, index ) {
			if ( !msg ) {
				window.alert( "please input some words" );
				return false;
			}
			var self = this,
				$view = self.element,
				$textBtn = $( document.createElement( "span" ) ),
				$inputbox = $view.find( ".ui-input" ),
				$buttons = $view.find( ".ui-textbtn" ),
				checkExist = false;

			$textBtn.text( msg ).addClass( "ui-textbtn" );
			
			$buttons.each( function () {
				checkExist = ( $( this ).text() === msg ) ? true : false;
				if( checkExist ){
					return false;
				}
			});
			
			if( checkExist ) {
				window.alert( "Already added [" + msg + "], input another text" );
			} else {
				if( index >= 0 ){
					$buttons.eq( index ).before( $textBtn );
				} else {
					$inputbox.before( $textBtn );
				}
			}
			self._unselect();
			self.refresh();
		},

		_removeTextBtn: function ( index ) {
			var $buttons = this.element.find( ".ui-textbtn" );

			if ( index === "all") {
				$buttons.remove();
			} else if( index >= 0 ){
				$buttons.eq( index ).remove();
			} else {
				if( $buttons.hasClass( "ui-textbtn-selected" ) ){
					$buttons.eq( $( ".ui-textbtn-selected" ).index() -1 ).remove();
				} else {
					this.select( $buttons.length - 1);
				}
			}
			this.refresh();
		},

		_resizeTextBtn: function () {
			var self = this,
				$view = self.element,
				$buttons = $view.find(".ui-textbtn"),
				$inputBox = $view.find("ui-input"),
				totalWidth = $view.width(),
				labelWidth = $view.find("ui-label").outerWidth( true ),
				addressWidth = $view.find("ui-address").outerWidth( true ),
				inputPaddingMargin = $inputBox.outerWidth( true ) - $inputBox.width(),
				maxWidth = ( totalWidth - labelWidth - addressWidth - inputPaddingMargin ),
				btnLength = $buttons.length,
				index = 0;

			for ( index = 0 ; index < btnLength ; index += 1 ) {
				$buttons.eq( index ).css( "width", "auto" ); // for resizing windows width
				if ( $buttons.eq( index ).width() > maxWidth ) {
					$buttons.eq( index ).width( Math.round( maxWidth * this._maxInputWidthRate ) ); // will be applied ellipsis effect.
				}
			}
		},

		_resizeInputBox: function () {
			var $view		= this.element,
				$inputBox	= $view.find( ".ui-input" ),
				$label		= $view.find( ".ui-label" ),
				$buttons		= $view.find( ".ui-textbtn" ),
				$thisBtn		= null,
				totalWidth	= $view.width(),
				labelWidth	= $label.outerWidth( true ),
				addressWidth= $view.find(".ui-address").outerWidth( true ),
				inputPaddingMargin = $inputBox.outerWidth( true ) - $inputBox.width(),
				btnsTop		= 0,
				btnsWidth	= 0,
				inputWidth	= 0,
				index		= 0,
				btnsLength	= $buttons.length;

			for ( index = 0; index < btnsLength; index += 1 ) {
				$thisBtn = $buttons.eq( index );
				if ( index === 0 ) {
					btnsTop = $thisBtn.position().top;
				}
				if ( btnsTop !== $thisBtn.position().top ) { // rows > 1
					labelWidth = 0;
				}
				if ( $label.position().left === $thisBtn.position().left ) {
					btnsWidth = 0;
				}
				btnsWidth += $thisBtn.outerWidth( true );
			}
			inputWidth = totalWidth - labelWidth - addressWidth - btnsWidth;
			inputWidth = ( inputWidth > this._minInputWidth ) ? inputWidth : ( totalWidth - addressWidth );
			
			$inputBox.width( inputWidth - inputPaddingMargin );
		},

		_unselect: function () {
			if ( this._focusState ) {
				this.element.find( ".ui-textbtn" ).removeClass( "ui-textbtn-selected" );
			}
		},

		add: function ( str, index ) {
			if( this._focusState ) {
				this._addTextBtn( str, index );
			}
		},

		remove: function ( index ) {
			if ( this._focusState ) {
				this._removeTextBtn( index );
			}
		},

		select: function ( idx ) {
			var $view = this.element,
				$buttons = $view.find( ".ui-textbtn" ),
				$selectedBtn = $view.find( ".ui-textbtn-selected" );
			if( idx === undefined ) {
				return ( $selectedBtn.length === 0 ) ? null : $selectedBtn.text();
			} else if ( $buttons.eq( idx ).hasClass( "ui-textbtn-selected" ) ) {
				this._removeTextBtn( idx );
			} else {
				this._unselect();
				$buttons.eq( idx ).addClass( "ui-textbtn-selected" ).trigger( "select" );
			}
		},
		
		focusIn: function () {
			var $view	= this.element;
			if( !this._focusState ) {
				$view.find( ".ui-textbtn-focusout" ).remove();
				$view.find( ".ui-textbtn" ).show();
				$view.find( ".ui-input" ).show();
				$view.find( ".ui-address" ).show();
				this._unselect();
				this._focusState = true;
				this.refresh();
			} else {
				return false;
			}
		},

		focusOut: function () {
			var $view	= this.element,
				$buttons	= $view.find( ".ui-textbtn" ),
				$input		= $view.find( ".ui-input" ),
				$address	= $view.find( ".ui-address" ),
				$moreBtn	= $( document.createElement("span") ),
				btnLength = $buttons.length - 1;

			if( this._focusState ) {
				
				if( btnLength > 0 ) {
					$moreBtn.text( " + " + btnLength ).addClass( "ui-textbtn-focusout" );
					$address.hide();
					$buttons.hide();
					$input.hide();
					$buttons.eq( 0 ).show();
					$input.before( $moreBtn );
					this._unselect();
					this._focusState = false;
				} else {
					this._focusState = true;
				}
			}
		},

		inputText: function ( inputStr ) {
			var $view = this.element,
				$inputBox;
			if( this._focusState ) {
				$inputBox = $view.find( ".ui-input" );
				if( !inputStr ) {
					if( $inputBox.val() === "" ){
						return null;
					}
					return $inputBox.val();
				} else {
					$inputBox.val( inputStr );
				}
				return false;
			} else {
				this.focusIn();
				return "no focus";
			}
		},

		length: function () {
			return this.element.find( ".ui-textbtn" ).length;
		},

		destroy: function () {
			var $view = this.element;
			$view.find( ".ui-textbtn" ).off( "click keyup" ).remove();
			$view.find( ".ui-label" ).remove();
			$view.find( ".ui-input" ).off( "click keyup" ).remove();
			$view.find( ".ui-address" ).off( "click" ).remove();
			$view.undelegate( "keyup click" );
			$view.remove();
		},

		refresh : function () {
			$( ".ui-label" ).text( this.options.label );
			this._resizeTextBtn();
			this._resizeInputBox();
		}
	});

	$.mobile.document.on( "pagecreate create" , function ( e ) {
		$.mobile.multibuttonentry.prototype.enhanceWithin( e.target );
	}).on( "pageshow", function () {
		$( ":jqmData(role='multibuttonentry')" ).multibuttonentry( "refresh" );
	});

	$.mobile.window.on( "resize", function () {
		$( ":jqmData(role='multibuttonentry')" ).multibuttonentry( "refresh" );
	});

} ( jQuery, document, window ) );
				this.focusIn();
				return "no focus";
			}
		},

		length: function () {
			return this.element.find( ".ui-textbtn" ).length;
		},

		destroy: function () {
			var $view = this.element;
			$view.find( ".ui-textbtn" ).off( "click keyup" ).remove();
			$view.find( ".ui-label" ).remove();
			$view.find( ".ui-input" ).off( "click keyup" ).remove();
			$view.find( ".ui-address" ).off( "click" ).remove();
			$view.undelegate( "keyup click" );
			$view.remove();
		},

		refresh : function () {
			$( ".ui-label" ).text( this.options.label );
			this._resizeTextBtn();
			this._resizeInputBox();
		}
	});

	$.mobile.document.on( "pagecreate create" , function ( e ) {
		$.mobile.multibuttonentry.prototype.enhanceWithin( e.target );
	}).on( "pageshow", function () {
		$( ":jqmData(role='multibuttonentry')" ).multibuttonentry( "refresh" );
	});

	$.mobile.window.on( "resize", function () {
		$( ":jqmData(role='multibuttonentry')" ).multibuttonentry( "refresh" );
	});

} ( jQuery, document, window ) );