
(function () {
  const button = document.getElementById('en');
  const timeInput = document.getElementById('rt');

  const LocalNotifications =
    window.Capacitor?.Plugins?.LocalNotifications;

  if (!LocalNotifications) {
    button.textContent = 'الإشعارات غير متاحة';
    return;
  }

  async function setupReminder(requestPermission = false) {
    try {
      let permission = await LocalNotifications.checkPermissions();

      if (permission.display !== 'granted' && requestPermission) {
        permission = await LocalNotifications.requestPermissions();
      }

      if (permission.display !== 'granted') {
        button.textContent = 'اسمح بالإشعارات أولاً';
        return;
      }

      const [hour, minute] = (timeInput.value || '09:00')
        .split(':').map(Number);

      await LocalNotifications.cancel({
        notifications: [{ id: 100 }]
      });

      await LocalNotifications.schedule({
        notifications: [{
          id: 100,
          title: 'سجّل حضورك 🗓️',
          body: 'متنساش تسجل حضورك النهارده!',
          schedule: {
            on: { hour, minute },
            allowWhileIdle: true
          }
        }]
      });

      button.textContent = 'الإشعارات مفعّلة ✓';

    } catch (error) {
      console.error(error);
      button.textContent = 'حصل خطأ في الإشعارات';
    }
  }

  setupReminder(false);

  button.onclick = () => setupReminder(true);

  timeInput.addEventListener('change', () => {
    setupReminder(false);
  });
})();
