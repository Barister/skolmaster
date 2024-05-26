const ModalFormModule = {
   init: function () {
      document.addEventListener("DOMContentLoaded", this.onDomContentLoaded.bind(this));
   },
   onDomContentLoaded: function () {
      this.cacheDom();
      this.bindEvents();
      this.hideEmailField();
   },
   cacheDom: function () {
      this.buttons = document.querySelectorAll('.btn');
      this.modalForm = document.querySelector('.modal-form');
      this.form = document.querySelector('#form');
      this.body = document.querySelector('body');
      this.formSubmitResult = this.modalForm.querySelector('.modal-form__result');
      this.email = this.modalForm.querySelector('.modal-form__email');
      this.phonePattern = /^(\+7|7|8|9)\d{9,}$/; // Регулярное выражение для телефонов в России
   },
   bindEvents: function () {
      this.buttons.forEach(button => {
         button.addEventListener('click', this.onClick.bind(this));
      });
   },
   hideEmailField: function () {
      if (this.email) {
         this.updateStyles(this.email, { display: "none", visibility: "hidden" });
      }
   },
   onClick: function (event) {
      event.stopPropagation();
      this.toggleModal(true);
      document.addEventListener('click', this.outerClickListener.bind(this));
      this.form.addEventListener('submit', this.formValidate.bind(this));
   },
   outerClickListener: function (event) {
      if (!event.target.closest('#form') || event.target.closest('.modal-form__close')) {
         this.hidePopup();
      }
   },
   hidePopup: function () {
      this.toggleModal(false);
      this.updateResult('');
   },
   toggleModal: function (isActive) {
      this.modalForm.classList.toggle('active', isActive);
      this.form.classList.toggle('active', isActive);
      this.body.classList.toggle('scroll-lock', isActive);
      if (!isActive) {
         document.removeEventListener('click', this.outerClickListener.bind(this));
         this.form.removeEventListener('submit', this.formValidate.bind(this));
      }
   },
   updateResult: function (message, isError = false) {
      this.formSubmitResult.textContent = message;
      this.formSubmitResult.classList.toggle('err', isError);
      this.formSubmitResult.classList.toggle('ok', !isError && message !== '');
   },
   formValidate: function (event) {
      event.preventDefault();
      const inputMailField = this.form.querySelector('#email');
      const inputPolicyField = this.form.querySelector('#checkbox');
      const inputPhoneField = this.form.querySelector('#phone');
      const inputStatus = this.phonePattern.test(inputPhoneField.value);

      if (inputStatus && inputPolicyField && !inputMailField.value) {
         this.submitForm(event);
      } else {
         this.updateResult('Проверьте номер телефона на ошибки!', true);
      }
   },
   submitForm: async function (event) {
      try {
         const response = await fetch(event.target.action, {
            method: 'POST',
            body: new FormData(event.target)
         });

         if (!response.ok) throw (`Error accessing the server: ${response.status}`);

         const contentType = response.headers.get('content-type');
         if (!contentType || !contentType.includes('application/json')) {
            throw ('Processing error. The response is not JSON');
         }

         const json = await response.json();
         if (json.result === "success") {
            this.updateResult('Заявка успешна отправлена.');
            setTimeout(this.hidePopup.bind(this), 3000);
            this.form.reset();
         } else {
            this.updateResult(`Ошибка отправки заявки 1. ${json.info}`, true);
         }
      } catch (error) {
         this.updateResult(`Ошибка отправки заявки 2. ${error}`, true);
      }
   },
   updateStyles: function (element, styles) {
      Object.assign(element.style, styles);
   }
};

ModalFormModule.init();
