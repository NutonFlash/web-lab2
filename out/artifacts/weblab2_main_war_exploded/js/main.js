$(function () {
// -----------------------------ОБРАБОТКА НАЖАТИЙ НА ПОЛЯ ФОРМЫ------------------------------
    window.addEventListener('load', () => {

        let radios = document.querySelectorAll('.r-radio');
        for (let i = 0; i < radios.length; i++) {
            radios[i].addEventListener('click', clickHandleForR);
        }

        function clickHandleForR() {
            for (let i = 1; i < radios.length + 1; i++) {
                console.log(this.id);
                if (this.id.split('r-radio')[1] == i) {
                    if (this.className === 'r-radio')
                        this.classList.replace('r-radio', 'r-clickedRadio');
                } else {
                    radios[i - 1].classList.replace('r-clickedRadio', 'r-radio');
                }
            }
            let R_val = $(this).val();
            redrawAxisHeaders(R_val);
            drawFromInput();
        }

        $('#x-textinput').on('input', drawFromInput);
        $('#y-select').on('change', drawFromInput);

    });

    function redrawAxisHeaders(R_val) {
        let svgGraph = document.querySelector(".result-graph").getSVGDocument();
        svgGraph.querySelector('.x-axis-minus-r').textContent = (-R_val).toString();
        svgGraph.querySelector('.y-axis-minus-r').textContent = (-R_val).toString();
        svgGraph.querySelector('.x-axis-minus-half-r').textContent = (-R_val / 2).toString();
        svgGraph.querySelector('.y-axis-minus-half-r').textContent = (-R_val / 2).toString();
        svgGraph.querySelector('.x-axis-plus-r').textContent = (R_val).toString();
        svgGraph.querySelector('.y-axis-plus-r').textContent = (R_val).toString();
        svgGraph.querySelector('.x-axis-plus-half-r').textContent = (R_val / 2).toString();
        svgGraph.querySelector('.y-axis-plus-half-r').textContent = (R_val / 2).toString();
    }

    function drawFromInput() {
        if (validateForm()) {
            let xVal = document.getElementById('x-textinput').value;
            let yVal = document.querySelector('select').value;
            let rVal = document.querySelector('.r-clickedRadio').value;
            drawPoint(xVal * 68 / rVal + 110,
                -(yVal / rVal * 68 - 110));
        } else {
            clearCanvas();
        }
    }

// -----------------------------ОБРАБОТКА НАЖАТИЙ НА КАРТИНКУ------------------------------
    let canvas = $('#graph-canvas');
    canvas.on('click', function (event) {
        if (!validateR()) {
            document.getElementById("r").style = "color: #FF4500;"
            let rErr = document.getElementById("r_err");
            rErr.innerHTML = "<p>*Please choose R value</p>";
            rErr.style = "color: #FF4500;" +
                "padding-bottom: 10px";
            return;
        }
        let R_val = $('.r-clickedRadio').val();
        const Y_VALUES = [-2.0, -1.5, -1.0, -0.5, 0.0, 0.5, 1.0, 1.5, 2.0];
        const X_MIN = -5;
        const X_MAX = 3;
        let yFromCanvas = (-event.offsetY + 110) / 68 * R_val;
        let minDifference = Infinity;
        let nearestYValue;
        // находим ближайший Y
        for (let i = 0; i < Y_VALUES.length; i++) {
            if (Math.abs(yFromCanvas - Y_VALUES[i]) < minDifference) {
                minDifference = Math.abs(yFromCanvas - Y_VALUES[i]);
                nearestYValue = Y_VALUES[i];
            }
        }
        // находим X
        let xValue = (event.offsetX - 110) / 68 * R_val;
        if (xValue < X_MIN) xValue = X_MIN;
        else if (xValue > X_MAX) xValue = X_MAX;

        drawPoint(xValue * 68 / R_val + 110, -(nearestYValue / R_val * 68 - 110));

        // заполняем поля x и y в форме
        let ySelect = $('#y-select option[value="' + nearestYValue + '"]');
        ySelect.prop('selected', true);
        $('#y-select option').not(ySelect).prop('selected', false);
        $('#x-textinput').val(xValue.toString().substring(0, 10));

        sendData();

        setTimeout(() => {
            location.reload();
        }, 10);
    });

    function clearCanvas() {
        canvas[0].getContext('2d').clearRect(0, 0, canvas.width(), canvas.height());
    }

    function drawPoint(x, y) {
        clearCanvas();
        if (x > canvas.width() || x < -canvas.width() || y > canvas.height() || y < -canvas.height()) return;
        let ctxAxes = canvas[0].getContext('2d');
        ctxAxes.setLineDash([2, 2]);
        ctxAxes.beginPath();
        ctxAxes.moveTo(x, 110);
        ctxAxes.lineTo(x, y);
        ctxAxes.moveTo(110, y);
        ctxAxes.lineTo(x, y);
        ctxAxes.stroke();
        ctxAxes.fillStyle = 'red';
        ctxAxes.arc(x, y, 2, 0, 2 * Math.PI);
        ctxAxes.fill();
    }

//------------------------------ВАЛИДАЦИЯ ПОЛЕЙ ФОРМЫ----------------------------------
    function validateForm() {
        return validateX() && validateY() && validateR();
    }

//Валидация X
    function validateX() {
        let X_text = document.getElementById('x-textinput');
        let X_val = X_text.value;
        if (X_val >= -5 && X_val <= 3)
            return true;
        return false;
    }

//Валидация Y
    function validateY() {
        let Y_select = document.querySelector('select');

        return Y_select.value !== 'Select';
    }

//Валидация R
    function validateR() {
        let R_radio = document.querySelector('.r-clickedRadio');

        return R_radio != null;
    }

//Отправка данных формы на контроллер
    function sendData() {
        let xVal = document.getElementById('x-textinput').value;
        let yVal = document.querySelector('select').value;
        let rVal = document.querySelector('.r-clickedRadio').value;
        $.ajax({
            url: 'servletController',
            type: 'POST',
            dataType: "json",
            data: {
                'X_val': xVal.toString(),
                'Y_val': yVal.toString().substring(0, 10),
                'R_val': rVal.toString(),
                'timezone': new Date().getTimezoneOffset()
            }
        });
    }

//--------------------------------------ОБРАБОТКА НАЖАТИЯ НА КНОПКУ SUBMIT-------------------------------------------
    $('#submit').on('click', function (event) {
        event.preventDefault();
        if (!validateForm()) {
            if (!validateR()) {
                document.getElementById("r").style = "color: #FF4500;"
                let rErr = document.getElementById("r_err");
                rErr.innerHTML = "<p>*Please choose R value</p>";
                rErr.style = "color: #FF4500;" +
                    "padding-bottom: 10px";
            } else {
                document.getElementById("r").style = "color: #FFFFFF;";
                document.getElementById("r_err").innerHTML = "";
            }

            if (!validateX()) {
                document.getElementById("x").style = "color: #FF4500;";
                let xErr = document.getElementById("x_err");
                xErr.innerHTML = "<p>*Please input correct X value</p>";
                xErr.style = "color: #FF4500;" +
                    "padding-bottom: 10px";
                document.getElementById("x-textinput").style = "color: #FF4500;";
            } else {
                document.getElementById("x").style = "color: #FFFFFF;";
                document.getElementById("x_err").innerHTML = "";
                document.getElementById("x-textinput").style = "color: #3e3e3e;";
            }

            if (!validateY()) {
                document.getElementById("y").style = "color: #FF4500;";
                let yErr = document.getElementById("y_err");
                yErr.innerHTML = "<p>*Please choose Y value</p>";
                yErr.style = "color: #FF4500;" +
                    "padding-bottom: 10px";
            } else {
                document.getElementById("y").style = "color: #FFFFFF;";
                document.getElementById("y_err").innerHTML = "";
            }
        } else {
            function successMessage() {
                document.getElementById("x_err").innerHTML = "Форма успешно отправлена!";
                document.getElementById("x_err").style = "font-size: 16px; font-family: 'Montserrat', sans-serif; padding-bottom: 14px; font-style: italic";
            }

            function clearMessage() {
                document.getElementById("x_err").innerHTML = "";
                document.getElementById("x_err").style = "";
            }

            setTimeout(successMessage, 500);
            setTimeout(clearMessage, 3500);

            document.getElementById("x").style = "color: #FFFFFF;";
            document.getElementById("x-textinput").style = "color: #3e3e3e;";
            document.getElementById("y").style = "color: #FFFFFF;";
            document.getElementById("r").style = "color: #FFFFFF;";

            document.getElementById("x_err").innerHTML = "";
            document.getElementById("y_err").innerHTML = "";
            document.getElementById("r_err").innerHTML = "";

            sendData();
            setTimeout(() => {
                location.reload();
            }, 10);
        }
    });

//--------------------------------------ОБРАБОТКА НАЖАТИЯ НА КНОПКУ RESET-------------------------------------------
    let resetButton = $("#reset");
    resetButton.on('click', function () {

        $.ajax({
            url: 'servletClearTable',
            type: 'POST',
            dataType: "json",
            data: {}
        });

        document.getElementById("x").style = "color: #FFFFFF;";
        document.getElementById("x-textinput").style = "color: #3e3e3e;";
        document.getElementById("y").style = "color: #FFFFFF;";
        document.getElementById("r").style = "color: #FFFFFF;";

        document.getElementById("x_err").innerHTML = "";
        document.getElementById("y_err").innerHTML = "";
        document.getElementById("r_err").innerHTML = "";

        let radio = document.querySelector('.r-clickedRadio');
        if (radio != null)
            radio.classList.replace('r-clickedRadio', 'r-radio');
        let tableLines = document.querySelectorAll('#result-table > tbody:not(.table-body)');
        Array.from(tableLines).forEach(line => {
            line.innerHTML = '';
        });
        clearCanvas();
        setTimeout(() => {
            location.reload();
        }, 10);
    });
})