# Project Directory

- __presentation__
    - data visualization ppt.pptx (presentation file)
- __report-qualitrics__
    - Default Report.pdf (Auto Generated Report from Qualitrics Survey)
- index.html (file serving visualiazation)
- bars.vl.json (vegalite histogram)
- bethold.vl.json (vegalite p-value bar charts)
- circle-packing.js (helper file to draw circle packing)
- density-geomap.html (iframed in index.html geomap with density)
- main.js (Main JS entry file)
- nested-treemap.js (Helper file to draw hierarchical treemap)
- parallel-coordinate.html (iframed parallel coordinate in index.html)
- pymap.js (Draws density geomap interactive)
- processed-complete.csv (copy of processed csv file)
    - using link in project `https://gist.githubusercontent.com/ssuwal/b0e150a81b2815e1013b39ec4ca27b8f/raw/71adc2e610c114e94316d17b548080edca0f6eda/data-processed-complete.csv`
- survey-questions.md (List of survey questions)

# Slides

 - Slides are located in the presentation folder. The file size is 78 MB due to video embedded in the presentation.

# Running the visualization

The recommended way to run the code is to use a server so that there are no blocking agents from browser. No compilation is required, Although internet is required, since data is an external source and also the libraries required to run the visualization.

1. Using Python

    The following command can be run once in root folder of the code. 
```
$ python -m http.server
```
alternatively command

```
$ python -m SimpleHttpServer
```

2. Use github pages link

https://ssuwal.github.io/visualization-combined

3. Use any server of choice node or apache server.


## Libraries Used

1. Leaflet JS, LeafLet HeatMap JS and Leaflet CSS
2. JQuery
3. Lodash
4. Vega lite, Vega Embed and Vega JS
5. D3 JS
6. Observablehq/stdlib JS
7. RxJS
8. Bootstrap JS and Bootstrap CSS required by leaflet JS

# Kitchen Sink Repository

- Repository used over semester to commit and gather work from all group members.
https://github.com/ssuwal/project1-discussion
