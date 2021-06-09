<template>
  <v-app>
    <div class="container">
      <div class="card card_hidden" v-bind:class="[flipped ? 'cardRight' : 'card']">
        <v-img :src="backCard"></v-img> 
        
        <v-btn v-bind:class="[this.selected_card.lines == 2 ? 'lang_button english_two' : 'lang_button english_one']" @click="selectLanguage('English')">English</v-btn>
        <v-btn class="lang_button kawahili" @click="selectLanguage('Kawahili')">Kawahili</v-btn>
      </div>
      <div class="card" v-bind:class="[flipped ? 'cardLeft' : 'card']" @click="flip()">
        <v-img :src="frontCard"></v-img> 
      </div>


      <div class="text-center pt-10">
        <v-btn v-if="card_isShuffling" rounded color="primary" dark x-large @click="stop_Card()">Stop</v-btn>
        <v-btn v-else rounded color="primary" dark x-large @click="start_Card()">Shuffle</v-btn>
      </div>
      

      <div class="slot_container">
        <card-slot-machine
          :list="card_list"
          :shuffling="card_shuffling"
          :height="350"
          :width="260"
          :responsive="true"
          :nextFlag="card_nextFlag"
          :prevFlag="card_prevFlag"
          @onScrolling="onScrolling"
          @onComplete="onCardComplete"
          @stop_Card="stop_Card">
        </card-slot-machine>
      </div>


      <div class="text-center pt-10">
        <v-btn rounded color="primary" dark x-large @click="start_Prompt()">{{shuffleButtonLabel}}</v-btn>
      </div>
      

      <div class="slot_container">
        <slot-machine
          :list="prompt_list"
          :shuffling="prompt_shuffling"
          :height="350"
          :width="260"
          :responsive="true"
          :nextFlag="prompt_nextFlag"
          :prevFlag="prompt_prevFlag"
          @onComplete="onPromptComplete">
        </slot-machine>
      </div>
      
    </div>
  </v-app>
</template>


========================================================================================================================
===================================================== SCRIPT ===========================================================
========================================================================================================================
<script>

  import SlotMachine from './components/Slot_Machine';
  import CardSlotMachine from './components/CardSlotMachine';

export default {
  name: 'App',

  components: {
    "slot-machine": SlotMachine,
    "card-slot-machine": CardSlotMachine,
  },

  data: () => ({
    flipped: false,
    prompt_shuffling: false,
    prompt_nextFlag: false,
    prompt_prevFlag: false,
    shuffleButtonLabel: "Shuffle",
    card_shuffling: false,
    card_nextFlag: false,
    card_prevFlag: false,
    card_isShuffling: false,
    selected_cardIndex: 0, 
    selected_card: null,
    card_list: [
      {text: "angry", lines: 2},
      {text: "anxious", lines: 2},
      {text: "ashamed", lines: 2},
      {text: "bored", lines: 1},
      {text: "concerned", lines: 1},
      {text: "confident", lines: 1},
      {text: "confused", lines: 1},
      {text: "curious", lines: 1},
      {text: "defeated", lines: 1},
      {text: "disgust", lines: 1},
      {text: "doubtful", lines: 1},
      {text: "embarrassed", lines: 1},
      {text: "excited", lines: 1},
      {text: "exhausted", lines: 1},
      {text: "focused", lines: 1},
      {text: "frightened", lines: 2},
      {text: "frustrated", lines: 2},
      {text: "furious", lines: 1},
      {text: "happy", lines: 1},
      {text: "hopeful", lines: 1},
      {text: "jealous", lines: 1},
      {text: "lonely", lines: 1},
      {text: "loved", lines: 1},
      {text: "mischievous", lines: 1},
      {text: "panic", lines: 2},
      {text: "peaceful", lines: 1},
      {text: "playful", lines: 1},
      {text: "proud", lines: 2},
      {text: "sad", lines: 1},
      {text: "surprised", lines: 2},
    ],
    prompt_list: [
      {text: "01"},
      {text: "02"},
      {text: "03"},
      {text: "04"},
      {text: "05"},
      {text: "06"},
      {text: "07"},
      {text: "08"},
      {text: "09"},
      {text: "10"},
      {text: "11"},
      {text: "12"},
      {text: "13"},
      {text: "14"},
      {text: "15"},
      {text: "16"},
      {text: "17"},
      {text: "18"},
      {text: "19"},
      {text: "20"},
      {text: "21"},
      {text: "22"},
      {text: "23"},
      {text: "24"},
      {text: "25"},
      {text: "26"},
      {text: "27"},
      {text: "28"},
      {text: "29"},
      {text: "30"},
      {text: "31"},
      {text: "32"},
      {text: "33"},
      {text: "34"},
      {text: "35"},
      {text: "36"},
      {text: "37"},
      {text: "38"},
      {text: "39"},
      {text: "40"},
    ],
    frontCard: require("@/assets/Cards/Front/anxious.png"),
    backCard: require("@/assets/Cards/Back/angry.png"),
  }),

  methods: {
    flip(){
      // if (!this.flipped){
        this.flipped = !this.flipped;
      // } 
    },

    selectLanguage(lang){
      var asound = this.loadAudio(lang, this.selected_card.text);
      if (asound){
        var aaduio = new Audio(asound);
        aaduio.play();
      } 
    },

    loadAudio(lang, fileName){
      var file = null;
      try {
        file = require("@/assets/Sound/" + lang + "/" + fileName + ".ogg");
      }catch(e){
        alert(fileName, " File is not exist");
      }
      return file;
    },

    loadFrontCard(fileName){
      return this.loadCard("Front/", fileName);
    },

    loadBackCard(fileName){
      return this.loadCard("Back/", fileName);
    },

    loadCard(path, fileName){
      var file = null;
      try {
        file = require("@/assets/Cards/" + path + fileName + ".png");
      }catch(e){
        alert("File is not exist");
      }
      return file;
    },

    start_Prompt(){
      this.prompt_shuffling = !this.prompt_shuffling;
      if (this.prompt_shuffling){
        this.shuffleButtonLabel = "Stop!"
      }else{
        this.shuffleButtonLabel = "Shuffle!" 
      }
    },

    next_Prompt(){
      this.prompt_nextFlag = !this.prompt_nextFlag;
    },

    prev_Prompt(){
      this.prompt_prevFlag = !this.prompt_prevFlag;
    },

    onPromptComplete(data){
      this.prompt_shuffling = false;
      this.shuffleButtonLabel = "Shuffle!"
      console.log(data);
    },

    start_Card(){
      this.flipped = false;
      this.card_isShuffling = true;
      this.card_shuffling = true;
    },

    stop_Card(){
      this.card_shuffling = false;
    },

    next_Card(){
      this.card_nextFlag = !this.card_nextFlag;
    },

    prev_Card(){
      this.card_prevFlag = !this.card_prevFlag;
    },

    selectCard(){
      this.selected_card = this.card_list[this.selected_cardIndex];
      this.frontCard = this.loadFrontCard(this.selected_card.text);
      this.backCard = this.loadBackCard(this.selected_card.text);
    },

    onScrolling(){
      this.flipped = false;
    },

    onCardComplete(data){
      this.card_isShuffling = false;      
      this.selected_cardIndex = data;
      this.selectCard();
    },

    
  },
/////life cycle////////////// 
  created(){
    this.selected_cardIndex = this.card_list.length / 2
    this.selectCard();
  }

};
</script>

========================================================================================================================
===================================================== STYLE ===========================================================
========================================================================================================================

<style type='text/css' scoped>
  .container{
    position: relative;
    top: 2%;
  }
  .card_container {
    position: relative;
    width: 100%;    
  }

  .card {
    display: inline-flex;
    width: 20%;
    left: 40%;
    transition: 0.5s;
    position: absolute;
    top:0px;
  }

  .card_hidden {
    opacity: 0;
    position: relative;
  }

  .cardLeft{
    transform:translate(-50%, 0);
  }

  .cardRight{
    transform:translate(50%, 0);
    opacity: 1;
  }
  
  .lang_button{
    position: absolute;
    left: 30%;
    width: 70%;
    opacity: 0;
    background-color: aqua;
  }

  .kawahili{
    top: 30%;
  }

  .english_one{
    top: 50%;
  }

  .english_two{
    top: 63%;
  }

  .slot_container{
    position: relative; 
    /* top: 3% */
  }
  

  /* .konvajs-content{
    position: none;
  } */
  @media only screen and (max-width: 768px) {
    .card {
      left: 27.5%;
      width: 45%;
    }
  }
</style>