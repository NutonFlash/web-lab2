package com.example.weblab2.servlets;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class ControllerServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        getServletContext().getRequestDispatcher("/index.jsp").forward(request,response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if (request.getParameter("X_val") != null && request.getParameter("Y_val") != null &&
                request.getParameter("R_val") != null) {
            getServletContext().getRequestDispatcher("/servletAreaCheck").forward(request, response);
            System.out.println("отправилось в areaCheck");
        } else
            getServletContext().getRequestDispatcher("/index.jsp").forward(request, response);
    }
}