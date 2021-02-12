import firebase from '@/plugins/firebase'
import 'firebase/auth'
import Cookies from 'js-cookies'

export const state = () => ({
    user: null
})

export const mutations = {
    SET_USER(state, user) {
        state.user = user
    }
}

export const actions = {
    async login({commit},user){
        try {
            await firebase.auth().signInWithEmailAndPassword(user.email, user.password)
            firebase.auth().currentUser.getIdToken()
            .then((token) => {
                if (token) {
                    const { uid, email} = firebase.auth().currentUser
                    Cookies.setItem('access_token',token)
                    commit('SET_USER',{uid, email})
                }
            })
            .catch()
        } catch (error) {
            console.log(error)
            throw error
        }
    },
    
    loginGoogle({commit}, data){
        Cookies.setItem('access_token', data.token)
        commit('SET_USER', {uid: data.uid, email: data.email})
    },

    logout ({commit}) {
        Cookies.removeItem('access_token')
        commit('SET_USER',null)
    }
}