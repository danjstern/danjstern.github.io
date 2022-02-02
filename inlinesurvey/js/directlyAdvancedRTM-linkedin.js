//console.log('Loading directlyAdvancedRTM.js');

let directly_caputure_rating = null;
let directly_current_questionUuid = null;
var directlyLinkedInRTM = {
  init(rtm_id, options) {
    let self = this,
      metadata;
    if (options === undefined) {
      options = {};
    }
    // Directly RTM widget
    (function(d, i, r, e, c, t, l, y) {
      i[r] = i[r] || function() {
        (i[r].cq = i[r].cq || []).push(arguments)
      };
      l = d.createElement("script");
      l.id = "directlyRTMScript";
      l.src = e;
      l.async = 1;
      y = d.head || d.getElementsByTagName("head")[0];
      if (d.readyState === "complete" || d.readyState === "loaded" || d.readyState === "interactive") {
        y.appendChild(l);
      } else if (i.addEventListener) {
        i.addEventListener("DOMContentLoaded", function() {
          y.appendChild(l);
        });
      } else {
        i.attachEvent("onload", function() {
          y.appendChild(l);
        });
      }
    })(document, window, "DirectlyRTM", "https://www.directly.com/widgets/rtm/embed.js");

    let configs = {
      id: rtm_id,
      i18n: (typeof options.i18n != "undefined") ? options.i18n : null,
      metadata: (typeof options.metadata != "undefined") ? options.metadata : null
    }

    DirectlyRTM("config", configs);

    //add validation css
    self.addAskFormCSS('Field required', 'Invalid value');

  },
  addAskFormCSS(validationRequiredField, validationInvalidFormat) {
    //Load PreChatForm css
    let cssId = 'directlyPreChatCSS';
    if (!document.getElementById(cssId)) {
      let head = document.getElementsByTagName('head')[0];
      let link = document.createElement('link');
      link.id = cssId;
      link.crossorigin = 'anonymous';
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = 'https://rtm-linkedin.mw-directly.com/css/directlyLinkedInRTM.css';
      link.media = 'all';
      head.appendChild(link);
    }

    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `.directly-validation-error-format > label::after {
        content: "${validationInvalidFormat}";
        text-transform: lowercase;
        color: red;
        right: 30px;
        font-weight: 100;
        position: absolute;
    }
    .directly-validation-error-required > label::after {
        content: "${validationRequiredField}";
        text-transform: lowercase;
        color: red;
        right: 30px;
        font-weight: 100;
        position: absolute;
    }

    .d-disclaimer {
  margin: 0 22px;
  max-height: 120px;
  height: 120px;
  font-size: 70%;
  color: gray;
  overflow-y: auto;
}
button#directly-submit[disabled] {
  background-color: lightgray;
  border-color: grey;
  color: darkgray;
}
.directly-legal_terms-field {
  height: 24px;
}
input#directly-meta-legal_terms + label {
font-size: 10px;
}
input#directly-meta-legal_terms[disabled] + label {
color: #c5c5c5;
font-size:0px;
}
input#directly-meta-legal_terms[disabled] + label:after {
  content: "You must scroll to bottom of terms to accept\\a";
  white-space: pre;
  font-size: 10px;
}
    @media (max-width: 668px) {
      #directlyFormFields {
         height: calc(100% - 140px);
      }
    }`;
    document.getElementsByTagName('head')[0].appendChild(style);

  },
  validateForm() {
    //Validate form
    const validationErrorClass = 'directly-validation-error';
    const parentErrorClass = 'directly-has-validation-error';
    const inputs = document.querySelectorAll('[data-directlyFieldName]');
    inputs.forEach(function(input) {
      console.log(input);
      directlyLinkedInRTM.validateField(input);

      function checkValidity(options) {
        const insertError = options.insertError
        const parent = input.parentNode
        const error = parent.querySelector(`.${validationErrorClass}`) ||
          document.createElement('div')

        if (!input.validity.valid && input.validationMessage) {
          error.className = validationErrorClass
          error.textContent = input.validationMessage

          if (insertError) {
            parent.insertBefore(error, input)
            parent.classList.add(parentErrorClass)
          }
        } else {
          parent.classList.remove(parentErrorClass)
          error.remove()
        }
      }
      input.addEventListener('input', function() {
        // We can only update the error or hide it on input.
        // Otherwise it will show when typing.
        checkValidity({
          insertError: false
        });
        directlyLinkedInRTM.validateField(input);
      })
      input.addEventListener('invalid', function(e) {
        // prevent showing the default display
        e.preventDefault()

        // We can also create the error in invalid.
        checkValidity({
          insertError: true
        });
        directlyLinkedInRTM.validateField(input);
      })
    })
  },
  setFieldVisited(fieldObj) {
    console.log(fieldObj);
    if (fieldObj.value) {
      fieldObj.classList.add('directlyHasValue');
    } else {
      fieldObj.classList.remove('directlyHasValue');

    }
  },
  validateField(fieldObj) {
    //Validate form
    const fieldRequiredErrorClass = 'directly-validation-error-format';
    const fieldValidationErrorClass = 'directly-validation-error-format';
    if (fieldObj.validity.valueMissing) {
      fieldObj.parentNode.classList.add(fieldRequiredErrorClass);
      fieldObj.parentNode.classList.remove(fieldValidationErrorClass);
    } else if (fieldObj.validity.valueMissing) {
      fieldObj.parentNode.classList.remove(fieldRequiredErrorClass);
      fieldObj.parentNode.classList.add(fieldValidationErrorClass);
    } else {
      fieldObj.parentNode.classList.remove(fieldRequiredErrorClass);
      fieldObj.parentNode.classList.remove(fieldValidationErrorClass);
    }

  },
  submitLinkedInSurvey(formData) {
    console.log(createMetadataPayload());
    if (directly_current_questionUuid) {
      DirectlyRTM("updateMetadata", {
        questionUuid: directly_current_questionUuid,
        metadata: {
          "linkedInSurvey": createMetadataPayload()
        },
      });
      directly_current_questionUuid = false;
      DirectlyCloseSurvey();
    }
  }

}

//Read defaults from script tag attributes
let defaultReturnUrl = "";
if (document.getElementById("directlyPreChatScript")) {
  if (document.getElementById("directlyPreChatScript").getAttribute("directlyReturnUrl")) {
    defaultReturnUrl = document.getElementById("directlyPreChatScript").getAttribute("directlyReturnUrl");
  }
}

directlyLinkedInRTM.init("2c998593672f95d201675620cab85809");
DirectlyRTM("onRated", function(ratingData) {
  console.log(ratingData.rating);
  switch (ratingData.rating) {
    case 'POSITIVE_5':
      directly_caputure_rating = 5;
      break;
    case 'NEUTRAL_POSITIVE_5':
      directly_caputure_rating = 4;
      break;
    case 'NEUTRAL_5':
      directly_caputure_rating = 3;
      break;
    case 'NEUTRAL_NEGATIVE_5':
      directly_caputure_rating = 2;
      break;
    case 'NEGATIVE_5':
      directly_caputure_rating = 1;
      break;
  }
  console.log(directly_caputure_rating);
});

DirectlyRTM("onSolved", function(solvedData) {
  directly_current_questionUuid = solvedData.questionUuid;
  displayLinkedInSurvey();
});

DirectlyRTM("onReroute", function(rerouteData) {
  directly_current_questionUuid = rerouteData.questionUuid;
  //if (rerouteData.reroutedByExpert || rerouteData.reroutedByPoster) {
  //displayLinkedInSurvey();
  //}
});

function displayLinkedInSurvey() {
  let surveyContainer = document.getElementById("postChatSurveyContainer");
  if (!surveyContainer) {
    //    console.log(`Starting **buildFrom** \nformJSON: \n${JSON.stringify(formJSON)}\nactiveSession: ${activeSession}`);
    let postChatSurveyWidget = document.createElement('div');
    postChatSurveyWidget.id = "postChatSurveyContainer";
    let postChatSurveyWidgetHTML = '';
    let validationText;
    postChatSurveyWidgetHTML += `<div class="directly-post-chat-survey-header"><h1 class="header-title">How did we do?</h1><div onclick="DirectlyCloseSurvey();" class="directly-chat-survey-header-minimize">&times;</div></div>`
    postChatSurveyWidgetHTML += `<div id="directlyFormContainer"><form id="directly-chat-survey-ask-question-form" class="directly-chat-survey-ask-question-form" onsubmit="event.preventDefault();return directlyLinkedInRTM.submitLinkedInSurvey(this);"><div id="directlyFormFields">`
    postChatSurveyWidgetHTML += `<div class="directly-chat-survey-input-group directly-chat-survey-radio-group">
      <label for="directly-meta-customer">Overall Rating?</label>
      <div class="directly-survey-radio-btn-group">
			<input type="radio" name="overall-rating" id="directly-survey-or_5" value="5" required ${directly_caputure_rating == 5?'checked':''}>
			<label for="5">Very Good</label>
		  </div>
      <div class="directly-survey-radio-btn-group">
			<input type="radio" name="overall-rating" id="directly-survey-or_4" value="4" required ${directly_caputure_rating == 4?'checked':''}>
      <label for="4">Good</label>
      </div>
      <div class="directly-survey-radio-btn-group">
			<input type="radio" name="overall-rating" id="directly-survey-or_3" value="3" required ${directly_caputure_rating == 3?'checked':''}>
      <label for="3">Neutral</label>
      </div>
      <div class="directly-survey-radio-btn-group">
			<input type="radio" name="overall-rating" id="directly-survey-or_2" value="2" required ${directly_caputure_rating == 2?'checked':''}>
      <label for="2">Poor</label>
      </div>
      <div class="directly-survey-radio-btn-group">
			<input type="radio" name="overall-rating" id="directly-survey-or_1" value="1" required ${directly_caputure_rating == 1?'checked':''}>
      <label for="1">Very Poor</label>
      </div>
      </div>`;
    postChatSurveyWidgetHTML += `<div class="directly-chat-survey-input-group directly-chat-survey-radio-group">
      <label for="directly-meta-customer">Expert Rating?</label>
      <div class="directly-survey-radio-btn-group">
			<input type="radio" name="expert-rating" id="directly-survey-er_5" value="5">
			<label for="5">Very Helpful</label>
		  </div>
      <div class="directly-survey-radio-btn-group">
			<input type="radio" name="expert-rating" id="directly-survey-er_4" value="4">
      <label for="4">Helpful</label>
      </div>
      <div class="directly-survey-radio-btn-group">
			<input type="radio" name="expert-rating" id="directly-survey-er_3" value="3">
      <label for="3">Neutral</label>
      </div>
      <div class="directly-survey-radio-btn-group">
			<input type="radio" name="expert-rating" id="directly-survey-er_2" value="2">
      <label for="2">Unhelpful</label>
      </div>
      <div class="directly-survey-radio-btn-group">
			<input type="radio" name="expert-rating" id="directly-survey-er_1" value="1">
      <label for="1">Very Unhelpful</label>
      </div>
      </div>`;
    postChatSurveyWidgetHTML += `<div class="directly-chat-survey-input-group directly-chat-survey-radio-group">
      <label for="directly-meta-customer">Speed of Response?</label>
      <div class="directly-survey-radio-btn-group">
			<input type="radio" name="speed-rating" id="directly-survey-speed_5" value="5">
			<label for="5">Very Fast</label>
		  </div>
      <div class="directly-survey-radio-btn-group">
			<input type="radio" name="speed-rating" id="directly-survey-speed_4" value="4">
      <label for="4">Fast</label>
      </div>
      <div class="directly-survey-radio-btn-group">
			<input type="radio" name="speed-rating" id="directly-survey-speed_3" value="3">
      <label for="3">Neutral</label>
      </div>
      <div class="directly-survey-radio-btn-group">
			<input type="radio" name="speed-rating" id="directly-survey-speed_2" value="2">
      <label for="2">Slow</label>
      </div>
      <div class="directly-survey-radio-btn-group">
			<input type="radio" name="speed-rating" id="directly-survey-speed_1" value="1">
      <label for="1">Very Slow</label>
      </div>
      </div>`;
    postChatSurveyWidgetHTML += `<div class="directly-chat-survey-input-group directly-chat-survey-radio-group">
      <label for="directly-meta-customer">Level of Resolution?</label>
      <div class="directly-survey-radio-btn-group">
			<input type="radio" name="resolution-level" id="directly-survey-rl_5" value="5">
			<label for="5">Completely</label>
		  </div>
      <div class="directly-survey-radio-btn-group">
			<input type="radio" name="resolution-level" id="directly-survey-rl_4" value="4">
      <label for="4">Mostly</label>
      </div>
      <div class="directly-survey-radio-btn-group">
			<input type="radio" name="resolution-level" id="directly-survey-rl_3" value="3">
      <label for="3">Neutral</label>
      </div>
      <div class="directly-survey-radio-btn-group">
			<input type="radio" name="resolution-level" id="directly-survey-rl_2" value="2">
      <label for="2">Not enough</label>
      </div>
      <div class="directly-survey-radio-btn-group">
			<input type="radio" name="resolution-level" id="directly-survey-rl_1" value="1">
      <label for="1">Not at all</label>
      </div>
      </div>`;
    postChatSurveyWidgetHTML += `<div class="directly-chat-survey-input-group">
      <label for="additional-feedback">Additional Feedback</label>
      <textarea name="additional-feedback" id="directly-survey-additional-feedback" cols="40" rows="3" maxlength="1000"></textarea>
      </div>`;

    postChatSurveyWidgetHTML += `<div class="directly-chat-survey-input-group"><input  id="directly-survey-follow-up" type="checkbox" name="follow-up" value="1" onclick="toggleFollowUp(this.checked)">
      <label for="follow-up" class="afterCheckBox">Would you like LinkedIn to follow-up?</label></div>`;

    postChatSurveyWidgetHTML += `<div class="directly-chat-survey-input-group hidden">
      <label for="follow-up-contact">Email to contact you?</label>
      <input type="text" name="follow-up-contact" id="directly-survey-follow-up-contact" pattern="[^@\s]+@[^@\s]+\.[^@\s]+" title="Please enter a valid email address.">
      </div>`;

    postChatSurveyWidgetHTML += `<div class="directly-chat-survey-submit-group directly-submit-button"><button id="directly-submit" class="directly-chat-survey-btn directly-submit" name="submit feedback" type="submit" onclick="this.form.classList.add('directlyFormSubmitted');">Submit Feedback</button></div>`;
    postChatSurveyWidgetHTML += `</form></div></div>`;

    postChatSurveyWidget.innerHTML = postChatSurveyWidgetHTML;
    document.body.append(postChatSurveyWidget);
    //hide rtm
    document.getElementsByClassName("directly-rtm")[0].classList.add("hidden");
  }
}

function DirectlyCloseSurvey() {
  let surveyContainer = document.getElementById("postChatSurveyContainer");
  if (surveyContainer) {
    surveyContainer.parentNode.removeChild(surveyContainer);
    document.getElementsByClassName("directly-rtm")[0].classList.remove("hidden");
  };
}

function toggleFollowUp(currValue) {
  if (currValue) {
    document.getElementById('directly-survey-follow-up-contact').parentElement.classList.remove("hidden");
    document.getElementById('directly-survey-follow-up-contact').required = true;
  } else {
    document.getElementById('directly-survey-follow-up-contact').parentElement.classList.add("hidden");
    document.getElementById('directly-survey-follow-up-contact').required = false;
    document.getElementById('directly-survey-follow-up-contact').value = null;
  }
}

function createMetadataPayload() {

  let inputFields = document.querySelectorAll("#directly-chat-survey-ask-question-form input");
  let payload = {
    "additional-feedback": "none provided",
    "expert-rating": "0",
    "overall-rating": "0",
    "resolution-level": "0",
    "speed-rating": "0",
    "follow-up": "0",
    "follow-up-contact": "n/a"
  };
  for (let i = 0; i < inputFields.length; i++) {
    switch (inputFields[i].type) {
      case 'text':
      case 'email':
        if (inputFields[i].value) {
          payload[inputFields[i].name] = inputFields[i].value;
        }
        break;
      case 'radio':
      case 'checkbox':
        if (inputFields[i].checked) {
          payload[inputFields[i].name] = inputFields[i].value;
        }
        break;

        if (inputFields[i].checked) {
          payload[inputFields[i].name] = inputFields[i].value;
        }
        break;
    }
  }
  let textFields = document.querySelectorAll("#directly-chat-survey-ask-question-form textarea");
  for (let i2 = 0; i2 < textFields.length; i2++) {
    if (textFields[i2].value) {
      payload[textFields[i2].name] = textFields[i2].value;
    }
  }
  return payload;

}


function loadCustomFormFunction() {

}
