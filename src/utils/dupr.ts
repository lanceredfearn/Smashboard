export const DUPR_CLIENT_ID = '6116991916';
export const DUPR_KEY_ID = '5616016501';
export const DUPR_CLIENT_KEY = 'test-ck-0f3d03ec-02bb-436d-fceb-7848797ed42a';
export const DUPR_CLIENT_SECRET = 'test-cs-04dd90d84c074ec6fc3d6f692590f022';

interface PlayerSearchResult {
    players?: Array<{ id: string; name: string; rating?: number }>; // simplified
}

/**
 * Fetch a player's DUPR rating by name from the DUPR test environment.
 * Returns the player's rating if found, otherwise null.
 */
export async function fetchDUPRRating(name: string): Promise<number | null> {
    if (!name.trim()) return null;
    try {
        const url = `https://uat.dupr.gg/api/v1/players/search?name=${encodeURIComponent(name)}`;
        const response = await fetch(url, {
            headers: {
                'x-client-id': DUPR_CLIENT_ID,
                'x-key-id': DUPR_KEY_ID,
                'x-client-key': DUPR_CLIENT_KEY,
                'x-client-secret': DUPR_CLIENT_SECRET,
            },
        });
        if (!response.ok) return null;
        const data: PlayerSearchResult = await response.json();
        const player = data.players && data.players[0];
        return player && typeof player.rating === 'number' ? player.rating : null;
    } catch (error) {
        console.error('Error fetching DUPR rating', error);
        return null;
    }
}
