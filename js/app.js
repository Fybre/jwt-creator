document.addEventListener("DOMContentLoaded", function () {
  // Initialize date fields with current time and default expiry
  initializeDates();

  // Set up event listeners
  setupTabs();
  setupDateListeners();
  setupPermissionCalculator();
  setupSecretToggle();
  setupQuickDates();
  setupApplyPermissionButtons();
  setupCopyButtons();
  setupFormSubmit();
  setupFormReset();
  setupIdentityClaimToggle();
  setupScopeToggle();
  setupGenerateSecret();
  setupJwtDecoder();
});

// Set up tab navigation
function setupTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.dataset.tab;

      // Update button states
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Update content visibility
      tabContents.forEach((content) => {
        content.classList.remove("active");
        if (content.id === `${targetTab}-tab`) {
          content.classList.add("active");
        }
      });
    });
  });
}

// Initialize date fields
function initializeDates() {
  const now = new Date();
  const nbfInput = document.getElementById("nbf-date");
  const expInput = document.getElementById("exp-date");

  // Set NBF to now
  nbfInput.value = formatDateTimeLocal(now);
  updateTimestampDisplay("nbf");

  // Set EXP to 30 days from now
  const exp = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  expInput.value = formatDateTimeLocal(exp);
  updateTimestampDisplay("exp");
}

// Format date for datetime-local input
function formatDateTimeLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Update timestamp display
function updateTimestampDisplay(field) {
  const input = document.getElementById(`${field}-date`);
  const display = document.getElementById(`${field}-timestamp`);

  if (input.value) {
    const date = new Date(input.value);
    display.textContent = Math.floor(date.getTime() / 1000);
  } else {
    display.textContent = "-";
  }
}

// Set up date input listeners
function setupDateListeners() {
  document
    .getElementById("nbf-date")
    .addEventListener("change", () => updateTimestampDisplay("nbf"));
  document
    .getElementById("exp-date")
    .addEventListener("change", () => updateTimestampDisplay("exp"));
}

// Set up permission calculator (using BigInt for large workflow values)
function setupPermissionCalculator() {
  const checkboxes = document.querySelectorAll('input[name="perm"]');
  const resultDisplay = document.getElementById("calculated-permission");

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      let total = BigInt(0);
      checkboxes.forEach((cb) => {
        if (cb.checked) {
          total += BigInt(cb.value);
        }
      });
      resultDisplay.textContent = total.toString();
    });
  });
}

// Set up secret toggle
function setupSecretToggle() {
  const toggleBtn = document.getElementById("toggle-secret");
  const secretInput = document.getElementById("secret");

  toggleBtn.addEventListener("click", () => {
    if (secretInput.type === "password") {
      secretInput.type = "text";
      toggleBtn.querySelector(".eye-icon").textContent = "Hide";
    } else {
      secretInput.type = "password";
      toggleBtn.querySelector(".eye-icon").textContent = "Show";
    }
  });
}

// Set up generate secret button
function setupGenerateSecret() {
  const generateBtn = document.getElementById("generate-secret");
  const copyBtn = document.getElementById("copy-secret");
  const secretInput = document.getElementById("secret");

  generateBtn.addEventListener("click", () => {
    const charset =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);

    let secret = "";
    for (let i = 0; i < 32; i++) {
      secret += charset[array[i] % charset.length];
    }

    secretInput.value = secret;
    // Show the secret so user can see/copy it
    secretInput.type = "text";
    document.querySelector("#toggle-secret .eye-icon").textContent = "Hide";
  });

  copyBtn.addEventListener("click", async () => {
    const secret = secretInput.value;
    if (!secret) return;

    try {
      await navigator.clipboard.writeText(secret);
      copyBtn.classList.add("copied");
      setTimeout(() => {
        copyBtn.classList.remove("copied");
      }, 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  });
}

// Set up quick date buttons
function setupQuickDates() {
  const buttons = document.querySelectorAll(".quick-dates button");
  const nbfInput = document.getElementById("nbf-date");
  const expInput = document.getElementById("exp-date");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const days = parseInt(button.dataset.days, 10);
      const now = new Date();

      // Set NBF to now
      nbfInput.value = formatDateTimeLocal(now);
      updateTimestampDisplay("nbf");

      // Set EXP to now + days
      const exp = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      expInput.value = formatDateTimeLocal(exp);
      updateTimestampDisplay("exp");
    });
  });
}

// Set up apply permission buttons (using data-target attribute)
function setupApplyPermissionButtons() {
  const calculatedPerm = document.getElementById("calculated-permission");
  const applyButtons = document.querySelectorAll(".btn-apply[data-target]");

  applyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.target;
      const targetInput = document.getElementById(targetId);
      if (targetInput) {
        targetInput.value = calculatedPerm.textContent;
      }
    });
  });
}

// Set up copy buttons
function setupCopyButtons() {
  document.getElementById("copy-jwt").addEventListener("click", async () => {
    const jwt = document.getElementById("jwt-output").value;
    await copyToClipboard(jwt, "copy-jwt");
  });

  document.getElementById("copy-header").addEventListener("click", async () => {
    const header = document.getElementById("auth-header").value;
    await copyToClipboard(header, "copy-header");
  });
}

async function copyToClipboard(text, buttonId) {
  try {
    await navigator.clipboard.writeText(text);
    const button = document.getElementById(buttonId);
    const originalText = button.textContent;
    button.textContent = "Copied!";
    button.classList.add("copied");
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove("copied");
    }, 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
    alert("Failed to copy to clipboard");
  }
}

// Set up form submission
function setupFormSubmit() {
  const form = document.getElementById("jwt-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await generateJWT();
  });
}

// Set up form reset
function setupFormReset() {
  const form = document.getElementById("jwt-form");

  form.addEventListener("reset", () => {
    // Hide output section
    document.getElementById("output-section").style.display = "none";

    // Reset displays after form values are cleared
    setTimeout(() => {
      document.getElementById("calculated-permission").textContent = "256";
      initializeDates();

      // Reset scope visibility (default is therefore_user, so hide permission sections)
      document.getElementById("permission-calculator-section").style.display =
        "none";
      document.getElementById("object-permissions-section").style.display =
        "none";

      // Reset identity claim visibility (default is windowsaccountname)
      document.getElementById("windows-account-fields").style.display = "block";
      document.getElementById("name-field").style.display = "none";
      document.getElementById("email-field").style.display = "none";
    }, 10);
  });
}

// Set up identity claim type toggle
function setupIdentityClaimToggle() {
  const claimTypeSelect = document.getElementById("identity-claim-type");
  const windowsFields = document.getElementById("windows-account-fields");
  const nameField = document.getElementById("name-field");
  const emailField = document.getElementById("email-field");

  function updateIdentityFields() {
    const selectedType = claimTypeSelect.value;

    // Hide all fields first
    windowsFields.style.display = "none";
    nameField.style.display = "none";
    emailField.style.display = "none";

    // Show the relevant field
    switch (selectedType) {
      case "windowsaccountname":
        windowsFields.style.display = "block";
        break;
      case "name":
        nameField.style.display = "block";
        break;
      case "emailaddress":
        emailField.style.display = "block";
        break;
    }
  }

  // Set initial state based on default selection
  updateIdentityFields();

  // Listen for changes
  claimTypeSelect.addEventListener("change", updateIdentityFields);
}

// Set up scope toggle for granular permissions visibility
function setupScopeToggle() {
  const scopeSelect = document.getElementById("scope");
  const permissionCalcSection = document.getElementById(
    "permission-calculator-section",
  );
  const objectPermSection = document.getElementById(
    "object-permissions-section",
  );

  function updatePermissionSectionsVisibility() {
    const isSpecific = scopeSelect.value === "therefore_specific";
    permissionCalcSection.style.display = isSpecific ? "block" : "none";
    objectPermSection.style.display = isSpecific ? "block" : "none";
  }

  // Set initial state
  updatePermissionSectionsVisibility();

  // Listen for changes
  scopeSelect.addEventListener("change", updatePermissionSectionsVisibility);
}

// Generate JWT
async function generateJWT() {
  try {
    // Get form values
    const issuer = document.getElementById("issuer").value.trim();
    const audience = document.getElementById("audience").value.trim();
    const secret = document.getElementById("secret").value;
    const scope = document.getElementById("scope").value;
    const includeIat = document.getElementById("include-iat").checked;
    const identityClaimType = document.getElementById(
      "identity-claim-type",
    ).value;

    const nbfDate = new Date(document.getElementById("nbf-date").value);
    const expDate = new Date(document.getElementById("exp-date").value);

    // Validate secret length
    if (secret.length < 32) {
      alert("Secret must be at least 32 characters long");
      return;
    }

    // Validate dates
    if (expDate <= nbfDate) {
      alert("Expiry date must be after Not Before date");
      return;
    }

    // Build payload
    const payload = {
      iss: issuer,
      aud: audience,
      nbf: Math.floor(nbfDate.getTime() / 1000),
      exp: Math.floor(expDate.getTime() / 1000),
      "urn:oauth:scope": scope,
    };

    // Add identity claim based on selected type
    switch (identityClaimType) {
      case "windowsaccountname": {
        const domain = document.getElementById("domain").value.trim();
        const username = document.getElementById("username").value.trim();
        if (!username) {
          alert("Username is required");
          return;
        }
        const fullUsername = domain
          ? `${domain}\\${username}`
          : `\\${username}`;
        payload[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsaccountname"
        ] = fullUsername;
        break;
      }
      case "name": {
        const userName = document.getElementById("user-name").value.trim();
        if (!userName) {
          alert("Name is required");
          return;
        }
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] =
          userName;
        break;
      }
      case "emailaddress": {
        const userEmail = document.getElementById("user-email").value.trim();
        if (!userEmail) {
          alert("Email address is required");
          return;
        }
        payload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ] = userEmail;
        break;
      }
    }

    // Add iat if requested
    if (includeIat) {
      payload.iat = Math.floor(Date.now() / 1000);
    }

    // Get object permission values
    const categoryId = document.getElementById("category-id").value;
    const categoryPerm = document.getElementById("category-perm").value;
    const casedefId = document.getElementById("casedef-id").value;
    const casedefPerm = document.getElementById("casedef-perm").value;
    const caseId = document.getElementById("case-id").value;
    const casePerm = document.getElementById("case-perm").value;
    const docId = document.getElementById("doc-id").value;
    const docPerm = document.getElementById("doc-perm").value;
    const wfinstId = document.getElementById("wfinst-id").value;
    const wfinstToken = document.getElementById("wfinst-token").value;
    const wfinstPerm = document.getElementById("wfinst-perm").value;
    const eformId = document.getElementById("eform-id").value;
    const eformPerm = document.getElementById("eform-perm").value;
    const ixprofId = document.getElementById("ixprof-id").value;
    const ixprofPerm = document.getElementById("ixprof-perm").value;

    // Add category if provided
    if (categoryId && categoryPerm) {
      payload["the:ctgry"] = `${categoryId}:${categoryPerm}`;
    }

    // Add case definition if provided
    if (casedefId && casedefPerm) {
      payload["the:casedef"] = `${casedefId}:${casedefPerm}`;
    }

    // Add case if provided
    if (caseId && casePerm) {
      payload["the:case"] = `${caseId}:${casePerm}`;
    }

    // Add document if provided
    if (docId && docPerm) {
      payload["the:doc"] = `${docId}:${docPerm}`;
    }

    // Add workflow instance if provided (format: InstanceNo:TokenNo:Permission)
    if (wfinstId && wfinstPerm) {
      const tokenNo = wfinstToken || "0";
      payload["the:wfinst"] = `${wfinstId}:${tokenNo}:${wfinstPerm}`;
    }

    // Add eForm if provided
    if (eformId && eformPerm) {
      payload["the:eform"] = `${eformId}:${eformPerm}`;
    }

    // Add indexing profile if provided
    if (ixprofId && ixprofPerm) {
      payload["the:ixprof"] = `${ixprofId}:${ixprofPerm}`;
    }

    // Encode secret
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(secret);

    // Generate JWT using jose library
    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .sign(secretKey);

    // Display output
    document.getElementById("jwt-output").value = jwt;
    document.getElementById("payload-preview").textContent = JSON.stringify(
      payload,
      null,
      2,
    );
    document.getElementById("auth-header").value = `Bearer ${jwt}`;
    document.getElementById("output-section").style.display = "block";

    // Scroll to output
    document
      .getElementById("output-section")
      .scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    console.error("JWT generation failed:", error);
    alert("Failed to generate JWT: " + error.message);
  }
}

// Set up JWT Decoder
function setupJwtDecoder() {
  const decodeBtn = document.getElementById("decode-btn");
  const clearBtn = document.getElementById("clear-decode-btn");
  const input = document.getElementById("jwt-decode-input");
  const output = document.getElementById("decode-output");
  const errorDiv = document.getElementById("decode-error");
  const headerPre = document.getElementById("decoded-header");
  const payloadPre = document.getElementById("decoded-payload");
  const statusDiv = document.getElementById("token-status");

  decodeBtn.addEventListener("click", () => {
    const jwt = input.value.trim();

    // Reset display
    output.style.display = "none";
    errorDiv.style.display = "none";
    statusDiv.className = "";

    if (!jwt) {
      showDecodeError("Please enter a JWT token");
      return;
    }

    try {
      const parts = jwt.split(".");
      if (parts.length !== 3) {
        showDecodeError("Invalid JWT format. Expected 3 parts separated by dots.");
        return;
      }

      // Decode header and payload
      const header = JSON.parse(base64UrlDecode(parts[0]));
      const payload = JSON.parse(base64UrlDecode(parts[1]));

      // Display decoded values
      headerPre.textContent = JSON.stringify(header, null, 2);
      payloadPre.textContent = JSON.stringify(payload, null, 2);

      // Check token status
      const now = Math.floor(Date.now() / 1000);
      let statusHtml = "";
      let statusClass = "";

      if (payload.exp) {
        const expDate = new Date(payload.exp * 1000);
        if (payload.exp < now) {
          statusClass = "status-expired";
          statusHtml = `<strong>Expired</strong> — Token expired on ${expDate.toLocaleString()}`;
        } else {
          const timeLeft = payload.exp - now;
          const daysLeft = Math.floor(timeLeft / 86400);
          const hoursLeft = Math.floor((timeLeft % 86400) / 3600);

          if (payload.nbf && payload.nbf > now) {
            const nbfDate = new Date(payload.nbf * 1000);
            statusClass = "status-not-yet-valid";
            statusHtml = `<strong>Not Yet Valid</strong> — Token becomes valid on ${nbfDate.toLocaleString()}`;
          } else {
            statusClass = "status-valid";
            statusHtml = `<strong>Valid</strong> — Expires on ${expDate.toLocaleString()} (${daysLeft}d ${hoursLeft}h remaining)`;
          }
        }
      } else {
        statusHtml = "<strong>No Expiry</strong> — Token has no expiration claim";
      }

      statusDiv.className = statusClass;
      statusDiv.innerHTML = statusHtml;

      output.style.display = "block";
    } catch (err) {
      console.error("Decode error:", err);
      showDecodeError("Failed to decode JWT: " + err.message);
    }
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    output.style.display = "none";
    errorDiv.style.display = "none";
  });

  function showDecodeError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
  }

  function base64UrlDecode(str) {
    // Replace URL-safe characters and add padding
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const padding = base64.length % 4;
    if (padding) {
      base64 += "=".repeat(4 - padding);
    }
    return atob(base64);
  }
}
