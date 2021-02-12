<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Register Form</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn  icon large target="_blank" v-on="on">
                      <v-icon>mdi-code-tags</v-icon>
                    </v-btn>
                  </template>
                  <span>Source</span>
                </v-tooltip>
              </v-toolbar>
              <v-form @submit.prevent="register">
                <v-card-text>
                  <v-text-field
                    v-model="name"
                    label="Nombre"
                    name="username"
                    prepend-icon="mdi-account"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    v-model="email"
                    label="Email"
                    name="email"
                    prepend-icon="mdi-email"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    label="Password"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                  ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn type="submit" color="primary">Register</v-btn>
                </v-card-actions>
              </v-form>
               <v-card-text>
                <v-btn text to="/login">
                  Entrar con mi usuario.
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import Swal from 'sweetalert2'
import firebase from '@/plugins/firebase'
import 'firebase/auth'
export default {
  name: "index",
  layout: "auth",
  data() {
    return {
      name: "",
      email: "",
      password: ""
    };
  },
  methods: {
    async register() {
      await firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
      this.$store.dispatch('users/login',{email:this.email, password: this.password})
        .then(() => {
          this.$router.push('/')
        })
        .catch(error => {
           Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message,
            
          });
        })
    }
  }
};
</script>
