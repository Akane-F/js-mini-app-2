document.addEventListener('DOMContentLoaded', () => {
  const foodModal = document.getElementById('foodModal');
  const closeModal = document.querySelector('.closeModal');
  const foodChoices = document.querySelectorAll('.food-choice');
  const foodDisplay = document.getElementById('foodDisplay');
  const emptyEnergy = document.getElementById('empty-energy');

// ゲージのステータス管理
let gauge = {
  energy: 5,
  happiness: 5,
};

function increaseEnergy() {
  if (gauge.energy < 5) {
    gauge.energy++;
    updateGauge('energy', gauge.energy, true);
  }
}

function decreaseEnergy() {
  if (gauge.energy > 0) {
    gauge.energy--;
    updateGauge('energy', gauge.energy, false);
  }
}

function increaseHappiness() {
  if (gauge.happiness < 5) {
    gauge.happiness++;
    updateGauge('happiness', gauge.happiness, true);
  }
}

function decreaseHappiness() {
  if (gauge.happiness > 0) {
    gauge.happiness--;
    updateGauge('happiness', gauge.happiness, false);
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
      // timeout
      setTimeout(() => {
        foodDisplay.classList.remove('show');
        foodDisplay.classList.add('hidden');
      }, 3000);
    })
  })

  // close modal
  if (closeModal) {
    closeModal.addEventListener('click', () =>{
      foodModal.classList.add('hidden');
    })
  }

  // empty-energy
  if (gauge.energy == 0) {
    emptyEnergy.classList.remove('hidden');
    emptyEnergy.classList.add('show');
  } else{
    emptyEnergy.classList.remove('show');
    emptyEnergy.classList.add('hidden');   
  }

  document.querySelectorAll('#action button').forEach(button => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      handleAction(action);
    });
  });

  function handleAction(action) {
    switch (action) {
      case 'eat':
        // #foodModal show
        foodModal.classList.remove('hidden');
        break;
      case 'sleep':
          // energy:+1
          document.querySelector('#piyo').src = './assets/suibun.png';
          document.querySelector('#moon').style.opacity = '1';
          increaseEnergy();
          setTimeout(() => {
            document.querySelector('#piyo').src = './assets/piyopiyo.gif';
            document.querySelector('#moon').style.opacity = '0';
          }, 3000);
        break;
      case 'game':
        // energy:-1 happiness:+1
        document.querySelector('#piyo').src = './assets/mizudeppou.png';
        decreaseEnergy();
        increaseHappiness();
        setTimeout(() => {
          if (gauge.energy == 0) {
            document.querySelector('#piyo').src = './assets/sick-piyo.png';
          } else {
            document.querySelector('#piyo').src = './assets/piyopiyo.gif';
          }
        }, 3000);
        break;
      case 'medicine':
        // energy:+1
        document.querySelector('#piyo').src = './assets/megusuri-shippai.png';
        increaseEnergy();
        setTimeout(() => {
            document.querySelector('#piyo').src = './assets/piyopiyo.gif';
          }, 3000);
        break;
      case 'clean':
        // #clean（opacity: 0 -> 1） happiness:+1 or happiness:-1
        document.querySelector('#poop').style.opacity = '0';
        increaseHappiness();
        setTimeout(() => {
          document.querySelector('#poop').style.opacity = '1';
          decreaseHappiness();
          if (gauge.happiness == 0) {
            document.querySelector('#piyo').src = './assets/boring-piyo.png';
          }
        }, 300000)
        break;
      case 'scale':
        // happiness:+1
        document.querySelector('#piyo').src = './assets/taiju.png';
        increaseHappiness();
        setTimeout(() => {
            document.querySelector('#piyo').src = './assets/piyopiyo.gif';
          }, 3000);
        break;
      case 'education':
        // energy:-1 happiness:+1
        document.querySelector('#piyo').src = './assets/study-piyoyo.png';
        decreaseEnergy();
        increaseHappiness();
        setTimeout(() => {
          if (gauge.energy == 0) {
            document.querySelector('#piyo').src = './assets/sick-piyo.png';
          } else {
            document.querySelector('#piyo').src = './assets/piyopiyo.gif';
          }
        }, 3000);
        break;
      case 'conversation':
        // energy:-1 happiness:+1
        document.querySelector('#piyo').src = './assets/missetu.png';
        decreaseEnergy();
        increaseHappiness();
        setTimeout(() => {
          if (gauge.energy == 0) {
            document.querySelector('#piyo').src = './assets/sick-piyo.png';
          } else {
            document.querySelector('#piyo').src = './assets/piyopiyo.gif';
          }
        }, 3000);
        break;
    }
  }
})
