package com.example.weblab2.servlets;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class ControllerServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        getServletContext().getRequestDispatcher("/index.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if (request.getSession().getAttribute("reqid") == null)
            request.getSession().setAttribute("reqid", 0);
        if (request.getParameter("clear") != null && request.getParameter("clear").equals("true")) {
            System.out.println("-----------------clear---------------------");
            getServletContext().getNamedDispatcher("ClearTableServlet").forward(request, response);
        } else if (request.getParameter("xval") != null && request.getParameter("yval") != null &&
                request.getParameter("r-coordinate") != null && request.getParameter("reqid") != null && Integer.parseInt(request.getParameter("reqid")) != (int) request.getSession().getAttribute("reqid")) {
            request.getSession().setAttribute("reqid", Integer.parseInt(request.getParameter("reqid")));
            System.out.println("-----------------checkCoords---------------------");
            getServletContext().getNamedDispatcher("AreaCheckServlet").forward(request, response);
        } else {
            System.out.println("-----------------defPage---------------------");
            getServletContext().getRequestDispatcher("/index.jsp").forward(request, response);
        }
    }
}