// Cloudflare's DNS-over-HTTPS endpoint
const dohEndpoint = 'https://cloudflare-dns.com/dns-query';

// Function to resolve a hostname using DoH
async function resolveHostname(hostname) {
  try {
    // Construct the URL for the DoH query
    const url = new URL(dohEndpoint);
    url.searchParams.set('name', hostname);
    url.searchParams.set('type', 'A'); // Query for IPv4 addresses

    // Make the request to Cloudflare
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/dns-json'
      }
    });

    const data = await response.json();

    // Check if the response contains answers
    if (data.Answer) {
      // Filter for A records (IPv4 addresses) and map to the required format
      const addresses = data.Answer
        .filter(record => record.type === 1) // Type 1 is 'A' record
        .map(record => record.data);
      
      console.log(`Resolved ${hostname} to:`, addresses);
      return { addresses: addresses };
    }
  } catch (error) {
    console.error(`Failed to resolve ${hostname}:`, error);
  }
  
  // If resolution fails, let the browser handle it as a fallback
  return {
      isTRR: "false"
  };
}

// This is the main logic for Firefox. It checks for the 'dns' API.
if (typeof browser !== 'undefined' && browser.dns) {
  // Add a listener that intercepts all DNS resolution requests from the browser
  browser.dns.onResolve.addListener(resolveHostname);
  console.log("1.1.1.1 DNS resolver is now active.");
  
  // We also need to add the 'dns' permission to our manifest for Firefox.
  // This cannot be done dynamically, so we'll need two manifest files.
  // For now, this code will work once the permission is granted.
} else {
    console.log("browser.dns API not found. This extension will run in helper mode.");
}