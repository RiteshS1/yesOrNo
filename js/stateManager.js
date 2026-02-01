class StateManager {
  constructor() {
    this.states = {
      yes: {
        videoPath: './assets/yes.mp4',
        title: 'i knew you loved me back cutiepie 🥰',
        subtitle: 'lets plan our first date to the mountains🥹',
        showButtons: false,
        triggerConfetti: true
      },
      firstNo: {
        videoPath: './assets/firstNo.mp4',
        title: 'oyii please think again!',
        subtitle: 'itna jldi na ni kete 🙂‍↔️',
        showButtons: true,
        nextState: 'secondNo',
        triggerConfetti: false
      },
      secondNo: {
        videoPath: './assets/secondNo.mp4',
        title: 'aisha kyuinn kr rae ho ??',
        subtitle: 'maan vi jao yaal 🥺',
        showButtons: true,
        nextState: 'finalNo',
        triggerConfetti: false
      },
      finalNo: {
        videoPath: './assets/finalNo.mp4',
        title: 'beautifulll kitna code kr waoge😭',
        subtitle: 'thik ae ab agr ek aur No to hum aapko bhula denge',
        showButtons: true,
        nextState: null,
        triggerConfetti: false,
        randomButton: true
      }
    };
  }

  getCurrentState() {
    const urlParams = new URLSearchParams(window.location.search);
    const state = urlParams.get('state') || 'firstNo';
    return this.states[state] ? state : 'firstNo';
  }

  getStateConfig(state) {
    return this.states[state] || this.states.firstNo;
  }

  getNextStateUrl(currentState) {
    const config = this.getStateConfig(currentState);
    if (config.nextState) {
      return `?state=${config.nextState}`;
    }
    return '?state=yes';
  }

  getYesUrl() {
    return '?state=yes';
  }
}

window.StateManager = StateManager;
