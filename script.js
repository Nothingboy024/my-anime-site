const animeGrid = document.getElementById('animeGrid');
const searchInput = document.getElementById('searchInput');
const loader = document.getElementById('loader');
const gridTitle = document.getElementById('gridTitle');

async function fetchAnime(query = '') {
    loader.classList.remove('hidden');
    
    // Choose endpoint based on search query
    const url = query 
        ? `https://api.jikan.moe/v4/anime?q=${query}&limit=24&order_by=score&sort=desc`
        : `https://api.jikan.moe/v4/top/anime?limit=24`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        gridTitle.innerText = query ? `Results for: ${query}` : "Trending Now";
        renderCards(data.data);
    } catch (error) {
        console.error("API Error:", error);
        animeGrid.innerHTML = `<p class="text-red-500">Failed to load. The API might be busy.</p>`;
    } finally {
        loader.classList.add('hidden');
    }
}

function renderCards(list) {
    if (!list || list.length === 0) {
        animeGrid.innerHTML = `<p class="text-zinc-500">No anime found.</p>`;
        return;
    }

    animeGrid.innerHTML = list.map(anime => `
        <div class="anime-card group cursor-pointer">
            <div class="relative overflow-hidden rounded-2xl aspect-[3/4] mb-3 bg-zinc-900 shadow-2xl">
                <img src="${anime.images.webp.large_image_url}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <p class="text-xs text-zinc-300 line-clamp-3">${anime.synopsis || 'No description available.'}</p>
                </div>
                <div class="absolute top-3 right-3 bg-red-600 text-[10px] font-black px-2 py-1 rounded-md shadow-xl">
                    ★ ${anime.score || 'N/A'}
                </div>
            </div>
            <h3 class="font-bold text-sm leading-tight truncate group-hover:text-red-500 transition-colors">${anime.title}</h3>
            <div class="flex items-center gap-2 mt-1">
                <span class="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">${anime.type || 'TV'}</span>
                <span class="w-1 h-1 bg-zinc-700 rounded-full"></span>
                <span class="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">${anime.episodes || '?'} EPS</span>
            </div>
        </div>
    `).join('');
}

// Debounce search to save API hits
let debounceTimer;
searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        fetchAnime(e.target.value);
    }, 600);
});

// Load top anime on start
fetchAnime();
