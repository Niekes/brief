<template>
    <div v-bind:class="[css, 'mb-3']">
        <textarea v-bind:class="[textareacss]" class="form-control my-2" v-model.trim="briefInputValue" type="text" v-bind:name="name" v-bind:placeholder="placeholder" v-bind:rows="rows"></textarea>
        <button :aria-label="'open ' + name" class="btn btn-secondary hint--bottom hint--rounded pull-right ml-2" v-on:click="loadLoadModule(name)"><i class="fa fa-folder-open-o" aria-hidden="true"></i></button>
        <button :aria-label="'save ' + name" class="btn btn-secondary hint--bottom hint--rounded pull-right" v-on:click="loadSaveModule(name)"><i class="fa fa-floppy-o" aria-hidden="true"></i></button>
    </div>
</template>

<script>
import {loadValues} from '@/components/valueHandler';
export default {
    name  : 'briefInput',
    props : ['name', 'placeholder', 'rows', 'css', 'textareacss'],
    data(){
        return {
            briefInputValue: null
        };
    },
    methods: {
        loadSaveModule(target){
            if (!this.briefInputValue){
                return;
            }

            if (this.rows === 1){
                this.briefInputValue.replace(/[\r\n\v]+/g, '');
            }

            this.$emit('open-modal', {target: target, value: this.briefInputValue});
        },
        loadLoadModule(target){
            loadValues(target, this.callback);
        },
        callback(value){
            this.briefInputValue = value;
        }
    }
};
</script>

<style scoped>
    textarea {
        resize: none;
    }
</style>
