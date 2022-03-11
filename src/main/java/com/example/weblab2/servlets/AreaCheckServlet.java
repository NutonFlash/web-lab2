package com.example.weblab2.servlets;

import com.example.weblab2.beans.EntriesBean;
import com.example.weblab2.beans.Entry;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

public class AreaCheckServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        long startTime = System.nanoTime();
        String xString = request.getParameter("xval");
        String yString = request.getParameter("yval");
        String rString = request.getParameter("r-coordinate");
        boolean isValuesValid = validateValues(xString, yString, rString);

        //        System.out.println(xString +"\n" +yString+"\n" +rString);
        //      System.out.println("x: "+validateX(xString) + "\ny: "+validateY(yString) + "\nr: "+validateR(rString));

        if (isValuesValid) {
            double xValue = Double.parseDouble(xString);
            double yValue = Double.parseDouble(yString);
            double rValue = Double.parseDouble(rString);
            boolean isHit = checkHit(xValue, yValue, rValue);

            OffsetDateTime currentTimeObject = OffsetDateTime.now(ZoneOffset.UTC);
            String currentTime;
            try {
                currentTimeObject = currentTimeObject.minusMinutes(Long.parseLong(request.getParameter("timezone")));
                currentTime = currentTimeObject.format(DateTimeFormatter.ofPattern("HH:mm:ss"));
            } catch (Exception exception) {
                currentTime = "HH:mm:ss";
            }
            String executionTime = String.valueOf(System.nanoTime() - startTime);
            HttpSession session = request.getSession();
            EntriesBean entries = (EntriesBean) session.getAttribute("entries");
            if (entries == null) entries = new EntriesBean();
            entries.getEntries().add(new Entry(xValue, yValue, rValue, currentTime, executionTime, isHit));
            session.setAttribute("entries", entries);
        }
        getServletContext().getRequestDispatcher("/index.jsp").forward(request, response);
    }

    private boolean validateX(String xString) {
        try {
            double xValue = Double.parseDouble(xString);
            return (xValue >= -5 && xValue <= 3);
        } catch (NumberFormatException exception) {
            return false;
        }
    }

    private boolean validateY(String yString) {
//        -2,-1.5,-1,-0.5,0,0.5,1,1.5,2
        try {
            double xValue = Double.parseDouble(yString);
            return (xValue == -2 || xValue == -1.5 || xValue == -1 || xValue == -0.5 || xValue == 0 || xValue == 2 || xValue == 1.5 || xValue == 1 || xValue == 0.5);
        } catch (NumberFormatException exception) {
            return false;
        }
    }

    private boolean validateR(String rString) {
        try {
//            1, 1.5, 2, 2.5, 3
            double rValue = Double.parseDouble(rString);
            return (rValue == 1 || rValue == 1.5 || rValue == 2 || rValue == 2.5 || rValue == 3);
        } catch (NumberFormatException exception) {
            return false;
        }
    }

    private boolean validateValues(String xString, String yString, String rString) {
        return validateX(xString) && validateY(yString) && validateR(rString);
    }

    private boolean checkTriangle(double xValue, double yValue, double rValue) {
        return xValue >= 0 && yValue <= 0 && (yValue - xValue / 2 + rValue / 2) >= 0;
    }

    private boolean checkRectangle(double xValue, double yValue, double rValue) {
        return xValue <= 0 && yValue <= 0 && xValue >= -rValue && yValue >= -rValue;
    }

    private boolean checkCircle(double xValue, double yValue, double rValue) {
        return xValue <= 0 && yValue >= 0 && Math.sqrt(xValue * xValue + yValue * yValue) <= rValue;
    }

    private boolean checkHit(double xValue, double yValue, double rValue) {
        return checkTriangle(xValue, yValue, rValue) || checkRectangle(xValue, yValue, rValue) ||
                checkCircle(xValue, yValue, rValue);
    }
}