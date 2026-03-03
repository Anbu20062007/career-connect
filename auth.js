document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://127.0.0.1:5000/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
      // ✅ Save user info to localStorage
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("email", data.email);
      localStorage.setItem("usertype", data.usertype);

      // ✅ Redirect based on user type
      if (data.usertype === "jobseeker") {
        window.location.href = "jobseeker.html";
      } else if (data.usertype === "employer") {
        window.location.href = "employer.html";
      } else {
        document.getElementById("message").innerText = "Unknown user type!";
      }
    } else {
      document.getElementById("message").innerText = data.message;
    }
  } catch (error) {
    document.getElementById("message").innerText = "Server error. Please try again.";
  }
});
