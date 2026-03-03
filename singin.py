from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Database connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Anbu@",  # 🔑 change this
    database="careerconnect"
)
cursor = db.cursor(dictionary=True)

# ---------------------------
# SIGNUP
# ---------------------------
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    fullname = data.get("fullname")
    email = data.get("email")
    password = data.get("password")
    usertype = data.get("usertype")  # jobseeker or employer

    try:
        cursor.execute("INSERT INTO users (fullname, email, password, usertype) VALUES (%s, %s, %s, %s)",
                       (fullname, email, password, usertype))
        db.commit()
        return jsonify({"success": True, "message": "User registered successfully"})
    except mysql.connector.Error as err:
        return jsonify({"success": False, "message": str(err)})

# ---------------------------
# LOGIN
# ---------------------------
@app.route("/signin", methods=["POST"])
def signin():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email=%s AND password=%s", (email, password))
    user = cursor.fetchone()
    cursor.close()

    if user:
        return jsonify({
            "success": True,
            "message": "Login successful",
            "user_id": user["id"],          # 👈 user_id
            "usertype": user["usertype"],  # 👈 employer / jobseeker
            "email": user["email"]         # 👈 email
        })
    else:
        return jsonify({"success": False, "message": "Invalid email or password"})


# ---------------------------
# POST A JOB (Employer)
# ---------------------------
@app.route("/postjob", methods=["POST"])
def post_job():
    data = request.json
    title = data.get("title")
    description = data.get("description")
    location = data.get("location")
    salary = data.get("salary")
    employer_id = data.get("employer_id")


    if not employer_id:
        return jsonify({"success": False, "message": "Employer ID missing"}), 400

    cursor = db.cursor()
    cursor.execute(
      "INSERT INTO jobs (employer_id, title, description, location, salary) VALUES (%s, %s, %s, %s, %s)",
    (employer_id, title, description, location, salary)
      )

    db.commit()
    cursor.close()

    return jsonify({"success": True, "message": "Job posted successfully!"})


# Get jobs posted by specific employer
@app.route("/employer/jobs/<int:employer_id>", methods=["GET"])
def get_employer_jobs(employer_id):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id AS job_id, title, description, location, salary FROM jobs WHERE employer_id = %s", (employer_id,))
    jobs = cursor.fetchall()
    cursor.close()
    return jsonify({"success": True, "jobs": jobs})





# ---------------------------
# GET ALL JOBS (Jobseeker)
# ---------------------------
@app.route("/jobs", methods=["GET"])
def get_jobs():
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT 
            j.id, j.title, j.description, j.location, j.salary, j.employer_id
        FROM jobs j
        ORDER BY j.id DESC
    """)
    jobs = cursor.fetchall()
    cursor.close()
    return jsonify({"success": True, "jobs": jobs})

# ---------------------------
# APPLY FOR A JOB (Jobseeker)
# ---------------------------
@app.route("/apply", methods=["POST"])
def apply_job():
    data = request.json
    job_id = data.get("job_id")
    user_id = data.get("user_id")
    usertype = data.get("usertype")  # ✅ also receive from frontend

    if not user_id or usertype != "jobseeker":
        return jsonify({"success": False, "message": "You must be logged in as a Job Seeker to apply."}), 403

    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT usertype FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()

    if not user or user["usertype"] != "jobseeker":
        return jsonify({"success": False, "message": "Only Job Seekers can apply for jobs"}), 403

    # Insert application
    cursor.execute(
        "INSERT INTO applications (job_id, user_id) VALUES (%s, %s)",
        (job_id, user_id)
    )
    db.commit()
    cursor.close()

    return jsonify({"success": True, "message": "Application submitted successfully!"})




# ---------------------------
# VIEW CANDIDATES (Employer)
# ---------------------------
@app.route("/candidates/<int:job_id>", methods=["GET"])
def get_candidates(job_id):
    cursor = db.cursor(dictionary=True)

    query = """
        SELECT 
            a.id AS application_id,
            u.id AS user_id,
            u.fullname,
            u.email,
            a.applied_at
        FROM applications a
        JOIN users u ON a.user_id = u.id
        WHERE a.job_id = %s
        ORDER BY a.applied_at DESC
    """
    cursor.execute(query, (job_id,))
    candidates = cursor.fetchall()
    cursor.close()

    return jsonify({"success": True, "candidates": candidates})



# ---------------------------
# MAIN
# ---------------------------
if __name__ == "__main__":
    app.run(debug=True)
