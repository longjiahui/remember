<template>
    <div class="knowledge box">
        <div v-if="knowledge.categories" class="knowledge-categories">{{knowledge.categories}}</div>
        <div class="knowledge-time" v-if="knowledge._next_date">{{getTimeDesc(knowledge._next_date)}}</div>
        <div class="knowledge-content">{{knowledge.content}}</div>
        <div class="process-bar" :style="{'--process': knowledge.level?(knowledge.c_level?knowledge.c_level:0)/knowledge.level:1}"></div>
    </div>
</template>

<script>
const dms = 1 * 24 * 60 * 60 * 1000;
export default {
    props:{
        knowledge: {
            type: Object,
            default: ()=>({})
        }
    },
    methods: {
        getTimeDesc(time){
            let offset = time - Date.now();

            offset = offset / dms;
            let d = Math.floor(offset);
            if(isNaN(d)){
                return '';
            }else if (d < 0){
                return '待复习';
            }else if(d === 0){
                return '今天需要复习';
            }else if(d === 1){
                return '明天需要复习';
            }else if(d === 2){
                return "后天需要复习";
            }else if(d === 3){
                return "大后天需要复习";
            }else {
                return `${d}天后需要复习`;
            }
        }
    }
}
</script>

<style lang="less" scoped>
.knowledge-content{
    word-break: break-all;
    color: var(--text-color-default);
}
.knowledge{
    max-width: 100%;
    padding: 15px;
    position: relative;
}
.knowledge-categories{
    font-weight: bold;
    margin-bottom: 3px;
}
.knowledge-time{
    font-size: var(--fsS);
    margin-bottom: 8px;
}
.process-bar{
    position: absolute;
    width: 100%;
    height: 3px;
    background: black;
    bottom: 0;
    left: 0;
    opacity: var(--process, 0);
    transform: scaleX(var(--process, 0));
    transform-origin: left;
}
</style>