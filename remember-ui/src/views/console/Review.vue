<template>
    <div class="main-content">
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
            <transition-group tag="div" name="slide-fade" class="knowledge-group">
                <div
                    v-for="(knowledge, index) in knowledges"
                    :key="knowledge._id"
                    @click="handleReview(knowledge._id, index)"
                    class="for-anime">
                    <knowledge
                        class="opacity-hover"
                        :knowledge="knowledge"></knowledge>
                </div>
                <div :key="$utils.uuid()" v-if="!refetchLock && !(knowledges && knowledges.length > 0)" class="inline-box" style="padding: 10px;border-radius: 5px;color: var(--text-color-light)">😀 全都复习完了</div>
            </transition-group>
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
import Knowledge from '@/components/Knowledge';
const pageSize = 15;
export default {
    components:{
        Knowledge
    },
    data(){
        return {
            refetchLock: false,
            knowledges: [],
            no: 1,
            pageSize,
            total: 0,
        }
    },
    created(){
        this.refetchData();
    },
    methods:{
        refetchData(){
            if(!this.refetchLock){
                this.refetchLock = true;
                this.$api.knowledge.pagination({
                    no: this.no,
                    size: pageSize,
                    review: true,}).then(({total, data})=>{
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
        handleReview(_id, i){
            this.$api.knowledge.review(_id).then(()=>{
                this.knowledges.splice(i, 1);
            });
        },
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

.knowledge{
    cursor: pointer;

}
</style>