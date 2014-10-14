/*! Simple Form Validation - v0.1.0 - 2014-10-14
* https://github.com/SubZane/simpleformvalidation
* Copyright (c) 2014 Andreas Norman; Licensed MIT */
var SimpleFormValidator = {
	options: {
		error_msg_html_tag: 'span',
		error_msg_html: '<span class="errormsg">{msg}</span>',
		container: '.simple-form-validation',
		validateButton: '.validateButton'
	},

	form: {
		valid: true
	},

	init: function (elem) {
		// Mix in the passed-in options with the default options
		//this.options = $.extend({}, this.options, options);

		// Save the element reference, both as a jQuery
		// reference and a normal reference
		this.elem = elem;
		this.$elem = $(elem);
	},

	validateOnBlur: function() {
		var sfv = this;
		var fields = this.$elem.find('[data-role="validate"]');
		fields.each(function () {
			var field = this;
			$(field).on('blur', function(e) {
				sfv.validate(this);
			});
		});
	},

	validate: function(field) {
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

			if (validate === 'checked') {
				return sfv.validateChecked(field);
			}

			if (validate === 'radio') {
				return sfv.validateRadio(field);
			}
		});
	},

	validateAll: function () {
		this.form.valid = true;
		var sfv = this;
		var fields = this.$elem.find('[data-role="validate"]');
		fields.each(function () {
			var field = this;
			sfv.validate(field);
		});
	},

	validateChecked: function(obj) {
		if ($(obj).prop('checked')) {
			this.reportSuccess(obj);
		} else {
			this.reportError(obj);
			return true;
		}
	},

	validateRadio: function(obj) {
		var name = $(obj).attr('name');
		if($('input[type="radio"][name='+name+']:checked').length > 0){
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

	validateEmail: function(obj) {
		var pattern =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if (pattern.test($(obj).val())) {
			this.reportSuccess(obj);
		} else {
			this.reportError(obj);
			return true;
		}
	},

	validateAlphaNumeric: function(obj) {
		var pattern =/^[a-zA-Z0-9]+$/;
		if (pattern.test($(obj).val())) {
			this.reportSuccess(obj);
		} else {
			this.reportError(obj);
			return true;
		}
	},

	validateAlphabeticCharacters: function(obj) {
		var pattern =/^[a-zA-Z]+$/;
		if (pattern.test($(obj).val())) {
			this.reportSuccess(obj);
		} else {
			this.reportError(obj);
			return true;
		}
	},

	validateURL: function(obj) {
		var pattern =/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
		if (pattern.test($(obj).val())) {
			this.reportSuccess(obj);
		} else {
			this.reportError(obj);
			return true;
		}
	},





	validateNumbers: function(obj) {
		var pattern = /^\d+$/;
		if (pattern.test($(obj).val())) {
			this.reportSuccess(obj);
		} else {
			this.reportError(obj);
			return true;
		}
	},

	validateConfirm: function(obj) {
		var confirm_target_value = $($(obj).data('validate-confirmtarget')).val();
		if (confirm_target_value === $(obj).val()) {
			this.reportSuccess(obj);
		} else {
			this.reportError(obj);
		}
	},

	reportError: function (obj) {
		$(obj).data('valid', 'false');
		$(obj).removeClass('valid');
		$(obj).addClass('error');
		this.addErrorMessage(obj);
		this.form.valid = false;
		this.triggerformValidationChange_Event();
	},

	triggerformValidationChange_Event: function () {
		if (this.form.valid) {
			$.event.trigger({
				type: 'formValidationChange',
				message: 'Form is valid.',
				time: new Date()
			});
		} else {
			$.event.trigger({
				type: 'formValidationChange',
				message: 'Form is not valid.',
				time: new Date()
			});
		}
	},

	addErrorMessage: function(obj) {
		if (!$(obj).next(this.options.error_msg_html_tag).length) {
			var errormsg = this.options.error_msg_html;
			var complete_errormsg = errormsg.replace('{msg}', $(obj).data('validate-error-msg'));
			$(obj).parent().append(complete_errormsg);
		}
	},

	removeErrorMessage: function(obj) {
		$(obj).next(this.options.error_msg_html_tag).remove();
	},

	reportSuccess: function (obj) {
		$(obj).data('valid', 'true');
		$(obj).removeClass('error');
		$(obj).addClass('valid');
		this.removeErrorMessage(obj);
	},
};
