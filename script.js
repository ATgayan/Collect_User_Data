const loader = document.getElementById('loader');
const app = document.getElementById('app');

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.style.display = "none";
    app.classList.remove("hidden");
  }, 1000);
});

const questions = [
  "Do you enjoy helping your friends with assignments?",
  "Do you like planning your day ahead of time?",
  "Do you feel energized after hanging out with friends?",
  "Do you get emotional during movies or dramas?",
  "Do you prefer studying in quiet places?",
  "Do you love trying out new apps or tech stuff?",
  "Is your room or desk usually neat and organized?",
  "Do you speak up in group discussions?",
  "Do you enjoy working on group projects?",
  "Do you keep your personal feelings private?"
];

let currentQuestion = 0;
let answers = [];

function startQuiz() {
  const name = document.getElementById('name').value.trim();
  const gender = document.getElementById('gender').value;
  if (!name || !gender) {
    alert("Please enter your name and gender.");
    return;
  }
  document.getElementById('startBox').classList.add('hidden');
  document.getElementById('quizBox').classList.remove('hidden');
  showQuestion();
}

function showQuestion() {
  document.getElementById('questionText').textContent = questions[currentQuestion];
}

function answer(choice) {
  answers.push(choice);
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    document.getElementById('quizBox').classList.add('hidden');
    document.getElementById('contactBox').classList.remove('hidden');
  }
}

function showResult() {
  const mobile = document.getElementById('mobile').value.trim();
  const email = document.getElementById('email').value.trim();
  const warning = document.getElementById('contactWarning');

  if (!mobile || !email) {
    if (warning) {
      warning.textContent = "⚠️ Add correct mobile number and email for sending your results.";
      warning.classList.remove("hidden");
    } else {
      alert("⚠️ Please enter a valid mobile and email.");
    }
    return;
  }

  if (warning) warning.classList.add("hidden");

  document.getElementById('contactBox').classList.add('hidden');
  document.getElementById('resultBox').classList.remove('hidden');

  const yesCount = answers.filter(a => a === 'yes').length;
  let personality = "";

  if (yesCount >= 8) {
    personality = "🌟 You are a Confident Leader – bold, organized and expressive!";
  } else if (yesCount >= 5) {
    personality = "🌿 You are a Balanced Soul – thoughtful, social and adaptable.";
  } else {
    personality = "🌙 You are a Quiet Thinker – introspective, calm and deep.";
  }

  document.getElementById('resultText').innerText = personality;

  sendDataToBackend(
    document.getElementById('name').value,
    document.getElementById('gender').value,
    questions,
    answers,
    mobile,
    email,
    personality
  );
}

// Function to send data to backend
function sendDataToBackend(name, gender, questions, answers, mobile, email, result) {
  const combinedQA = questions.map((question, index) => ({
    question: question,
    answer: answers[index]
  }));

  fetch("https://8e34-2402-4000-2370-895-3c0b-ce1-5ea-69dc.ngrok-free.app/uploads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      gender,
      mobile,
      email,
      result,
      quiz: combinedQA
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("✅ Sent successfully", data);
    })
    .catch((err) => {
      console.error("❌ Failed to send data", err);
    });
}
