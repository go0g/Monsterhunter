function attackValue(minAttack, maxAttack) {
  //get random integer between minAttack and maxAttack
  return Math.floor(Math.random() * (maxAttack - minAttack) + minAttack);
}

function checkWinner(monster, player) {
  if (monster <= 0 && player <= 0) {
    return "draw";
  }
  if (monster <= 0) {
    return "player";
  }
  if (player <= 0) {
    return "monster";
  }
  return null;
}

const app = Vue.createApp({
  data() {
    return {
      battleLog: [],
      monsterHealth: 100,
      playerHealth: 100,
      currentRound: 0,
      winner: null,
    };
  },
  watch: {
    monsterHealth(value) {
      this.winner = checkWinner(value, this.playerHealth);
    },
    playerHealth(value) {
      this.winner = checkWinner(this.monsterHealth, value);
    },
  },

  computed: {
    monsterBarStyles() {
      return this.monsterHealth < 0
        ? { width: "0%" }
        : { width: this.monsterHealth + "%" };
    },
    playerBarStyles() {
      return this.playerHealth < 0
        ? { width: "0%" }
        : { width: this.playerHealth + "%" };
    },
    mayUseSpecialAttack() {
      return this.currentRound % 3 !== 0;
    },
    winnerText() {
      switch (this.winner) {
        case "monster":
          return "You lost!";
          break;
        case "player":
          return "You win!";
          break;
        case "draw":
          return "Is a draw";
          break;
        default:
          return "";
          break;
      }
    },
  },
  methods: {
    attackMonster() {
      this.currentRound++;
      const attack = attackValue(5, 12);
      this.monsterHealth -= attack;
      this.addLogMessage('player', 'attack', attack);
      this.attackPLayer();
    },
    attackPLayer() {
      const attack = attackValue(8, 15);
      this.playerHealth -= attack;
      this.addLogMessage('monster', 'attack', attack);
    },
    specialAttackMonster() {
      this.currentRound++;
      const attack = attackValue(10, 25)
      this.monsterHealth -= attack;
      this.addLogMessage('player', 'speacial attack', attack)
      this.attackPLayer();
    },
    healPlayer() {
      this.currentRound++;
      const healValue = attackValue(8, 20);
      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += attackValue(8, 20);
      }
      this.addLogMessage('player', 'heal', healValue)
      this.attackPLayer();
    },
    surrender() {
      this.winner = "monster";
    },
    newGame() {
      this.battleLog = [];
      this.monsterHealth = 100;
      this.playerHealth = 100;
      this.currentRound = 0;
      this.winner = null;
    },
    addLogMessage(who, what, value) {
      this.battleLog.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
      console.log(this.battleLog);
    },
  },
});

app.mount("#game");
