import M = require("./mission.js");
import {Chart, LinearScale, Title, Tooltip, Legend, BarController, BarElement} from "chart.js";
import Map = require ("./map.js");
import Leaflet = require("leaflet");
import index = require("./index.js");
import Sidebar = require("./sidebar.js")


export enum Stage {
    Map,
    Table,
    Hi***REMOVED***ogram,
    Heatmap
}

export class View {
    private _***REMOVED***age: Stage;

    con***REMOVED***ructor() {
        this._***REMOVED***age = Stage.Map;
    }

    get ***REMOVED***age(): Stage {
        return this._***REMOVED***age;
    }

     async setView(value: Stage, missions: M.Mission[]) {
        let container = document.getElementById("row-container");
        if(value !== this._***REMOVED***age) {
            switch (this._***REMOVED***age) {
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
                case Stage.Hi***REMOVED***ogram:
                    let hi***REMOVED***ogram = document.getElementById("hi***REMOVED***ogram");
                    //container.removeChild(hi***REMOVED***ogram);
                    hi***REMOVED***ogram.remove();
                    break;
                case Stage.Heatmap:
                    let heatmap = document.getElementById("map");
                    heatmap.remove();
                    break;
            }

            switch (value) {
                case Stage.Map:
                    console.log("initMap");
                    this._***REMOVED***age = Stage.Map;
                    await this.initMap(missions);
                    break;
                case Stage.Table:
                    console.log("initMissions");
                    this._***REMOVED***age = Stage.Table;
                    this.initTable(missions)
                    break;
                case Stage.Hi***REMOVED***ogram:
                    console.log("initHi***REMOVED***ogram");
                    this._***REMOVED***age = Stage.Hi***REMOVED***ogram;
                    this.initHi***REMOVED***ogram(missions);
                    break;
                case Stage.Heatmap:
                    console.log("initHeatmap");
                    this._***REMOVED***age = Stage.Heatmap;
                    this.initHeatmap(missions);
            }
        }
    }

    private async initMap(missions: M.Mission[]) {
        let mapElement = document.createElement("div");
        mapElement.id = "map";
        mapElement.classLi***REMOVED***.add("col", "m-0", "p-0", "w-auto")
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
        divParent.classLi***REMOVED***.add("col", "p-3");
        let tableElement = document.createElement("table");
        tableElement.classLi***REMOVED***.add("table", "text-light");

        // Define table head, append to table element

        let tableHead = document.createElement("thead");
        let trElement = document.createElement("tr");
        let headItems = ["#", "Products", "Countrycode", "Fir***REMOVED*** FrameTime"
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
                tr.appendChild(this.createtdElement(scene.fir***REMOVED***FrameTime.toString()));
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

    private createtdElement(value: ***REMOVED***ring) {
        let tdElement = document.createElement("td");
        tdElement.innerHTML = value;
        return tdElement;
    }

    private initHi***REMOVED***ogram(mission: M.Mission[]) {
        let divParent = document.createElement("div");
        divParent.id = "hi***REMOVED***ogram";
        divParent.classLi***REMOVED***.add("col", "p-3");
        let ctx = document.createElement("canvas");
        Chart.regi***REMOVED***er(LinearScale, Title, Tooltip, Legend, BarController, BarElement);
        let te***REMOVED*** = [ // Replace with data once available
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
                    data: te***REMOVED***,
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
                            ***REMOVED***epSize: 3
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
                            title: (te***REMOVED***) => {
                                if(!te***REMOVED***.length) {
                                    return "";
                                }
                                con***REMOVED*** item = te***REMOVED***[0];
                                con***REMOVED*** x = item.parsed.x;
                                con***REMOVED*** min = x - 0.5;
                                con***REMOVED*** max = x + 0.5;
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
        mapElement.classLi***REMOVED***.add("col", "m-0", "p-0", "w-auto")
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