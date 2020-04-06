<template>
    <div class="knowledge box">
        <div v-if="knowledge.categories" class="knowledge-categories">{{knowledge.categories}}</div>
        <div class="knowledge-time">{{$utils.getTimeDescDetail(knowledge.date_create)}}</div>
        <div class="knowledge-content">{{knowledge.content}}</div>
        <div class="process-bar" :style="{'--process': knowledge.level?(knowledge.c_level?knowledge.c_level:0)/knowledge.level:1}"></div>
    </div>
</template>

<script>
export default {
    props:{
        knowledge: {
            type: Object,
            default: ()=>({})
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