const getReviews = async () => {
    const res = await fetch("/data/games.json");
    const data = await res.json();
    return data;
};

export { getReviews };