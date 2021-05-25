<template>
  <v-app>
    <div class="container">
       <!-- // <div class="card_container"> -->
          <div class="card card_hidden" v-bind:class="[flipped ? 'cardRight' : 'card']">
            <!-- <v-img src = "./assets/Cards/Prompt/01.png"></v-img>    -->
            <v-img src = "./assets/Cards/Back/angry.png"></v-img>    
            <v-btn class="button english" @click="selectLanguage('English')">English</v-btn>
            <v-btn class="button kawahili" @click="selectLanguage('Kawahili')">Kawahili</v-btn>
          </div>
          <div class="card" v-bind:class="[flipped ? 'cardLeft' : 'card']" @click="flip()">
            <v-img src = "./assets/Cards/Front/angry.jpg"></v-img>
          </div>
        <!-- </div> -->

        <slot-machine class="slot_container"
            :list="list"
            :trigger="trigger"
            :height="350"
            :width="256"
            :responsive="true"
            @onComplete="onComplete">
        </slot-machine>
    </div>
    
  </v-app>
</template>


========================================================================================================================
===================================================== SCRIPT ===========================================================
========================================================================================================================
<script>

 import SlotMachine from './components/Slot_Machine';

export default {
  name: 'App',

  components: {
    "slot-machine": SlotMachine,
  },

  data: () => ({
    flipped: false,

    list: [
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
      {text: "40"}
    ],
    trigger: null,
  }),

  methods: {
    flip(){
      if (!this.flipped){
        this.flipped = !this.flipped;
      } 
    },

    selectLanguage(value){
      var asound = this.loadAudio("Ring01.wav");
      var aaduio = new Audio(asound);
      aaduio.play();
      this.start();
      console.log(value);
    },

    loadAudio(fileName){
      return require("@/assets/Sounds/" + fileName);
      // return require(this.getSoundPath() + fileName);
    },

    start(){
      this.trigger = new Date();
    },

    onComplete(data){
      console.log(data);
    }
  }
};
</script>

========================================================================================================================
===================================================== STYLE ===========================================================
========================================================================================================================

<style type='text/css' scoped>
  .container{
    position: relative;
    top: 5%;
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
    opacity: 0%;
    position: relative;
  }

  .cardLeft{
    transform:translate(-50%, 0);
  }

  .cardRight{
    transform:translate(50%, 0);
    opacity: 100%;
  }
  
  .button{
    position: absolute;
    left: 30%;
    width: 40%;
    opacity: 0%;
    background-color: aqua;
  }

  .kawahili{
    top: 31%;
    height: 20%;
  }

  .english{
    top: 63%;
    height: 10%;
  }

  .slot_container{
    position: relative; 
    top: 3%
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