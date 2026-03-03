document.getElementById("postJobForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const location = document.getElementById("location").value;
  const salary = document.getElementById("salary").value;

  // Get employer details from localStorage (saved after login)
const employer_id = localStorage.getItem("user_id");
const employer_email = localStorage.getItem("email");
const usertype = localStorage.getItem("usertype");

if (!employer_id || !employer_email || usertype !== "employer") {
  alert("You must be logged in as an employer to post jobs.");
  window.location.href = "login.html"; // force re-login
}

  try {
    const response = await fetch("http://127.0.0.1:5000/postjob", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, location, salary, employer_id, employer_email })
    });

    const data = await response.json();
    document.getElementById("message").innerText = data.message;

    if (data.success) {
      document.getElementById("postJobForm").reset();
    }
  } catch (error) {
    document.getElementById("message").innerText = "Server error. Please try again.";
  }
});
