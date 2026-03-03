document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const usertype = document.getElementById("usertype").value;

  try {
    const response = await fetch("http://127.0.0.1:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullname, email, password, usertype })
    });

    const data = await response.json();

    const msg = document.getElementById("message");
    msg.innerText = data.message;

    if (data.success) {
      msg.style.color = "green";

      // Redirect after signup
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    } else {
      msg.style.color = "red";
    }
  } catch (error) {
    document.getElementById("message").innerText = "Server error. Please try again.";
  }
});

// Example after successful login response
if (data.success) {
  localStorage.setItem("seeker_id", data.seeker_id);  
  window.location.href = "jobseeker.html";
}
