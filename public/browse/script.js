import { auth, db, onAuthStateChanged, collection, getDocs, signOut } from "./firebase.js";

// Select elements
const profilePic = document.getElementById("profilePic");
const profileDropdown = document.getElementById("profileDropdown");
const profileList = document.getElementById("profile-list");
const logoutBtn = document.getElementById("logout-btn");
const videoOverlay = document.getElementById("videoOverlay");
const videoElement = document.getElementById("video");
const closeVideoBtn = document.getElementById("closeVideo");
const movieSections = {
    trending: document.getElementById("trendingMovies"),
    newReleases: document.getElementById("newReleases"),
    topPicks: document.getElementById("topPicks"),
};

// ✅ Toggle profile dropdown
profilePic.addEventListener("click", (event) => {
    event.stopPropagation();
    profileDropdown.classList.toggle("show");
});

// ✅ Hide dropdown when clicking outside
document.addEventListener("click", (event) => {
    if (!profileDropdown.contains(event.target) && !profilePic.contains(event.target)) {
        profileDropdown.classList.remove("show");
    }
});

// ✅ Load profiles from Firestore
async function loadProfiles() {
    const user = auth.currentUser;
    if (!user) return;

    profileList.innerHTML = ""; // Clear old profiles

    try {
        const profilesSnapshot = await getDocs(collection(db, "users", user.uid, "profiles"));
        profilesSnapshot.forEach((doc) => {
            const profile = doc.data();
            const profileDiv = document.createElement("div");
            profileDiv.innerHTML = `<img src="${profile.avatar}" class="profile-avatar"> ${profile.name}`;
            profileDiv.onclick = () => switchProfile(profile);
            profileList.appendChild(profileDiv);
        });
    } catch (error) {
        console.error("Error fetching profiles:", error);
    }
}

// ✅ Switch user profile
function switchProfile(profile) {
    profilePic.src = profile.avatar;
    alert(`Switched to ${profile.name}`);
    profileDropdown.classList.remove("show");
}

// ✅ Logout function
logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "/home";
});

// ✅ Play movie
function playMovie(videoUrl) {
    videoElement.src = videoUrl;
    videoOverlay.style.display = "flex";
    videoElement.play();
}

closeVideoBtn.addEventListener("click", () => {
    videoElement.pause();
    videoOverlay.style.display = "none";
});
