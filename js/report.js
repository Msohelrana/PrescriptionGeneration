import { API_BASE, getToken, fetchJSON } from "./utils.js";

export async function loadReport(tableBody, chartCanvas) {
    const token = getToken();
    if (!token) return;

    try {
        const { data } = await fetchJSON(`${API_BASE}/prescription/report`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        tableBody.innerHTML = "";
        const labels = [];
        const counts = [];
        data.data.forEach(r => {
            const day = r.day.split("T")[0];
            tableBody.innerHTML += `<tr><td>${day}</td><td>${r.count}</td></tr>`;
            labels.push(day);
            counts.push(r.count);
        });

        const ctx = chartCanvas.getContext("2d");
        if (window.reportChart) window.reportChart.destroy();
        window.reportChart = new Chart(ctx, {
            type: "bar",
            data: { labels, datasets: [{ label: "Prescriptions per Day", data: counts, backgroundColor: "#1976d2" }] },
            options: { responsive: true, scales: { y: { beginAtZero: true } } }
        });
    } catch (err) {
        console.error(err);
    }
}
