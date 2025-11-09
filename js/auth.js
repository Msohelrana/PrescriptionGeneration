import { API_BASE, setToken, fetchJSON } from "./utils.js";


export function initRegister(form) {
    const errorEl = form.querySelector("#error") || document.getElementById("error");

    form.addEventListener("submit", async e => {
        e.preventDefault();

        if (errorEl) errorEl.textContent = "";

        const data = {
            firstName: form.firstName.value.trim(),
            lastName: form.lastName.value.trim(),
            email: form.email.value.trim(),
            password: form.password.value
        };

        try {
            const { res, data: result } = await fetchJSON(`${API_BASE}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (res.ok && result.success) {
                alert("Registration successful!");
                window.location.href = "index.html";
            } else {
                if (errorEl) {
                    errorEl.textContent = result.message + " " + (result.errors ? result.errors.join(", ") : "Registration failed!");
                }
            }
        } catch (err) {
            if (errorEl) errorEl.textContent = err.message || "Something went wrong!";
        }
    });
}

export function initLogin(form) {
    form.addEventListener("submit", async e => {
        e.preventDefault();

        const email = form.email.value.trim();
        const password = form.password.value;

        try {
            const { res, data } = await fetchJSON(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (res.ok && data.token) {
                setToken(data.token);
                window.location.href = "dashboard.html";
            } else {
                form.querySelector("#error").innerText = data.message || "Invalid email or password!";
            }
        } catch (err) {
            form.querySelector("#error").innerText = err.message || "Something went wrong!";
        }
    });

}
