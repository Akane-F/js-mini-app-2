document.addEventListener('DOMContentLoaded', () => {
  const foodModal = document.getElementById('foodModal');
  const closeModals = document.querySelectorAll('.closeModal');
  const foodChoices = document.querySelectorAll('.food-choice');
  const foodDisplay = document.getElementById('foodDisplay');
  const moon = document.getElementById('moon');
  const emptyEnergy = document.getElementById('empty-energy');
  const emptyHappiness = document.getElementById('empty-happiness');
  const taskToggle = document.getElementById('task-toggle');
  const taskModal = document.getElementById('taskModal');
  const taskStatusMap = new Map([
    ['meal', document.querySelector('#status-meal')],
    ['sleep', document.querySelector('#status-sleep')],
    ['play', document.querySelector('#status-play')],
    ['medicine', document.querySelector('#status-medicine')],
    ['clean', document.querySelector('#status-clean')],
    ['weight', document.querySelector('#status-weight')],
    ['teach', document.querySelector('#status-teach')],
    ['talk', document.querySelector('#status-talk')],
  ]);
  const cooldownSet = new Set();
  const cooldownTimeMap = new Map();
  const COOLDOWN_TIME = 5 * 60 * 1000;

  const conversations = [
    "I'm hungry... Got any snacks?",
    "So sleepy... Can I take a nap?",
    "Wanna play with me?",
    "How are you feeling today?",
    "I kinda feel like studying today!",
    "Let’s talk more! I like chatting with you!",
    "Do you think I’ve grown a little?"
  ];

// ゲージのステータス管理
let gauge = {
  energy: 5,
  happiness: 5,
};

function increaseEnergy() {
  if (gauge.energy < 5) {
    gauge.energy++;
    updateGauge('energy', gauge.energy, true);
    resetPiyoImage();
  }
}

function decreaseEnergy() {
  if (gauge.energy > 0) {
    gauge.energy--;
    updateGauge('energy', gauge.energy, false);
    resetPiyoImage();
  }
}

function increaseHappiness() {
  if (gauge.happiness < 5) {
    gauge.happiness++;
    updateGauge('happiness', gauge.happiness, true);
    resetPiyoImage();
  }
}

function decreaseHappiness() {
  if (gauge.happiness > 0) {
    gauge.happiness--;
    updateGauge('happiness', gauge.happiness, false);
    resetPiyoImage();
  }
}

function updateGauge(id, gauge, increase) {
  const gaugeIcons = document.querySelectorAll(`#${id} .gauge-fg img`);
  if (!gaugeIcons || gaugeIcons.length === 0) return;

  const icon = increase ? gaugeIcons[gauge - 1] : gaugeIcons[gauge];
  if (!icon) return;

  icon.style.transition = "opacity 1s ease";

  if (increase && gauge > 0) {
    icon.style.opacity = 1;
  } else if (!increase && gauge < gaugeIcons.length ) {
    icon.style.opacity = 0;
  }
  // empty-energy
  if (id === 'energy') {
      if (gauge === 0) {
        emptyEnergy.classList.remove('hidden');
        emptyEnergy.classList.add('show');
      } else {
        emptyEnergy.classList.remove('show');
        emptyEnergy.classList.add('hidden');
      }
    }
  // empty-happiness
  if (id === 'happiness') {
      if (gauge === 0) {
        emptyHappiness.classList.remove('hidden');
        emptyHappiness.classList.add('show');
      } else {
        emptyHappiness.classList.remove('show');
        emptyHappiness.classList.add('hidden');
      }
    }
}

// 3分ごとに、energy:-1 happiness:-1
setInterval(() => {
  decreaseEnergy();
  decreaseHappiness();
}, 180000);

  // foodchoice
  foodChoices.forEach(choice => {
    choice.addEventListener('click', () => {
      const food = choice.dataset.food;
      console.log(choice.dataset.food);
      // close Modal
      foodModal.classList.add('hidden');
      // show the food
      foodDisplay.textContent = food;
      foodDisplay.classList.remove('hidden');
      foodDisplay.classList.add('show');
      // energy:+1
      increaseEnergy();
      markTaskAsChecked('meal');
      // timeout
      setTimeout(() => {
        foodDisplay.classList.remove('show');
        foodDisplay.classList.add('hidden');
      }, 3000);
    })
  })

  // task check
  taskToggle.addEventListener('click', ()=>{
    taskModal.classList.remove('hidden');
    taskModal.classList.add('show');
  });

  // markTaskAschecked
    function markTaskAsChecked(taskName) {
    const element = taskStatusMap.get(taskName);
    if(element && !element.classList.contains('checked')){
      element.textContent = '✅';
      element.classList.add('checked');
      updateBadge();
    }
  }

  // update badge
  function updateBadge() {
    let uncheckedCount = 0;
    for (let [, element] of taskStatusMap) {
      if (!element.classList.contains('checked')) {
        uncheckedCount++;
      }
    }
    const badge = document.getElementById('badge');
    badge.textContent = uncheckedCount;
    badge.classList.toggle('hidden', uncheckedCount === 0);
    badge.classList.toggle('show', uncheckedCount > 0);
  }
  
  // close modal
  closeModals.forEach(button => {
    button.addEventListener('click', ()=>{
      const modal = button.closest('.modal');
      if (modal) {
        modal.classList.add('hidden');
      }
    });
  });

  // resetImage
  let resetImageTimeout = null;
  function resetPiyoImage(newImage = './assets/piyopiyo.gif', delay = 3000) {
    if (resetImageTimeout) {
      clearTimeout(resetImageTimeout);
    }
    resetImageTimeout = setTimeout(() => {
      const piyo = document.querySelector('#piyo');
      if (gauge.energy === 0 && gauge.happiness === 0){
        piyo.src = './assets/dead.png';
      } else if(gauge.energy === 0) {
        piyo.src = './assets/sick-piyo.png';
      } else if (gauge.happiness === 0) {
        piyo.src = './assets/boring-piyo.png';
      } else {
        piyo.src = newImage;
      }
    }, delay);
  }

  // cooldown
  function canExecuteAction(actionName) {
    const now = Date.now();
    if(!cooldownSet.has(actionName)) {
      cooldownSet.add(actionName);
      cooldownTimeMap.set(actionName, now);
      setTimeout(() => {
        cooldownSet.delete(actionName);
        cooldownTimeMap.delete(actionName);
      }, COOLDOWN_TIME);
      return true;
    }
    const lastExecuted = cooldownTimeMap.get(actionName);
    const timePassed = now - lastExecuted;
    const minutesLeft = Math.ceil((COOLDOWN_TIME - timePassed) / 60000);
    alert(`${actionName} : Please wait for ${minutesLeft} minutes`);
    return false;
  }

  function handleAction(action) {
    switch (action) {
      case 'eat':
        // #foodModal show
        foodModal.classList.remove('hidden');
        break;
      case 'sleep':
          // energy:+1
          document.querySelector('#piyo').src = './assets/suibun.png';
          moon.classList.remove('hidden');
          moon.classList.add('show');
          increaseEnergy();
          markTaskAsChecked('sleep');
          setTimeout(() => {
            moon.classList.remove('show');
            moon.classList.add('hidden');
          }, 3000)
          resetPiyoImage();
        break;
      case 'game':
        // energy:-1 happiness:+1
        document.querySelector('#piyo').src = './assets/mizudeppou.png';
        decreaseEnergy();
        increaseHappiness();
        markTaskAsChecked('play');
        resetPiyoImage();
        break;
      case 'medicine':
        // energy:+1
        document.querySelector('#piyo').src = './assets/megusuri-shippai.png';
        increaseEnergy();
        markTaskAsChecked('medicine');
        resetPiyoImage();
        break;
      case 'clean':
        // #clean（opacity: 0 -> 1） happiness:+1 or happiness:-1
        document.querySelector('#poop').style.opacity = '0';
        increaseHappiness();
        markTaskAsChecked('clean');
        resetPiyoImage();
        setTimeout(() => {
          document.querySelector('#poop').style.opacity = '1';
          decreaseHappiness();
        }, 180000)
        break;
      case 'scale':
        // happiness:+1
        document.querySelector('#piyo').src = './assets/taiju.png';
        increaseHappiness();
        markTaskAsChecked('weight');
        resetPiyoImage();
        break;
      case 'education':
        // energy:-1 happiness:+1
        document.querySelector('#piyo').src = './assets/study-piyoyo.png';
        decreaseEnergy();
        increaseHappiness();
        markTaskAsChecked('teach');
        resetPiyoImage();
        break;
      case 'conversation':
        // energy:-1 happiness:+1
        document.querySelector('#piyo').src = './assets/missetu.png';
        //-- Write by Jquery --//
        const messageText = $('<p></p>')
          .addClass('message-text')
          .text(conversations[Math.floor(Math.random() * conversations.length)]);
        $('#message').append(messageText);
        setTimeout(() => {
          messageText.remove();
        }, 3000);
        //-- Write by Jquery --//
        decreaseEnergy();
        increaseHappiness();
        markTaskAsChecked('talk');
        resetPiyoImage();
        break;
    }
  }

    document.querySelectorAll('#action button').forEach(button => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      if (canExecuteAction(action)) {
        handleAction(action);
      }
    });
  });
})
