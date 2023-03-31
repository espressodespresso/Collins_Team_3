import M = require("./mission.js");
import {Chart, LinearScale, Title, Tooltip, Legend, BarController, BarElement} from "chart.js";
import Map = require ("./map.js");
import Leaflet = require("leaflet");
import index = require("./index.js");
import Sidebar = require("./sidebar.js")


export enum Stage {
    Map,
    Table,
    Histogram,
    Heatmap
}

export class View {
    private _stage: Stage;

    constructor() {
        this._stage = Stage.Map;
    }

    get stage(): Stage {
        return this._stage;
    }

     async setView(value: Stage, missions: M.Mission[]) {
        let container = document.getElementById("row-container");
        if(value !== this._stage) {
            switch (this._stage) {
                case Stage.Map:
                    let map = document.getElementById("map");
                    map.remove();
                    //container.removeChild(map);
                    break
                case Stage.Table:
                    let table = document.getElementById("table");
                   // container.removeChild(table);
                    table.remove();
                    break;
                case Stage.Histogram:
                    let histogram = document.getElementById("histogram");
                    //container.removeChild(histogram);
                    histogram.remove();
                    break;
                case Stage.Heatmap:
                    let heatmap = document.getElementById("map");
                    heatmap.remove();
                    break;
            }

            switch (value) {
                case Stage.Map:
                    console.log("initMap");
                    this._stage = Stage.Map;
                    await this.initMap(missions);
                    break;
                case Stage.Table:
                    console.log("initMissions");
                    this._stage = Stage.Table;
                    this.initTable(missions)
                    break;
                case Stage.Histogram:
                    console.log("initHistogram");
                    this._stage = Stage.Histogram;
                    this.initHistogram(missions);
                    break;
                case Stage.Heatmap:
                    console.log("initHeatmap");
                    this._stage = Stage.Heatmap;
                    this.initHeatmap(missions);
            }
        }
    }

    private async initMap(missions: M.Mission[]) {
        let mapElement = document.createElement("div");
        mapElement.id = "map";
        mapElement.classList.add("col", "m-0", "p-0", "w-auto")
        document.getElementById("row-container").appendChild(mapElement);
        index.map = new Map.Map;
        await index.map.initLayers(missions)
            .then(() => document.getElementById("sidebar").innerHTML = "")
            .catch(e => console.error("Unable to reload layers\n" + e));
        await Sidebar.FormatSidebar(missions, index.map.map, index.view)
            .catch(e => console.error("Unable to reload sidebar\n" + e));
    }

    private initTable(missions: M.Mission[]) {
        // Create table container & define table element
        let divParent = document.createElement("div");
        divParent.id = "table";
        divParent.classList.add("col", "p-3");
        let tableElement = document.createElement("table");
        tableElement.classList.add("table", "text-light");

        // Define table head, append to table element

        let tableHead = document.createElement("thead");
        let trElement = document.createElement("tr");
        let headItems = ["#", "Products", "Countrycode", "First FrameTime"
            , "Aircraft Takeoff Time", "Center Position"];
        for(let i=0; i < headItems.length; i++) {
            let thElement = document.createElement("th");
            thElement.scope = "col";
            thElement.append(document.createTextNode(headItems[i]));
            trElement.appendChild(thElement);
            console.log(thElement);
        }
        tableHead.append(trElement);
        tableElement.appendChild(tableHead);

        // Define table body & dynamically add table data

        let tableBody = document.createElement("tbody");
        let count = 0;
        for(let i=0; i < missions.length; i++) {
            let mission = missions[i];
            for(let j=0; j < mission.scenes.length; j++) {
                count++;
                let scene = mission.scenes[j];
                let tr = document.createElement("tr");
                let th = document.createElement("th");
                th.scope = "row";
                th.innerHTML = count.toString();
                tr.appendChild(th);
                tr.appendChild(this.createtdElement(`${mission.name} ${scene.name}`));
                tr.appendChild(this.createtdElement(scene.countrycode));
                tr.appendChild(this.createtdElement(scene.firstFrameTime.toString()));
                tr.appendChild(this.createtdElement(""));
                tr.appendChild(this.createtdElement(scene.center.toString()));
                tableBody.appendChild(tr);
            }
        }


        tableElement.appendChild(tableBody);
        divParent.appendChild(tableElement);
        console.log(divParent);
        document.getElementById("row-container").appendChild(divParent);
    }

    private createtdElement(value: string) {
        let tdElement = document.createElement("td");
        tdElement.innerHTML = value;
        return tdElement;
    }

    private initHistogram(mission: M.Mission[]) {
        let divParent = document.createElement("div");
        divParent.id = "histogram";
        divParent.classList.add("col", "p-3");
        let ctx = document.createElement("canvas");
        Chart.register(LinearScale, Title, Tooltip, Legend, BarController, BarElement);
        let test = [ // Replace with data once available
            {x: 0.5, y: 10},
            {x: 1.5, y: 9},
            {x: 2.5, y: 8},
            {x: 3.5, y: 2},
            {x: 4.5, y: 5},
            {x: 5.5, y: 7},
            {x: 6.5, y: 1},
            {x: 7.5, y: 2},
            {x: 8.5, y: 4},
            {x: 9.5, y: 8},
            {x: 10.5, y: 1},
            {x: 11.5, y: 3},
            {x: 12.5, y: 7},
            {x: 13.5, y: 5},
            {x: 14.5, y: 9},
            {x: 15.5, y: 10},
            {x: 16.5, y: 10},
            {x: 17.5, y: 2},
            {x: 18.5, y: 4},
            {x: 19.5, y: 1},
            {x: 20.5, y: 6},
            {x: 21.5, y: 7},
            {x: 22.5, y: 2},
            {x: 23.5, y: 4}
        ];
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: test,
                    borderWidth: 1,
                    barPercentage: 1,
                    categoryPercentage: 1,
                    borderRadius: 5
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        offset: false,
                        grid: {
                            offset: false
                        },
                        ticks: {
                            stepSize: 3
                        },
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'No. of Missions'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: (test) => {
                                if(!test.length) {
                                    return "";
                                }
                                const item = test[0];
                                const x = item.parsed.x;
                                const min = x - 0.5;
                                const max = x + 0.5;
                                return `Hours: ${min} - ${max}`;
                            }
                        }
                    }
                }
            }
        });
        divParent.appendChild(ctx);
        document.getElementById("row-container").appendChild(divParent);
    }

    private async initHeatmap(missions: M.Mission[]) {
        let mapElement = document.createElement("div");
        mapElement.id = "map";
        mapElement.classList.add("col", "m-0", "p-0", "w-auto")
        document.getElementById("row-container").appendChild(mapElement);
        index.map = new Map.Map;
        await index.map.initLayers(missions)
            .then(() => document.getElementById("sidebar").innerHTML = "")
            .catch(e => console.error("Unable to reload layers\n" + e));
        await Sidebar.FormatSidebar(missions, index.map.map, index.view)
            .catch(e => console.error("Unable to reload sidebar\n" + e));
        await index.map.calculateHeatmapCoverage(missions);
    }
}