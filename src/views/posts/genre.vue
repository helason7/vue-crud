<script setup>
    //import ref
    import { ref, onMounted } from "vue";

    //import router
    import { useRouter, useRoute } from 'vue-router';

    //import api
    import api from "../../api";

    //init router
    const router = useRouter();

    const route = useRoute();

    //define state
    const genre = ref("");
    const value = ref("");
    const errors = ref([]);
    const id = route.params.id;
    const isEdit = route.params.isEdit;
    const posts = ref([]);
    
    //method fetchDataPosts
    const fetchDataPosts = async () => {

        //fetch data 
        await api.get('/api/v2/genres')

        .then(response => {

            //set response data to state "posts"
            console.log('res: ', response.data)
            posts.value = response.data
            // datas = response.data

        });
    }
    //run hook "onMounted"
    onMounted(() => {

        //call method "fetchDataPosts"
        fetchDataPosts();
    });
    //method deletePost
    const deletePost = async (id) => {

        //delete post with API
        await api.delete(`/api/v2/genres/${id}`)
        .then(() => {

            //call method "fetchDataPosts"
            fetchDataPosts();
        })

    };

    console.log('isEdit: ', route.params.isEdit)
    //method "storePost"
    const storePost = async () => {

        //init formData
        let formData = new FormData();

        //assign state value to formData
        formData.append("genre", genre.value);
        formData.append("value", value.value);

        console.log('formData: ', formData);
        //store data with API
        const headers = {
            'Content-Type':'application/json'
        }
        await api.post('/api/v2/genres', formData, { headers: headers})
        // await axios.post('localhost:8080/api/v1/movies', formData)
        .then(() => {
            //redirect
            if(isEdit == 0){
                router.push({ path: "/create" });
            }else{
                router.push({ name: "posts.edit", params: {id: id}});
            }
            
        })
        .catch((error) => {
            //assign response error data to state "errors"
            console.log('errs: ', error)
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
                                <label class="form-label fw-bold">Add New Genre</label>
                                <input type="text" class="form-control" v-model="genre" placeholder="new Genre">
                                <div v-if="errors.genre" class="alert alert-danger mt-2">
                                    <span>{{ errors.genre[0] }}</span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Value</label>
                                <input type="text" class="form-control" v-model="value" placeholder="Genre value">
                                <div v-if="errors.value" class="alert alert-danger mt-2">
                                    <span>{{ errors.value[0] }}</span>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-md btn-primary rounded-sm shadow border-0">Save</button>
                        </form>
                        <br>
                            <table class="table table-bordered">
                            <thead class="bg-dark text-white">
                                <tr>
                                    <th scope="col">Id Genre</th>
                                    <th scope="col">Genre Name</th>
                                    <th scope="col">Genre Value</th>
                                    <th scope="col" style="width:15%">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="posts.length == 0">
                                    <td colspan="6" class="text-center">
                                        <div class="alert alert-danger mb-0">
                                            Data Belum Tersedia!
                                        </div>
                                    </td>
                                </tr>
                                <tr v-else v-for="(post, index) in posts" :key="post.id">
                                    <td>{{ post.id }}</td>
                                    <td>{{ post.genre }}</td>
                                    <td>{{ post.value }}</td>
                                    <td class="text-center">
                                       <button @click.prevent="deletePost(post.id)" class="btn btn-sm btn-danger rounded-sm shadow border-0">DELETE</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>