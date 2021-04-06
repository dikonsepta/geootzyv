var myObjects = [];



var myFeedbacks = [{
    // id: 1,
    place: [56.846717, 53.197888],
    name: "Диана",
    title: "Генеральский Дом",
    data: "03.11.2019",
    feed: "Обычно туристы ходят по всяким музеям и храмам, а лучше бы поинтересовались этим местом!"
}, {
    // id: 2,
    place: [56.852676, 53.207358],
    name: "Вера",
    title: "Центральная площадь",
    data: "01.09.2020",
    feed: "Варламовы отлично постралаись и получилось крутое общественное пространство!"
}, {
    // id: 3,
    place: [56.849288, 53.223287],
    name: "Вера",
    title: "УдГу",
    data: "25.05.2018",
    feed: "На*ер УдГУ! И всю систему образования!"
}, {
    // id: 4,
    place: [56.849288, 53.223287],
    name: "Диана",
    title: "УдГУ",
    data: "09.07.2019",
    feed: "А какой памятник Пушкину зато!"
}];



class LocalStorage {
    constructor() {}


    initStorage() {
        if (localStorage.getItem("geootzyv") === null ||
            JSON.parse(localStorage.getItem("geootzyv")).feeds.length === 0) {

            localStorage.setItem("geootzyv", JSON.stringify({
                count: 1,
                feeds: []
            }));

            let geoArray = [];
            myFeedbacks.forEach(feed => {
                feed.id = JSON.parse(localStorage.getItem("geootzyv")).count;
                geoArray.push(feed);
                localStorage.setItem("geootzyv", JSON.stringify({
                    count: JSON.parse(localStorage.getItem("geootzyv")).count + 1,
                    feeds: []
                }));
            });

            localStorage.setItem("geootzyv", JSON.stringify({
                count: JSON.parse(localStorage.getItem("geootzyv")).count,
                feeds: geoArray
            }));
        }
    }


    addFeedback(newFeedback) {
        let geoArray = JSON.parse(localStorage.getItem("geootzyv")).feeds;
        newFeedback.id = JSON.parse(localStorage.getItem("geootzyv")).count;
        geoArray.push(newFeedback);

        localStorage.setItem("geootzyv", JSON.stringify({
            count: JSON.parse(localStorage.getItem("geootzyv")).count + 1,
            feeds: geoArray
        }));
    }


    removeFeedback(id) {
        let geoArray = JSON.parse(localStorage.getItem("geootzyv")).feeds;
        geoArray.forEach((feed, i, arr) => {
            if (feed.id === id) {
                arr.splice(i, 1);
            }
        });

        localStorage.setItem("geootzyv", JSON.stringify({
            count: JSON.parse(localStorage.getItem("geootzyv")).count,
            feeds: geoArray
        }));
    }


    clearStorage() {
        localStorage.removeItem("geootzyv");
    }


    inArray() {
        let geoArray = JSON.parse(localStorage.getItem("geootzyv")).feeds;
        return geoArray;
    }
}