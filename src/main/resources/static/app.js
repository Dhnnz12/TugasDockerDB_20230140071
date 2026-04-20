const BASE_URL = "/api/users";

// DOM Elements
const userForm = document.getElementById("userForm");
const userIdInput = document.getElementById("userId");
const nameInput = document.getElementById("name");
const nimInput = document.getElementById("nim");
const userTable = document.getElementById("userTable");
const messageDiv = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");

// ========================
// NOTIFICATIONS
// ========================
function showMessage(text, type = "success") {
    messageDiv.textContent = text;
    messageDiv.className = type;
    messageDiv.style.display = "block";

    setTimeout(() => {
        messageDiv.style.display = "none";
    }, 3000);
}

// ========================
// LOAD USERS
// ========================
async function loadUsers() {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) throw new Error("Failed to fetch users");
        
        const users = await response.json();
        renderTable(users);
    } catch (error) {
        console.error(error);
        showMessage("❌ Gagal memuat data user", "error");
    }
}

function renderTable(users) {
    userTable.innerHTML = "";

    if (users.length === 0) {
        userTable.innerHTML = `
            <tr>
                <td colspan="3" class="empty-state">
                    <p>Belum ada user terdaftar.</p>
                </td>
            </tr>
        `;
        return;
    }

    users.forEach(user => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <div style="font-weight: 500">${user.name}</div>
            </td>
            <td style="color: var(--text-secondary)">${user.nim}</td>
            <td>
                <div class="action-btns">
                    <button class="icon-btn edit-btn" onclick="editUser('${user.id}', '${user.name}', '${user.nim}')" title="Edit">
                        <i data-lucide="edit-3" style="width:16px; height:16px"></i>
                    </button>
                    <button class="icon-btn delete-btn" onclick="deleteUser('${user.id}')" title="Hapus">
                        <i data-lucide="trash-2" style="width:16px; height:16px"></i>
                    </button>
                </div>
            </td>
        `;
        userTable.appendChild(tr);
    });

    // Refresh icons
    if (window.lucide) {
        lucide.createIcons();
    }
}

// ========================
// ADD / UPDATE USER
// ========================
userForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = userIdInput.val; // This is a mistake in current HTML, should be userIdInput.value
    // Wait, in my pending index.html redesign I will use standard value.
    const idValue = userIdInput.value;

    const userData = {
        name: nameInput.value,
        nim: nimInput.value
    };

    const isUpdate = !!idValue;
    const url = isUpdate ? `${BASE_URL}/${idValue}` : BASE_URL;
    const method = isUpdate ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        if (!response.ok) throw new Error(await response.text());

        showMessage(isUpdate ? "✏️ User berhasil diupdate" : "✅ User berhasil ditambahkan");
        resetForm();
        loadUsers();
    } catch (error) {
        console.error(error);
        showMessage("❌ Error: " + error.message, "error");
    }
});

// ========================
// EDIT USER
// ========================
window.editUser = function(id, name, nim) {
    userIdInput.value = id;
    nameInput.value = name;
    nimInput.value = nim;
    
    submitBtn.innerHTML = '<i data-lucide="save" style="width:18px; height:18px"></i> Update User';
    nameInput.focus();
    lucide.createIcons();
    
    // Optional: Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ========================
// DELETE USER
// ========================
window.deleteUser = async function(id) {
    if (!confirm("Yakin ingin hapus user?")) return;

    try {
        const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Gagal menghapus user");

        showMessage("🗑️ User berhasil dihapus");
        loadUsers();
    } catch (error) {
        console.error(error);
        showMessage("❌ Gagal hapus user", "error");
    }
};

// ========================
// RESET FORM
// ========================
window.resetForm = function() {
    userForm.reset();
    userIdInput.value = "";
    submitBtn.innerHTML = '<i data-lucide="user-plus" style="width:18px; height:18px"></i> Simpan User';
    lucide.createIcons();
};

// ========================
// INIT LOAD
// ========================
document.addEventListener("DOMContentLoaded", () => {
    loadUsers();
});
