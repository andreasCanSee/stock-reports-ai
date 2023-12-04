export async function fetchApi(url) {
    try {
        const response = await fetch(url);
        const jsonResponse = await response.json();
        if (!response.ok || jsonResponse.status !== "success") {
            throw new Error(jsonResponse.message || "Error fetching data");
        }
        return jsonResponse.data;
    } catch (err) {
        console.error(`Error fetching from ${url}:`, err);
        throw err;
    }
}
