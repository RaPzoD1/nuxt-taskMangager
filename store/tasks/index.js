import firebase from "@/plugins/firebase";
import "firebase/firestore";

export const state = () => ({
  tasks: [],
  editTask: ''
});

export const getters = {
  getTasks(state) {
    return state.tasks;
  }
};

export const mutations = {
  setTasks(state, tasks) {
    state.tasks = tasks;
  },
  add(state, task) {
    state.tasks.push(task);
  },
  delete(state, task) {
    state.tasks.filter(item => {
      return item !== task;
    });
  },
  editTask(state, task){
    const updateTask = state.tasks.find(item => item === task)
    updateTask.start = new Date(updateTask.start).toISOString().substr(0, 10)
    updateTask.end = new Date(updateTask.end).toISOString().substr(0, 10)
    state.editTask = updateTask
  }
};

export const actions = {
  async loadTasks({ commit }) {
    const tasks = [];
    const db = firebase.firestore();
    const query = await db.collection("tasks").get();
    query.forEach(doc => {
      let start = doc.data().start.toDate();
      start = new Date(start).toDateString();
      let end = doc.data().end.toDate();
      end = new Date(end).toDateString();
      const task = {
        id: doc.id,
        name: doc.data().name,
        description: doc.data().description,
        status: doc.data().status,
        start,
        end
      };
      tasks.push(task);
    });
    commit("setTasks", tasks);
  },
  async saveTask({ commit }, task) {
    const db = firebase.firestore();
    const start = await firebase.firestore.Timestamp.fromDate(
      new Date(task.start)
    );
    const end = await firebase.firestore.Timestamp.fromDate(new Date(task.end));
    await db.collection("tasks").add({
      name: task.name,
      description: task.description,
      status: task.status,
      start,
      end
    });
  },
  async updateTask({ commit }, task) {
    const db = firebase.firestore();
    const start = await firebase.firestore.Timestamp.fromDate(
      new Date(task.start)
    );
    const end = await firebase.firestore.Timestamp.fromDate(new Date(task.end));
    await db
      .collection("tasks")
      .doc(`${task.id}`)
      .set({
        name: task.name,
        description: task.description,
        status: task.status,
        start,
        end
      });
  },
  async removeTask({ commit }, task) {
    const db = firebase.firestore()
    await db.collection('tasks').doc(`${task.id}`).delete()
    commit('delete', task)
  }
};
