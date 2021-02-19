/*
remaining tasks
 - form validation (https://pageclip.co/blog/2018-02-20-you-should-use-html5-form-validation.html)
 -COMPLETE css for vertical scrolling on small windows
 - remove askQuestion_old
 - option to pass in Name and Email
 - upload css and javascript to mw-directly.com and make css path absolute in this file.
 - test
 - create readme
*/

//console.log('Loading directlyAdvancedRTM.js');
let preChatForm = {
  contactType: "email", //email or phone
  nameLabel: "Name",
  namePlaceHolder: "Enter your name here",
  contactMethodLabel: "Email Address",
  contactMethodPlaceHolder: "Enter you email email address here",
  questionLabel: "Your Question",
  questionPlaceHolder: "How can we help?",
  title: "How can we help you?",
  submitBtnLabel: "Ask our Experts",
  validationRequiredField: "required",
  validationInvalidFormat: "invalid value",
  extendedFields: [{
      id: "Serial Number",
      type: "text",
      label: "Serial Number",
      required: true,
      default: "hello world"
    },
    {
      id: "Fruit",
      folder: "",
      type: "drop-down",
      label: "Fruit",
      placeholder: "Choose your favorite fruit",
      required: true,
      options: [{
        label: "orange",
        value: 1
      }, {
        label: "apple",
        value: 2
      }],
      default: null //drop-down defaults should be the value, not the label
    },
    {
      id: "OS",
      folder: "private",
      type: "drop-down",
      label: "OS",
      placeholder: "Choose OS",
      required: true,
      options: ["Mac", "PC", "iOS", "Android"],
      default: "" //drop-down defaults should be the value, not the label
    },
    {
      id: "Referring Page",
      folder: "private",
      type: "hidden",
      label: "",
      required: true,
      default: window.location.href
    },
  ]

}
var directlyUtilities = {
  formId(agentFieldName) {
    return agentFieldName.toLowerCase().replace(/[ ]/gi, '_').replace(/[^0-9a-z_]/gi, '');
  },
  buildForm(formDefinition) {

  }
}

var directlyPreChatRTM = {


  toggleAskForm(state) {
//    console.log(`toggleAskForm - Parameter: ${state}`);
    if (state == "show") {
      let existingPreChatForm = document.getElementById("directlyPreChatContainer");
      if (existingPreChatForm) {
        existingPreChatForm.style.display = "unset";

      } else {

        DirectlyRTM("getState",
          function(params) {
            directlyPreChatRTM.buildForm(preChatForm, params.session);
          });
      }
    }
  },
  askQuestion(form) {
    let formValues = {
      metadata: {}
    };
    let formFields = document.querySelectorAll('[data-directlyFieldName]');
//    console.log('***FORM SUBMITTED***');
//    console.log(form);
    for (let i3 = 0; i3 < formFields.length; i3++) {
      console.log(`Field ID: ${formFields[i3].id} = ${formFields[i3].value} (${formFields[i3].getAttribute('data-directlyFieldName')})`);
      if (formFields[i3].getAttribute('data-directlyFieldName') == 'metadata') {
//        console.log(`Metafield found: Name = ${formFields[i3].getAttribute('data-directlyMetaLabel')}  || Folder = ${formFields[i3].getAttribute('data-directlyMetaFolder')}`);
        //metadata fields
        if (formFields[i3].getAttribute('data-directlyMetaFolder') == 0 || formFields[i3].getAttribute('data-directlyMetaFolder') == '' || formFields[i3].getAttribute('data-directlyMetaFolder') == 'public') {
//          console.log(`Metadata field: ${JSON.stringify(formFields[i3])}`);
          formValues['metadata'][formFields[i3].getAttribute('data-directlyMetaLabel')] = formFields[i3].value;
        } else {
          if (formValues['metadata'][formFields[i3].getAttribute('data-directlyMetaFolder')] === undefined) {
            formValues['metadata'][formFields[i3].getAttribute('data-directlyMetaFolder')] = {};
          }
          formValues['metadata'][formFields[i3].getAttribute('data-directlyMetaFolder')][formFields[i3].getAttribute('data-directlyMetaLabel')] = formFields[i3].value;
        }
      } else {
        formValues[formFields[i3].getAttribute('data-directlyFieldName')] = formFields[i3].value;
      }

    }
//    console.log('Payload:');
//    console.log(formValues);
    let askResults = DirectlyRTM("askQuestion", formValues);
//    console.log(askResults);
    return false;
  },


  init(rtm_id, options) {
    let self = this,
      metadata;
    if (options === undefined) {
      options = {};
    }


//if preChat Definition passed in, read from options.
    if (options.preChatForm) {
      preChatForm = options.preChatForm;
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
    self.addAskFormCSS(options.preChatForm.validationRequiredField, options.preChatForm.validationInvalidFormat);

    DirectlyRTM("onNavigate", function(path) {
      if (path.path == "/ask") {
        self.toggleAskForm("show");
      } else {
        self.toggleAskForm("hide");
      }
    });
    DirectlyRTM("onAskQuestion", function() {
      // Remove the form so it can be rebuilt based on session
      document.getElementById("directlyPreChatContainer").remove();
    });

    DirectlyRTM("onReady", function(data) {
      console.log(`RTM onReady\n----data:----\n${JSON.stringify(data)}`);
    });
  },

  validateFormDefinition(formJSON) {
    //ensure the form is valid
    return true;
  },
  buildForm(formJSON, activeSession) {
//    console.log(`Starting **buildFrom** \nformJSON: \n${JSON.stringify(formJSON)}\nactiveSession: ${activeSession}`);
    let preChatWidget = document.createElement('div');
    preChatWidget.id = "directlyPreChatContainer";
    let preChatWidgetHTML = '';
    let validationText;
    if (this.validateFormDefinition(formJSON)) {
      preChatWidgetHTML += `<div class="directly-pre-chat-header">${activeSession?'<div onclick="DirectlyRTM(\'navigate\', \'/list\');" class="directly-pre-chat-header-menu">&#9776;</div>':''}<h1 class="header-title">${formJSON.title||'How can we help you?'}</h1><div onclick="DirectlyRTM('minimize');" class="directly-pre-chat-header-minimize">&times;</div></div>`
      preChatWidgetHTML += `<div id="directlyFormContainer"><form id="directly-pre-chat-ask-question-form" class="directly-pre-chat-ask-question-form" onsubmit="event.preventDefault();return directlyPreChatRTM.askQuestion(this);">`
      preChatWidgetHTML += `<input type="hidden" id="directly-active-session" name="directly-active-session" value=${activeSession} required>`
      if (!activeSession) {
        preChatWidgetHTML += `<div class="directly-pre-chat-input-group directly-name-field"><label for="directly-name">${formJSON.nameLabel||'Name'}</label><input id="directly-name" placeholder="${formJSON.namePlaceHolder||'Type your name here'}" type="text" value="" data-directlyFieldName="name" required></div>`;
        if (formJSON.contactType === 'phone') {
          preChatWidgetHTML += `<div class="directly-pre-chat-input-group directly-phone-field"><label for="directly-phone">${formJSON.contactMethodLabel||'Phone Number'}</label><input id="directly-phone" placeholder="${formJSON.contactMethodPlaceHolder||'Type your phone number here'}" type="tel" value="" data-directlyFieldName="phone" required></div>`;
        } else {
          preChatWidgetHTML += `<div class="directly-pre-chat-input-group directly-email-field"><label for="directly-email">${formJSON.contactMethodLabel||'Email Address'}</label><input id="directly-email" placeholder="${formJSON.contactMethodPlaceHolder||'Type your email address here'}" type="text" pattern="^[a-zA-Z0-9_\\-\\.]+@[a-zA-Z0-9_\\-\\.]+\\.[a-zA-Z]{2,5}$" value="" data-directlyFieldName="email" required></div>`;
        }
      }
      console.log(preChatWidgetHTML);
      // Begin Extended Fields
      for (let i = 0; i < formJSON.extendedFields.length; i++) {
//        console.log(`Field "${formJSON.extendedFields[i].label}" is in folder "${formJSON.extendedFields[i].folder}"`);
        switch (formJSON.extendedFields[i].type) {
          case 'text':
            if (["email", "url", "number", "tel", "date"].includes(formJSON.extendedFields[i].validation)) {
              validationText = `type="${formJSON.extendedFields[i].validation}"`;
            } else if (formJSON.extendedFields[i].validation) {
              validationText = `type="text" pattern="${formJSON.extendedFields[i].validation}"`;
            } else {
              validationText = `type="text"`;
            }
            preChatWidgetHTML += `<div class="directly-pre-chat-input-group directly-${directlyUtilities.formId(formJSON.extendedFields[i].id)}-field"><label for="directly-meta-${directlyUtilities.formId(formJSON.extendedFields[i].id)}">${formJSON.extendedFields[i].label}</label><input id="directly-meta-${directlyUtilities.formId(formJSON.extendedFields[i].id)}" placeholder="${formJSON.extendedFields[i].placeHolder||''}" data-directlyFieldName="metadata" data-directlyMetaLabel="${formJSON.extendedFields[i].label}" data-directlyMetaFolder="${formJSON.extendedFields[i].folder||''}" value="${formJSON.extendedFields[i].default||''}" ${formJSON.extendedFields[i].required?'required':''} ${validationText}></div>`;
            break;
          case 'hidden':
            preChatWidgetHTML += `<div class="directly-pre-chat-input-group directly-${directlyUtilities.formId(formJSON.extendedFields[i].id)}-field"><input id="directly-meta-${directlyUtilities.formId(formJSON.extendedFields[i].id)}" placeholder="${formJSON.extendedFields[i].placeHolder||''}" type="hidden" value="${formJSON.extendedFields[i].default||''}" data-directlyFieldName="metadata" data-directlyMetaLabel="${formJSON.extendedFields[i].label}" data-directlyMetaFolder="${formJSON.extendedFields[i].folder||''}"></div>`;
            break;
          case 'drop-down':
            preChatWidgetHTML += `<div class="directly-pre-chat-input-group directly-pre-chat-select-group directly-${directlyUtilities.formId(formJSON.extendedFields[i].id)}-field"><label for="directly-meta-${directlyUtilities.formId(formJSON.extendedFields[i].id)}">${formJSON.extendedFields[i].label}</label><select id="directly-meta-${directlyUtilities.formId(formJSON.extendedFields[i].id)}" data-directlyFieldName="metadata" data-directlyMetaLabel="${formJSON.extendedFields[i].label}" data-directlyMetaFolder="${formJSON.extendedFields[i].folder||''}" ${formJSON.extendedFields[i].required?'required':''}>`;
            //options
            preChatWidgetHTML += `<option value="" disabled ${formJSON.extendedFields[i].default==''?'selected':''}>${formJSON.extendedFields[i].placeholder}</option>`;
            for (let i2 = 0; i2 < formJSON.extendedFields[i].options.length; i2++) {
              if (typeof(formJSON.extendedFields[i].options[i2]) == "object") {
                preChatWidgetHTML += `<option value="${formJSON.extendedFields[i].options[i2].value}" ${formJSON.extendedFields[i].options[i2].id == formJSON.extendedFields[i].default?'selected':''}>${formJSON.extendedFields[i].options[i2].label}</option>`;
              } else {
                preChatWidgetHTML += `<option ${formJSON.extendedFields[i].options[i2] == formJSON.extendedFields[i].default?'selected':''}>${formJSON.extendedFields[i].options[i2]}</option>`;
              }
            }
            preChatWidgetHTML += `</select></div>`;

            break;
          default:
            console.log(`Unkown field type for ${JSON.stringify(formJSON.extendedFields[i])}\n`)
        }
      }
      // End Extended Fields
      preChatWidgetHTML += `<div class="directly-pre-chat-input-group directly-question-field"><label for="question">${formJSON.questionLabel}</label><textarea id="directly-question" placeholder="${formJSON.questionPlaceHolder}" rows="4" data-directlyFieldName="questionText" required></textarea></div>`;
      preChatWidgetHTML += `<div class="directly-pre-chat-submit-group directly-submit-button"><button id="directly-submit" class="directly-pre-chat-btn directly-submit" name="Send to our experts" type="submit">${formJSON.submitBtnLabel}</button></div>`;
      preChatWidgetHTML += `</form></div></div>`;
      preChatWidget.innerHTML = preChatWidgetHTML;


    } else {
      preChatWidget.innerHTML = 'Error building pre-chat form.  Invalid form definition.';
      preChatWidget.className = 'DirectlyPreChatError';
    }
    document.body.append(preChatWidget);
    directlyPreChatRTM.validateForm();
  },
 addAskFormCSS(validationRequiredField, validationInvalidFormat) {
   //Load PreChatForm css
   let cssId = 'directlyPreChatCSS';  // you could encode the css path itself to generate id..
if (!document.getElementById(cssId))
{
   let head  = document.getElementsByTagName('head')[0];
   let link  = document.createElement('link');
   link.id   = cssId;
   link.crossorigin = 'anonymous';
   link.rel  = 'stylesheet';
   link.type = 'text/css';
   link.href = 'css/directlyAdvancedRTM.css';
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
    }`;
    document.getElementsByTagName('head')[0].appendChild(style);

},
 validateForm(){
   //Validate form
   const validationErrorClass = 'directly-validation-error';
   const parentErrorClass = 'directly-has-validation-error';
   const inputs = document.querySelectorAll('[data-directlyFieldName]');
   inputs.forEach(function (input) {
     directlyPreChatRTM.validateField(input);
     function checkValidity (options) {
       const insertError = options.insertError
       const parent = input.parentNode
       const error = parent.querySelector(`.${validationErrorClass}`)
         || document.createElement('div')

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
     input.addEventListener('input', function () {
       // We can only update the error or hide it on input.
       // Otherwise it will show when typing.
       checkValidity({insertError: false});
       directlyPreChatRTM.validateField(input);
     })
     input.addEventListener('invalid', function (e) {
       // prevent showing the default display
       e.preventDefault()

       // We can also create the error in invalid.
       checkValidity({insertError: true});
       directlyPreChatRTM.validateField(input);
     })
   })
 },
  validateField(fieldObj){
    //Validate form
    const fieldRequiredErrorClass = 'directly-validation-error-format';
    const fieldValidationErrorClass = 'directly-validation-error-format';
    if(fieldObj.validity.valueMissing){
      fieldObj.parentNode.classList.add(fieldRequiredErrorClass);
      fieldObj.parentNode.classList.remove(fieldValidationErrorClass);
    } else if(fieldObj.validity.valueMissing){
      fieldObj.parentNode.classList.remove(fieldRequiredErrorClass);
      fieldObj.parentNode.classList.add(fieldValidationErrorClass);
    } else {
      fieldObj.parentNode.classList.remove(fieldRequiredErrorClass);
      fieldObj.parentNode.classList.remove(fieldValidationErrorClass);
    }

  }

}



//document.addEventListener("DOMContentLoaded", function(){
//  directlyPreChatRTM.buildForm(preChatForm, false);
//});
