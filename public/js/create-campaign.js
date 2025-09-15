document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  if (!token || !user) {
    alert("You must be logged in to create a campaign.");
    window.location.href = "login.html";
  }
});

document
  .getElementById("campaignForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      alert("You must be logged in to create a campaign.");
      window.location.href = "login.html";
      return;
    }

    const imageInput = document.getElementById("campaignImage").files[0];
    const title = document.getElementById("campaignTitle").value;
    const goal = document.getElementById("campaignGoal").value;
    const deadline = document.getElementById("campaignDeadline").value;

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    let base64Image = "";
    if (imageInput) {
      base64Image = await toBase64(imageInput);
    }

    const campaign = {
      id: Date.now(),
      title: title,
      creatorId: user.id,
      goal: parseFloat(goal),
      deadline: deadline,
      image: base64Image,
      isApproved: false,
    };

    try {
      const response = await fetch("http://localhost:3000/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(campaign),
      });

      if (!response.ok) {
        throw new Error("Failed to create campaign");
      }

      alert("Campaign created successfully! Waiting for admin approval.");
      window.location.href = "campaigns.html";
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong while creating the campaign.");
    }
  });
