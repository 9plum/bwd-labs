document.addEventListener("DOMContentLoaded", function() {
  const openDialogButton = document.getElementById("open-dialog-btn");
  const dialog = document.getElementById("task-dialog");
  const closeDialogButton = document.getElementById("close-dialog-btn");
  const form = dialog.querySelector('form');

  // Открытие модального окна при нажатии на кнопку "Добавить"
  openDialogButton.addEventListener("click", function() {
      dialog.showModal();
  });

  // Закрытие модального окна при нажатии на кнопку "Отмена"
  closeDialogButton.addEventListener("click", function(e) {
      e.preventDefault(); // Предотвращаем отправку формы
      dialog.close();
  });

  // Предотвращаем закрытие диалога при отправке формы
  form.addEventListener('submit', function(e) {
      e.preventDefault();
  });

  // Закрытие модального окна при нажатии за его пределами
  dialog.addEventListener("click", function(event) {
      const dialogBounds = dialog.getBoundingClientRect();
      if (
          event.clientX < dialogBounds.left ||
          event.clientX > dialogBounds.right ||
          event.clientY < dialogBounds.top ||
          event.clientY > dialogBounds.bottom
      ) {
          dialog.close();
      }
  });
});
