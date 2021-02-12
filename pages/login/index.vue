<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Login Form</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon large target="_blank" v-on="on">
                      <v-icon>mdi-code-tags</v-icon>
                    </v-btn>
                  </template>
                  <span>Source</span>
                </v-tooltip>
              </v-toolbar>
              <v-form @submit.prevent="login">
                <v-card-text>
                  <v-text-field
                    v-model="email"
                    label="Usuario"
                    name="login"
                    prepend-icon="mdi-account"
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
                  <v-btn type="submit" color="primary">Login</v-btn>
                </v-card-actions>
                <v-card-text>
                  <v-btn fab color="primary" @click="loginGoogle">
                    <v-icon>mdi-google</v-icon>
                  </v-btn>
                </v-card-text>
              </v-form>
              <v-card-text>
                <v-btn text to="/register">
                  No tienes un usuario aun? Registrate
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
import Swal from "sweetalert2";
import firebase from "@/plugins/firebase";
import "firebase/auth";
export default {
  name: "index",
  layout: "auth",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    login() {
      this.$store
        .dispatch("users/login", { email: this.email, password: this.password })
        .then(() => {
          this.$router.push("/");
        })
        .catch(error => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message
          });
          // console.log(error);
        });
    },
    loginGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider();

      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          result.user.getIdToken().then(token => {
            this.$store
              .dispatch("users/loginGoogle", {
                email: result.user.email,
                uid: result.user.uid,
                token
              })
              .then(() => {
                this.$router.push("/");
              })
              .catch(error => {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: error.message
                });
              });
          });
        });
    }
  }
};
</script>
