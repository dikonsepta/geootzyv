class GeoOtzyv {
    constructor() {
        this.balloonBlank = document.querySelector("#balloon--blank").innerHTML;

        this.myMap = new YaMap(
            this.onClick.bind(this),
            this.getContent.bind(this),
            this.balloonBlank);

        this.myMap.init().then(this.onInit.bind(this));

        this.localS = new LocalStorage();
        this.localS.initStorage();
    }



    onInit() {
        this.localS.inArray().forEach(obj =>
            this.myMap.createPlacemark(obj.place)
        );

        document.body.addEventListener('click', this.onDocumentClick.bind(this));
    }


    getDate() {
        let date = new Date();

        function dateValid(num) {
            return (num < 10) ? `0${num}` : `${num}`
        }

        let now = `${dateValid(date.getDate())}.${dateValid(date.getMonth() + 1)}.${date.getFullYear()}`;
        return now;
    }



    formValidate(form) {
        let name = form.querySelector(".balloon__name").value;
        let title = form.querySelector(".balloon__place").value;
        let data = this.getDate();
        let feed = form.querySelector(".balloon__otzyv").value;

        if (name && title && data && feed) {
            let newFeedback = {
                id: localStorage.length + 1,
                place: this.myMap.newCoords,
                name: name,
                title: title,
                data: data,
                feed: feed
            }
            this.localS.addFeedback(newFeedback);

            return true;

        } else {
            return false;
        }
    }



    getContent(coords) {
        let list = '';

        this.localS.inArray().forEach(obj => {
            let id;

            for (let key in obj) {
                if (key === "id") id = obj['id'];

                if (key === "place" &&
                    (JSON.stringify(obj[key]) === JSON.stringify(coords) ||
                        JSON.stringify(coords).includes(JSON.stringify(obj[key])))) {

                    let review =
                        '<li class="fb" ' + 'id=' + `${id}` + '>' +
                        '<span class="name">' + obj.name + '</span>' +
                        '<span class="title">' + obj.title + '</span>' +
                        '<span class="data">' + obj.data + '</span>' +
                        '<p class="feed" title="Удалить">' + obj.feed + '</p>' +
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
            '<ul class="feedbacks">' + list + '</ul>' +
            '<hr>' +
            '<h1>Отзыв:</h1>' +
            '<input class="balloon__name" type="text" placeholder="Укажите ваше имя">' +
            '<input class="balloon__place" type="text" placeholder="Укажите место">' +
            '<textarea class="balloon__otzyv" placeholder="Оставьте отзыв"></textarea>' +
            '<button class="balloon__add">Добавить</button>' +
            '</div>';

        return (list !== '') ? balloonFilled : this.balloonBlank;
    }



    onClick(coords, coordsCluster) {
        let content;

        if (coordsCluster) {
            content = this.getContent(coordsCluster);

        } else {
            content = this.getContent(coords);
        }

        this.myMap.openBalloon(coords, content);
    }



    onDocumentClick(e) {
        e.preventDefault();

        if (e.target.tagName === "BUTTON" && e.target.classList.contains("balloon__add") &&
            this.formValidate(e.target.closest(".balloon"))) {
            this.myMap.closeBalloon();
            this.myMap.createPlacemark();

        } else if (e.target.tagName === "BUTTON" && e.target.classList.contains("balloon__add")) {
            let inputs = e.target.closest(".balloon").querySelectorAll('input, textarea');

            for (let el of inputs) {
                if (!el.value) {
                    el.style.borderColor = "#FF5722";

                } else {
                    el.style.borderColor = "#BDBDBD";
                };
            }

        } else if (e.target.tagName === "BUTTON" && e.target.classList.contains("balloon__remove")) {
            alert("Очистить локальное хранилище и перезагрузить страницу?");
            this.localS.clearStorage();
            window.location.reload();

        }
        // else if (e.target.tagName === "SPAN" && e.target.classList.contains("name")) {
        //     let removeID = e.target.closest("li").getAttribute("id");
        //     this.myMap.deletePlacemark(removeID);
        // }
    }
}




new GeoOtzyv();