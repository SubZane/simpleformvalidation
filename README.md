Simple Form Validation v0.9.1
===========

Simple Form Validation - Add form validation to your web form without knowing much about JavaScript

##Background
I found that many form validation scripts can do amazing things but are also complicated to use because of it. I wanted a script that does the basics and is easy to install and use with frameworks such as bootstrap.

Meet Simple Form Validation

##Features
* Direct validation! onBlur, onChange and onKeyUp
* Validates email
* Validates urls
* Validates numbers
* Validates alpha numeric characters
* Validates alphabetic characters
* Validates minimun length
* Validates maximum length
* Validates exact length

##Browser Support
* Google Chrome
* Internet Explorer 8+
* Firefox
* Safari 6+

##Installation
```
bower install simpleformvalidation --save
```

###Setup
```html
<!-- You'll need jquery -->
<script src="dependencies/jquery/dist/jquery.min.js"></script>
<!-- and you'll need to include simplegmaps of course! -->
<script src="../src/jquery.simpleformvalidation.js"></script>
```
##Usage
```javascript
$('#id_of_your_div').simplegmaps();
```

###Settings and Defaults
```javascript
options: {
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
  }
  onComplete: function () {
    return true;
  }
};
```
* `container`: The ID or classname of the container holding your form elements. Doesn't have to be a form.
* `postButton`: ID or classname of the button to pose a validate form and submit button.
* `autoValidate`: Default true. When true, the form will validate each field as you type and leave it.
* `icheck`: Default false. When true, the error message position will change to support icheck.
* `onSuccess`: What to do when all fields are valid.
* `onError`: What to do when one or many fields aren't valid.
* `onComplete`: What to do just before onSuccess and before onError.

###Typical setup
This could be your typical script setup for a simple email form.

```javascript
jQuery(document).ready(function($) {
  SimpleFormValidator.init({
    container: '.simple-form-validation',
    postButton: '.simple-post-button',
    autoValidate: true,
    onSuccess: function () {
      $('#myform').submit();
    },
    onError: function () {
      $('.huge-errorbox').show();
    }
  });
});
```

###How to add validation to a field
To add validation requirements to a field you'll need to add `data-role="validate"`
```html
<div class="form-group">
  <label for="MyField">A pretty field</label>
  <input type="text" class="form-control" id="MyField" data-role="validate" />
</div>
```

To set validation rules on the field you'll first have to decide on one or many rules
* Email: `data-validate="email"`
* Url: `data-validate="url"`
* Regex pattern: `data-validate="pattern"`
* Numbers: `data-validate="numeric"`
* Alpha numeric characters: `data-validate="alpha-numeric"`
* Alphabetic characters: `data-validate="alphabet"`
* Checkboxes: `data-validate="required"`
* Radio Groups: `data-validate="radio-group"`
* Length: `data-validate="length"`
* Confirm: `data-validate="confirm"`

On validating length you'll need to specify minimum or maximum length
* Validates minimun length: `data-validate-minimum="1"`
* Validates maximum length: `data-validate-maximum="10"`
* Validates exact length: `data-validate-exact="6"`

On validating confirm you'll need to specify the input to compare with
* Confirm: `data-validate-confirmtarget="#fldPassword"`

Example with requirements on length
```html
<div class="form-group">
  <label for="MyField">A pretty field</label>
  <input type="text" class="form-control" id="MyField" data-role="validate" data-validate="length" data-validate-minimum="1" data-validate-maximum="10">
</div>
```

###Error Messages
The error message for the field must also be set using the attribute `data-validate-error-msg`

Example with radio button group and error messages
```html
<div class="form-group">
  <div class="radio">
    <label>
      <input type="radio" name="optionsRadios" id="optionsRadios1" value="option1" data-role="validate" data-validate="radio-group"  data-validate-error-msg="Error lipsum dolor">
      Option one is this and that&mdash;be sure to include why it's great
    </label>
  </div>

  <div class="radio">
    <label>
      <input type="radio" name="optionsRadios" id="optionsRadios2" value="option2">
      Option two can be something else and selecting it will deselect option one
    </label>
  </div>

  <div class="radio disabled">
    <label>
      <input type="radio" name="optionsRadios" id="optionsRadios3" value="option3">
      Option three is
    </label>
  </div>
</div>
```


##changelog
####0.9.1
* Fixed bug with appending error messages. Error messages will now clear between every check.

####0.9.0
* Changed validation control to also include a check on a data-attribute on the container. ```data-formvalid="true"``` and ```data-formvalid="false"```. It is now possible to force a true or false state on the form by externaly changning this value.
* Added support for [iCheck](http://fronteed.com/iCheck/)
* Added anonymous function ```onComplete``` that always will execute before onError and before onSuccess.

####0.8.0
* Added support for exact length

####0.7.0
* Added support for custom regex patterns

####0.6.0
* Added support for textareas. Has the same validation options like normal inputs
* Added new option clearOnSuccess to clear all `.valid` classes when the form validates.
* onError no returns fields with validation errors.

####0.5.0
First public release.
