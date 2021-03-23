var myObjects = [];



var myFeedbacks = [{
    id: 1,
    place: [56.846717, 53.197888],
    name: "Диана",
    title: "Генеральский Дом",
    data: "03.11.2019",
    feed: "Обычно туристы ходят по всяким музеям и храмам, а лучше бы поинтересовались этим местом!"
}, {
    id: 2,
    place: [56.852676, 53.207358],
    name: "Вера",
    title: "Центральная площадь",
    data: "01.09.2020",
    feed: "Варламовы отлично постралаись и получилось крутое общественное пространство!"
}, {
    id: 3,
    place: [56.849288, 53.223287],
    name: "Вера",
    title: "УдГу",
    data: "25.05.2018",
    feed: "На*ер УдГУ! И всю систему образования!"
}, {
    id: 4,
    place: [56.849288, 53.223287],
    name: "Диана",
    title: "УдГУ",
    data: "09.07.2019",
    feed: "А какой памятник Пушкину зато!"
}];



class LocalStorage {
    constructor() {}


    initStorage() {
        if (localStorage.length === 0) {

            myFeedbacks.forEach(feed =>
                localStorage[`${localStorage.length + 1}`] = `${JSON.stringify(feed)}`
            );

        }
    }


    addFeedback(newFeedback) {
        localStorage.setItem(`${localStorage.length + 1}`, `${JSON.stringify(newFeedback)}`);
    }



    clearStorage() {
        localStorage.clear();
    }


    inArray() {
        let feedbacks = [];
        for (let i = 1; i <= localStorage.length; i++) {
            let obj = JSON.parse(localStorage.getItem(i));
            feedbacks.push(obj);
        }
        return feedbacks;
    }
}