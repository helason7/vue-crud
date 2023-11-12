<script setup>

    //import ref and onMounted
    import { ref, onMounted, computed } from 'vue';

    //import api
    import api from '../../api';

    //define state
    const posts = ref([]);

    const searchTerm = ref('');

    //method fetchDataPosts
    const fetchDataPosts = async () => {

        //fetch data 
        await api.get('/api/v1/movies')

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
        await api.delete(`/api/v1/movies/${id}`)
        .then(() => {

            //call method "fetchDataPosts"
            fetchDataPosts();
        })

    };

    const filtered = computed(() => {
    return posts.value.filter(post => {
        // You can customize this condition based on your search requirements
        console.log('post: ', post)
        return (
            post.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
            post.director.toLowerCase().includes(searchTerm.value.toLowerCase())
        );
    });
});
    
</script>

<template>
    <div class="container mt-5 mb-5">
     <h1 class="display-5 fw-bold">Movies Collection</h1>
        <div class="row">
            <div class="col-md-12">
                <router-link :to="{ name: 'posts.create' }" class="btn btn-md btn-success rounded shadow border-0 mb-3">Add New Movie</router-link>
                <div class="card border-0 rounded shadow">
                    <div class="card-body">
                        <div class="search-container">
                            <!-- <div class="input-group"> -->
                                <div class="form-outline">
                                    <input type="search" v-model="searchTerm" placeholder="Search...">
                                </div>
                            <!-- </div> -->
                        </div>
                        
                        <br>
                        <div class="table-container">

                            <table class="table table-bordered">
                            <thead class="bg-dark text-white">
                                <tr>
                                    <th scope="col">Image</th>
                                    <th scope="col">Title</th>
                                    <th scope="col">Director</th>
                                    <th scope="col">Summary</th>
                                    <th scope="col">Genres</th>
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
                                <tr v-else v-for="(post, index) in filtered" :key="post.id">
                                    <td class="text-center">
                                        <img :src="post.image" width="200" class="rounded-3"/>
                                    </td>
                                    <td>{{ post.title }}</td>
                                    <td>{{ post.director }}</td>
                                    <td>{{ post.summary }}</td>
                                    <td>{{ post.genres }}</td>
                                    <td class="text-center">
                                        <router-link :to="{ name: 'posts.edit', params:{id: post.id} }" class="btn btn-sm btn-primary rounded-sm shadow border-0 me-2">EDIT</router-link>
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
    </div>
</template>

<style scoped>
.search-container {
  text-align: right;
  margin-bottom: 10px;
}

.table-container {
  overflow-x: auto; /* Enable horizontal scrolling for the table if needed */
}
</style>