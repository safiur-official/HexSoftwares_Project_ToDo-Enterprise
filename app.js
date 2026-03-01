/*!
 * Smart To-Do
 * Modern Kanban Task Manager (PWA Ready)
 *
 * © 2026 SK Safiur Rahaman
 * Released under the MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files to deal
 * in the Software without restriction, subject to the conditions
 * stated in the MIT License.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
 */






let editingTaskId = null;
"use strict";

/* ================= FIREBASE IMPORTS ================= */

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

/* ================= FIREBASE CONFIG ================= */

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

/* ================= DARK MODE ================= */

document.addEventListener("DOMContentLoaded", () => {

  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
  }

  const toggleBtn = document.getElementById("darkToggle");

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem("darkMode",
        document.body.classList.contains("dark"));
    });
  }
});

/* ================= AUTH REDIRECT ================= */

onAuthStateChanged(auth, (user) => {

  const path = window.location.pathname;

  if (user) {
    if (path.includes("login.html") ||
        path.includes("signup.html") ||
        path.includes("index.html")) {
      window.location.href = "home.html";
    }
  }

  if (!user && path.includes("home.html")) {
    window.location.href = "login.html";
  }
});

/* ================= LOGIN ================= */

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) return alert("Enter credentials");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "home.html";
    } catch (err) {
      alert(err.message);
    }
  });
}

/* ================= SIGNUP ================= */

const signupBtn = document.getElementById("signupBtn");

if (signupBtn) {
  signupBtn.addEventListener("click", async () => {

    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    if (!email || !password) return alert("Enter credentials");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      window.location.href = "home.html";
    } catch (err) {
      alert(err.message);
    }
  });
}

/* ================= HOME LOGIC ================= */

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });

  const openBtn = document.getElementById("openTaskModal");
  const modal = document.getElementById("taskModal");
  const closeBtn = document.getElementById("taskCloseBtn");
  const saveBtn = document.getElementById("saveTask");

  /* ===== MODAL CONTROL ===== */

  if (openBtn) openBtn.onclick = () => modal.classList.remove("hidden");
  if (closeBtn) closeBtn.onclick = () => modal.classList.add("hidden");

  /* ===== SAVE TASK ===== */
saveBtn.addEventListener("click", async () => {

  const user = auth.currentUser;
  if (!user) return alert("Not authenticated");

  const title = document.getElementById("taskTitle").value.trim();
  const description = document.getElementById("taskDesc").value;
  const priority = document.getElementById("taskPriority").value;
  const dueDate = document.getElementById("taskDueDate").value;

  if (!title) return alert("Task title required");

  try {

    if (editingTaskId) {
      // 🔵 UPDATE EXISTING TASK
      await updateDoc(doc(db, "tasks", editingTaskId), {
        title,
        description,
        priority,
        dueDate
      });

      editingTaskId = null; // reset
    } else {
      // 🟢 CREATE NEW TASK
      await addDoc(collection(db, "tasks"), {
        uid: user.uid,
        title,
        description,
        priority,
        dueDate,
        status: "todo",
        createdAt: serverTimestamp()
      });
    }

    modal.classList.add("hidden");

    // Reset form
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDesc").value = "";
    document.getElementById("taskDueDate").value = "";
    document.getElementById("taskPriority").value = "Low";

  } catch (err) {
    alert(err.message);
  }
});

  /* ================= TASK LISTENER ================= */

  onAuthStateChanged(auth, (user) => {

  if (!user) return;

  const q = query(
    collection(db, "tasks"),
    where("uid", "==", user.uid)
    
  );

onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
  const tasks = [];

  snapshot.forEach(docSnap => {
    tasks.push({ id: docSnap.id, ...docSnap.data() });
  });

  // Priority weight map
  const priorityOrder = {
    High: 3,
    Medium: 2,
    Low: 1
  };

  // Sort by:
  // 1️⃣ Status grouping handled automatically by column
  // 2️⃣ Priority (High → Low)
  // 3️⃣ Due Date (earliest first)

  tasks.sort((a, b) => {

    const pA = priorityOrder[a.priority] || 1;
    const pB = priorityOrder[b.priority] || 1;

    if (pB !== pA) return pB - pA;

    const dA = a.dueDate ? new Date(a.dueDate) : new Date(9999,0,1);
    const dB = b.dueDate ? new Date(b.dueDate) : new Date(9999,0,1);

    return dA - dB;
  });

  document.getElementById("todo").innerHTML = "";
  document.getElementById("ongoing").innerHTML = "";
  document.getElementById("completed").innerHTML = "";

  tasks.forEach(task => {
    const card = createTaskCard(task);
    document.getElementById(task.status).appendChild(card);
  });

});

/* ================= CREATE TASK CARD ================= */

function createTaskCard(task) {
  function formatTimestamp(ts) {
  if (!ts) return "";

  let date;

  if (ts.seconds) {
    date = new Date(ts.seconds * 1000);
  } else if (ts.toDate) {
    date = ts.toDate();
  } else {
    date = new Date(ts);
  }

  return formatDateTime(date);
}

  const card = document.createElement("div");

  /* ================= PRIORITY LOGIC ================= */

  const rawPriority = task.priority || "Low";
  const priority = rawPriority.toLowerCase();

let priorityClass = "priority-low";
let priorityCardClass = "";

if (priority === "medium") {
  priorityClass = "priority-medium";
}

if (priority === "high") {
  priorityClass = "priority-high";

  // Only highlight if not completed
  if (task.status !== "completed") {
    priorityCardClass = "high-priority";
  }
}

  const createdText = task.createdAt
  ? `Created: ${formatTimestamp(task.createdAt)}`
  : "";

/* ================= WATERMARK TIMESTAMPS ================= */

let watermarkContent = "";

if (task.status === "completed") {

  const createdLine = task.createdAt
    ? `Created: ${formatTimestamp(task.createdAt)}`
    : "";

  const dueLine = task.dueDate
    ? `Due: ${formatDateTime(task.dueDate)}`
    : "Due: No due date";

  watermarkContent = `
    <div class="task-timestamps">
      ${createdLine ? `<div>${createdLine}</div>` : ""}
      <div>${dueLine}</div>
    </div>
  `;

} else {

  watermarkContent = `
    <div class="task-timestamps">
      ${task.createdAt ? `<div>Created: ${formatTimestamp(task.createdAt)}</div>` : ""}
    </div>
  `;
}

/* ================= DUE DATE + COUNTDOWN ================= */

let dueSection = "";

if (task.dueDate) {
  const formattedDue = formatDateTime(task.dueDate);

  // 🔵 Active countdown for todo & ongoing
  if (task.status === "todo" || task.status === "ongoing") {
    dueSection = `
      <div class="task-due">
        <div>Due: ${formattedDue}</div>
        <div class="countdown" data-due="${task.dueDate}">
          ${getRemainingTime(task.dueDate)}
        </div>
      </div>
    `;
  }
}

/* ================= PREMIUM COMPLETION STATUS ================= */

if (task.status === "completed" && task.completedAt) {

  let statusLabel = "";
  let statusClass = "";

  // Convert Firestore timestamp safely
  const completedDate = task.completedAt.seconds
    ? new Date(task.completedAt.seconds * 1000)
    : task.completedAt.toDate
      ? task.completedAt.toDate()
      : new Date(task.completedAt);

  if (task.dueDate) {
    const dueDate = new Date(task.dueDate);

    if (completedDate < dueDate) {
      statusLabel = "Early";
      statusClass = "completed-early";
    } else if (completedDate > dueDate) {
      statusLabel = "Late";
      statusClass = "completed-late";
    } else {
      statusLabel = "On time";
      statusClass = "completed-ontime";
    }
  }

  dueSection = `
    <div class="task-due completed ${statusClass}">
      ✔ Completed ${timeAgo(task.completedAt)}
      ${statusLabel ? `• ${statusLabel}` : ""}
    </div>
  `;
}

  /* ================= OVERDUE + CRITICAL LOGIC ================= */

let overdueClass = "";
let criticalClass = "";

if (task.dueDate && task.status !== "completed") {

  const now = new Date();
  const due = new Date(task.dueDate);

  // Overdue if due date already passed
  if (due < now) {
    overdueClass = "overdue-task";
  }

  // Critical if high priority AND overdue
  if (priority === "high" && due < now) {
    criticalClass = "critical-task";
  }
}

  /* ================= CARD SETUP ================= */

let lockedClass = task.status === "completed" ? "locked-task" : "";

card.className = `task-card ${priorityCardClass} ${overdueClass} ${criticalClass} ${lockedClass}`;
card.draggable = true;
  card.dataset.id = task.id;
  

  /* ================= DRAG SUPPORT ================= */

 card.addEventListener("dragstart", (e) => {

  if (task.status === "completed") {
    e.preventDefault();
    return;
  }

  e.dataTransfer.setData("id", task.id);
});
  /* ================= HTML STRUCTURE ================= */

  card.innerHTML = `
    <div class="task-header">
      <h4>${task.title}</h4>
      <span class="priority-badge ${priorityClass}">
        ${rawPriority}
      </span>
    </div>

    <p>${task.description || ""}</p>

   ${dueSection}


    <div class="task-actions">
<select class="status-select" ${task.status === "completed" ? "disabled" : ""}>    
    <option value="todo" ${task.status === "todo" ? "selected" : ""}>To-Do</option>
    <option value="ongoing" ${task.status === "ongoing" ? "selected" : ""}>Ongoing</option>
    <option value="completed" ${task.status === "completed" ? "selected" : ""}>Completed</option>
  </select>

  <button class="edit-btn">Edit</button>
  <button class="delete-btn">Delete</button>
</div>
${watermarkContent}
  `;

  /* ================= DELETE ================= */

  card.querySelector(".delete-btn").addEventListener("click", async () => {
    await deleteDoc(doc(db, "tasks", task.id));
  });

   card.querySelector(".edit-btn").addEventListener("click", () => {
if (task.status === "completed") {
  alert("Completed tasks are locked and cannot be edited.");
  return;
}
  editingTaskId = task.id;

  document.getElementById("taskTitle").value = task.title || "";
  document.getElementById("taskDesc").value = task.description || "";
  document.getElementById("taskPriority").value = task.priority || "Low";
  document.getElementById("taskDueDate").value = task.dueDate || "";

  document.getElementById("taskModal").classList.remove("hidden");
});
  /* ================= STATUS CHANGE ================= */

card.querySelector(".status-select").addEventListener("change", async (e) => {

  const newStatus = e.target.value;

  if (newStatus === "completed") {

    const confirmed = confirm(
      "Are you sure you want to mark this task as completed?\nThis action cannot be undone."
    );

    if (!confirmed) {
      e.target.value = task.status;
      return;
    }

    await updateDoc(doc(db, "tasks", task.id), {
      status: "completed",
      completedAt: serverTimestamp()
    });

  } else {

    await updateDoc(doc(db, "tasks", task.id), {
      status: newStatus
    });

  }

});

  return card;
}
/* ================= DRAG & DROP ================= */

document.querySelectorAll(".column").forEach(column => {

  column.addEventListener("dragover", e => e.preventDefault());

column.addEventListener("drop", async (e) => {

  e.preventDefault();

  const taskId = e.dataTransfer.getData("id");
  const newStatus = column.dataset.status;

  if (!taskId) return;

  if (newStatus === "completed") {

    const confirmed = confirm(
      "Are you sure you want to mark this task as completed?\nThis action cannot be undone."
    );

    if (!confirmed) return;

    await updateDoc(doc(db, "tasks", taskId), {
      status: "completed",
      completedAt: serverTimestamp()
    });

  } else {

    await updateDoc(doc(db, "tasks", taskId), {
      status: newStatus
    });

  }

});});})}

/* 
   AUTO YEAR FOOTER UPDATE
= */

document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("currentYear");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});



function formatDateTime(dateInput) {
  const d = new Date(dateInput);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  const ampm = hours >= 12 ? "am" : "pm";
  hours = hours % 12;
  hours = hours ? hours : 12;
  hours = String(hours).padStart(2, "0");

  return `${day}/${month}/${year}  ${hours}:${minutes}:${seconds} ${ampm}`;
}

function getRemainingTime(dueDate) {
  const now = new Date();
  const target = new Date(dueDate);

  const diff = target - now;

  if (diff <= 0) return "Expired";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function timeAgo(timestamp) {
  if (!timestamp) return "";

  let date;

  // Handle Firestore serverTimestamp
  if (timestamp.seconds) {
    date = new Date(timestamp.seconds * 1000);
  } else if (timestamp.toDate) {
    date = timestamp.toDate();
  } else {
    date = new Date(timestamp);
  }

  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 5) return "Just now";
  if (diff < 60) return `${diff} seconds ago`;

  const minutes = Math.floor(diff / 60);
  if (minutes < 60)
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24)
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  if (days < 30)
    return `${days} day${days > 1 ? "s" : ""} ago`;

  const months = Math.floor(days / 30);
  if (months < 12)
    return `${months} month${months > 1 ? "s" : ""} ago`;

  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}


/* ================= LIVE COUNTDOWN ENGINE ================= */
setInterval(() => {
  document.querySelectorAll(".countdown").forEach(el => {
    const due = el.dataset.due;
    el.textContent = getRemainingTime(due);
  });
}, 1000);

setInterval(() => {
  document.querySelectorAll(".relative-time").forEach(el => {
    const timestamp = el.dataset.time;
    el.textContent = timeAgo(JSON.parse(timestamp));
  });
}, 60000); // update every 60 sec


/* ================= COLUMN COLLAPSE ================= */

document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll(".column-header").forEach(header => {
    header.addEventListener("click", () => {
      const column = header.closest(".column");
      column.classList.toggle("collapsed");
    });
  });

});



/* ================= PWA SERVICE WORKER ================= */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(() => console.log("Service Worker Registered"))
      .catch(err => console.log("SW registration failed:", err));
  });
}