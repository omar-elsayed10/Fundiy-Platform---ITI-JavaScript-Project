const content = document.getElementById("content");
const usersBtn = document.getElementById("usersBtn");
const campaignsBtn = document.getElementById("campaignsBtn");
const pledgesBtn = document.getElementById("pledgesBtn");
const logoutBtn = document.getElementById("logoutBtn");

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user || user.role !== "admin") {
  alert("Admins only! Please login as admin.");
  window.location.href = "login.html";
}

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
});

// Load Users
usersBtn.addEventListener("click", async () => {
  const res = await fetch("http://localhost:3000/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const users = await res.json();

  content.innerHTML = `
    <h2>Users</h2>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${users
            .map(
              (u) => `
              <tr>
                <td>${u.id}</td>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${u.role}</td>
                <td>
                  <button class="action-btn delete ban-btn" 
                          data-id="${u.id}" 
                          data-active="${u.isActive}">
                    ${u.isActive === false ? "Unban" : "Ban"}
                  </button>
                  <button class="action-btn ${
                    u.role === "admin" ? "unapprove" : "approve"
                  } role-btn"
                    data-id="${u.id}"
                    data-role="${u.role}">
                    ${u.role === "admin" ? "Remove Admin" : "Make Admin"}
                  </button>
                </td>
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;

  // Attach ban/unban events
  document.querySelectorAll(".ban-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const isActive = btn.dataset.active === "true";
      await banUser(id, !isActive);
    });
  });

  // Attach role change events
  document.querySelectorAll(".role-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const role = btn.dataset.role;
      const newRole = role === "admin" ? "user" : "admin";
      await changeRole(id, newRole);
    });
  });
});

// Ban/Unban User
async function banUser(id, activate) {
  const res = await fetch(`http://localhost:3000/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isActive: activate }),
  });
  if (res.ok) usersBtn.click();
}

// Change Role (Make/Remove Admin)
async function changeRole(id, newRole) {
  const res = await fetch(`http://localhost:3000/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role: newRole }),
  });
  if (res.ok) usersBtn.click();
}

//  Ban/Unban User
async function banUser(id, activate) {
  const res = await fetch(`http://localhost:3000/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isActive: activate }),
  });
  if (res.ok) usersBtn.click();
}

// Load Campaigns
campaignsBtn.addEventListener("click", async () => {
  const res = await fetch("http://localhost:3000/campaigns", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const campaigns = await res.json();

  content.innerHTML = `
    <h2>Campaigns</h2>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Title</th><th>Goal</th><th>Deadline</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${campaigns
            .map(
              (c) => `
              <tr>
                <td>${c.id}</td>
                <td>${c.title}</td>
                <td>$${c.goal}</td>
                <td>${c.deadline}</td>
                <td>${c.isApproved ? "Approved &#9989" : "Pending &#8987"}</td>
                <td>
                  <button class="action-btn ${
                    c.isApproved ? "unapprove" : "approve"
                  } approve-btn" 
                    data-id="${c.id}" 
                    data-status="${c.isApproved}">
                    ${c.isApproved ? "Unapprove" : "Approve"}
                  </button>
                  <button class="action-btn delete delete-campaign-btn" 
                    data-id="${c.id}">
                    Delete
                  </button>
                </td>
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;

  // Attach approve/unapprove events
  document.querySelectorAll(".approve-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const status = btn.dataset.status === "true";
      await toggleApprove(id, status);
    });
  });

  // Attach delete campaign events
  document.querySelectorAll(".delete-campaign-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      await deleteCampaign(id);
    });
  });
});

// Approve/Unapprove
async function toggleApprove(id, status) {
  const res = await fetch(`http://localhost:3000/campaigns/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isApproved: !status }),
  });
  if (res.ok) campaignsBtn.click();
}

// Delete Campaign
async function deleteCampaign(id) {
  const res = await fetch(`http://localhost:3000/campaigns/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.ok) campaignsBtn.click();
}

// load Pledges
pledgesBtn.addEventListener("click", async () => {
  try {
    const [pledgesRes, usersRes, campaignsRes] = await Promise.all([
      fetch("http://localhost:3000/pledges", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("http://localhost:3000/users", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("http://localhost:3000/campaigns", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const pledges = await pledgesRes.json();
    const users = await usersRes.json();
    const campaigns = await campaignsRes.json();

    console.log("pledges:", pledges);
    console.log("users:", users);
    console.log("campaigns:", campaigns);

    content.innerHTML = `
      <h2>Pledges</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Campaign</th>
              <th>User</th>
              <th>Amount</th>
              <th>Remaining Goal</th>
            </tr>
          </thead>
          <tbody>
            ${pledges
              .map((p) => {
                const u = users.find((x) => String(x.id) === String(p.userId));
                const c = campaigns.find(
                  (x) => String(x.id) === String(p.campaignId)
                );

                const remaining = c ? Math.max(c.goal - p.amount, 0) : 0;

                return `
                  <tr>
                    <td>${p.id}</td>
                    <td>${c ? c.title : "Unknown"}</td>
                    <td>${u ? u.name : "Unknown"}</td>
                    <td>$${p.amount}</td>
                    <td>$${remaining}</td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    console.error("Error loading pledges:", err);
    content.innerHTML = `<p style="color:red;">Failed to load pledges data.</p>`;
  }
});
