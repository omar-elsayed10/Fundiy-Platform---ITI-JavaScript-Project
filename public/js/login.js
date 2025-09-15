let loginForm = document.getElementById("loginForm");
let email = document.getElementById("email");
let password = document.getElementById("password");

loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const loginData = {
    email: email.value,
    password: password.value,
  };

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      throw new Error(" Failed to login. Please try again. ");
    }

    const data = await response.json();
    console.log("Login success:", data);

    localStorage.setItem("token", data.accessToken);

    localStorage.setItem("user", JSON.stringify(data.user));

    if (data.user.role === "admin" && data.user.isActive === true) {
      alert("Login success !!");
      window.location.href = "adminDashboard.html";
    } else if (data.user.role === "user" && data.user.isActive === true) {
      alert("Login success !!");
      window.location.href = "campaigns.html";
      console.log(data.user.role);
    } else {
      alert("You are banned");
    }

    // window.location.href = "campaigns.html";
  } catch (err) {
    console.error(err);
    alert("Failed to login Email or Password is incorrect. Please try again. ");
  }
});
