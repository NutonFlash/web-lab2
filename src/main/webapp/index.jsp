<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<jsp:useBean id="entries" class="com.example.weblab2.beans.EntriesBean" scope="session"/>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta content="Second web programming lab" name="description">
    <meta content="Alexey Kislitsin" name="author">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="images/favicon.ico">
    <link href="css/style.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat" rel="stylesheet">
    <title>Web lab №2</title>
</head>
<body>
<header>
    <p class="header-text-left">Алексей Кислицин (P3231)</p>
    <p class="header-text-right">Вариант №42479</p>
</header>
<main>
    <table id="main-grid">
        <tr>
            <!--Graph-->
            <td class="content-header" id="graph-content-header">
                <div class="plate-top">
                    <h2 class="plate-top-title">Graph</h2>
                </div>
                <div class="image-container">
                    <object class="result-graph" type="image/svg+xml" data="images/graph.svg">
                    </object>
                    <canvas id="graph-canvas" width="220" height="220">Область для canvas</canvas>
                </div>
                <table id="values-table">
                    <tr>
                        <!--Values-->
                        <td class="content-plate" id="values-plate">
                            <div class="plate-top">
                                <h2 class="plate-top-title"> Values </h2>
                            </div>
                            <form action="/web-lab2" id="input-form" method="POST">
                                <table id="input-grid">

                                    <!--X Value-->
                                    <tr class="value-container">
                                        <td class="input-grid-label">
                                            <label for="x-textinput" id="x">X: </label>
                                        </td>
                                        <td class="input-grid-value">
                                            <div id="x_err"></div>
                                            <input autocomplete="off" id="x-textinput" maxlength="5" name="xval"
                                                   placeholder="Number from -5 to 3"
                                                   type="text">
                                        </td>
                                    </tr>

                                    <!--Y VALUES-->
                                    <tr class="value-container">
                                        <td class="input-grid-label">
                                            <label id="y">Y:</label>
                                        </td>
                                        <td class="input-grid-value">
                                            <div id="y_err"></div>
                                            <p id="select-description">Choose one of the coordinates from the list:</p>
                                            <select id="y-select" name="yval">
                                                <option value="Select">Select</option>
                                                <option value="2">2</option>
                                                <option value="1.5">1.5</option>
                                                <option value="1">1</option>
                                                <option value="0.5">0.5</option>
                                                <option value="0">0</option>
                                                <option value="-0.5">-0.5</option>
                                                <option value="-1">-1</option>
                                                <option value="-1.5">-1.5</option>
                                                <option value="-2">-2</option>
                                            </select>
                                        </td>
                                    </tr>

                                    <!--R Values-->
                                    <tr class="value-container">
                                        <td class="input-grid-label">
                                            <label id="r">R: </label>
                                        </td>

                                        <td class="r-radio-group">
                                            <div id="radio-container">
                                                <div id="r_err"></div>
                                                <label for="r-radio1">1</label> <input type="radio" class="r-radio"
                                                                                       value="1" name="r-coordinate"
                                                                                       id="r-radio1">
                                                <label for="r-radio2">1.5</label> <input type="radio" class="r-radio"
                                                                                         value="1.5" name="r-coordinate"
                                                                                         id="r-radio2">
                                                <label for="r-radio3">2</label> <input type="radio" class="r-radio"
                                                                                       value="2" name="r-coordinate"
                                                                                       id="r-radio3">
                                                <label for="r-radio4">2.5</label> <input type="radio" class="r-radio"
                                                                                         value="2.5" name="r-coordinate"
                                                                                         id="r-radio4">
                                                <label for="r-radio5">3</label> <input type="radio" class="r-radio"
                                                                                       value="3" name="r-coordinate"
                                                                                       id="r-radio5">
                                            </div>
                                        </td>
                                    </tr>

                                    <!--Buttons-->
                                    <tr>
                                        <td class="buttons-row" colspan="2">
                                            <div class="buttons">
                                                <input class="button" name="Submit" type="submit" value="Submit"
                                                       id="submit">
                                                <input class="button" name="Reset" type="submit" value="Reset"
                                                       id="reset">
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                                <input class="input-form__hidden_timezone" type="hidden" name="timezone" value="">
                                <input class="input-form__hidden_clear" type="hidden" name="clear" value="">
                                <input class="input-form__hidden_reqid" type="hidden" name="reqid" value="">
                            </form>
                        </td>
                    </tr>
                </table>
            </td>
            <!--Table-->
            <td class="content-header" id="table-content-header" rowspan="2">
                <div class="plate-top">
                    <h2 class="plate-top-title"> Table </h2>
                </div>

                <div class="scroll-container">
                    <table id="result-table">
                        <tbody class="table-body">
                        <tr class="table-header">
                            <th class="coords-col"> X</th>
                            <th class="coords-col">Y</th>
                            <th class="coords-col">R</th>
                            <th class="time-col">Current Time</th>
                            <th class="time-col"> Execution time</th>
                            <th class="hitres-col"> Hit result</th>
                        </tr>
                        <c:forEach var="entry" items="${entries.entries}">
                            <tr class="table-line">
                                <td>${entry.xValue}</td>
                                <td>${entry.yValue}</td>
                                <td>${entry.rValue}</td>
                                <td>${entry.currentTime}</td>
                                <td>${entry.executionTime}</td>
                                <td>${entry.hitResult}</td>
                            </tr>
                        </c:forEach>
                        </tbody>
                    </table>
                </div>
            </td>
        </tr>
        <tr>

        </tr>
    </table>
</main>
<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
<script src="js/main.js"></script>
</body>
</html>
