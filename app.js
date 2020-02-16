const STATE = {
    loading: false,
    champions: [],
    img: null,
    info: null,
    title: null,
    id: null,
    error: null
}

const championsDIV = document.querySelector('.champions');
let all_champions;
let champions_info;

const championsURL = 'http://ddragon.leagueoflegends.com/cdn/10.3.1/data/en_US/champion.json';

const getIndividualInfo =  (champions) => {
    const champs = champions.map(async (champion) => {
        try {
            const response = await fetch(`http://ddragon.leagueoflegends.com/cdn/10.3.1/data/en_US/champion/${champion.id}.json`)
            const indChamp = await response.json();
            const data = indChamp.data[champion.id]

            return {
                ...champion,
                ...data
            }
        } catch (error) {
            return {
                ...champion
            }
        }
    });

    return Promise.all(champs);
}

const createChampionsArray = (response, keys) => {
    const champions = keys.map( key => {
        return response[key];
    });

    return champions
};

const getAllChampions = async (url) => {
    STATE.loading = true;

    if (STATE.loading) {
        championsDIV.innerHTML = renderLoading;
    }

    try {
        const response = await fetch(url);
        const responseData = await response.json();
    
        const champiosData = await responseData.data;
    
        const allChampions = createChampionsArray(champiosData, Object.keys(champiosData));
        const individualInfo = await getIndividualInfo(allChampions);

        STATE.champions = individualInfo;
        STATE.info = individualInfo[0].lore,
        STATE.img = `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${individualInfo[0].id}_0.jpg`,
        STATE.title = individualInfo[0].title.toUpperCase(),
        STATE.id = individualInfo[0].id,
        STATE.loading = false;
        
    } catch (error) {
        STATE.error = "Error fetching data";
        STATE.loading = false;
    }
};


const renderLoading = () => {
    return `
        <h1>LOL CHAMPIONS</h1>
        <h2>Loading...</h2>
    `
}

const renderError = (error) => {
    return `
        <h1>LOL CHAMPIONS</h1>
        <h2>${error}</h2>
    `
};

const championsList = (championsArr) => {
    const champions = championsArr.map((champion, index) => {
    const img = `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`;

        return `
            <li id=${index}>
                <img id=${index} src=${img} alt="champion"/>
                <span id=${index}>${champion.name}</span>
            </li>
        `
    });

    return champions;
};

const renderChampions = (championsArr) => {
    const champions = championsList(championsArr).join('\n');
    const { title, img, info } = STATE;

    return `
        <h1>LOL CHAMPIONS</h1>
        <div class="champions-list">
            <ul id="all-champions">
                ${champions}
            </ul>
        </div>
        <div class="champion-info">
            <span>${title}</span>
            <img src=${img} alt="champion"/>
            <p>${info}</p>
        </div>
    `
};

const renderInfo = (title, img, info) => {
    return `
        <span>${title}</span>
        <img src=${img} alt="champion"/>
        <p>${info}</p>
    `
}


getAllChampions(championsURL)
    .then(() => {
        if (STATE.error) {
            championsDIV.innerHTML = renderError(STATE.error);
        } else if (STATE.loading) {
            championsDIV.innerHTML = renderLoading;
        } else {
            championsDIV.innerHTML = renderChampions(STATE.champions);
            champions_info = document.querySelector('.champion-info');

            all_champions = document.querySelector('#all-champions').addEventListener('click', (event) => {
                let tagname = event.target.tagName;
                let id = event.target.id;
                const champion = STATE.champions[id];

                if (tagname === "LI" || tagname === "IMG" || tagname === "SPAN") {
                    const { lore, title, id} = champion;
                    //console.log(champion);
                    const img = `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`;
                    champions_info.innerHTML = renderInfo(title, img, lore)
                }
                
            })
            
        }
    })




