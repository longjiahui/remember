<template>
    <div class="main-content">
        <div class="new-block">
            <knowledge-editor @show="hideOtherEditor(arguments[0])" ref="knowledgeEditorNew" @new="handleNewKnowledge">
                <div class="box button opacity-hover button-large btn-add button-with-radius container-column column-center-vertical"><i class="iconfont icon-add" style="margin-right: 5px"></i>新建知识</div>
            </knowledge-editor>
        </div>
        <transition name="slide-fade">
            <el-pagination
                @current-change="refetchData"
                :current-page.sync="no"
                v-if="total / pageSize > 1"
                class="inline-box"
                :page-size="pageSize"
                :pager-count="11"
                layout="prev, pager, next"
                :total="total">
            </el-pagination>
        </transition>
        <!-- <transition-group name="slide-fade" tag="div" class="knowledge-group auto-width"> -->
            <div class="knowledge-group">
                <knowledge-editor
                    @show="hideOtherEditor(arguments[0])"
                    @delete="knowledges.splice(index, 1) && --total"
                    ref="knowledgeEditor"
                    :knowledge.sync="knowledge"
                    v-for="(knowledge, index) in knowledges"
                    :key="knowledge._id">
                    <knowledge :knowledge="knowledge"></knowledge>
                </knowledge-editor>
                <div :key="$utils.uuid()" v-if="!refetchLock && !(knowledges && knowledges.length > 0)" class="inline-box" style="padding: 10px;border-radius: 5px;color: var(--text-color-light)">暂无知识</div>
            </div>
        <!-- </transition-group> -->
        <transition name="slide-fade">
            <el-pagination
                @current-change="refetchData"
                :current-page.sync="no"
                v-if="total / pageSize > 1"
                class="inline-box"
                :page-size="pageSize"
                :pager-count="11"
                layout="prev, pager, next"
                :total="total">
            </el-pagination>
        </transition>
    </div>       
</template>

<script>
import KnowledgeEditor from '@/components/KnowledgeEditor';
import Knowledge from '@/components/Knowledge';

const pageSize = 15;

export default {
    components:{
        KnowledgeEditor,
        Knowledge
    },
    data(){
        return {
            knowledges: [],
            total: 0,
            pageSize,
            no: 1,

            refetchLock: false,
        };
    },
    created(){
        this.refetchData();
    },
    methods: {
        handleNewKnowledge(newKnowledge){
            this.knowledges.unshift(newKnowledge);
            ++total;
            if(this.knowledges.length === pageSize){
                this.knowledges.pop()
            }
        },
        refetchData(){
            if(!this.refetchLock){
                this.refetchLock = true;
                this.$api.knowledge.pagination({
                    no: this.no,
                    size: pageSize}).then(({total, data})=>{
                    this.total = total;
                    if(this.knowledges && this.knowledges.length > 0){
                        this.knowledges = [];
                        this.$nextTick(()=>{
                            setTimeout(()=>{
                                this.knowledges = data?data:[];
                                this.refetchLock = false;
                            }, 500);
                        });
                    }else{
                        this.knowledges = data?data:[];
                        this.refetchLock = false;
                    }
                });
            }
        },
        hideOtherEditor(current){
            this.$refs.knowledgeEditor.forEach(editor=>{
                if(editor._uid !== current._uid){
                    editor.hide();
                }
            })
            if(this.$refs.knowledgeEditorNew._uid !== current._uid){
                this.$refs.knowledgeEditorNew.hide();
            }
        }
    }
}
</script>

<style lang="less" scoped>
.main-content{
    padding: 20px 0;
    &>*{
        margin-bottom: 20px;

        &:last-child{
            margin-bottom: 0;
        }
    }
}

.btn-add{
    display: inline-flex;
    transition: all .3s;
    &:hover{
        opacity: .7;
    }
}
.knowledge-group{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    // align-items: left;
    &>div{
        margin-bottom: 15px;
        &:last-child{
            margin-bottom: 0
        }
    }
}
</style>