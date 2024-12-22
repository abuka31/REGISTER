// Функция для проверки, существует ли уже зарегистрированный пользователь
function checkIfUserExists(username) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.find(user => user.username === username);
  }
  
  // Регистрация пользователя
  document.getElementById('register-form')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
  
    if (checkIfUserExists(username)) {
      alert('Этот пользователь уже существует.');
    } else {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      users.push({ username, password });
      localStorage.setItem('users', JSON.stringify(users));
      alert('Вы успешно зарегистрированы!');
    }
  });
  
  // Вход пользователя
  document.getElementById('login-form')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
  
    const users = JSON.parse(localStorage.getItem('users')) || [];
  
    // Логика для админки
    if (username === "321" && password === "123") {
      window.location.href = "dashboard.html"; // Переход в админ панель
      return;
    }
  
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
      alert('Добро пожаловать!');
    } else {
      alert('Неверное имя пользователя или пароль');
    }
  });
  
  // Загрузка списка пользователей в админ панель
  window.onload = function() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userListElement = document.getElementById('user-list');
  
    users.forEach((user, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${user.username}</td>
        <td>${user.password}</td>
        <td>
          <button class="btn btn-danger" onclick="deleteUser(${index})">Удалить</button>
        </td>
      `;
      userListElement.appendChild(tr);
    });
  }
  
  // Функция для удаления пользователя
  function deleteUser(index) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.splice(index, 1); // Удаляем пользователя по индексу
    localStorage.setItem('users', JSON.stringify(users)); // Сохраняем изменения в localStorage
    location.reload(); // Перезагружаем страницу, чтобы обновился список
  }
  
  // Регистрация пользователя и сохранение в Firestore
document.getElementById('register-form')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
  
    // Проверка, существует ли уже такой пользователь в Firestore
    db.collection("users").where("username", "==", username).get().then(querySnapshot => {
      if (!querySnapshot.empty) {
        alert('Этот пользователь уже существует.');
      } else {
        // Сохраняем данные в Firestore
        db.collection("users").add({
          username: username,
          password: password
        }).then(() => {
          alert('Вы успешно зарегистрированы!');
        }).catch(error => {
          console.error("Ошибка при сохранении:", error);
        });
      }
    });
  });

  // Загрузка списка пользователей из Firestore в админ панель
window.onload = function() {
    const userListElement = document.getElementById('user-list');
  
    db.collection("users").get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const user = doc.data();
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${user.username}</td>
          <td>${user.password}</td>
          <td>
            <button class="btn btn-danger" onclick="deleteUser('${doc.id}')">Удалить</button>
          </td>
        `;
        userListElement.appendChild(tr);
      });
    });
  }
  
  // Удаление пользователя из Firestore
  function deleteUser(userId) {
    db.collection("users").doc(userId).delete().then(() => {
      alert('Пользователь удален!');
      location.reload(); // Перезагружаем страницу для обновления списка
    }).catch(error => {
      console.error("Ошибка при удалении:", error);
    });
  }

  