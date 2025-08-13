document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("ageForm");
  const dayInput = document.getElementById("dayInput");
  const monthInput = document.getElementById("monthInput");
  const yearInput = document.getElementById("yearInput");
  const resultsSection = document.getElementById("resultsSection");

  // Real-time validation
  dayInput.addEventListener("input", validateDay);
  monthInput.addEventListener("input", validateMonth);
  yearInput.addEventListener("input", validateYear);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (validateForm()) {
      calculateAge();
    }
  });

  function validateDay() {
    const day = parseInt(dayInput.value);
    const month = parseInt(monthInput.value);
    const year = parseInt(yearInput.value);

    if (isNaN(day) || day < 1 || day > 31) {
      setError(dayInput, "dayError", "Must be a valid day");
      return false;
    }

    if (!isNaN(month) && !isNaN(year)) {
      const daysInMonth = new Date(year, month, 0).getDate();
      if (day > daysInMonth) {
        setError(dayInput, "dayError", `Must be between 1-${daysInMonth}`);
        return false;
      }
    }

    setSuccess(dayInput);
    return true;
  }

  function validateMonth() {
    const month = parseInt(monthInput.value);

    if (isNaN(month) || month < 1 || month > 12) {
      setError(monthInput, "monthError", "Must be a valid month");
      return false;
    }

    if (!isNaN(parseInt(dayInput.value))) {
      validateDay();
    }

    setSuccess(monthInput);
    return true;
  }

  function validateYear() {
    const year = parseInt(yearInput.value);
    const currentYear = new Date().getFullYear();

    if (isNaN(year) || year < 1900 || year > currentYear) {
      setError(yearInput, "yearError", `Must be between 1900-${currentYear}`);
      return false;
    }

    if (
      !isNaN(parseInt(monthInput.value)) &&
      parseInt(monthInput.value) === 2
    ) {
      validateDay();
    }

    setSuccess(yearInput);
    return true;
  }

  function validateForm() {
    const isDayValid = validateDay();
    const isMonthValid = validateMonth();
    const isYearValid = validateYear();

    return isDayValid && isMonthValid && isYearValid;
  }

  function setError(input, errorId, message) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    document.getElementById(errorId).textContent = message;
  }

  function setSuccess(input) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
  }

  function calculateAge() {
    const day = parseInt(dayInput.value);
    const month = parseInt(monthInput.value);
    const year = parseInt(yearInput.value);

    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    if (
      birthDate.getDate() !== day ||
      birthDate.getMonth() !== month - 1 ||
      birthDate.getFullYear() !== year
    ) {
      setError(dayInput, "dayError", "Invalid date");
      return;
    }

    if (birthDate > today) {
      setError(dayInput, "dayError", "Must be in the past");
      return;
    }

    // Calculate age
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate additional statistics
    const totalDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    // Life statistics (approximate)
    const heartbeats = Math.floor(totalMinutes * 70); // ~70 beats per minute
    const breaths = Math.floor(totalMinutes * 16); // ~16 breaths per minute

    // Next birthday
    const nextBirthday = new Date(today.getFullYear(), month - 1, day);
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const daysToNextBirthday = Math.ceil(
      (nextBirthday - today) / (1000 * 60 * 60 * 24)
    );

    // Show results with animation
    resultsSection.style.display = "block";
    setTimeout(() => {
      animateResult(document.getElementById("yearsVal"), years);
      animateResult(document.getElementById("monthsVal"), months);
      animateResult(document.getElementById("daysVal"), days);

      // Update additional stats
      document.getElementById("totalDays").textContent =
        totalDays.toLocaleString();
      document.getElementById("totalHours").textContent =
        totalHours.toLocaleString();
      document.getElementById("totalMinutes").textContent =
        totalMinutes.toLocaleString();
      document.getElementById("totalSeconds").textContent =
        totalSeconds.toLocaleString();
      document.getElementById("heartbeats").textContent =
        heartbeats.toLocaleString();
      document.getElementById("breaths").textContent = breaths.toLocaleString();
      document.getElementById("nextBirthday").textContent = daysToNextBirthday;

      // Show milestones
      showMilestones(years, totalDays);

      // Add show class to result cards
      document.querySelectorAll(".result-card").forEach((card, index) => {
        setTimeout(() => card.classList.add("show"), index * 200);
      });
    }, 100);
  }

  function animateResult(element, target) {
    const start = parseInt(element.textContent) || 0;
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const value = Math.floor(easeOutQuart * (target - start) + start);

      element.textContent = value;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  function showMilestones(years, totalDays) {
    const milestones = [];
    const milestonesContainer = document.getElementById("milestones");

    // Age milestones
    if (years >= 18) milestones.push("🎓 Adult");
    if (years >= 21) milestones.push("🍷 Legal Drinking Age");
    if (years >= 30) milestones.push("🎯 Thirty Club");
    if (years >= 40) milestones.push("💪 Life Begins at 40");
    if (years >= 50) milestones.push("🌟 Golden Years");
    if (years >= 65) milestones.push("🏖️ Retirement Age");

    // Day milestones
    if (totalDays >= 1000) milestones.push("📅 1K Days");
    if (totalDays >= 5000) milestones.push("🎊 5K Days");
    if (totalDays >= 10000) milestones.push("💎 10K Days");
    if (totalDays >= 20000) milestones.push("🚀 20K Days");

    if (milestones.length === 0) {
      milestones.push("🌱 Young & Growing");
    }

    milestonesContainer.innerHTML = milestones
      .map((milestone) => `<span class="milestone-badge">${milestone}</span>`)
      .join("");
  }
});
