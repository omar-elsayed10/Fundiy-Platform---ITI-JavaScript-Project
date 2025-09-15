const paymentForm = document.getElementById("paymentForm");

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user) {
  alert("You must be logged in to pledge.");
  window.location.href = "login.html";
}
const urlParams = new URLSearchParams(window.location.search);
const campaignId = parseInt(urlParams.get("campaignId"));

paymentForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const cardNumber = document.getElementById("cardNumber").value.trim();
  const expiry = document.getElementById("expiry").value;
  const cvv = document.getElementById("cvv").value.trim();
  const amount = parseFloat(document.getElementById("amount").value.trim());

  if (!name || !cardNumber || !expiry || !cvv || !amount) {
    alert("Please fill in all fields!");
    return;
  }

  if (name.length < 3 || /\d/.test(name)) {
    alert("Name must be at least 3 characters and contain no numbers.");
    return;
  }

  if (cardNumber.length !== 16 || isNaN(cardNumber)) {
    alert("Card number must be 16 digits.");
    return;
  }
  if (cvv.length !== 3 || isNaN(cvv)) {
    alert("CVV must be 3 digits.");
    return;
  }
  if (amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  const pledgeObj = {
    campaignId: campaignId,
    userId: user.id,
    amount: amount,
  };

  try {
    const response = await fetch("http://localhost:3000/pledges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(pledgeObj),
    });

    if (!response.ok) {
      throw new Error("Failed to create pledge");
    }

    const data = await response.json();
    console.log("Pledge created:", data);

    const campaignRes = await fetch(
      `http://localhost:3000/campaigns/${campaignId}`
    );
    const campaign = await campaignRes.json();

    const newGoal = campaign.goal - amount;

    const updateRes = await fetch(
      `http://localhost:3000/campaigns/${campaignId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ goal: newGoal }),
      }
    );

    if (!updateRes.ok) throw new Error("Failed to update campaign goal");

    alert(`Payment of $${amount} was successful!\nThank you, ${name}.`);

    window.location.href = "campaigns.html";
  } catch (err) {
    console.error(err);
    alert(" Failed to process payment. Try again.");
  }
});
