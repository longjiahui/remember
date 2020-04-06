<template>
  <transition name="slide-fade" mode="out-in" appear>
    <div class="for-anime" v-if="!state" >
      <div :key="1" @click.capture="state = true" class="editor-hover">
        <slot></slot>
      </div>
    </div>
    <div :key="2" v-else style="width: 100%">
      <div class="box new-box container-row">
          <input v-model="_knowledge.categories" type="text" class="input input-categories" placeholder="(选填) 类别1, 类别2...">
          <textarea v-model="_knowledge.content" @keyup.enter="handleSaveKnowledge" @input="contentError = false" :class="`textarea textarea-content${contentError?' input-error':''}`" placeholder="(markdown) 请输入内容 ..."></textarea>
      </div>
      <div class="container-column column-space-between">
          <div class="box container-column">
            <div class="button opacity-hover" @click="state = false">取消</div>
            <div class="button opacity-hover primary" @click="handleSaveKnowledge">保存</div>
          </div>
          <div v-if="knowledge._id" class="button opacity-hover box" @click="handleDeleteKnowledge">删除</div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props:{
    knowledge: {
      type: Object,
      default: ()=>({})
    }
  },
  watch: {
    state: {
      immediate: true,
      handler(newState){
        if(newState){
          this.$emit('show', this);
        }
      }
    }
  },
  data(){
    return {
      state: false,
      _knowledge: {},
      contentError: false,
    }
  },
  mounted(){
    this._knowledge = this.knowledge;
  },
  methods:{
    hide(){
      this.state = false;
    },
    handleSaveKnowledge(){
      if(this._knowledge.content){
          //create
          this.$api.knowledge.save(this._knowledge).then((data)=>{
              if(this.knowledge._id){
                //update
                this.$emit('update:knowledge', data);
              }else{
                //insert
                this.$emit('new', data);
              }
              this._knowledge = {};
              this.state = false;
          });
      }else{
          this.contentError = true;
      }
    },
    handleDeleteKnowledge(){
      this.$api.knowledge.delete(this._knowledge._id).then(()=>{
        this.$emit('delete');
      })
    }
  }
}
</script>

<style scoped lang="less">
@import url(~@/assets/style/function);

.editor-hover{
  cursor: pointer;
  transition: all var(--speed-fast);
  &:hover{
    opacity: .7;
  }
}

.input-categories{
    border-bottom: 1px dashed lightgray;
}
.input-error{
    box-shadow: var(--shadow-error);
}
.textarea-content{
  transition: box-shadow var(--speed-slow);
  height: 100%;
}
.new-box{
  height: 300px;
  margin-bottom: 10px;
}
</style>
