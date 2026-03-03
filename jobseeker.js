// Load jobs when page loads
window.onload = async () => {
  try {
    const response = await fetch("http://127.0.0.1:5000/jobs");
    const data = await response.json();

    const jobList = document.getElementById("job-list");
    jobList.innerHTML = "";

    if (data.success && data.jobs.length > 0) {
      data.jobs.forEach(job => {
        const jobCard = document.createElement("div");
        jobCard.classList.add("job-card");
        jobCard.innerHTML = `
          <h3>${job.title}</h3>
          <p>${job.description}</p>
          <p><strong>Location:</strong> ${job.location}</p>
          <p><strong>Salary:</strong> ${job.salary || "N/A"}</p>
          <button onclick="applyJob(${job.id})">Apply Now</button>
        `;
        jobList.appendChild(jobCard);
      });
    } else {
      jobList.innerHTML = "<p>No jobs available right now.</p>";
    }
  } catch (error) {
    console.error("Error loading jobs:", error);
    document.getElementById("job-list").innerHTML = "<p>Failed to load jobs.</p>";
  }
};

// Apply to a job
async function applyJob(jobId) {
  const user_id = localStorage.getItem("user_id"); // from login
  const usertype = localStorage.getItem("usertype"); // from login

  if (!user_id || usertype !== "jobseeker") {
    alert("You must be logged in as a Job Seeker to apply.");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:5000/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job_id: jobId, user_id, usertype })  // ✅ send usertype too
    });

    const data = await response.json();
    if (data.success) {
      alert("✅ Applied successfully!");
    } else {
      alert("⚠️ " + data.message);
    }
  } catch (err) {
    console.error("Error applying:", err);
    alert("Server error. Try again.");
  }
}

