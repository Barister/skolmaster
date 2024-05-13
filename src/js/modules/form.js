
// form email


document.addEventListener("DOMContentLoaded", function () {

   setTimeout(function () {

      let email = document.querySelector(".modal-form__email");

      if (email) {
         //console.log({ email });
         email.style.display = "none";
         email.style.visibility = "hidden";

      }
   }, 1000);
});


// modal form popup

let buttons = document.querySelectorAll('.btn');
let modalForm = document.querySelector('.modal-form');

const form = document.querySelector('#form');
const body = document.querySelector('body');

buttons.forEach(el => {
   el.addEventListener('click', onClick);
});

function onClick(event) {
   event.stopPropagation();
   //console.log('нажата кнопка');
   modalForm.classList.add('active');
   form.classList.add('active');
   document.addEventListener('click', outerClickListener);
   form.addEventListener('submit', formValidate);
   body.classList.toggle('scroll-lock');
}

function outerClickListener(event) {
   if (!event.target.closest('#form') || event.target.closest('.modal-form__close')) {
      //console.log('hidePopup call');
      hidePopup();
   }
   //document.removeEventListener('click', outerClickListener);
}

function hidePopup() {
   modalForm.classList.remove('active');
   form.classList.remove('active');
   body.classList.toggle('scroll-lock');

   formSubmitResult.textContent = '';
   formSubmitResult.classList.remove('err', 'ok');
}

// form validation

const phonePattern = /^(\+7|7|8|9)\d{9,}$/; // Регулярное выражение для телефонов в России

let formSubmitResult = modalForm.querySelector('.modal-form__result');

function formValidate(event) {

   event.preventDefault(); // отменяем отправку формы


   const inputMailField = form.querySelector('#email');
   const inputPolicyField = form.querySelector('#checkbox');

   // console.log(inputPolicyField);

   const inputPhoneField = form.querySelector('#phone');
   const inputStatus = phonePattern.test(inputPhoneField.value);

   // console.log('inputStatus:', inputStatus);

   // Если валидация прошла успешно, можно отправить форму на сервер
   if (inputStatus && inputPolicyField && !inputMailField.value) {
      submitForm(event);

   }
   else {
      console.log('Проверьте номер телефона на ошибки!');
      formSubmitResult.textContent = 'Проверьте номер телефона на ошибки!';
      formSubmitResult.classList.add('err');
   }


}


// form send function

async function submitForm(event) {
   //event.preventDefault();

   try {
      // Формируем запрос
      const response = await fetch(event.target.action, {
         method: 'POST',
         body: new FormData(event.target)
      });
      // проверяем, что ответ есть
      if (!response.ok) throw (`Error accessing the server: ${response.status}`);

      // проверяем, что ответ действительно JSON
      const contentType = response.headers.get('content-type');

      if (!contentType || !contentType.includes('application/json')) {

         throw ('Processing error. The response is not JSON');

      }
      // обрабатываем запрос
      const json = await response.json();
      if (json.result === "success") {
         // в случае успеха
         formSubmitResult.textContent = 'Заявка успешна отправлена.';
         formSubmitResult.classList.add('ok');
         //alert(json.info);
         setTimeout(hidePopup, 3000);
         form.reset();
      } else {
         // в случае ошибки
         console.log(json);
         // throw (json.info);
         formSubmitResult.textContent = `Ошибка отправки заявки 1. ${json.info}`;
         formSubmitResult.classList.add('err');
      }
   } catch (error) { // обработка ошибки
      // alert(error);
      formSubmitResult.textContent = `Ошибка отправки заявки 2. ${error}`;
      formSubmitResult.classList.add('err');
   }
}