(function () {
  "use strict";

  const form = document.querySelector("#contact-form");
  if (!form) {
    return;
  }

  const loadingEl = form.querySelector(".loading");
  const errorEl = form.querySelector(".error-message");
  const sentEl = form.querySelector(".sent-message");
  const submitBtn = form.querySelector('button[type="submit"]');

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showLoading() {
    if (loadingEl) loadingEl.classList.add("d-block");
    if (errorEl) errorEl.classList.remove("d-block");
    if (sentEl) sentEl.classList.remove("d-block");
  }

  function hideLoading() {
    if (loadingEl) loadingEl.classList.remove("d-block");
  }

  function displayError(message) {
    hideLoading();
    if (sentEl) sentEl.classList.remove("d-block");
    if (errorEl) {
      errorEl.textContent = message instanceof Error ? message.message : message;
      errorEl.classList.add("d-block");
    }
    if (submitBtn) submitBtn.disabled = false;
  }

  function displaySuccess() {
    hideLoading();
    if (errorEl) errorEl.classList.remove("d-block");
    if (sentEl) sentEl.classList.add("d-block");
    form.reset();
    if (submitBtn) submitBtn.disabled = false;
  }

  function validate(name, email, subject, message) {
    if (name.length < 2 || name.length > 100) {
      return "Please enter a valid name (2-100 characters).";
    }
    if (!EMAIL_RE.test(email) || email.length > 254) {
      return "Please enter a valid email address.";
    }
    if (subject.length < 2 || subject.length > 150) {
      return "Please enter a subject (2-150 characters).";
    }
    if (message.length < 10 || message.length > 5000) {
      return "Please enter a message (10-5000 characters).";
    }
    return null;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const action = form.getAttribute("action");
    if (!action) {
      displayError("The form action property is not set!");
      return;
    }

    const name = (form.querySelector('#name')?.value || "").trim();
    const email = (form.querySelector('#email')?.value || "").trim();
    const subject = (form.querySelector('#subject')?.value || "").trim();
    const message = (form.querySelector('textarea[name="message"]')?.value || "").trim();

    const validationError = validate(name, email, subject, message);
    if (validationError) {
      displayError(validationError);
      return;
    }

    showLoading();
    if (submitBtn) submitBtn.disabled = true;

    try {
      const formData = new FormData(form);
      const response = await fetch(action, {
        method: "POST",
        body: formData,
        headers: { "X-Requested-With": "XMLHttpRequest" },
      });

      const text = (await response.text()).trim();

      if (response.ok && text === "OK") {
        displaySuccess();
      } else {
        throw new Error(
          text || `Form submission failed (${response.status} ${response.statusText}).`,
        );
      }
    } catch (error) {
      console.error("contact form submit error:", error);
      displayError(error);
    }
  });
})();
