<template>
  <v-data-table
    :headers="headers"
    :items="tasks"
    sort-by="name"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Tareas</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="700px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Nueva Tarea
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-form @submit.prevent="save">
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.name"
                      label="Nombre"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="editedItem.description"
                      label="Descripcion"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.status"
                      label="Estado"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-menu
                      v-model="menu"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedItem.start"
                          label="fecha Inicio"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editedItem.start"
                        @input="menu = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                     <v-menu
                      v-model="menu2"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedItem.end"
                          label="Fecha final"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editedItem.end"
                        @input="menu2 = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Cancelar
              </v-btn>
              <v-btn color="blue darken-1" text @click="save">
                Guardar
              </v-btn>
            </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItem"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon small @click="deleteItem(item)">
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>
<script>
import {mapGetters} from 'vuex'
import Swal from 'sweetalert2'

export default {
  name: "index",  
  async fetch ( context) {
   await context.store.dispatch('tasks/loadTasks')
  },
  data: () => ({
    menu: false,
    menu2: false,
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Nombre",
        align: "start",
        value: "name"
      },
      { text: "Descripcion", value: "description" },
      { text: "Estado", value: "status" },
      { text: "Fecha Inicio", value: "start" },
      { text: "Fecha fin", value: "end" },
      { text: "Acciones", value: "actions", sortable: false }
    ],
    editedIndex: -1,
    editedItem: {
      id: "",
      name: "",
      description: "",
      status: "",
      start: new Date().toISOString().substr(0, 10),
      end: new Date().toISOString().substr(0, 10)
    },
    defaultItem: {
      id: "",
      name: "",
      description: "",
      status: "",
      start: new Date().toISOString().substr(0, 10),
      end: new Date().toISOString().substr(0, 10)
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva tarea" : "Editar tarea";
    },
    ...mapGetters ({
      tasks: 'tasks/getTasks'
    })    
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    }
  }, 

  methods: {
    editItem(item) {
      this.editedIndex = this.tasks.indexOf(item);
      this.$store.commit('tasks/editTask', item)
      const newTask = this.$store.state.tasks.editTask
      this.editedItem = Object.assign({}, newTask);      
      this.dialog = true;
    },

    deleteItem(item) {    
      
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(async result => {
        if (result.isConfirmed) {
         await this.$store.dispatch('tasks/removeTask', item )          
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      });
      this.closeDelete();
    },

    // deleteItemConfirm() {
    //   this.tasks.splice(this.editedIndex, 1);      
    //   this.closeDelete();
    // },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      
      if (this.editedIndex > -1) {
        await this.$store.dispatch('tasks/updateTask', this.editedItem)
      } else {        
        await this.$store.dispatch('tasks/saveTask', this.editedItem)    
      }
      this.close();
    }
  }
};
</script>
