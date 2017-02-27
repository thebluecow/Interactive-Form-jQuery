// JavaScript Document
document.addEventListener('DOMContentLoaded', () => {
	
	const $jsPuns = $('#color option:contains("JS Puns")');
	const $heartJS = $('#color option:contains("JS shirt")');
	const $checkBoxes = $('input[type=checkbox]');
	
	let totalEvent = 0;

	/*
	Set focus on the first text field
	When the page loads, give focus to the first text field
	*/
	$('input[type="text"]').get(0).focus();
	
	const createAdditionalFields = () => {
		
		// Get job role drop down field and add text field
		// A text field that will be revealed when the "Other" option is selected from the "Job Role" drop down menu.
		const $jobRole = $('select#title');
		
		$($jobRole).on('change', (e) => {
			if (e.target.value === 'other') {
				$('#job-role-other').removeClass('is-hidden');
			} else {
				$('#job-role-other').addClass('is-hidden');
				$('#other-title').val('');
			}
		});
		
				
		// Total Field
		const $totalEvent = '<div id="total-activities"><input type="text" value="" class="hide-on-open" name="total">' +
			  				'<strong>Total: $<span id="total-value">' + totalEvent + '</strong></span></div>';
		
		$('.activities').append($totalEvent);
		
		showTotalActivities();
		
	};
	
	const showTotalActivities = () => {
		totalEvent > 0 ? $('#total-activities').show() : $('#total-activities').hide();
	}
	
	const displayPaymentMethods = () => {
		let optionSelected = $('#payment option:selected').text();
		
		(optionSelected === 'Credit Card' || optionSelected === 'Select Payment Method') ? $('#credit-card').show() : $('#credit-card').hide();
		
		//When a user selects the "PayPal" payment option, the Paypal information should display
		// and the credit card and “Bitcoin” information should be hidden.
		optionSelected === 'PayPal' ? $('#paypal').show() : $('#paypal').hide();
		
		// When a user selects the "Bitcoin" payment option, the Bitcoin information should display
		// and the credit card and “PayPal” information should be hidden.
		optionSelected === 'Bitcoin' ? $('#bitcoin').show() : $('#bitcoin').hide();
		
		if (optionSelected !== 'Credit Card') {
			clearCCFields();
			removeCCWarnings();
		}
	}
	
	$('#design').on('change', (e) => {
		const $colorOptions = $('#color').children();
		//If the user selects "Theme - JS Puns" then the color menu should only
		// display "Cornflower Blue," "Dark Slate Grey," and "Gold."
		if (e.target.value.includes('puns')) {
			$('#color option').remove();
            $($jsPuns).appendTo('#color');
			// If the user selects "Theme - I ♥ JS" then the color menu should only
			// display "Tomato," "Steel Blue," and "Dim Grey."	
		} else if (e.target.value.includes('heart')) {
			$('#color option').remove();
            $($heartJS).appendTo('#color');
		} else {
			$('#color option').remove();
			$($jsPuns).appendTo('#color');
			$($heartJS).appendTo('#color');
		}
		
		// Hide the "Color" label and select menu until a T-Shirt design is selected from the "Design" menu.
		if ((e.target.value === "js puns") ||  (e.target.value === "heart js")) {
			$('#colors-js-puns').removeClass('is-hidden');
		} else {
			$('#colors-js-puns').addClass('is-hidden');
		}
	});
	
	// If the user selects a workshop, don't allow selection of a workshop at the same date and time
	// disable the checkbox and visually indicate that the workshop in the competing time slot isn't available.
	$('input[type=checkbox]').change(function() {
		
		/* BEGIN SETTING TOTAL EVENT */
		
		// Get event value from checkbox label
		const eventValue = parseInt($(this)[0].parentElement.textContent.match('\\$(.*)')[1]);
		
		if ($(this).is(":checked")) {
			totalEvent += eventValue;
		} else {
			totalEvent -= eventValue;
		}
		
		$('#total-value').html('<span id="total-value">' + totalEvent + '</strong></span>');
		
		// As a user selects activities, a running total should display below the list of checkboxes. 
		showTotalActivities();
		
		/* END SETTING TOTAL EVENT */
		
		/* BEGIN CHECKBOX EVENT ENABLE-DISABLE */
		
		const isScheduled = checkboxParentText => {
			return checkboxParentText.indexOf(',') >= 0;
		};
		
		// First, let's get the variables for the changed checkbox
		if (isScheduled($(this)[0].parentElement.textContent)) {
			const labelText = $(this)[0].parentElement.textContent.match('— (.*),')[1];
			const checkboxName = $(this)[0].name;
			const checked = $(this).is(":checked");

		// Iterate through all the checkboxes
		$('input[type=checkbox]').each(function(){
			if (isScheduled($(this)[0].parentElement.textContent)) {
			// Grab the label text for each checkbox
				const checkBoxLabelText = $(this)[0].parentElement.textContent.match('— (.*),')[1];

				// Disable/Enable
				if (($(this)[0].name !== checkboxName) && checkBoxLabelText === labelText) {
					if (checked) {
						$(this)[0].disabled = true;
						$(this)[0].parentElement.style.color = 'rgba(89,89,89, .25)';
					} else {
						$(this)[0].disabled = false;
						$(this)[0].parentElement.style.color = 'initial';
					}
				}
			}
		});
	}	
		
		/* END CHECKBOX EVENT ENABLE-DISABLE */
});
	
	/*
		********************************
		FORM VALIDATION METHODS
		********************************
	*/
	
	//The "Credit Card" payment option should be selected by default
	$('#payment').val('credit card');
	
	$('#payment').on('change', function(){		
		displayPaymentMethods();	
	});
	
	// remove credit card warnings to allow processing of form
	// useful if credit card is selected, a warning is shown, then the
	// the user selects PayPal or Bitcoin
	const removeCCWarnings = () => {
		$('div#credit-error').remove();
		$('#cc-num').removeClass('warning');
		$('#zip').removeClass('warning');
		$('#cvv').removeClass('warning');
	}
	
	const clearCCFields = () => {
		console.log('clear');
		$('#cc-num').val('');
		$('#zip').val('');
		$('#cvv').val('');
	}
	
	// Checks if num is valid based on pattern supplied and field
	const isValidNum = (pattern, field) => {
		const isCorrect = pattern.test($(field).val());
		let message = "";
		
		isCorrect ? $(field).removeClass('warning') : $(field).addClass('warning');
		
		return isCorrect;
	}
	
	const isValidEmail = emailString => {
		let pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
		
		return pattern.test(emailString);	
	}
	
	const isValidCheck = () => {
		let isChecked = false;
		
		$('input[type=checkbox]').each(function() {
			if (!isChecked) {
				if ($(this).is(":checked")) {
					isChecked = true;
				}
			}
		});
		
		if (!isChecked) {
			let errorMessage = '<div id="active-error" class="warning-text">Please select at least one activity to proceed.</div>';
			$('div#active-error').remove();
			$('.activities').prepend(errorMessage);
		} else {
			$('div#active-error').remove();
		}
	}
	
	const checkCreditCard = () => {
		// Credit card field should only accept a number between 13 and 16 digits
			const creditCheck = isValidNum(/^[0-9]{13,16}$/, '#cc-num');
			
			// create custom error message for credit card
			if (!(creditCheck)) {
				if ($('#cc-num').val() === "") {
					message = "Please enter a credit card number.";
				} else {
					message = "Please enter a number that is between 13 and 16 digits long.";
				}
			
				let errorMessage = '<div id="credit-error" class="warning-text">' + message + '</div>';
				$('div#credit-error').remove();
				$('label[for="exp-month"]').prepend(errorMessage);
			} else {
				$('div#credit-error').remove();
			}
	}
	
	const checkZip = () => {
		isValidNum(/^[0-9]{5}$/, '#zip');
	}
	
	const checkCVV = () => {
		isValidNum(/^[0-9]{3}$/, '#cvv');
	}
	
	$("form").submit(function( event ) {
		// Provide some kind of indication when there’s a validation error. The field’s borders could turn red
		
		//Name field can't be blank
		$('#name').val().length > 0 ? $('#name').removeClass('warning') : $('#name').addClass('warning');
		
		//Email field must be a validly formatted e-mail address 
		isValidEmail($('#mail').val()) ? $('#mail').removeClass('warning') : $('#mail').addClass('warning');
		
		// Must select at least one checkbox under the "Register for Activities" section of the form.
		isValidCheck();
		
		// Adding a check for 'Select Payment Method' here as well. If no option is selected, there should be a warning
		// to prevent the page from sending
		if ($('#payment option:selected').text() === 'Select Payment Method') {
			let errorMessage = '<div id="active-error" class="warning-text">Please select a payment method.</div>';
			$('div#payment-error').remove();
			$('label[for="payment"]').prepend(errorMessage);
		} else {
			$('div#payment-error').remove();
		}
		
		// If the selected payment option is "Credit Card," make sure the user has supplied
		// a credit card number, a zip code, and a 3 number CVV value before the form can be submitted.
		
		if ($('#payment option:selected').text() === 'Credit Card') {
			
			checkCreditCard();
		
			//The zipcode field should accept a 5-digit number
			checkZip();
		
			//The CVV should only accept a number that is exactly 3 digits long
			checkCVV();
		} else {
			clearCCFields();
			// if, in some way, the warning class is still attached to the credit card fields
			// this will remove them to allow submit
			removeCCWarnings();
		}
		
		if ($('.warning').length > 0 || $('.warning-text').length > 0) {
			alert('The form could not be submitted. Please review all error messages and required fields marked in red.');
			event.preventDefault();
		}
	});
	
	// Program your form so that it provides a real-time validation error message for at least one text input field.
	$('#mail').on('keyup', function() {
		isValidEmail($('#mail').val()) ? $('#mail').removeClass('warning') : $('#mail').addClass('warning');
	});
	
	$('#cc-num').on('keyup', function() {
		checkCreditCard();
	});
	
	$('#zip').on('keyup', function() {
		checkZip();
	});
	
	$('#cvv').on('keyup', function() {
		checkCVV();
	});
	
	// methods called when first opening page
	
	createAdditionalFields();
	displayPaymentMethods();
	
	// Hide the "Color" label and select menu until a T-Shirt design is selected from the "Design" menu.
	$('#colors-js-puns').addClass('is-hidden');
	
	// Adding this at runtime. If JavaScript is turned off, the field will still show.
	$('.hide-on-open').addClass('is-hidden');

});