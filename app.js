const INITIAL_STATE = {
    loading: false,
    champions: [],
    img: null,
    info: null,
    title: null,
    id: null,
    error: null
}


const championsURL = 'http://ddragon.leagueoflegends.com/cdn/10.3.1/data/en_US/champion.json';

const createChampionsArray = (response, keys) => {
    const champions = keys.map( key => {
        return response[key];
    });

    return champions
};

const getAllChampions = async (url) => {
    const response = await fetch(url);
    const responseData = await response.json();

    const champiosData = await responseData.data;

    const championsArr = createChampionsArray(champiosData, Object.keys(champiosData));

    console.log(championsArr)
};


getAllChampions(championsURL);