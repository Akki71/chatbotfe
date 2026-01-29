(function () {
  if (window.__SEO_CHATBOT__) return;
  window.__SEO_CHATBOT__ = true;

  const currentScript = document.currentScript;

  const PROJECT_NAME =
    currentScript?.dataset.projectName || "SEO AI Assistant";

  const PROJECT_ID =
    currentScript?.dataset.projectId || "default";

  const PRIMARY_COLOR =
    currentScript?.dataset.primaryColor || "#6366f1";

  const CHATBOT_URL =
    `https://chatbot.preproductiondemo.com/chatbot` +
    `?projectName=${encodeURIComponent(PROJECT_NAME)}` +
    `&projectId=${encodeURIComponent(PROJECT_ID)}` +
    `&color=${encodeURIComponent(PRIMARY_COLOR)}`;

  let iframe = null;
  let isOpen = false;

  // Floating Button
  const button = document.createElement("button");
  button.innerHTML = "💬";
  button.title = `Chat with ${PROJECT_NAME}`;

Object.assign(iframe.style, {
  position: "fixed",
  bottom: "90px",
  right: "16px",
  width: window.innerWidth < 640 ? "92%" : "420px",
  height: window.innerWidth < 640 ? "75%" : "580px",
  border: "none",
  borderRadius: "16px",
  background: "#ffffff",
  boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
  zIndex: "999998",
});

  function createIframe() {
    iframe = document.createElement("iframe");
    iframe.src = CHATBOT_URL;

    Object.assign(iframe.style, {
      position: "fixed",
      bottom: "100px",
      right: "24px",
      width: "420px",
      height: "580px",
      border: "none",
      borderRadius: "16px",
      background: "#ffffff",
      boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
      zIndex: "999998",
    });

    document.body.appendChild(iframe);
  }

  button.onclick = () => {
    if (!isOpen) {
      createIframe();
      isOpen = true;
    } else {
      iframe.remove();
      iframe = null;
      isOpen = false;
    }
  };

  document.body.appendChild(button);
})();
