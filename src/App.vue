<template>
    <div class="container my-4">
        <div class="row mb-3">
            <div id="image" class="offset-6 col-6 mb-3">
                <img class="img-thumbnail float-right" style="max-height: 200px" src="http://via.placeholder.com/200x200?text=No+image+selected">
            </div>
            <div class="offset-6 col-6">
                <div class="custom-file">
                    <input type="file" class="custom-file-input" id="customFile" v-on:change="encodeImageFileAsURL($event)" accept="image/jpeg">
                    <label class="custom-file-label" for="customFile">Choose image (only jpeg & aspect ratio 1:1)</label>
                </div>
            </div>
        </div>
        <div class="row">
            <briefInput :css="'col-6'" :name="'address'" :placeholder="'add the recipient here'" :rows="5" v-on:open-modal="openModal"></briefInput>
            <briefInput :css="'col-6'" :textareacss="'text-right'" :name="'additional information'" :placeholder="'add additional information here (e.g date)'" :rows="5" v-on:open-modal="openModal"></briefInput>
        </div>
        <div class="row">
            <briefInput :css="'col-12'" :name="'reference'" :placeholder="'add the reference here'" :rows="1" v-on:open-modal="openModal"></briefInput>
        </div>
        <div class="row">
            <briefInput :css="'col-12'" :name="'text'" :placeholder="'add the text here'" :rows="10" v-on:open-modal="openModal"></briefInput>
        </div>
        <div class="row mt-3 mb-5">
            <div class="col-8 pr-0">
                <button v-on:click="saveDocument" class="btn btn-block btn-dark" style="border-radius: 4px 0 0 4px;">save as</button>
            </div>
            <div class="col-3 px-0">
                <input v-model="file" class="form-control text-center" type="name" name="file" style="border-radius: 0;border-left: 0;border-right: 0">
            </div>
            <div class="col-1 pl-0">
                <label class="d-flex justify-content-center align-items-center bg-light" style="height:100%;border-radius: 0 4px 4px 0;border:1px solid #ced4da">.pdf</label>
            </div>
        </div>
        <briefModal v-if="modalIsOpen === true" :name="modalName" :value="modalValue" v-on:close-modal="closeModal"></briefModal>
    </div>
</template>

<script>
import briefInput from './components/briefInput';
import briefModal from './components/briefModal';
import {createPdf} from './components/pdfCreator';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

export default {
    name       : 'App',
    components : {
        briefInput, briefModal
    },
    data(){
        return {
            modalIsOpen : false,
            image       : null,
            file        : 'brief'
        };
    },
    mounted(){
        if (process.env.NODE_ENV === 'production'){
            OfflinePluginRuntime.install();
        }
    },
    methods: {
        openModal(e){
            this.modalName   = e.target;
            this.modalValue  = e.value;
            this.modalIsOpen = true;
        },
        closeModal(){
            this.modalName   = null;
            this.modalIsOpen = false;
        },
        saveDocument(){
            var vars = {};
            this.$children.forEach((d) => {
                vars[d.name] = d.briefInputValue;
            });

            if (this.image){
                vars.image = this.image;
            }

            createPdf(vars, this.file);
        },
        encodeImageFileAsURL(e){
            var filesSelected = e.target.files;
            var that          = this;
            if (filesSelected.length){
                var fileToLoad = filesSelected[0];
                var fileReader = new FileReader();

                fileReader.onload = function(fileLoadedEvent){
                    var srcData  = fileLoadedEvent.target.result;
                    var newImage = document.createElement('img');

                    newImage.setAttribute('class', 'img-thumbnail float-right');
                    newImage.style.maxHeight = '200px';
                    newImage.src = srcData;
                    that.image   = {
                        src: srcData
                    };

                    document.getElementById('image').innerHTML = newImage.outerHTML;

                    newImage.onload = function(){
                        that.image   = {
                            src    : srcData,
                            width  : this.width,
                            height : this.height
                        };
                    };
                };
                fileReader.readAsDataURL(fileToLoad);
            }
        }
    }
};
</script>

<style lang="scss">
@import './assets/css/bootstrap.css';
@import './assets/css/hint.css';
@import './assets/css/fork-awesome.css';
#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

button.close{
    outline: none !important;
    box-shadow: none !important;
}

#image{
    max-height: 200px;
}

header.container-fluid{
    background: rgba(179,220,237,1);
    background: -moz-linear-gradient(45deg, rgba(179,220,237,1) 0%, rgba(41,184,229,1) 15%, rgba(188,224,238,1) 100%);
    background: -webkit-gradient(left bottom, right top, color-stop(0%, rgba(179,220,237,1)), color-stop(15%, rgba(41,184,229,1)), color-stop(100%, rgba(188,224,238,1)));
    background: -webkit-linear-gradient(45deg, rgba(179,220,237,1) 0%, rgba(41,184,229,1) 15%, rgba(188,224,238,1) 100%);
    background: -o-linear-gradient(45deg, rgba(179,220,237,1) 0%, rgba(41,184,229,1) 15%, rgba(188,224,238,1) 100%);
    background: -ms-linear-gradient(45deg, rgba(179,220,237,1) 0%, rgba(41,184,229,1) 15%, rgba(188,224,238,1) 100%);
    background: linear-gradient(45deg, rgba(179,220,237,1) 0%, rgba(41,184,229,1) 15%, rgba(188,224,238,1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#b3dced', endColorstr='#bce0ee', GradientType=1 );
}

.fadeout{
    opacity: 1;
    animation-name: fadeout;
    animation-duration: 340ms;
    animation-fill-mode: forwards;
}

.fadein{
    opacity: o;
    animation-name: fadein;
    animation-duration: 340ms;
    animation-fill-mode: forwards;
}

@keyframes fadein {
    from {opacity: 0;}
    to {opacity: 1;}
}

@keyframes fadeout {
    from {opacity: 1;}
    to {opacity: 0;}
}
</style>
