import { API_BASE, getToken, fetchJSON } from "./utils.js";

export async function loadPrescriptions(tableBody) {
    const token = getToken();
    if (!token) return window.location.href = "index.html";

    const start = document.getElementById("startDate")?.value;
    const end = document.getElementById("endDate")?.value;

    let url = `${API_BASE}/prescription`;
    if (start && end) url += `?startDate=${start}&endDate=${end}`;

    try {
        const { data } = await fetchJSON(url, { headers: { Authorization: `Bearer ${token}` } });

        tableBody.innerHTML = "";
        if (data?.data?.length > 0) {
            data.data.forEach(p => {
                tableBody.innerHTML += `<tr>
                    <td>${p.presDate?.split("T")[0]}</td>
                    <td>${p.patientName}</td>
                    <td>${p.age}</td>
                    <td>${p.gender}</td>
                    <td>${p.diagnosis}</td>
                    <td>${p.medicines}</td>
                    <td>${p.nextVisitDate?.split("T")[0] || "-"}</td>
                    <td>
                        <button onclick="deletePrescription('${p.id}')">Delete</button>
                        <button onclick="goToUpdatePage('${p.id}')">Update</button>
                    </td>
                </tr>`;
            });
        } else {
            tableBody.innerHTML = "<tr><td colspan='8'>No prescriptions found</td></tr>";
        }
    } catch (err) {
        console.error(err);
    }
}

export async function addPrescription(form) {
    form.addEventListener("submit", async e => {
        e.preventDefault();
        const token = getToken();

        const payload = {
            patientName: form.patientName.value.trim(),
            age: Number(form.age.value || 0),
            gender: form.gender.value,
            diagnosis: form.diagnosis.value.trim(),
            medicines: form.medicines.value.trim(),
            nextVisitDate: form.nextVisitDate.value || null
        };

        try {
            const { res, data } = await fetchJSON(`${API_BASE}/prescription`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Prescription saved!");
                window.location.href = "dashboard.html";
            } else {
                alert(data.message || "Error saving prescription!");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong!");
        }
    });
}

export async function loadPrescriptionById(form, id) {
    const token = getToken();
    try {
        const { data: resData } = await fetchJSON(`${API_BASE}/prescription/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = resData.data;
        form.patientName.value = data.patientName || "";
        form.age.value = data.age || "";
        form.gender.value = data.gender || "";
        form.diagnosis.value = data.diagnosis || "";
        form.medicines.value = data.medicines || "";
        form.nextVisitDate.value = data.nextVisitDate?.split("T")[0] || "";
    } catch (err) {
        alert(err.message || "Failed to load prescription.");
        window.location.href = "dashboard.html";
    }
}

export function updatePrescription(form, id, formErr) {
    form.addEventListener("submit", async e => {
        e.preventDefault();
        formErr.textContent = "";

        const token = getToken();
        const payload = {
            patientName: form.patientName.value.trim(),
            age: Number(form.age.value || 0),
            gender: form.gender.value,
            diagnosis: form.diagnosis.value.trim(),
            medicines: form.medicines.value.trim(),
            nextVisitDate: form.nextVisitDate.value || null
        };

        try {
            const { res, data } = await fetchJSON(`${API_BASE}/prescription/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok && data.success) {
                alert("Prescription updated successfully!");
                window.location.href = "dashboard.html";
            } else {
                formErr.textContent = data.errors?.join(", ") || data.message || "Update failed.";
            }
        } catch (err) {
            formErr.textContent = err.message || "Update failed.";
        }
    });
}

export async function deletePrescription(id, reloadFn) {
    if (!confirm("Are you sure you want to delete this prescription?")) return;
    const token = getToken();
    try {
        await fetch(`${API_BASE}/prescription/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        reloadFn();
    } catch (err) {
        console.error(err);
    }
}

export function goToUpdatePage(id) {
    window.location.href = `updatePres.html?id=${encodeURIComponent(id)}`;
}
