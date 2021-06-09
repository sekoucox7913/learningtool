<template>
    <!-- <div ref="stage-parent"> -->
        <div>
            <div ref="stage-container">
                
            </div>
            <div ref="scroll_container" class="scroll_container">
                <v-img src="@/assets/Arrow-Left-icon.png" class="scroll prevBtn" @click="prev()" ></v-img> 
                <v-img src="@/assets/Arrow-Right-icon.png" class="scroll nextBtn" @click="next()"></v-img> 
            </div>
        </div>
        
    <!-- </div> -->
</template>

<script>
    /* eslint-disable */
    import 'konva';
    import Konva from 'konva';
    export default {
        props: {
            list: {
                type: Array,
            },
            shuffling: {
                type: Boolean,
                default: false
            },
            nextFlag: {
                type: Boolean, 
                default: false
            },
            prevFlag: {
                type: Boolean, 
                default: false
            },
            width: {
                type: Number,
                default: 500
            },
            height: {
                type: Number,
                default: 200
            },
            responsive: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                items: [],
                stageConfig: {
                    height: null,
                    width: null,
                    centerX: 0,
                },
                itemConfig: {
                    x: 0,
                    y: 0,
                    fontSize: 0,
                    spacing: 0,
                    width: 0,
                    height: 0,  // 產生時所需的高
                    startX: 0,  // 產生時的起始位置
                    align: 'center',
                    wrap: 'none',
                    ellipsis: true
                },
                animation: null,
                stopping: false,
                currentItem: null,
                acc: 100,
                stage: null,
                layer: null,
                currentIndex: -1,
                totalTime: 0,
                animationRunning: false,
                blur: false,
                isStopping: false,
                isScrolling: false,
            }
        },
        methods: {
            initSetting() {
                this.stageConfig.height = this.height;
                this.stageConfig.width = window.innerWidth;
                this.stageConfig.centerX = this.stageConfig.width / 2;
                console.log(window.innerWidth);
            },

            refreshTextSetting() {
                this.itemConfig.width = this.width + 40;
                this.itemConfig.height = this.height;
                this.itemConfig.startX = this.stageConfig.centerX - this.itemConfig.width / 2 - this.list.length / 2 * this.itemConfig.width;
            },
            
            initCanvas() {
                this.stage = new Konva.Stage({
                    container: this.$refs["stage-container"],
                    width: this.stageConfig.width,
                    height: this.stageConfig.height
                });
                 this.layer = new Konva.Layer();
                this.stage.add(this.layer);

               
                if (this.responsive) {
                   
                    this.$refs["stage-container"].children[0].style.width = '100%';
                    this.$refs["stage-container"].children[0].style.height = 'auto';
                    // this.$refs["stage-container"].children[0].style['padding-bottom'] = `${this.stageConfig.height / this.stageConfig.width * 100}%`;
                    this.$refs["stage-container"].children[0].style['position'] = '';
                    // this.$refs["stage-container"].children[0].children[0].style.width = '100%';
                    // this.$refs["stage-container"].children[0].children[0].style.height = '100%';
                    this.$refs["stage-container"].children[0].children[0].style['position'] = '';
                    this.$refs["stage-container"].children[0].children[0].style['object-fit'] = 'contain';
                    
                }
            },

            drawBorder() {
                // this.layer.add(new Konva.Line({
                //     x: 0,
                //     y: 0,
                //     points: [this.stageConfig.centerX + this.itemConfig.width / 2, 0, this.stageConfig.centerX + this.itemConfig.width / 2, this.itemConfig.height],
                //     stroke: 'black',
                //     dash: [1],
                //     opacity: 0.5,
                // }));
                // this.layer.add(new Konva.Line({
                //     x: 0,
                //     y: 0,
                //     points: [this.stageConfig.centerX - this.itemConfig.width / 2, 0, , this.stageConfig.centerX - this.itemConfig.width / 2, this.itemConfig.height],
                //     stroke: 'black',
                //     dash: [1],
                //     opacity: 0.5,
                // }));
                // this.layer.add(new Konva.Rect({
                //     x: 0,
                //     y: 0,
                //     width: this.stageConfig.width,
                //     height: this.stageConfig.height,
                //     stroke: 'black',
                //     strokeWidth: 5,
                // }));
                // this.stage.draw();
            },

            drawItems() {
                this.items.forEach(e => {
                    e.remove();
                });
                this.items = [];
                let list = this.list.length > 5 ? [...this.list] : [...this.list, ...this.list];
                list.forEach((e, index) => {
                    let self = this;  
                    var theImage = new Image();
                    theImage.onload = function(){
                      let img = new Konva.Image({
                        image: theImage,
                        width: self.itemConfig.width - 40, 
                        height: self.itemConfig.height - 20,
                        x:  index * self.itemConfig.width + self.itemConfig.startX + 10,
                        y: 10,
                      });
                      img.cache();
                      img.filters([Konva.Filters.Blur]);
                      self.layer.add(img);
                      self.items.push(img);
                    }

                    let src = require('@/assets/Cards/Prompt/' + e.text + '.png');
                    theImage.src = src;
                
                });

                this.stage.draw();

                this.currentIndex = this.list.length / 2;
                this.currentItem = this.items[this.currentIndex];
                this.updateBlur();

                this.$refs["scroll_container"].style.width = '100%'

            },

            drawAll() {
                this.layer.children.forEach(e => e.remove());
                this.drawItems();
                this.drawBorder();
            },

            start() {
                this.blur = false;
                this.acc = 100;
                this.stopping = false;
                this.currentIndex = this.random(0, this.items.length - 1);
                this.currentItem = this.items[this.currentIndex];
                this.items.forEach(e => {
                    if (e.blurRadius() == 0){
                        e.blurRadius(10);
                    }
                });
                this.animation.start();
            },

            stop(){
                if (this.isStopping === true){
                    return;
                }
                this.isStopping = true;
                
                this.tweenMoveItems(this.stageConfig.width / 2 - this.currentItem.x() - this.itemConfig.width / 2 + 10);
                this.updateBlur();
                this.blur = true;
                this.totalTime = 0;
                this.animation.stop();
                this.stopping = false;
                this.acc = 0;
                this.complete();
            },

            next(){
                if (this.isScrolling == true){
                    return;
                }
                this.isScrolling = true
                this.items.forEach((e, index) => {
                    let self = this
                    let tween = new Konva.Tween({
                        node: e,
                        duration: 0.3,
                        x: e.x() +   this.itemConfig.width,
                        onUpdate: function(){
                            self.componsate(index);
                        },
                        onFinish: function(){
                            if (index == self.items.length - 1){
                                self.updateBlur();
                                self.isScrolling = false;
                            }
                        }
                    });
                    tween.play();
                });
            },

            prev(){
                if (this.isScrolling == true){
                    return;
                }
                this.isScrolling = true
                this.items.forEach((e, index) => {
                    let self = this
                    let tween = new Konva.Tween({
                        node: e,
                        duration: 0.3,
                        x: e.x() - this.itemConfig.width,
                        onUpdate: function(){
                            self.componsate(index);
                        },
                        onFinish: function(){
                            if (index == self.items.length - 1){
                                self.updateBlur();
                                self.isScrolling = false;
                            }
                        }
                    });
                    tween.play();
                });
            },

            updateBlur(){
                this.items.forEach(e => {
                    if (e == this.currentItem){
                        e.blurRadius(0);
                    }else{
                        if (e.blurRadius() == 0){
                            e.blurRadius(10);
                        }
                    }
                });
            },

            componsate(index){
                let item = this.items[index];
                let x = item.x();
                if (x > this.stageConfig.centerX + this.items.length / 2 * this.itemConfig.width - this.itemConfig.width / 2){
                    x = (x - (this.stageConfig.centerX + this.items.length / 2 * this.itemConfig.width - this.itemConfig.width / 2)) + this.itemConfig.startX;
                }
                
                if (x < this.itemConfig.startX){
                    x = (x - this.itemConfig.startX) + (this.stageConfig.centerX + this.items.length / 2 * this.itemConfig.width - this.itemConfig.width / 2);
                }
                if (x < this.stageConfig.width / 2 + this.itemConfig.width / 2 && x >= this.stageConfig.width / 2 - this.itemConfig.width / 2){
                    this.currentItem = item; 
                    this.currentIndex = index;
                }
                item.setX(x);  
            }, 

            complete() {
                this.$emit('onComplete', this.currentItem.attrs.data);
            },

            moveItems(acc) {
                this.items.forEach((e, index) => {
                    let x = (acc + e.x())
                    e.setX(x);  
                    this.componsate(index);
                });
            },

            tweenMoveItems(distance, time = 0.01) {
                this.items.forEach((e, index) => {
                    let self = this
                    let tween = new Konva.Tween({
                        node: e,
                        duration: time,
                        x: e.x() + distance,
                        onFinish: function(){
                            if (index == self.items.length - 1){
                                self.isStopping = false;
                            }
                        }
                    });
                    tween.play();
                });
            },

            createAnimation() {
                let self = this;
                this.totalTime = 0;
                this.animation = new Konva.Animation(function (frame) {
                    self.moveItems(self.acc);
                    self.totalTime = self.totalTime + frame.timeDiff
                    if (!self.stopping && self.totalTime > self.random(2000, 3000)) {
                        self.stopping = true;
                    }

                    if (self.stopping && self.acc > 0) {
                        self.acc =  self.acc - Math.max(self.acc - Math.random(), 5);
                    }
                         
                    if (self.stopping && self.acc < 5) {
                        self.stop();
                    } 
                }, this.layer);
            },
            random(min, max) {
                return min + Math.floor(Math.random() * (max - min + 1));
            }
        },
        watch: {
            shuffling() {
                if (this.shuffling == false){
                    this.stop();
                }else{
                    this.start();
                }
            },
            list() {
                if (this.stage != null) {
                    this.drawAll();
                }
            },
            nextFlag(){
                this.next();
            },
            prevFlag(){
                this.prev();
            }
        },
        mounted() {
            this.initSetting();
            this.initCanvas();
            this.refreshTextSetting();
            this.createAnimation();
            this.drawAll();
        }
    }
</script>

<style type='text/css' scoped>
    .scroll{
        position: absolute;
        top: 15%;
        height: 70%;
        width: 100px;
        opacity: 0;
        transition: 0.5s;
    }

    .scroll:hover{
        opacity: 0.5;
    }

    .prevBtn{
        left: 0px;
    }

    .nextBtn{
        right: 0px;
    }
    
    .scroll_container{
        position: absolute;
        width: 100%;
        height: 350px;
        top: 1%;
    }

</style>