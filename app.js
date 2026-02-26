"use strict";

/* 
   FIREBASE IMPORTS
 */

import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp
} from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* 
   FIREBASE CONFIG (PUT YOURS HERE)
 */

const firebaseConfig = {
  apiKey: "AIzaSyCtDrzBSi471DBTVUy5yZ8vrFXQryNJrSs",
  authDomain: "todo-enterprise.firebaseapp.com",
  projectId: "todo-enterprise",
  storageBucket: "todo-enterprise.firebasestorage.app",
  messagingSenderId: "639461967735",
  appId: "1:639461967735:web:f95399a785fa709fea8372",
  measurementId: "G-QG76ZKZ6P7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* 
   PREMIUM DARK MODE SYSTEM
 */

document.addEventListener("DOMContentLoaded", () => {

  const savedMode = localStorage.getItem("darkMode");

  if (savedMode === "true") {
    document.body.classList.add("dark");
  }

  const toggleBtn = document.getElementById("darkToggle");

  if (toggleBtn) {

    toggleBtn.addEventListener("click", () => {

      document.body.classList.toggle("dark");

      const isDark = document.body.classList.contains("dark");

      localStorage.setItem("darkMode", isDark);

      // Smooth micro animation feedback
      toggleBtn.style.transform = "scale(0.9)";
      setTimeout(() => {
        toggleBtn.style.transform = "scale(1)";
      }, 150);

    });

  }

});

/* 
   AUTH PROTECTION (REDIRECT SYSTEM)
 */

onAuthStateChanged(auth, (user) => {

  const path = window.location.pathname;

  // If logged in and on login/signup/index → go to home
  if (user) {
    if (
      path.includes("login.html") ||
      path.includes("signup.html") ||
      path.includes("index.html")
    ) {
      window.location.href = "home.html";
    }
  }

  // If NOT logged in and trying to access home
  if (!user && path.includes("home.html")) {
    window.location.href = "login.html";
  }
});

/* 
   LOGIN PAGE LOGIC
 */

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {

    const email = document
      .getElementById("loginEmail")
      .value.trim();

    const password = document
      .getElementById("loginPassword")
      .value.trim();

    if (!email || !password) {
      alert("Enter credentials");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "home.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

/* 
   SIGNUP PAGE LOGIC
 */

const signupBtn = document.getElementById("signupBtn");

if (signupBtn) {
  signupBtn.addEventListener("click", async () => {

    const email = document
      .getElementById("signupEmail")
      .value.trim();

    const password = document
      .getElementById("signupPassword")
      .value.trim();

    if (!email || !password) {
      alert("Enter credentials");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      window.location.href = "home.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

/*
   HOME PAGE LOGIC
 */

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });

  const openTaskModal = document.getElementById("openTaskModal");
  const taskModal = document.getElementById("taskModal");
  const taskCloseBtn = document.getElementById("taskCloseBtn");
  const saveTaskBtn = document.getElementById("saveTask");

  if (openTaskModal) {
    openTaskModal.addEventListener("click", () => {
      taskModal.classList.remove("hidden");
    });
  }

  if (taskCloseBtn) {
    taskCloseBtn.addEventListener("click", () => {
      taskModal.classList.add("hidden");
    });
  }

  /* ========= SAVE TASK ========= */

  if (saveTaskBtn) {
    saveTaskBtn.addEventListener("click", async () => {

      const user = auth.currentUser;
      if (!user) return alert("Not authenticated");

      const title = document
        .getElementById("taskTitle")
        .value.trim();

      const description =
        document.getElementById("taskDesc").value;

      const priority =
        document.getElementById("taskPriority").value;

      const dueDate =
        document.getElementById("taskDueDate").value;

      if (!title) {
        alert("Task title required");
        return;
      }

      try {
        await addDoc(collection(db, "tasks"), {
          uid: user.uid,
          title,
          description,
          priority,
          dueDate,
          status: "todo",
          createdAt: serverTimestamp()
        });

        taskModal.classList.add("hidden");

        document.getElementById("taskTitle").value = "";
        document.getElementById("taskDesc").value = "";
        document.getElementById("taskDueDate").value = "";

      } catch (error) {
        alert(error.message);
      }
    });
  }

  /* ========= REALTIME TASK LISTENER ========= */

 onAuthStateChanged(auth, (user) => {

  if (!user) return;

  const q = query(
    collection(db, "tasks"),
    where("uid", "==", user.uid)
  );

  onSnapshot(q, (snapshot) => {

    document.getElementById("todo").innerHTML = "";
    document.getElementById("ongoing").innerHTML = "";
    document.getElementById("completed").innerHTML = "";

    snapshot.forEach((docSnap) => {

      const task = docSnap.data();

      const card = document.createElement("div");
      card.className = "task-card";
      card.draggable = true;
      card.dataset.id = docSnap.id;

      card.innerHTML = `
        <strong>${task.title}</strong>
        <p>${task.description || ""}</p>
        <small>${task.dueDate || ""}</small>
        <button class="delete-btn">Delete</button>
      `;

      card.querySelector(".delete-btn")
        .addEventListener("click", async () => {
          await deleteDoc(doc(db, "tasks", docSnap.id));
        });

      card.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("id", docSnap.id);
      });

      if (task.status === "todo") {
        document.getElementById("todo").appendChild(card);
      }
      if (task.status === "ongoing") {
        document.getElementById("ongoing").appendChild(card);
      }
      if (task.status === "completed") {
        document.getElementById("completed").appendChild(card);
      }

    });
  });
});

     

  /* ========= DRAG & DROP ========= */

document.querySelectorAll(".column").forEach(column => {

  column.addEventListener("dragover", e => {
    e.preventDefault();
  });

  column.addEventListener("drop", async e => {
    e.preventDefault();

    const id = e.dataTransfer.getData("id");

    await updateDoc(doc(db, "tasks", id), {
      status: column.dataset.status
    });
  });

});
}