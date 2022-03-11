$(function () {
// -----------------------------ОБРАБОТКА НАЖАТИЙ НА ПОЛЯ ФОРМЫ------------------------------
    window.addEventListener('load', () => {
        let radios = $('.r-radio');
        for (let i = 0; i < radios.length; i++) {
            radios[i].addEventListener('click', clickHandleForR);
        }

        function clickHandleForR() {
            for (let i = 1; i < radios.length + 1; i++) {
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

        let tableLines = $('.table-line');
        if (tableLines.length > 0) {
            let tableRows = document.getElementById('result-table').rows;
            let lastTableChild = tableRows.item(tableRows.length - 1);
            let x_val = lastTableChild.cells.item(0).innerText;
            let y_val = lastTableChild.cells.item(1).innerText;
            let r_val = lastTableChild.cells.item(2).innerText;
            let ySelect = $('#y-select option[value="' + Number(y_val) + '"]');
            $('#y-select option').not(ySelect).prop('selected', false);
            ySelect.prop('selected', true);
            $('#x-textinput').val(x_val);
            for (let rButton of document.querySelectorAll('.r-radio')) {
                if (Number(rButton.value) === Number(r_val)) {
                    let simulatedMouseClick = document.createEvent("MouseEvent");
                    simulatedMouseClick.initMouseEvent("click", false, false, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, rButton);
                    rButton.dispatchEvent(simulatedMouseClick);
                }
            }
            console.log(x_val);
            console.log(y_val);
            console.log(r_val);
        }
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
        if (validateForm(false)) {
            let xVal = $('#x-textinput').val();
            let yVal = $('select').val();
            let rVal = $('.r-clickedRadio').val();
            drawPoint(xVal * 68 / rVal + 110,
                -(yVal / rVal * 68 - 110));
        } else {
            clearCanvas();
        }
    }

// -----------------------------ОБРАБОТКА НАЖАТИЙ НА КАРТИНКУ------------------------------
    let canvas = $('#graph-canvas');
    canvas.on('click', function (event) {
        if (validateR(true)) {
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
            $('#x-textinput').val(xValue.toString().substring(0, 5));
            let simulatedMouseClick = document.createEvent("MouseEvent");
            let button = document.querySelector('#submit');
            simulatedMouseClick.initMouseEvent("click", false, false, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, button);
            button.dispatchEvent(simulatedMouseClick);
        }
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
    function validateForm(isNeededErrMsg) {
        return validateX(isNeededErrMsg) && validateY(isNeededErrMsg) && validateR(isNeededErrMsg);
    }

//Валидация X
    function validateX(isNeededErrMsg) {
        let X_val = $('#x-textinput').val();
        if (X_val) {
            let normX = X_val.trim();
            let numXVal = parseFloat(normX);
            if (numXVal === +normX) {
                if (numXVal >= -5 && numXVal <= 3)
                    return true;
            }
        }
        if (isNeededErrMsg) {
            document.getElementById("x").style = "color: #FF4500;";
            let xErr = document.getElementById("x_err");
            xErr.innerHTML = "<p>*Please input correct X value</p>";
            xErr.style = "color: #FF4500;" +
                "padding-bottom: 10px";
            document.getElementById("x-textinput").style = "color: #FF4500;";
        }
        return false;
    }

//Валидация Y
    function validateY(isNeededErrMsg) {
        let Y_select = document.querySelector('select');
        if (Y_select.value === 'Select') {
            if (isNeededErrMsg) {
                document.getElementById("y").style = "color: #FF4500;";
                let yErr = document.getElementById("y_err");
                yErr.innerHTML = "<p>*Please choose Y value</p>";
                yErr.style = "color: #FF4500;" +
                    "padding-bottom: 10px";
            }
            return false;
        }
        return true;
    }

//Валидация R
    function validateR(isNeededErrMsg) {
        let R_radio = $('.r-clickedRadio').val();
        if (!R_radio) {
            if (isNeededErrMsg) {
                document.getElementById("r").style = "color: #FF4500;"
                let rErr = document.getElementById("r_err");
                rErr.innerHTML = "<p>*Please choose R value</p>";
                rErr.style = "color: #FF4500;" +
                    "padding-bottom: 10px";
            }
            return false;
        }
        return true;
    }

    function clearForm() {
        document.getElementById("x").style = "color: #FFFFFF;";
        document.getElementById("x-textinput").style = "color: #3e3e3e;";
        document.getElementById("y").style = "color: #FFFFFF;";
        document.getElementById("r").style = "color: #FFFFFF;";

        document.getElementById("x_err").innerHTML = "";
        document.getElementById("y_err").innerHTML = "";
        document.getElementById("r_err").innerHTML = "";
    }

//--------------------------------------ОБРАБОТКА НАЖАТИЯ НА КНОПКУ SUBMIT-------------------------------------------
    $('#submit').on('click', function (event) {
        if (!validateForm(true)) {
            event.preventDefault();

            if (validateR(false)) {
                document.getElementById("r").style = "color: #FFFFFF;";
                document.getElementById("r_err").innerHTML = "";
            }
            if (validateX(false)) {
                document.getElementById("x").style = "color: #FFFFFF;";
                document.getElementById("x_err").innerHTML = "";
                document.getElementById("x-textinput").style = "color: #3e3e3e;";
            }
            if (validateY(false)) {
                document.getElementById("y").style = "color: #FFFFFF;";
                document.getElementById("y_err").innerHTML = "";
            }
        } else {
            $('.input-form__hidden_timezone').val(new Date().getTimezoneOffset());
            $('.input-form__hidden_reqid').val(Math.round(Math.random() * 100000));
            //clearForm();
        }
    });

//--------------------------------------ОБРАБОТКА НАЖАТИЯ НА КНОПКУ RESET-------------------------------------------
    let resetButton = $("#reset");
    resetButton.on('click', function () {
        $('.input-form__hidden_clear').val('true');

        clearForm();

        let radio = document.querySelector('.r-clickedRadio');
        if (radio != null)
            radio.classList.replace('r-clickedRadio', 'r-radio');
        clearCanvas();
    });
})