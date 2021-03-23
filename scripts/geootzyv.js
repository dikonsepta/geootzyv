class GeoOtzyv {
    constructor() {
        this.balloonBlank = document.querySelector("#balloon--blank").innerHTML;

        this.map = new YaMap(
            this.onClick.bind(this),
            this.getContent.bind(this),
            this.balloonBlank);

        this.map.init().then(this.onInit.bind(this));
    }



    async onInit() {
        // await

        for (let i = 0; i < placemarks.length; i++) {
            this.map.createPlacemark(placemarks[i]);
        }

        document.body.addEventListener('click', this.onDocumentClick.bind(this));
    }


    getDate() {
        let date = new Date();

        function dateValid(num) {
            return (num < 10) ? `0${num}` : `${num}`
        }

        let now = `${dateValid(date.getDate())}.${dateValid(date.getMonth())}.${date.getFullYear()}`;
        return now;
    }



    formValidate(form) {
        let name = form.querySelector(".balloon__name").value;
        let title = form.querySelector(".balloon__place").value;
        let data = this.getDate();
        let feed = form.querySelector(".balloon__otzyv").value;

        if (name && title && data && feed) {
            feedbacks.push({
                place: this.map.newCoords,
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



    getContent(coords) {
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

        this.map.openBalloon(coords, content);
    }



    onDocumentClick(e) {
        e.preventDefault();

        if (e.target.tagName === "BUTTON" && this.formValidate(e.target.closest(".balloon"))) {
            this.map.closeBalloon();
            this.map.createPlacemark();

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
    }
}




new GeoOtzyv();