import { initRegister, initLogin } from "./auth.js";
import {
    loadPrescriptions, addPrescription, loadPrescriptionById,
    updatePrescription, deletePrescription, goToUpdatePage
} from "./prescription.js";
import { loadReport } from "./report.js";
import { logout, requireAuth, redirectIfLoggedIn } from "./utils.js";

// Register
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    redirectIfLoggedIn(); // Redirect to dashboard if already logged in
    initRegister(registerForm);
}
//Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    redirectIfLoggedIn(); // Redirect to dashboard if already logged in
    initLogin(loginForm);
}

// Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) logoutBtn.addEventListener("click", logout);

// Load Prescription
const presTableBody = document.querySelector("#prescriptionTable tbody");
if (presTableBody) {
    requireAuth(); // Redirect if not logged in
    loadPrescriptions(presTableBody);
}

//Filter by date
document.getElementById("filterBtn")?.addEventListener("click", () => {
    loadPrescriptions(presTableBody);
});
// Add new prescription
const presForm = document.getElementById("presForm");
if (presForm) {
    requireAuth();
    addPrescription(presForm);
}

// Update Prescription
const updateForm = document.getElementById("updateForm");
if (updateForm) {
    requireAuth();
    const urlParams = new URLSearchParams(window.location.search);
    const updateId = urlParams.get("id");
    const formErr = document.getElementById("formErr");
    if (!updateId) window.location.href = "dashboard.html";

    loadPrescriptionById(updateForm, updateId);
    updatePrescription(updateForm, updateId, formErr);
}

//Report
const reportTableBody = document.querySelector("#reportTable tbody");
const chartCanvas = document.getElementById("chart");
if (reportTableBody && chartCanvas) {
    requireAuth();
    loadReport(reportTableBody, chartCanvas);
}

// Global function 
window.deletePrescription = (id) => deletePrescription(id, () =>
    loadPrescriptions(presTableBody));
window.goToUpdatePage = goToUpdatePage;
