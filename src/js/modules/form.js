
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

buttons.forEach(el => {
   el.addEventListener('click', onClick);
});

function onClick(event) {
   event.stopPropagation();
   //console.log('нажата кнопка');
   modalForm.classList.add('active');
   document.addEventListener('click', outerClickListener);
}

function outerClickListener(event) {
   if (!event.target.closest('#form') || event.target.closest('.modal-form__close')) {
      //console.log('hidePopup call');
      hidePopup();
   }
   document.removeEventListener('click', outerClickListener);
}

function hidePopup() {
   modalForm.classList.remove('active');
}



// form send function

async function submitForm(event) {
   event.preventDefault(); // отключаем перезагрузку/перенаправление страницы
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
         console.log(contentType);
         throw ('Processing error. The response is not JSON');

      }
      // обрабатываем запрос
      const json = await response.json();
      if (json.result === "success") {
         // в случае успеха
         alert(json.info);
      } else {
         // в случае ошибки
         console.log(json);
         throw (json.info);
      }
   } catch (error) { // обработка ошибки
      alert(error);
   }
}