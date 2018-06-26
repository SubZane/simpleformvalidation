/*! Simple Form Validation - v0.9.3 - 2018-06-26
* https://github.com/SubZane/simpleformvalidation
* Copyright (c) 2018 Andreas Norman; Licensed MIT */
var SimpleFormValidator = {
	options: {
		error_msg_html_tag: 'span',
		error_msg_html: '<span class="errormsg">{msg}</span>',
		container: '.simple-form-validation',
		postButton: '.simple-post-button',
		autoValidate: true,
		icheck: false,
		clearOnSuccess: false,
		onSuccess: function () {
			return true;
		},
		onError: function () {
			return false;
		},
		onComplete: function () {
			return true;
		}
	},

	form: {
		valid: true
	},

	init: function (options) {
		// Mix in the passed-in options with the default options
		this.options = $.extend({}, this.options, options);

		// Save the element reference, both as a jQuery
		// reference and a normal reference
		this.elem = this.options.container;
		this.$elem = $(this.options.container);

		this.setFormValididationStatus(false);

		if (this.options.autoValidate) {
			this.initAutoValidation();
		}

		if ($(this.options.postButton).length > 0) {
			var sfv = this;
			$(this.options.postButton).on('click', function (evt) {
				sfv.validateForm();
			});
		}
	},

	initAutoValidation: function () {
		this.validateOnBlur();
		this.validateOnChange();
		this.validateOnKeyUp();
	},
	getGuid: function() {
		var strguid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
		return strguid;
	},

	validateOnBlur: function () {
		var sfv = this;
		var fields = this.$elem.find('input[type=text][data-role="validate"], input[type=password][data-role="validate"], textarea[data-role="validate"]');
		fields.each(function () {
			var field = this;
			$(field).on('blur', function (e) {
				sfv.validate(this);
			});
		});
	},

	validateOnKeyUp: function () {
		var sfv = this;
		var fields = this.$elem.find('input[type=text][data-role="validate"], input[type=password][data-role="validate"], textarea[data-role="validate"]');
		fields.each(function () {
			var field = this;
			$(field).on('keyup', function (e) {
				if ($(field).hasClass('error') || $(field).hasClass('valid')) {
					sfv.validate(this);
				}
			});
		});
	},

	validateOnChange: function () {
		var _self = this;
		var fields = this.$elem.find('input[type=radio][data-role="validate"], [type=checkbox][data-role="validate"]');
		fields.each(function () {
			var field = this;

			var siblings = _self.$elem.find('input[type="radio"][name=' + $(field).attr('name') + ']');
			if (_self.options.icheck === true) {
				if (siblings.length > 0) {
					siblings.each(function () {
						var sibling = this;
						$(sibling).on('ifChanged', function (e) {
							_self.validate(field);
						});
					});
				} else {
					$(field).on('ifChanged', function (e) {
						_self.validate(this);
					});
				}
			} else {
				if (siblings.length > 0) {
					siblings.each(function () {
						var sibling = this;
						$(sibling).on('change', function (e) {
							_self.validate(field);
						});
					});
				} else {
					$(field).on('change', function (e) {
						_self.validate(this);
					});
				}
			}
		});
	},

	validate: function (field) {
		var sfv = this;
		var validate = $(field).data('validate');
		var validateArray = validate.split(':');

		// Loop through all validations for a field and exit the loop at first error, leaving the field invalid
		validateArray.some(function (validate, index, _validateArray) {
			if (validate === 'length') {
				if ($(field).data('validate-minimum')) {
					return sfv.validateMinLength(field);
				}
				if ($(field).data('validate-maximum')) {
					return sfv.validateMaxLength(field);
				}
				if ($(field).data('validate-exact')) {
					return sfv.validateExactLength(field);
				}
			}

			if (validate === 'confirm') {
				return sfv.validateConfirm(field);
			}

			if (validate === 'email') {
				return sfv.validateEmail(field);
			}

			if (validate === 'numeric') {
				return sfv.validateNumbers(field);
			}

			if (validate === 'required') {
				return sfv.validateRequired(field);
			}

			if (validate === 'radio-group') {
				return sfv.validateRadio(field);
			}

			if (validate === 'alphabet') {
				return sfv.validateAlphabeticCharacters(field);
			}

			if (validate === 'alpha-numeric') {
				return sfv.validateAlphaNumeric(field);
			}

			if (validate === 'url') {
				return sfv.validateURL(field);
			}

			if (validate === 'pattern') {
				return sfv.validatePattern(field);
			}
		});
	},

	validatePattern: function (obj) {
		var pattern = new RegExp($(obj).data('validate-pattern'));

		if (pattern.test($(obj).val())) {
			this.reportSuccess(obj);
		} else {
			this.reportError(obj);
			return true;
		}
	},

	validateForm: function () {
		this.setFormValididationStatus(true);
		var sfv = this;
		var fields = this.$elem.find('input[data-role="validate"], textarea[data-role="validate"]');
		fields.each(function () {
			var field = this;
			sfv.validate(field);
		});

		if (this.isFormValid()) {
			if (this.options.clearOnSuccess) {
				fields.val('').removeClass('valid');
				fields.val('').removeClass('error');
			}
			this.options.onComplete();
			this.options.onSuccess();
		} else {
			this.options.onComplete();
			this.options.onError(fields.filter('.error'));
		}
	},

	reportError: function (obj) {
		$(obj).data('valid', 'false');
		$(obj).removeClass('valid');
		$(obj).addClass('error');
		this.addErrorMessage(obj);
		this.setFormValididationStatus(false);
	},

	isFormValid: function() {
		if (typeof $(this.options.container).data('formvalid') !== 'undefined') {
			if ($(this.options.container).data('formvalid') === true) {
				this.setFormValididationStatus(true);
				return true;
			} else {
				this.setFormValididationStatus(false);
				return false;
			}
		} else {
			if (this.form.valid === true) {
				return true;
			} else {
				return false;
			}
		}
	},

	setFormValididationStatus: function (valid) {
		this.form.valid = valid;
	},

	addErrorMessage: function (obj) {
		if ($(obj).data('error-guid')) {
			return;
		} else {
			if (!$(obj).next(this.options.error_msg_html_tag).length) {
				var guid = this.getGuid();
				$(obj).data('error-guid', guid);
				var errormsg = this.options.error_msg_html;
				var complete_errormsg = errormsg.replace('{msg}', $(obj).data('validate-error-msg'));
				var errorElement = $.parseHTML(complete_errormsg);
				$(errorElement).attr('data-guid', guid);

				var siblings = this.$elem.find('input[type="radio"][name=' + $(obj).attr('name') + ']');
				if (this.options.icheck === true) {
					if (siblings.length > 0) {
						$(siblings[siblings.length - 1]).parent().parent().parent().parent().append(errorElement);
					} else {
						// With icheck enabled and checkboxes we will need to step back som parents. However not for normal inputs
						if ($(obj).is(':checkbox')) {
							$(obj).parent().parent().parent().parent().append(errorElement);
						} else {
							$(obj).parent().append(errorElement);
						}
					}
				} else {
					if (siblings.length > 0) {
						$(siblings[siblings.length - 1]).parent().append(errorElement);
					} else {
						$(obj).parent().append(errorElement);
					}
				}
			}
		}
	},

	removeErrorMessage: function (obj) {
		if ($(obj).data('error-guid')) {
			var guid = $(obj).data('error-guid');
			$(this.options.container).find('[data-guid="' + guid + '"]').remove();
			$(obj).removeData('error-guid');
		}
	},

	reportSuccess: function (obj) {
		$(obj).data('valid', 'true');
		$(obj).removeClass('error');
		$(obj).addClass('valid');
		this.removeErrorMessage(obj);
	},

	validateRequired: function (obj) {
		if ($(obj).prop('checked')) {
			this.reportSuccess(obj);
		} else {
			this.reportError(obj);
			return true;
		}
	},

	validateRadio: function (obj) {
		var name = $(obj).attr('name');
		if ($('input[type="radio"][name=' + name + ']:checked').length > 0) {
			this.reportSuccess(obj);
		} else {
			this.reportError(obj);
			return true;
		}
	},

	validateExactLength: function (obj) {
		if ($(obj).data('validate-exact') === $(obj).val().length) {
			this.reportSuccess(obj);
		} else {
			this.reportError(obj);
			return true;
		}
	},

	validateMinLength: function (obj) {
		if ($(obj).data('validate-minimum') <= $(obj).val().length) {
			this.reportSuccess(obj);
		} else {
			this.reportError(obj);
			return true;
		}
	},

	validateMaxLength: function (obj) {
		if ($(obj).data('validate-maximum') >= $(obj).val().length) {
			this.reportSuccess(obj);
		} else {
			this.reportError(obj);
			return true;
		}
	},

	validateEmail: function (obj) {
		var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if (pattern.test($(obj).val())) {
			this.reportSuccess(obj);
		} else {
			this.reportError(obj);
			return true;
		}
	},

	validateAlphaNumeric: function (obj) {
		var pattern = /^[a-zA-Z0-9]+$/;
		if (pattern.test($(obj).val())) {
			this.reportSuccess(obj);
		} else {
			this.reportError(obj);
			return true;
		}
	},

	validateAlphabeticCharacters: function (obj) {
		var pattern = /^[a-zA-Z]+$/;
		if (pattern.test($(obj).val())) {
			this.reportSuccess(obj);
		} else {
			this.reportError(obj);
			return true;
		}
	},

	validateNumbers: function (obj) {
		var pattern = /^\d+$/;
		if (pattern.test($(obj).val())) {
			this.reportSuccess(obj);
		} else {
			this.reportError(obj);
			return true;
		}
	},

	validateConfirm: function (obj) {
		var confirm_target_value = $($(obj).data('validate-confirmtarget')).val();
		if (confirm_target_value === $(obj).val()) {
			this.reportSuccess(obj);
		} else {
			this.reportError(obj);
			return true;
		}
	},

	validateURL: function (obj) {
		var pattern = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
		if (pattern.test($(obj).val())) {
			this.reportSuccess(obj);
		} else {
			this.reportError(obj);
			return true;
		}
	},

	isFunction: function (func) {
		if (typeof func === 'function') {
			return true;
		} else {
			return false;
		}
	}
};
