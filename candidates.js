const employer_id = localStorage.getItem("user_id"); // Employer must be logged in

async function loadCandidates() {
  try {
    // 1. Get employer’s jobs
    const resJobs = await fetch("http://127.0.0.1:5000/jobs");
    const dataJobs = await resJobs.json();

    if (!dataJobs.success) {
      document.getElementById("candidate-list").innerHTML = "<p>Failed to load jobs.</p>";
      return;
    }

    // Filter only employer’s jobs
    const myJobs = dataJobs.jobs.filter(job => job.employer_id == employer_id);

    if (myJobs.length === 0) {
      document.getElementById("candidate-list").innerHTML = "<p>No jobs posted yet.</p>";
      return;
    }

    let allCandidates = "";

    // 2. For each job, fetch candidates
    for (let job of myJobs) {
      const resCand = await fetch(`http://127.0.0.1:5000/candidates/${job.id}`);
      const dataCand = await resCand.json();

      allCandidates += `<h2>Applicants for: ${job.title}</h2>`;

      if (dataCand.success && dataCand.candidates.length > 0) {
        dataCand.candidates.forEach(c => {
          allCandidates += `
            <div class="candidate-card">
              <h3>${c.fullname}</h3>
              <p>Email: ${c.email}</p>
              <p>Applied At: ${c.applied_at}</p>
            </div>
          `;
        });
      } else {
        allCandidates += `<p>No applicants yet.</p>`;
      }
    }

    document.getElementById("candidate-list").innerHTML = allCandidates;
  } catch (error) {
    console.error("Error loading candidates:", error);
    document.getElementById("candidate-list").innerHTML = "<p>Error fetching candidates.</p>";
  }
}

// Load when page starts
window.onload = loadCandidates;


