<script setup>
    //import ref
    import { ref, onMounted, computed } from "vue";

    //import router
    import { useRouter } from 'vue-router';

    //import api
    import api from "../../api";

    //init router
    const router = useRouter();

    //define state
    const image = ref("");
    const title = ref("");
    const director = ref("");
    const summary = ref("");
    const errors = ref([]);
    const items = ref([]);

    //onMounted
    onMounted( async () => {

        //fetch detail data post by ID
        await api.get(`/api/v2/genres`)
        .then(response => {
            
            //set response data to state
            items.value = response.data;
            console.log('res: ', items)

        });
    })

    const selectedItems = computed(() => {
        return items.value.filter(item => item.checked).map(item => item.genre);
    });

    //method for handle file changes
    const handleFileChange = (e) => {
        //assign file to state
        image.value = e.target.files[0];
    };

    //method "storePost"
    const storePost = async () => {

        //init formData
        let formData = new FormData();

        //assign state value to formData
        formData.append("title", title.value);
        formData.append("director", director.value);
        formData.append("genres", selectedItems.value);
        formData.append("summary", summary.value);

        console.log('formData: ', formData);

        const headers = {
            'Content-Type':'application/json'
        }
        await api.post('/api/v1/movies', formData, { headers: headers})
        // await axios.post('localhost:8080/api/v1/movies', formData)
        .then(() => {
            //redirect
            router.push({ path: "/posts" });
        })
        .catch((error) => {
            //assign response error data to state "errors"
            errors.value = error.response;
        });
    };
    
</script>

<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-12">
                <div class="card border-0 rounded shadow">
                    <div class="card-body">
                        <form @submit.prevent="storePost()">
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

                                <div v-for="(genre, index) in items" :key="index" class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="genre.checked" :id="'checkbox' + index" :value="genre.value">
                                <label :for="'checkbox' + index">{{ genre.genre }}</label>
                                </div>
                                <br>
                                <router-link :to="{ name: 'posts.genre', params: { isEdit: 0, id: 0} }" class="btn btn-md btn-success rounded shadow border-0 mb-3">
                                    add New Genre
                                </router-link>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Summary</label>
                                <textarea class="form-control" v-model="summary" rows="5" placeholder="Summary Post"></textarea>
                                <div v-if="errors.summary" class="alert alert-danger mt-2">
                                    <span>{{ errors.summary[0] }}</span>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-md btn-primary rounded-sm shadow border-0">Save</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>