const campaignsList = document.getElementById("campaignsList");
const myCampaignsBtn = document.getElementById("myCampaignsBtn");

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user) {
  alert("Please login first!");
  window.location.href = "login.html";
}

async function fetchCampaigns(filter = "all") {
  try {
    const response = await fetch("http://localhost:3000/campaigns", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch campaigns");

    let campaigns = await response.json();

    campaigns = campaigns.filter((c) => c.isApproved === true);

    if (filter === "my") {
      campaigns = campaigns.filter((c) => c.creatorId === user.id);
    }

    displayCampaigns(campaigns, filter);
  } catch (err) {
    console.error("Error:", err);
    campaignsList.innerHTML = `<p style="text-align:center; color:red;">Failed to load campaigns.</p>`;
  }
}

function displayCampaigns(campaigns, filter) {
  campaignsList.innerHTML = "";

  if (campaigns.length === 0) {
    campaignsList.innerHTML = `<p style="text-align:center; color:#555;">
      ${
        filter === "my"
          ? "You don't have any approved campaigns yet."
          : "No campaigns available yet."
      }
    </p>`;
    return;
  }

  campaigns.forEach((campaign) => {
    const card = document.createElement("div");
    card.className = "campaign-card";

    card.innerHTML = `
      <img src="${campaign.image}" alt="Campaign Image" style="width:100%; height:180px; object-fit:cover; border-radius:8px;">
      <h3>${campaign.title}</h3>
      <p><strong>Goal:</strong> $${campaign.goal}</p>
      <p><strong>Deadline:</strong> ${campaign.deadline}</p>
      <button class="donate-btn">Donate</button>
    `;

    card.querySelector(".donate-btn").addEventListener("click", () => {
      if (campaign.goal <= 0) {
        campaign.goal = 0;
        alert("This campaign is already completed!");
        return;
      }
      window.location.href = "pledges.html?campaignId=" + campaign.id;
    });

    campaignsList.appendChild(card);
  });
}

myCampaignsBtn.addEventListener("click", () => {
  fetchCampaigns("my");
  document.getElementsByTagName("h1")[0].textContent = "My Campaigns";
  // create dashboard button for my campaigns

  const dashboardBtn = document.createElement("button");
  if (document.querySelector(".dashboard-btn")) {
    document.querySelector(".dashboard-btn").remove();
  }
  dashboardBtn.textContent = "Dashboard";
  dashboardBtn.className = "dashboard-btn";
  dashboardBtn.addEventListener("click", () => {
    window.location.href = "userDashboard.html";
  });
  // append before logout button
  const logoutBtn = document.querySelector(".logout");
  logoutBtn.parentNode.insertBefore(dashboardBtn, logoutBtn);
});
allCampaignsBtn.addEventListener("click", () => {
  fetchCampaigns("all");
  document.getElementsByTagName("h1")[0].textContent = "All Campaigns";
  // remove dashboard button when clicked for all campaigns
  const dashboardBtn = document.querySelector(".dashboard-btn");
  if (dashboardBtn) {
    dashboardBtn.remove();
  }
});

fetchCampaigns("all");

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}
