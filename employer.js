// Load jobs for this employer
window.onload = async () => {
  const employer_id = localStorage.getItem("user_id"); // logged in employer ID
  if (!employer_id) {
    alert("You must be logged in as an Employer.");
    return;
  }

  try {
    const response = await fetch(`http://127.0.0.1:5000/employer/jobs/${employer_id}`);
    const data = await response.json();

    const container = document.getElementById("posted-jobs");
    container.innerHTML = "";

    if (data.success && data.jobs.length > 0) {
      data.jobs.forEach(job => {
        const div = document.createElement("div");
        div.classList.add("job-card");
        div.innerHTML = `
          <h3>${job.title}</h3>
          <p>${job.description}</p>
          <p><strong>Location:</strong> ${job.location}</p>
          <p><strong>Salary:</strong> ${job.salary || "N/A"}</p>
          <button onclick="viewCandidates(${job.job_id})">View Candidates</button>
        `;
        container.appendChild(div);
      });
    } else {
      container.innerHTML = "<p>No jobs posted yet.</p>";
    }
  } catch (err) {
    console.error("Error fetching employer jobs:", err);
  }
};

// Redirect to candidates page
function viewCandidates(jobId) {
  window.location.href = `candidates.html?job_id=${jobId}`;
}
