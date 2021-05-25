<template>
    <!-- <div ref="stage-parent"> -->
        <div ref="stage-container"></div>
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
            trigger: {
                type: Date,
                default: null
            },
            currentIndex: {
                type: Number,
                default: -1
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
            }
        },
        methods: {
            initSetting() {
              console.log(">>>>>>>>>>>>>>>>", screen.width);
                this.stageConfig.height = this.height;
                this.stageConfig.width = screen.width;
                this.stageConfig.centerX = this.stageConfig.width / 2;
            },
            refreshTextSetting() {
                this.itemConfig.width = this.width;
                this.itemConfig.fontSize = Math.ceil(this.stageConfig.height / 2.5);

                console.log( this.stageConfig.height);
                this.itemConfig.height = this.height;
                this.itemConfig.startX = 0;//-this.itemConfig.width// * 1.3;
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
                    //this.$refs["stage-container"].children[0].style['padding-bottom'] = `${this.stageConfig.height / this.stageConfig.width * 100}%`;
                    this.$refs["stage-container"].children[0].style['position'] = '';
                    // this.$refs["stage-container"].children[0].children[0].style.width = '100%';
                    // this.$refs["stage-container"].children[0].children[0].style.height = '100%';
                    this.$refs["stage-container"].children[0].children[0].style['position'] = '';
                    this.$refs["stage-container"].children[0].children[0].style['object-fit'] = 'contain';
                }
            },
            drawBorder() {
                this.layer.add(new Konva.Line({
                    x: 0,
                    y: 0,
                    points: [this.stageConfig.centerX + this.itemConfig.width / 2, 0, this.stageConfig.centerX + this.itemConfig.width / 2, this.itemConfig.height],
                    stroke: 'black',
                    dash: [1],
                    opacity: 0.5,
                }));
                this.layer.add(new Konva.Line({
                    x: 0,
                    y: 0,
                    points: [this.stageConfig.centerX - this.itemConfig.width / 2, 0, , this.stageConfig.centerX - this.itemConfig.width / 2, this.itemConfig.height],
                    stroke: 'black',
                    dash: [1],
                    opacity: 0.5,
                }));
                this.layer.add(new Konva.Rect({
                    x: 0,
                    y: 0,
                    width: this.stageConfig.width,
                    height: this.stageConfig.height,
                    stroke: 'black',
                    strokeWidth: 5,
                }));
                this.stage.draw();
            },
            drawItems() {
                this.items.forEach(e => {
                    e.remove();
                });
                this.items = [];
                let list = this.list.length > 5 ? [...this.list] : [...this.list, ...this.list];
                list.forEach((e, index) => {
                    let vm = this;
                    console.log(vm.width, vm.height);
                    var theImage = new Image();
                    // theImage.cache({pixelRatio: 1});
                    theImage.onload = function(){
                      let img = new Konva.Image({
                        image: theImage,
                        width: vm.width, 
                        height: vm.height,
                        x: index * vm.itemConfig.width * 1.2+ vm.itemConfig.startX,
                      });
                     
                      vm.layer.add(img);
                      vm.items.push(img);
                    }

                    let src = require('@/assets/Cards/Prompt/' + e.text + '.png');
                    theImage.src = src;
                
                });
                this.stage.draw();
            },

            drawAll() {
                this.layer.children.forEach(e => e.remove());
                this.drawItems();
                this.drawBorder();
            },

            start() {
                this.acc = 100;
                this.stopping = false;
                this.currentItem = this.currentIndex === -1 ?
                    this.items[this.random(0, this.items.length - 1)] : this.items[this.currentIndex];
                this.animation.start();
            },

            complete() {
                this.$emit('onComplete', this.currentItem.attrs.data);
            },

            moveItems(acc) {
                this.items.forEach(e => {
                    let x = (acc + e.x() - this.itemConfig.startX) %
                        (this.items.length * this.itemConfig.width) + this.itemConfig.startX;
                    e.setX(x);
                });
            },

            tweenMoveItems(distance) {
                this.items.forEach(e => {
                    let tween = new Konva.Tween({
                        node: e,
                        duration: 0.1,
                        x: e.x() + distance,
                    });
                    tween.play();
                });
            },

            createAnimation() {
                let self = this;
                this.animation = new Konva.Animation(function () {
                    self.moveItems(self.acc);
                    if (!self.stopping && self.acc > 25) {
                        self.acc = Math.max(self.acc - Math.random(), 25);
                    } else {
                        self.stopping = true;
                    }
                    if (self.stopping && self.currentItem.x() > 0 && self.currentItem.x() < self.stageConfig.centerX) {
                        self.tweenMoveItems(self.stageConfig.centerX - (self.currentItem.x() + self.itemConfig.fontSize / 2.5));
                        self.acc = 0;
                        self.animation.stop();
                        self.complete();
                    } else if (self.stopping && self.currentItem.x() > self.stageConfig.centerX) {
                        self.acc = Math.max(self.acc - Math.random() % 0.2, 5);
                    }
                }, this.layer);
            },
            random(min, max) {
                return min + Math.floor(Math.random() * (max - min + 1));
            }
        },
        watch: {
            trigger() {
                this.start();
            },
            list() {
                if (this.stage != null) {
                    this.drawAll();
                }
            },
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

<style scoped lang="scss">
</style>