let date = new Date();
let newCoords;
let balloonBlank = document.querySelector("#balloon--blank").innerHTML;


function dateValid(num) {
    return (num < 10) ? `0${num}` : `${num}`
}

let now = `${dateValid(date.getDate())}.${dateValid(date.getMonth())}.${date.getFullYear()}`;


let placemarks = [
        [56.846717, 53.197888], // генеральский дом
        [56.852676, 53.207358], // центральная площадь
        [56.849288, 53.223287], // удгу
        [56.849288, 53.223287] // удгу
    ],
    geoObjects = [];


let feedbacks = [{
    place: [56.846717, 53.197888],
    name: "Диана",
    title: "Генеральский Дом",
    data: "03.11.2019",
    feed: "Обычно туристы ходят по всяким музеям и храмам, а лучше бы поинтересовались этим местом!"
}, {
    place: [56.852676, 53.207358],
    name: "Вера",
    title: "Центральная площадь",
    data: "01.09.2020",
    feed: "Варламовы отлично постралаись и получилось крутое общественное пространство!"
}, {
    place: [56.849288, 53.223287],
    name: "Вера",
    title: "УдГу",
    data: "25.05.2018",
    feed: "На*ер УдГУ! И всю систему образования!"
}, {
    place: [56.849288, 53.223287],
    name: "Диана",
    title: "УдГУ",
    data: "09.07.2019",
    feed: "А какой памятник Пушкину зато!"
}];



function init() {
    let map = new ymaps.Map("map", {
        center: [56.852676, 53.206891],
        zoom: 14,
        controls: []
    });


    // function getClickCoords(coords) {
    //     return new Promise((resolve, reject) => {
    //         ymaps.geocode(coords)
    //             .then(response => resolve(response.geo0bjects.get(0).getAddressLine()))
    //             .catch(e => reject(e))
    //     })
    // }


    function formValidate(form) {
        let name = form.querySelector(".balloon__name").value;
        let title = form.querySelector(".balloon__place").value;
        let data = now;
        let feed = form.querySelector(".balloon__otzyv").value;

        if (name && title && data && feed) {
            feedbacks.push({
                place: newCoords,
                name: name,
                title: title,
                data: data,
                feed: feed
            });

            return true;

        } else {
            return false;
        }
    }


    function getContent(coords) {
        let list = '';

        feedbacks.forEach(obj => {
            for (let key in obj) {
                if (JSON.stringify(obj[key]) === JSON.stringify(coords) ||
                    JSON.stringify(coords).includes(JSON.stringify(obj[key]))) {

                    let review =
                        '<li class="fb">' +
                        '<span class="name">' + obj.name + '</span>' +
                        '<span class="title">' + obj.title + '</span>' +
                        '<span class="data">' + obj.data + '</span>' +
                        '<p class="feed">' + obj.feed + '</p>' +
                        '</li>';

                    if (Array.isArray(Array.isArray(coords))) {
                        coords.forEach(coordsCluster =>
                            list += review);
                    } else {
                        list += review;
                    }
                }
            }
        });

        let balloonFilled =
            '<div class="balloon">' +
            '<ul class="feedbacks">' +
            list +
            '</ul>' +
            '<hr>' +
            '<h1>Отзыв:</h1>' +
            '<input class="balloon__name" type="text" placeholder="Укажите ваше имя">' +
            '<input class="balloon__place" type="text" placeholder="Укажите место">' +
            '<textarea class="balloon__otzyv" placeholder="Оставьте отзыв"></textarea>' +
            '<button class="balloon__add">Добавить</button>' +
            '</div>';

        return (list !== '') ? balloonFilled : balloonBlank;
    }


    map.events.add("click", function (e) {
        if (!map.balloon.isOpen()) {
            newCoords = e.get("coords");
            map.balloon.open(newCoords, {
                contentBody: `${balloonBlank}`
            });
        } else {
            map.balloon.close();
        }
    });


    map.geoObjects.events.add("click", function (e) {
        let newCluster = e.get("target").properties._data.geoObjects;

        if (newCluster) {
            let coordsCluster = [];
            newCluster.forEach(mark => coordsCluster.push(mark.geometry.getCoordinates()));
            clusterer.options.set("clusterBalloonContentLayout",
                ymaps.templateLayoutFactory.createClass(getContent(coordsCluster)))

        } else {
            newCoords = e.get("target").geometry.getCoordinates();
            e.get("target").properties._data.balloonContent = getContent(newCoords);
        }
    });


    document.addEventListener("click", e => {
        e.preventDefault();
        if (e.target.tagName === "BUTTON" && formValidate(e.target.closest(".balloon"))) {
            map.balloon.close();
            if (newCoords) placemarks.push(newCoords);

            let newMarker = new ymaps.Placemark(newCoords, {
                balloonContent: `${getContent(newCoords)}`
            }, {
                iconLayout: "default#image",
                iconImageHref: "images/marker.svg",
                iconImageSize: [64, 64],
                iconImageOffset: [-32, -64]
            });

            geoObjects.push(newMarker);
            map.geoObjects.add(newMarker);
            clusterer.add(geoObjects);

        } else if (e.target.tagName === "BUTTON") {
            let inputs = e.target.closest(".balloon").querySelectorAll('input, textarea');
            for (let el of inputs) {
                if (!el.value) {
                    el.style.borderColor = "#FF5722";
                } else {
                    el.style.borderColor = "#BDBDBD";
                };
            }
        }
    });


    for (let i = 0; i < placemarks.length; i++) {
        const coords = placemarks[i];
        geoObjects[i] = new ymaps.Placemark(coords, {
            balloonContent: `${getContent(coords)}`
        }, {
            iconLayout: "default#image",
            iconImageHref: "images/marker.svg",
            iconImageSize: [64, 64],
            iconImageOffset: [-32, -59]
        });
    }


    let clusterer = new ymaps.Clusterer({
        gridSize: 100,
        groupByCoordinates: false,
        clusterBalloonMaxHeight: 360,
        clusterIconColor: "#FF5722",
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: ymaps.templateLayoutFactory.createClass(balloonBlank)
    });
    map.geoObjects.add(clusterer);
    clusterer.add(geoObjects);
}



ymaps.ready(init);