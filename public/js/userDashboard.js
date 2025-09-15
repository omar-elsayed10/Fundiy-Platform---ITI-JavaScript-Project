const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user) {
  alert("Please login first!");
  window.location.href = "login.html";
}

const campaignsTable = document.getElementById("campaignsTable");

const profileForm = document.getElementById("profileForm");
const userNameInput = document.getElementById("userName");
const userEmailInput = document.getElementById("userEmail");
const userPasswordInput = document.getElementById("userPassword");

userNameInput.value = user.name || "";
userEmailInput.value = user.email || "";

profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedUser = {
    name: userNameInput.value.trim() || user.name,
    email: userEmailInput.value.trim() || user.email,
    password: userPasswordInput.value.trim() || user.password,
  };

  try {
    const response = await fetch(`http://localhost:3000/users/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedUser),
    });

    if (!response.ok) throw new Error("Failed to update profile");

    const data = await response.json();

    localStorage.setItem("user", JSON.stringify(data));
    alert("Profile updated successfully!");
    window.location.reload();
  } catch (err) {
    console.error(err);
    alert("Error updating profile. Please try again.");
  }
});

async function fetchMyCampaigns() {
  try {
    const response = await fetch("http://localhost:3000/campaigns", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch campaigns");

    let campaigns = await response.json();

    campaigns = campaigns.filter(
      (c) => c.creatorId === user.id && c.isApproved === true
    );

    displayCampaigns(campaigns);
  } catch (err) {
    console.error(err);
    campaignsTable.innerHTML =
      "<tr><td colspan='5' style='color:red;'>Failed to load campaigns.</td></tr>";
  }
}

function displayCampaigns(campaigns) {
  campaignsTable.innerHTML = "";

  if (campaigns.length === 0) {
    campaignsTable.innerHTML =
      "<tr><td colspan='5'>No approved campaigns yet.</td></tr>";
    return;
  }

  campaigns.forEach((c) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${c.title}</td>
      <td>$${c.goal}</td>
      <td>${c.deadline}</td>
      <td><img src="${c.image}" alt="campaign"></td>
      <td>
        <button class="update-btn" onclick="updateCampaign(${c.id})">Update</button>
        <button class="delete-btn" onclick="deleteCampaign(${c.id})">Delete</button>
      </td>
    `;

    campaignsTable.appendChild(row);
  });
}

async function updateCampaign(id) {
  const newTitle = prompt("Enter new title (leave blank to keep old):");
  const newGoal = prompt("Enter new goal (leave blank to keep old):");
  const newDeadline = prompt("Enter new deadline (leave blank to keep old):");

  try {
    const res = await fetch(`http://localhost:3000/campaigns/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...(newTitle && { title: newTitle }),
        ...(newGoal && { goal: parseFloat(newGoal) }),
        ...(newDeadline && { deadline: newDeadline }),
      }),
    });

    if (!res.ok) throw new Error("Failed to update campaign");
    alert("Campaign updated!");
    fetchMyCampaigns();
  } catch (err) {
    console.error(err);
    alert("Error updating campaign.");
  }
}

async function deleteCampaign(id) {
  if (!confirm("Are you sure you want to delete this campaign?")) return;

  try {
    const res = await fetch(`http://localhost:3000/campaigns/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to delete campaign");

    alert("Campaign deleted!");
    fetchMyCampaigns();
  } catch (err) {
    console.error(err);
    alert("Error deleting campaign.");
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

fetchMyCampaigns();
