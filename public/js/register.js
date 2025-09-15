let registerForm = document.getElementById("registerForm");
let fullname = document.getElementById("fullname");
let email = document.getElementById("email");
let password = document.getElementById("password");

registerForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const userData = {
    name: fullname.value,
    email: email.value,
    password: password.value,
    role: "user",
    isActive: true,
  };

  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    const data = await response.json();
    console.log("User registered:", data);
    alert("Welcome " + fullname.value + " Registered Successfully !!");

    window.location.href = "login.html";
  } catch (err) {
    console.error(err);
    alert("Registration failed User already exists !!");
  }
});
