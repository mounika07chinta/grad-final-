Final Project – Interactive Data Visualization Research
===

This repo contains my final project for CS573 Data Visualization at WPI.
I built a COVID‑19 Global Interactive Dashboard that helps people explore and compare COVID‑19 cases, deaths, and vaccinations across countries and continents in a way that is easier to understand than raw tables or overloaded dashboards.

Proposing Ideas

When I first thought about this project, I noticed that a lot of COVID‑19 dashboards are powerful but hard to read, especially for non‑experts. They show huge tables, many charts at once, and mostly raw totals. I wanted a dashboard that stayed focused on a few simple questions:

How did COVID‑19 waves look across different countries and continents?

Which countries were hit hardest when you adjust for population?

How do vaccination patterns relate to later changes in cases and deaths?

My idea was to answer those questions with one page that combines a world map, a time‑series view, and a country detail panel, instead of many separate pages.

Prospectus

In my prospectus I defined the scope more clearly:

Problem: Existing dashboards often use raw counts and cluttered designs, making fair comparison between countries difficult and hiding important patterns.

Audience: Curious, non‑expert users who want a clearer picture of the pandemic without doing complex analysis.

Approach: Build a web‑based dashboard that links a choropleth map, a multi‑country time‑series chart, and a country detail panel with simple controls for metric, continent, and country.

I also outlined milestones: collecting and cleaning the data, doing exploratory plots, sketching designs, building a prototype, refining the design, and running a small evaluation.

Final Project Materials

Process Book
My process book is where I collected the main steps and design decisions for the project. It includes:

Overview and Motivation
I explain why comparing COVID‑19 between countries is tricky, and why per‑capita measures and simple, coordinated views can help people see patterns more clearly.

Related Work
I briefly describe the Our World in Data dashboards and a few papers/blog posts on COVID‑19 dashboard best practices. These influenced my choice to use per‑million metrics, show trends over time, and keep the interface relatively simple.

Questions
I list the main questions guiding the project and show how they evolved. For example, I started with “which country has more cases” and shifted to “which country had higher waves once population size is considered” and “what changed after vaccination campaigns started.”

Data
I describe how I used the Our World in Data COVID‑19 dataset, filtered it to country‑level records, and selected variables like date, location, continent, total and new cases/deaths, per‑million indicators, and vaccination metrics. I also explain how I created smaller files for the dashboard (time‑series data, latest snapshot, continent summaries, and a world GeoJSON file).

Exploratory Data Analysis
I show some initial plots I made to understand wave timing, peak sizes, and vaccination patterns. These early plots helped me decide which metrics to focus on and confirmed that raw totals are not good for fair global comparison.

Design Evolution
I include photos or screenshots of early sketches and prototypes. At first I tried splitting the map and time series across different screens and experimented with many small charts. Over time I realized this made it harder to connect “where” and “when,” so I moved to one integrated layout with three main views and fewer controls. I also describe how I adjusted color scales, legends, and annotations to reduce clutter.

Implementation
I summarize how I implemented the dashboard with HTML, CSS, JavaScript, and D3. I explain how the data is loaded, how the map and line chart are drawn, and how interactions work (for example, changing the metric updates the map and chart, clicking a country selects it in all views, etc.).

Evaluation
I describe a small, task‑based evaluation with classmates. I gave them tasks like “compare waves between two countries,” “find a European country with high deaths per million,” and “describe how vaccinations relate to cases over time.” Their feedback led me to improve labels, move titles outside the plots, and add short explanatory text under the map.

The process book is included as a PDF in this repo and linked on the project website.

Project Website
I created a public project website that:

Embeds the interactive COVID‑19 dashboard.

Briefly explains the problem, goals, and main design choices.

Highlights example questions users can answer with the dashboard.

Links to the process book PDF and data.

Embeds the two‑minute screencast video.

(Replace this line with your actual URL.)
Project Website: https://YourUsername.github.io/DataVisFinal/

Project Screen‑Cast
I recorded a ~2‑minute screen‑cast where I:

Introduce myself and the project.

Show the dashboard in action (changing metrics, filtering continents, selecting countries).

Explain what the three views show and how they work together.

Mention key insights the dashboard can help reveal, like differences in wave timing and how vaccination coverage relates to later case patterns.

(Replace this line with your actual video URL.)
Screencast: https://www.youtube.com/your-video-id

Outside Libraries/References

For this project I used:

D3.js for drawing the choropleth map and multi‑country time‑series chart and for handling interactions.

Basic HTML/CSS/JavaScript for layout and UI behavior.

I did not use higher‑level chart libraries on top of D3. Instead, I looked at existing D3 examples for maps and line charts and adapted those ideas to my data and design.

I also referenced:

Our World in Data COVID‑19 dashboards and documentation.

Articles and papers on best practices for COVID‑19 dashboards and health data visualization.

Resources / Ideas

The main dataset comes from Our World in Data. It covers confirmed cases, deaths, vaccinations, and per‑capita indicators for many countries over time.

The idea of combining a map, time‑series chart, and detail panel, and coordinating them with a small set of controls, is inspired by prior work on dashboards and coordinated multiple views.

Requirements

This repo includes:

Code

Main HTML file for the dashboard (for example, index.html).

JavaScript files for loading data and building the D3 views.

CSS for layout, colors, and typography.

Data

Preprocessed CSVs (e.g., dashboarddata.csv, latestsnapshot.csv, continentsummary.csv).

countries.geojson for the map.
If raw data is too large, I point to the original source at Our World in Data.

Process Book

process_book.pdf with all the design and analysis details.

README

This file, explaining what the project is about, what is in the repo, and where to find the website and screencast.

Notes on any non‑obvious interactions, such as how to select multiple countries or interpret the color scales.

GitHub Details

The project is based on the course template and customized with my code and data.

The main branch and the GitHub Pages branch are kept in sync so the dashboard can be hosted publicly.

To view the dashboard locally, you can run a simple local web server (for example, python -m http.server) and open the main HTML file in a browser.

Grading

Prospectus: Describes a realistic plan for a population‑aware COVID‑19 dashboard.

Process Book: Documents the design process, from initial questions and sketches through EDA, design changes, and evaluation.

Solution: The final visualization supports the main questions (waves, relative burden, and vaccination patterns) using coordinated, per‑capita views.

Implementation: The dashboard is reasonably polished, interactive, and responsive.

Presentation: The website and screencast explain the project in a clear, concise way and focus on the main contributions rather than only technical details.

Note on Deployment

This dashboard was developed and tested in a local environment using a local server (e.g., VS Code Live Server), where all features—including the choropleth map, time series visualizations, and interactive filters—work correctly and display as expected.

However, when the project is deployed on GitHub Pages, some visualizations may not render properly. This is mainly due to the limitations of static hosting environments, where handling of relative file paths and asynchronous loading of external data files (CSV and GeoJSON) can differ from local execution. As a result, certain data files may not be loaded correctly in the hosted version, which affects the display of charts and map components.

It is important to note that this issue does not impact the correctness of the implementation. The data processing, visualization logic, and interactivity are fully functional in the local environment. To demonstrate the intended behavior of the dashboard, screenshots of the working application have been included in the project report.