<template>
    <div
        @mousedown.capture="handleMouseDown"
        @mouseup.capture="init"
        @mouseleave.capture="init"
        :style="`--delay-process: ${process}`">
        <slot></slot>
    </div>
</template>

<script>
export default {
    props:{
        speed: {
            type: Number,
            default: 0.02
        },
    },
    data(){
        return {
            process: 0,
            intervalInstance: null,
            lock: false,
        }
    },
    methods: {
        init(){
            this.process = 0;
            this.lock = false;
        },
        handleMouseDown(e){
            let _this = this;
            if(!this.lock){
                this.lock = true;
                requestAnimationFrame(function anime(){
                    _this.process += _this.speed;
                    if(_this.process <= 1){
                        if(_this.lock){
                            requestAnimationFrame(anime);
                        }
                    }else{
                        _this.process = 0;
                        _this.$emit('trigger');
                    }
                });
            }
        }
    }
}
</script>