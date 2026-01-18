/**
 * State Manager Component
 */

class StateManager {
  constructor() {
    this.states = {
      yes: {
        gifPostId: '24899483',
        gifAspectRatio: '1.77778',
        title: 'i knew you loved me back cutiepie 🥰',
        subtitle: 'lets plan our first date to the mountains🥹',
        showButtons: false,
        triggerConfetti: true
      },
      firstNo: {
        gifPostId: '17491012',
        gifAspectRatio: '1.34454',
        title: 'oyii please think again!',
        subtitle: 'itna jldi na ni kete 🙂‍↔️',
        showButtons: true,
        nextState: 'secondNo',
        triggerConfetti: false
      },
      secondNo: {
        gifPostId: '11740727',
        gifAspectRatio: '1.01633',
        title: 'aisha kyuinn kr rae ho ??',
        subtitle: 'maan vi jao yaal 🥺',
        showButtons: true,
        nextState: 'finalNo',
        triggerConfetti: false
      },
      finalNo: {
        gifPostId: '17773846',
        gifAspectRatio: '1.80791',
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
      return `yesOrNo.html?state=${config.nextState}`;
    }
    return 'yesOrNo.html?state=yes';
  }

  getYesUrl() {
    return 'yesOrNo.html?state=yes';
  }
}

window.StateManager = StateManager;
