<template>
  <div class="container">
      <div class="element">
          <div class="musician">
              <p><strong>Name: </strong><input v-model="add.name"/></p>
              <p><strong>Band: </strong><input v-model="add.band"/></p>
              <p><strong>Instrument: </strong><input v-model="add.instrument"/></p>
              <button @click='addMusician()' :disabled="isEditing">Add</button>
          </div>
          <div class="musician" v-for="item in json" :key="item.id">
              <span>
                  <p>
                      <strong>Name: </strong>
                      <span v-if="!item.edit">{{item.name}}</span>
                      <span v-else><input v-model="update.name"/></span>
                    </p>
                  <p>
                      <strong>Band: </strong>
                      <span v-if="!item.edit">{{item.band}}</span>
                      <span v-else><input v-model="update.band"/></span>
                    </p>
                  <p>
                      <strong>Instrument: </strong>
                      <span v-if="!item.edit">{{item.instrument}}</span>
                      <span v-else><input v-model="update.instrument"/></span>
                    </p>
              </span>
              <span>
                  <button @click='deleteMusician(item._id)' :disabled="isEditing">Delete</button>
                  <button @click="editItem(item._id)" :disabled="!isEditable(item._id)">{{item.edit ? 'Cancel' : 'Edit'}}</button>
                  <button v-if="item.edit" @click='updateMusician(item._id)'>Update</button>
              </span>
          </div>
      </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'HelloWorld',
    props: {
        msg: String
    },
    data: () => ({
        json: '',
        id: '',
        update: {
            name: '',
            band: '',
            instrument: ''
        },
        add: {
            name: '',
            band: '',
            instrument: ''
        }
    }),
    mounted() {
        this.getMusicians()
    },
    computed: {
        isEditing() {
            if(this.json)
                return this.json.some(item => item.edit)
            return false    
        },
        url() {
            return process.env.NODE_ENV === 'production' ? 'https://musicians-back-end.herokuapp.com' : window.location.origin
        }
    },
    methods: {
        getMusicians() {
            axios.get(`${this.url}/musicians`)
                .then(response => {
                    response.data.forEach(item => item.edit = false)
                    this.json = response.data
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        updateMusician(id) {
            // const update = {
            //     ...(this.update.name ? { name: this.update.name } : {}),
            //     ...(this.update.band ? { band: this.update.band } : {}),
            //     ...(this.update.instrument ? { instrument: this.update.instrument } : {}),
            // }
            axios.put(`${this.url}/musicians/${id}`, this.update)
                .then(() => {
                    this.clearFields()
                    this.getMusicians()
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        addMusician() {
            if (this.add.name && this.add.band && this.add.instrument) {
                axios.post(`${this.url}/musicians`, this.add)
                    .then(() => {
                        this.clearFields()
                        this.getMusicians()
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        },
        deleteMusician(id) {
            axios.delete(`${this.url}/musicians/${id}`)
                .then(() => {
                    this.clearFields()
                    this.getMusicians()
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        clearFields() {
            this.id = ''
            this.json = ''
            this.update.name = ''
            this.update.band = ''
            this.update.instrument = ''
            this.add.name = ''
            this.add.band = ''
            this.add.instrument = ''
        },
        editItem(id) {
           const item = this.json.find(item => item._id === id)
           if(item.edit) {
               item.edit = false
               this.update.name = ''
               this.update.band = ''
               this.update.instrument = ''
           } else {
               item.edit = true
               this.update.name = item.name
               this.update.band = item.band
               this.update.instrument = item.instrument
           }
        },
        isEditable(id) {
            const item = this.json.filter(item => item.edit)[0]
            return item ? item._id === id : true
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.container {
    display: flex;

    .element {
        // flex-basis: 50%;

        .musician {
            text-align: left;
            margin-bottom: 1rem;;
            p {
                margin: 0;
            }
        }
    }
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
p {
    margin-bottom: 0px;
}
</style>
