const awakeCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Checks if a downstream service is awake and healthy.
 * Uses an in-memory cache to bypass the health check if the service was verified awake recently.
 * If the service is not awake, retries the request up to 15 times with a timeout.
 * 
 * @param {string} serviceUrl The base URL of the service.
 * @returns {Promise<boolean>} Resolves to true when the service is awake.
 */
export async function ensureServiceAwake(serviceUrl) {
    if (!serviceUrl) {
        throw new Error("Service URL is required to check if it's awake.");
    }

    const normalizedUrl = serviceUrl.replace(/\/$/, "");
    const now = Date.now();

    if (awakeCache.has(normalizedUrl)) {
        const lastChecked = awakeCache.get(normalizedUrl);
        if (now - lastChecked < CACHE_TTL_MS) {
            return true;
        }
    }

    console.log(`[Service Alerter] Checking if service at ${normalizedUrl} is awake...`);
    const healthUrl = `${normalizedUrl}/health`;

    const maxAttempts = 15;
    const timeoutMs = 4000; // 4 seconds timeout per attempt

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeoutMs);

            const response = await fetch(healthUrl, {
                method: "GET",
                signal: controller.signal
            });
            clearTimeout(id);

            if (response.ok) {
                console.log(`[Service Alerter] Service at ${normalizedUrl} is awake and healthy!`);
                awakeCache.set(normalizedUrl, Date.now());
                return true;
            } else {
                console.log(`[Service Alerter] Attempt ${attempt}/${maxAttempts}: Service at ${normalizedUrl} responded with status ${response.status}`);
            }
        } catch (error) {
            console.log(`[Service Alerter] Attempt ${attempt}/${maxAttempts} to wake service at ${normalizedUrl} failed: ${error.message}`);
        }

        // Wait 3 seconds before retrying
        await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    throw new Error(`Service at ${normalizedUrl} did not wake up after multiple attempts.`);
}
