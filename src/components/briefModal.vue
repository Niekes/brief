<template>
    <div id="brief-modal" class="fadein">
        <div class="col-6 offset-6 mt-5">
            <button v-on:click="close" type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h1 class="font-weight-bold">save {{name}}</h1>
            <div class="row">
                <div class="col-9">
                    <input class="form-control" v-on:keydown.enter.prevent="save" v-model.trim="briefModalKey" type="text" :name="name">
                </div>
                <div class="col-3">
                    <button class="btn btn-secondary btn-block" :disabled="disabled" v-on:click="save">{{button}}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {saveValue} from '@/components/valueHandler';
export default {
    name  : 'briefModal',
    props : ['name', 'value'],
    data(){
        return {
            briefModalKey : null,
            button        : 'OK',
            disabled      : null
        };
    },
    mounted(){
        document.querySelector('#brief-modal').querySelector('input').focus();
        document.body.addEventListener('keyup', (e) => {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code === 27){
                this.close();
            }
        });
    },
    methods: {
        save(){
            if (!this.briefModalKey){
                return;
            }
            this.button   = '...saving';
            this.disabled = 'disabled';

            setTimeout(() => {
                this.button   = 'SAVED!';
                saveValue(this.name, this.value, this.briefModalKey);
            }, 743);

            setTimeout(() => {
                this.close();
            }, 1567);
        },
        close(){
            document.querySelector('#brief-modal').setAttribute('class', 'fadeout');
            setTimeout(() => {
                this.$emit('close-modal');
            }, 340);
        }
    }
};
</script>

<style scoped>
    #brief-modal{
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        z-index: 107000000000;
        background-color: rgba(255,255,255,.9);
    }

    #brief-modal > div{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
    }
</style>
