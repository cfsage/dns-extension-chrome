document.addEventListener('DOMContentLoaded', () => {
  const statusMessage = document.getElementById('status-message');
  const chromeSetup = document.getElementById('chrome-setup');
  const activateButton = document.getElementById('activate-button');
  const confirmationMessage = document.getElementById('confirmation-message');
  const cloudflareDohUrl = 'https://cloudflare-dns.com/dns-query';

  // This function detects if the powerful 'dns' API is available (Firefox).
  const isFirefox = typeof browser !== 'undefined' && browser.dns;

  if (isFirefox) {
    // Firefox is fully automatic, so just show the connected status.
    statusMessage.textContent = '✅ Connected & Secure! Your DNS is automatically protected.';
  } else {
    // For Chrome, show the activation button.
    statusMessage.textContent = 'Action required to enable secure DNS.';
    chromeSetup.classList.remove('hidden');

    // Add the one-click event listener.
    activateButton.addEventListener('click', async () => {
      try {
        // 1. Copy the Cloudflare URL to the clipboard.
        await navigator.clipboard.writeText(cloudflareDohUrl);
        
        // 2. Open the browser's DNS settings page.
        chrome.tabs.create({ url: 'chrome://settings/security' });

        // 3. Update the UI to give the user the final instruction.
        activateButton.classList.add('hidden'); // Hide the button
        confirmationMessage.textContent = '✅ URL Copied! In the new tab, select "With Custom" and paste the URL.';
        confirmationMessage.classList.remove('hidden'); // Show the message
      
      } catch (err) {
        console.error('Failed to copy URL: ', err);
        confirmationMessage.textContent = 'Error: Could not copy URL.';
        confirmationMessage.classList.remove('hidden');
      }
    });
  }
});