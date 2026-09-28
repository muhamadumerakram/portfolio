(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = document.getElementById("nav-links");
  const toggle = document.getElementById("nav-toggle");
  const glow = document.getElementById("pointer-glow");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];

  const setActive = () => {
    const y = window.scrollY + 90;
    let current = sections[0]?.id;
    sections.forEach((section) => {
      if (section.offsetTop <= y) current = section.id;
    });
    navLinks.forEach((link) => {
      const match = link.getAttribute("href") === `#${current}`;
      if (match) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };

  window.addEventListener("scroll", setActive, { passive: true });
  setActive();

  if (glow && !prefersReduced && window.matchMedia("(pointer: fine)").matches) {
    glow.style.opacity = "1";
    window.addEventListener("pointermove", (event) => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    }, { passive: true });
  }

  document.querySelectorAll("[data-case-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const panel = document.getElementById(button.getAttribute("aria-controls"));
      if (!panel) return;
      const open = panel.classList.toggle("open");
      button.setAttribute("aria-expanded", String(open));
      button.textContent = open ? "Hide case study" : "View case study";
    });
  });

  const modal = document.getElementById("sample-code-modal");
  const openModal = document.getElementById("sample-code-btn");
  const closeModal = document.getElementById("close-modal");

  const setModal = (open) => {
    if (!modal) return;
    modal.classList.toggle("open", open);
    modal.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  };

  openModal?.addEventListener("click", () => setModal(true));
  closeModal?.addEventListener("click", () => setModal(false));
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) setModal(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setModal(false);
  });

  setupContactForm();
  setupBugLab();
})();

function setupContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const submit = document.getElementById("form-submit");
  if (!form || !status || !submit) return;

  const endpoint = window.PORTFOLIO_CONFIG?.formspreeEndpoint || "";
  const configured = endpoint && !endpoint.includes("YOUR_FORM_ID");

  if (!configured) {
    status.className = "form-status warn";
    status.textContent = "Contact form is ready, but Formspree is not configured yet. See README for the one-time setup.";
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const subject = String(data.get("subject") || "").trim();
    const message = String(data.get("message") || "").trim();
    const honeypot = String(data.get("_gotcha") || "").trim();

    if (honeypot) return;

    if (!name || !email || !subject || !message) {
      status.className = "form-status error";
      status.textContent = "Please complete all required fields.";
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.className = "form-status error";
      status.textContent = "Please enter a valid email address.";
      return;
    }

    if (!configured) {
      status.className = "form-status warn";
      status.textContent = "Formspree endpoint is not set. Replace YOUR_FORM_ID in js/config.js after creating a Formspree form.";
      return;
    }

    submit.disabled = true;
    submit.textContent = "Sending…";
    status.className = "form-status";
    status.textContent = "Sending your message.";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data
      });

      if (!response.ok) throw new Error("Request failed");

      form.reset();
      status.className = "form-status success";
      status.textContent = "Message sent. Thank you — I will get back to you by email.";
    } catch (error) {
      status.className = "form-status error";
      status.textContent = "The message could not be sent. Please try again or use the email link.";
    } finally {
      submit.disabled = false;
      submit.textContent = "Send message";
    }
  });
}

function setupBugLab() {
  const form = document.getElementById("buglab-form");
  const log = document.getElementById("bug-log");
  const counter = document.getElementById("bug-count");
  if (!form || !log) return;

  const found = new Set();

  const bugs = {
    emptyPassword: {
      id: "BUG-001",
      severity: "High",
      type: "Functional",
      title: "Login succeeds with an empty password",
      expected: "Authentication should fail when the password field is empty.",
      actual: "The demo environment accepted the request and showed a successful login state."
    },
    invalidEmail: {
      id: "BUG-002",
      severity: "Medium",
      type: "Validation",
      title: "Email field accepts values without an @ symbol",
      expected: "The email field should reject values that are not a valid email format.",
      actual: "A value without '@' was accepted by the login form."
    },
    brokenRemember: {
      id: "BUG-003",
      severity: "Low",
      type: "UI",
      title: "Remember me control does not change state",
      expected: "The checkbox should toggle between checked and unchecked.",
      actual: "The control appears interactive but does not persist a checked state."
    }
  };

  const render = (bug) => {
    if (found.has(bug.id)) return;
    found.add(bug.id);
    if (counter) counter.textContent = String(found.size);
    const card = document.createElement("article");
    card.className = "found-bug";
    card.innerHTML = `
      <strong>${bug.id}</strong> · ${bug.title}
      <div class="bug-meta">
        <div>Severity: ${bug.severity}</div>
        <div>Type: ${bug.type}</div>
        <div>Environment: Web / portfolio demo</div>
        <div>Status: Reproduced</div>
      </div>
      <p><strong>Expected:</strong> ${bug.expected}</p>
      <p><strong>Actual:</strong> ${bug.actual}</p>
    `;
    log.prepend(card);
  };

  const remember = document.getElementById("remember-me");
  remember?.addEventListener("click", (event) => {
    event.preventDefault();
    render(bugs.brokenRemember);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("lab-email").value.trim();
    const password = document.getElementById("lab-password").value;
    const result = document.getElementById("lab-result");

    if (!email.includes("@")) {
      render(bugs.invalidEmail);
    }

    if (!password) {
      render(bugs.emptyPassword);
      result.textContent = "Welcome, tester. Session started.";
      result.className = "form-status success";
      return;
    }

    result.textContent = "Credentials rejected. Try exploring empty or invalid field combinations.";
    result.className = "form-status";
  });
}
