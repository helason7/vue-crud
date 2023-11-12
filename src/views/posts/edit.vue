<script setup>
    //import ref
    import { ref, onMounted, computed } from "vue";

    //import router
    import { useRouter, useRoute } from 'vue-router';

    //import api
    import api from "../../api";

    //init router
    const router = useRouter();

    //init route
    const route = useRoute();
    
    //define state
    const image = ref("");
    const title = ref("");
    const summary = ref("");
    const genres = ref("");
    const director = ref("");
    const errors = ref([]);
    const items = ref([]);
    let parts = [];
    let isCheked = ref([]);
    const id = route.params.id;
    // const selectedItems = ref([]);

    //onMounted
    onMounted( async () => {

        //fetch detail data post by ID
        await api.get(`/api/v1/movies/${route.params.id}`)
        .then(response => {
            
            //set response data to state
            // console.log('res: ', response.data)
            title.value = response.data.title;
            director.value = response.data.director;
            genres.value = response.data.genres;
            summary.value = response.data.summary;
            parts.value = genres.value.split(',')
            
            console.log('part: ', parts.value)

        });
    })
 
    //onMounted
    onMounted( async () => {

    //fetch detail data post by ID
        await api.get(`/api/v2/genres`)
        .then(response => {
            
            //set response data to state
            items.value = response.data;
            console.log('res: ', parts.value)

            for (let index = 0; index < items.value.length; index++) {
               
                const element = parts.value;
                const el = items.value[index].genre;
                console.log('elemen: ', element)
                console.log('el: ', el)
                if (element.includes(el)) {
                    console.log(`${el} is in the array.`);
                    isCheked.value.push({
                        id: items.value[index].id,
                        checked: true,
                        name : items.value[index].genre
                    });
                }else{
                    console.log(`${el} tais.`);
                    isCheked.value.push({
                        id: items.value[index].id,
                        checked: false,
                        name : items.value[index].genre
                    });
                }
            }
            console.log('is: ',isCheked)

        });
    })

    const selectedItems = computed(() => {
        return isCheked.value.filter(item => item.checked).map(item => item.name);
    });
    //method for handle file changes
    const handleFileChange = (e) => {
        //assign file to state
        image.value = e.target.files[0];
    };

    //method "updatePost"
    const updatePost = async () => {

        //init formData
        let formData = new FormData();

        //assign state value to formData
        formData.append("image", image.value);
        formData.append("title", title.value);
        formData.append("summary", summary.value);
        formData.append("genres", selectedItems.value);
        formData.append("director", director.value);
        const headers = {
            'Content-Type':'application/json'
        }

        console.log(selectedItems.value, ': send')
        //store data with API
        await api.post(`/api/v1/movies/${route.params.id}`, formData,  { headers: headers})
        .then(() => {
            //redirect
            router.push({ path: "/posts" });
        })
        .catch((error) => {
            //assign response error data to state "errors"
            errors.value = error.response.data;
        });
    };

</script>

<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-12">
                <div class="card border-0 rounded shadow">
                    <div class="card-body">
                        <form @submit.prevent="updatePost()">
                            <div class="mb-3">
                                <label class="form-label fw-bold">Image</label>
                                <input type="file" class="form-control" @change="handleFileChange($event)">
                                <div v-if="errors.image" class="alert alert-danger mt-2">
                                    <span>{{ errors.image[0] }}</span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Title</label>
                                <input type="text" class="form-control" v-model="title" placeholder="Title Post">
                                <div v-if="errors.title" class="alert alert-danger mt-2">
                                    <span>{{ errors.title[0] }}</span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Director</label>
                                <input type="text" class="form-control" v-model="director" placeholder="Director Post">
                                <div v-if="errors.director" class="alert alert-danger mt-2">
                                    <span>{{ errors.director[0] }}</span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Genres</label>
                                <div v-for="item in isCheked" :key="item.id" class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="item.checked" :id="'checkbox' + item.id" :value="item.name">
                                <label :for="'checkbox' + index">{{ item.name }}</label>
                                </div>
                                <br>
                                <router-link :to="{ name: 'posts.genre', params: {isEdit: 1, id: id}}" class="btn btn-md btn-success rounded shadow border-0 mb-3">
                                    add New Genre
                                </router-link>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold"><Summary></Summary></label>
                                <textarea class="form-control" v-model="summary" rows="5" placeholder="Summary Post"></textarea>
                                <div v-if="errors.summary" class="alert alert-danger mt-2">
                                    <span>{{ errors.summary[0] }}</span>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-md btn-primary rounded-sm shadow border-0">Update</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>